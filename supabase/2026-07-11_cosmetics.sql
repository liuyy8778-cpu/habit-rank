-- ============================================================================
-- ②虛擬人物 + 家園（外觀系統）：items 分類欄位 + kids.equipped 穿戴快取
-- （貼進 Supabase SQL Editor 按 Run 一次即可；可重複執行、idempotent）
-- ----------------------------------------------------------------------------
-- 設計對應（顧問四題定調）：
--   Q1 穿脫 = kids.equipped jsonb 快取（非帳本事件）：ledger_events 一列都不加、
--      kind constraint 不動、purchase_item() 不動。equipped 只存 item_id 指標，
--      如 {"hat":"c_hat1","outfit":null,"home":"c_home1"}。穿戴合法性在前端 render
--      單一出口校驗（必須通過 inventoryOf() 且 category='cosmetic'），DB 不強制。
--      ledger_reset 後背包推導清空 → equipped 引用自動失效＝自動脫下，無額外邏輯。
--   Q2 槽位一次到位 3 槽（hat/outfit/home）：items 加 category + slot；本波只上
--      hat + home 的內建示範品，outfit 欄位保留、示範品併下一波（寧缺勿醜）。
--   Q4 外觀重複購買由前端擋（已擁有→按鈕灰），RPC 不動；同幣同架同 RPC。
-- 外觀道具走的仍是既有 items / ledger_events / purchase_item()：零新帳務邏輯。
-- ============================================================================

-- ========== 1) items 加 category / slot / art ==========
-- category：privilege（特權/體驗類＝現有商品全部）/ cosmetic（外觀類＝新增）
alter table public.items add column if not exists category text not null default 'privilege';
alter table public.items add column if not exists slot     text;            -- 僅 cosmetic 用：hat / outfit / home
alter table public.items add column if not exists art      text;            -- cosmetic 呈現用 emoji（如 👑 / 🏠）

-- 既有列一律回填為特權類（default 已處理新列，這行收斂舊列的 null 保險）
update public.items set category = 'privilege' where category is null;

-- category 值域約束（存在就不重建）
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'items_category_chk'
  ) then
    alter table public.items
      add constraint items_category_chk check (category in ('privilege','cosmetic'));
  end if;
end $$;

-- ========== 2) kids 加 equipped jsonb（當前穿戴快取，可變）==========
-- 與 kids.coins 同性質：純顯示快取，非稽核來源。所有權真相仍在 ledger_events（inventoryOf）。
alter table public.kids add column if not exists equipped jsonb not null default '{}'::jsonb;

-- ============================================================================
-- 驗收檢查點（在 SQL Editor 逐條跑，應無錯）：
--   -- 欄位已建、舊商品全為 privilege：
--   select category, count(*) from public.items group by category;
--   -- equipped 預設空物件:
--   select id, name, equipped from public.kids limit 3;
--   -- 外觀道具購買後仍走同一本帳本（買一件外觀後查該 kid 帳本應多出 coin_spend + item_acquire 兩列）：
--   -- select kind, item_id, amount, qty from public.ledger_events where kid_id = '<kid>' order by ts desc limit 4;
-- 前端接線：
--   · DEFAULT_ITEMS 內建示範外觀（c_hat*/c_home*）首登會 seed 進 items（cloudLoadItems）。
--   · _itemRow/_itemFromRow 已映射 category/slot/art；pushKid/cloudLoad 已映射 equipped。
--   · 穿脫走前端 equip()（setState → 去抖 cloudSave → pushKid 更新 kids.equipped），無 RPC。
-- ============================================================================
