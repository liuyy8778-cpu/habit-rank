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
- **持久化**:localStorage(`habitRank`)為主要來源與快取;登入後鏡像到 Supabase(見下)。`componentDidUpdate` 會 strip 掉 transient 欄位再存。
- **schema 遷移**:`migrateToV2()` + `SCHEMA_VERSION`,版本化無損升級,升級前備份 `habitRank_backup_v1`。

## 後端(Supabase)

- 家庭雲端空間:email magic link 登入(帳號=家長);小孩是 profile、不登入。
- 分階段完成:①登入閘門 ②核心進度上雲(kids/checkin_events/trust_levels/covenant)③多小孩(切換/新增/改名)。
- 家長 PIN 關卡:進「家長」頁強制輸入 4 位數 PIN(存 device key `habitRank_pin`,登出清除)。
- 待辦(2b):proposals / pledges / rewards 的 per-kid 雲端同步。
- 連線設定在 `src/app.js` 頂部(`SUPA_URL` / `SUPA_KEY`,publishable key 靠 RLS 保護、可公開)。

## 驗證方式

- `node --check src/app.js`、sc-if/sc-for 開閉數平衡檢查、`python3 build.py`。
- 端到端:`python3 -m http.server` + Playwright(chromium 在 `/opt/pw-browsers/chromium`)。注意:沙箱連不到 Supabase(網路白名單),雲端流程需真人實測。

## 設計負面清單(每個 PR 都要過)

不做手足比較、不碰隨機性/賭博機制、不增加螢幕黏著度、獎勵「準時停止」而非任務量。詳見上方 `@docs/design-advisor.md` 顧問角色。
