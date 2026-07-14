-- ============================================================================
-- 自訂任務表 custom_tasks（family 共享目錄，鏡像 items 模式）— 修法 2（reset-proof）
-- （貼進 Supabase SQL Editor 按 Run 一次即可；可重複執行、idempotent）
-- ----------------------------------------------------------------------------
-- 設計對應：
--   · 純加法遷移：只 CREATE TABLE / INDEX / POLICY，零 ALTER 任何現有表。
--     舊版 client 不認得本表 → 不 select → 看不到自訂任務，其餘（LIB 任務 / 商城 /
--     金幣）一切照舊，判定無害（共用 DB 遷移相容鐵律：初始為空、無 seed，繞過搶先 seed 風險）。
--   · 內建任務（LIB）永遠留在前端 code、不進本表；本表只裝家長/孩子提案產生的自訂任務。
--     catalog = LIB.concat(custom_tasks)，兩者 id 空間不重疊（LIB=k1/sc3…；自訂=newId() uuid）
--     → 不需 items 那套 missingBuiltinIds() 補種。
--   · reset-proof（修法 2 核心）：自訂任務「啟用」不走 kids.task_on，而是走本表 kid_id + active。
--     「重新來過」_resetCloud 只重置 kids.task_on（LIB 的啟用），完全不碰本表 →
--     reset 後自訂任務仍在、仍屬該孩子、仍可做。
-- 欄位形狀對齊 LIB 一筆 entry：{ id,type:'task',label,sub,coin,xp,icon,dom,domColor,where,unlockRank }
--   （type 恆 'task'，載入時由前端 _customTaskFromRow 注入，不設欄位。）
-- RLS 完全比照 items：家長是唯一登入者，family_id → families.owner_id = auth.uid()。
-- ============================================================================

create table if not exists public.custom_tasks (
  id          text primary key,                 -- 前端 newId() uuid（text 比照 items）
  family_id   uuid not null references public.families(id) on delete cascade,
  kid_id      uuid not null references public.kids(id)     on delete cascade,  -- 啟用歸屬：這筆自訂任務屬於哪個孩子（reset-proof 的關鍵）
  label       text not null,                    -- 對齊 LIB.label（任務名）
  sub         text,                             -- 對齊 LIB.sub（一行說明）
  coin        integer not null default 0 check (coin >= 0),
  xp          integer not null default 0 check (xp   >= 0),  -- 前端核准時自動導出 round(coin*0.75)
  icon        text default 'i-spark',
  dom         text default '自訂',              -- 對齊 LIB.dom（分組/領域標籤）
  dom_color   text default 'teal',              -- 對齊 LIB.domColor
  where_at    text not null default 'anywhere', -- 對齊 LIB.where（避開 SQL 保留字 where）
  unlock_rank integer,                          -- 對齊 LIB.unlockRank（null = 全段可見 / 全開）
  proposed    boolean not null default false,   -- 唯一允許角標「你提案的」
  active      boolean not null default true,    -- 保留下架能力（對齊 items.active）
  created_at  timestamptz not null default now()
);
create index if not exists custom_tasks_family_idx on public.custom_tasks(family_id);
create index if not exists custom_tasks_kid_idx    on public.custom_tasks(kid_id);

alter table public.custom_tasks enable row level security;
-- 家長對自家 custom_tasks 全權（孩子不登入，走家長帳號）；比照 items_owner_all
drop policy if exists custom_tasks_owner_all on public.custom_tasks;
create policy custom_tasks_owner_all on public.custom_tasks
  for all
  using      (exists (select 1 from public.families f where f.id = custom_tasks.family_id and f.owner_id = auth.uid()))
  with check (exists (select 1 from public.families f where f.id = custom_tasks.family_id and f.owner_id = auth.uid()));

-- ============================================================================
-- 驗收檢查點（在 SQL Editor 逐條跑，應無錯）：
--   select * from public.custom_tasks limit 1;                 -- 表已建
--   -- reset-proof 手驗：對某 kid 建一筆自訂任務後，跑 _resetCloud 的 task_on 重置語句：
--   --   update public.kids set task_on = '{"k1":true}'::jsonb where id = '<kid>';
--   -- 再查 custom_tasks 該列仍在、kid_id 未變：
--   --   select id, label, kid_id, active from public.custom_tasks where kid_id = '<kid>';
-- 前端接線：src/app.js 的 cloudLoadCustomTasks / pushCustomTasks / _customTaskRow /
--   _customTaskFromRow 會自動使用本表；createCustomTask 原語（核准任務提案的 task 分支）建列。
-- ============================================================================
