@docs/design-advisor.md

# habit-rank 專案說明

家庭自律養成 SPA(繁體中文)。用「段位 / 自律值」遊戲化,幫台灣家庭的青少年養成自律,家長同步掌握進度。核心哲學:訓練「自律」(自己選、持續做),不是「他律」(強制、監控);最終目標是孩子畢業、不再需要 app。

## 建置流程(重要)

- **不要手改 `index.html`**——它是 `build.py` 打包出來的產物(約 6.5MB)。
- 改邏輯改 `src/app.js`,改版面改 `src/template.html`,然後跑 `python3 build.py` 重新產生 `index.html`。
- `vendor/`(x-dc runtime + 字型)與 `cdn/`(React/Babel/supabase-js 本地化)一般不用動。
- 版本戳記 `@@BUILD@@` 由 build.py 自動代入。

## 架構

- **前端框架**:Claude Design 匯出的 x-dc 模板(`{{ binding }}`、`<sc-if>`、`<sc-for>`)+ React 18(runtime 於瀏覽器載入)。app 邏輯是一個 `class Component extends DCLogic`,`renderVals()` 回傳一份扁平物件綁定到模板。
- **事件表限制**:框架的 EVENT_MAP 有 onclick/onchange/oninput/onmousedown/onmouseup/onmouseenter/onmouseleave,**沒有 mousemove/touchmove**。
- **資料模型**:`checkinEvents` 是 append-only 事件流(單一真相來源);`todayEventOf` 取某行為當天最新事件。信任系統 per-behavior(trustLevel 0/1/2),升級需連續誠實 + 達成率地板。
- **商店 + 背包**(2026-07):商城目錄 = `items` 主檔(family 共享,收編舊 custom_shop);購買/使用 = `ledgerEvents` 真 append-only 帳本(kind:coin_spend/item_acquire/item_consume)。**金幣結餘 = 純事件推導** `deriveCoins()`(收入 checkin coin − 支出 coin_spend),`kids.coins` 只是顯示快取,業務判斷一律讀推導值。背包 = `inventoryOf()`(入包−出包)。雲端購買走 `purchase_item` RPC 原子交易(帳平鎖後端);SQL 見 `supabase/2026-07-11_shop_inventory.sql`。
- **虛擬人物 + 家園**(2026-07,②):外觀部件 = `items` 的 `category:'cosmetic'` 分類(特權品為 `'privilege'`),分 `slot`(hat/outfit/home,本波只上 hat+home)、帶 `art`(呈現 emoji)。購買走同一支 `purchase_item()` RPC、同一本 `ledgerEvents`、同一個 `inventoryOf()`——**零新帳務邏輯**。穿脫 = `kids.equipped` jsonb **顯示快取**(非帳本事件),合法性由**單一出口** `cosmeticEquipped()` 把關(必須 `inventoryOf>0` 且 category='cosmetic';ledger_reset 後背包清空 → 自動全脫)。家園有免費預設場景 `DEFAULT_HOME`(獲得框架,永不空白)。反黏著五紅線見 `docs/design-advisor.md`。SQL 見 `supabase/2026-07-11_cosmetics.sql`。
- **持久化**:localStorage(`habitRank`)為主要來源與快取;登入後鏡像到 Supabase(見下)。`componentDidUpdate` 會 strip 掉 transient 欄位再存。
- **schema 遷移**:`migrateToV2()` + `SCHEMA_VERSION`,版本化無損升級,升級前備份 `habitRank_backup_v1`。

## 後端(Supabase)

- 家庭雲端空間:email magic link 登入(帳號=家長);小孩是 profile、不登入。
- 分階段完成:①登入閘門 ②核心進度上雲(kids/checkin_events/trust_levels/covenant)③多小孩(切換/新增/改名)。
- 家長 PIN 關卡:進「家長」頁強制輸入 4 位數 PIN(存 device key `habitRank_pin`,登出清除)。
- 待辦(2b):proposals / pledges 的 per-kid 雲端同步。(商城 rewards 已由 items 主檔取代並上雲。)
- 商店表:`items`(family 共享,可變目錄)、`ledger_events`(append-only,只 SELECT+INSERT、無 UPDATE/DELETE policy)。「重新來過」永不 delete 帳本,而是 append 一筆 `kind:ledger_reset` 盤點事件;`deriveCoins`/`inventoryOf`/`purchase_item` 一律以最後一筆 reset 之後起算(舊帳保留可稽核)。孤兒表 `rewards` 待確認無資料後 drop(SQL 已附註)。
- 連線設定在 `src/app.js` 頂部(`SUPA_URL` / `SUPA_KEY`,publishable key 靠 RLS 保護、可公開)。
- **共用 DB 遷移相容鐵律**(孩子開始真實使用後生效):`items` 等 family 共享表一旦有真實資料,**含 seed 資料的遷移(新增內建品/欄位)須先問「舊前端看到新資料是否無害」**。無害才可直接 seed;不無害(舊前端會誤render/誤操作新資料)則 seed **延後到新前端合併上線後**執行,或先以 `active=false` 種入、上線後再開。理由:preview 與 production 共用同一個 Supabase,搶先 seed 會讓還在線上的舊前端撞見不認得的資料。②外觀因 `active` 預設可見且舊前端商城會忽略未知 category,判定無害故直接 seed(補種走 `cloudLoadItems` 缺漏補插,idempotent)。

## 驗證方式

- `node --check src/app.js`、sc-if/sc-for 開閉數平衡檢查、`python3 build.py`。
- 端到端:`python3 -m http.server` + Playwright(chromium 在 `/opt/pw-browsers/chromium`)。注意:沙箱連不到 Supabase(網路白名單),雲端流程需真人實測。

## 設計負面清單(每個 PR 都要過)

不做手足比較、不碰隨機性/賭博機制、不增加螢幕黏著度、獎勵「準時停止」而非任務量。詳見上方 `@docs/design-advisor.md` 顧問角色。

**商城鐵律**:螢幕時間 / 裝置使用額度(延長交機、加螢幕時段等)**永不**作為商城商品——示範資料與未來功能都受此約束。理由:Premack 原理,被當獎勵出售的東西會在孩子心中升值,與全案「訓練放下」目標正面牴觸。社交需求(過夜、交友)不標價。商品只放特權/體驗類;稀缺型角標(HOT/新)禁用,唯一角標=「你提案的」。
