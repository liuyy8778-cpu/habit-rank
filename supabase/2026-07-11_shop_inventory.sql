-- ============================================================================
-- 商店 + 背包系統：新表 / RLS / RPC（貼進 Supabase SQL Editor 按 Run 一次即可）
-- ----------------------------------------------------------------------------
-- 設計對應（三點拍板）：
--   1) 金幣結餘 = 純事件推導：收入(checkin_events approved/auto 的 coin)
--      − 支出(ledger_events 的 coin_spend)。kids.coins 只是顯示快取。
--   2) ledger_events = 真 append-only：只給 SELECT + INSERT，「不建」UPDATE / DELETE
--      policy → 任何客戶端（含家長）都無法改/刪帳本列，徹底封死 delete-重灌反模式。
--   3) items 主檔收編既有 custom_shop 與孤兒 rewards，成為商城單一真相。
-- RLS 慣例比照現有表：家長是唯一登入者，一律 family_id → families.owner_id = auth.uid()。
-- ============================================================================

-- ========== 1) items 主檔（family 共享，可變目錄）==========
create table if not exists public.items (
  id          text primary key,             -- 內建示範品用穩定 id（s5/s2…），自建品用前端 newId()；text 兩者皆容
  family_id   uuid not null references public.families(id) on delete cascade,
  name        text not null,
  cost        integer not null default 0 check (cost >= 0),
  icon        text default 'i-gift',
  grad        text default 'magenta',
  unlock_rank integer,                       -- 段位專屬櫥窗（null = 全段可見）
  builtin     boolean not null default false, -- 內建示範品（可上/下架，不可刪）
  proposed    boolean not null default false, -- 唯一允許的角標「你提案的」
  active      boolean not null default true,  -- 上架狀態
  pending     jsonb,                          -- 保價/排程下架（7 天預告）
  created_at  timestamptz not null default now()
);
create index if not exists items_family_idx on public.items(family_id);

alter table public.items enable row level security;
-- 家長對自家 items 全權（孩子不登入，走家長帳號）
drop policy if exists items_owner_all on public.items;
create policy items_owner_all on public.items
  for all
  using      (exists (select 1 from public.families f where f.id = items.family_id and f.owner_id = auth.uid()))
  with check (exists (select 1 from public.families f where f.id = items.family_id and f.owner_id = auth.uid()));

-- ========== 2) ledger_events 帳本（append-only）==========
create table if not exists public.ledger_events (
  id        uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  kid_id    uuid not null references public.kids(id)     on delete cascade,
  kind      text not null check (kind in ('coin_spend','item_acquire','item_consume')),
  item_id   text references public.items(id) on delete set null,
  amount    integer,   -- coin_spend 用：花費金幣
  qty       integer,   -- item_acquire / item_consume 用：件數
  date      date not null default (now() at time zone 'utc')::date,
  ts        timestamptz not null default now()
);
create index if not exists ledger_kid_idx on public.ledger_events(kid_id);

alter table public.ledger_events enable row level security;
-- 只給 SELECT + INSERT；刻意不建立 UPDATE / DELETE policy（帳本不可竄改、不可刪）
drop policy if exists ledger_select on public.ledger_events;
drop policy if exists ledger_insert on public.ledger_events;
create policy ledger_select on public.ledger_events
  for select using (exists (select 1 from public.families f where f.id = ledger_events.family_id and f.owner_id = auth.uid()));
create policy ledger_insert on public.ledger_events
  for insert with check (exists (select 1 from public.families f where f.id = ledger_events.family_id and f.owner_id = auth.uid()));

-- ========== 3) purchase_item()：單一 transaction 原子購買（帳平鎖後端）==========
-- 校驗餘額（事件推導值）→ 插 coin_spend + item_acquire 兩列；餘額不足直接 reject。
-- 「金幣只花不扣」：系統從不主動扣款，只有孩子主動購買才寫 coin_spend。
create or replace function public.purchase_item(p_kid uuid, p_item text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family uuid; v_cost integer; v_active boolean; v_bal integer;
  v_ts timestamptz := now(); v_date date := (now() at time zone 'utc')::date;
begin
  select i.family_id, i.cost, i.active into v_family, v_cost, v_active
    from public.items i where i.id = p_item;
  if v_family is null then raise exception 'item_not_found'; end if;
  if not v_active   then raise exception 'item_inactive';  end if;

  -- 授權：kid 必須屬於同一 family，且該 family 由呼叫者（家長）擁有
  if not exists (
    select 1 from public.kids k join public.families f on f.id = k.family_id
    where k.id = p_kid and k.family_id = v_family and f.owner_id = auth.uid()
  ) then raise exception 'not_authorized'; end if;

  -- 餘額 = 事件推導
  select coalesce((select sum(coin)   from public.checkin_events
                   where kid_id = p_kid and verdict in ('approved','auto')), 0)
       - coalesce((select sum(amount) from public.ledger_events
                   where kid_id = p_kid and kind = 'coin_spend'), 0)
    into v_bal;
  if v_bal < v_cost then raise exception 'insufficient_coins'; end if;

  insert into public.ledger_events(family_id, kid_id, kind, item_id, amount, qty, date, ts)
    values (v_family, p_kid, 'coin_spend',   p_item, v_cost, null, v_date, v_ts);
  insert into public.ledger_events(family_id, kid_id, kind, item_id, amount, qty, date, ts)
    values (v_family, p_kid, 'item_acquire', p_item, null,   1,    v_date, v_ts);

  update public.kids set coins = v_bal - v_cost where id = p_kid;  -- 顯示快取
  return jsonb_build_object('balance', v_bal - v_cost, 'cost', v_cost);
end $$;
revoke all on function public.purchase_item(uuid, text) from public;
grant execute on function public.purchase_item(uuid, text) to authenticated;

-- ========== 4) reset_kid_ledger()：「重新來過」授權清帳 ==========
-- 帳本無 DELETE policy，故清帳只能走這條授權路徑（僅限自家 kid）。
create or replace function public.reset_kid_ledger(p_kid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.kids k join public.families f on f.id = k.family_id
    where k.id = p_kid and f.owner_id = auth.uid()
  ) then raise exception 'not_authorized'; end if;
  delete from public.ledger_events where kid_id = p_kid;
end $$;
revoke all on function public.reset_kid_ledger(uuid) from public;
grant execute on function public.reset_kid_ledger(uuid) to authenticated;

-- ========== 5) 孤兒表 rewards：確認無資料後移除 ==========
-- Phase 2 商城改用 covenant.custom_shop，rewards 從未接線；本次收編到 items 後已無用。
-- 先檢查：  select count(*) from public.rewards;
-- 為 0 再跑：drop table if exists public.rewards;

-- ============================================================================
-- 驗收檢查點（在 SQL Editor 逐條跑，應無錯）：
--   select * from public.items limit 1;           -- 表已建
--   select * from public.ledger_events limit 1;   -- 表已建
--   -- 帳本不可刪（應該要 0 rows affected 或被 RLS 擋）：
--   -- delete from public.ledger_events where false;
-- 前端接線：src/app.js 的 cloudLoadItems / buy(RPC) / _reloadLedger 會自動使用上表。
-- ============================================================================
