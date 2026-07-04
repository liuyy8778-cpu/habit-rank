# Part A 交接 + 後端上手教學請求(給 Claude Design)

> 給 Claude Design。這份有兩個請求:
> **(1)** 幫我把「多小孩 + Supabase 後端」的技術方案收斂;
> **(2) ⭐ 最重要:** 使用者是**家長、不是工程師**。請你寫一份「零基礎照著點就能完成」的後端建置教學——這比技術設計本身更關鍵,因為這一步卡住,整個 Part A 就上不了。
>
> 既有負面清單持續有效:不做手足比較、不碰隨機性、不增加螢幕黏著度、獎勵「準時停止」而非任務量。

---

## 0. 現況(截至今天)

- **Part B 五項功能全部上線**(純前端可運作):
  - B5 Miss 原因診斷、B6 家長週報一句話、B3 公約雙向化(小孩提案+家長承諾+修訂紀錄)、B2 彈性連續(滾動 7 天)、B1 畢業機制(歷程回顧)。
- **Part A(多小孩 + Supabase)還沒動**,因為它卡在真實基礎設施:需要一個 Supabase 專案 + 把部署從純靜態改成含後端。**這些雲端操作要由使用者本人在 Supabase / Vercel 後台完成,實作方(Claude Code)無法代開雲端帳號與資源。**

---

## 1. 技術現況(給你判斷用)

- **部署**:Vercel 靜態託管,單一 `index.html`(約 6.5MB,由 `build.py` 從 `src/app.js` + `src/template.html` 打包)。
- **沒有**:`package.json`、npm、建置工具鏈、後端、登入、環境變數。
- **資料**:localStorage 單一 blob,`schemaVersion: 5`。
- **好消息**:早就鋪好後端的地基——`checkinEvents` 是 **append-only 事件流**(每筆打卡是一個事件),搬去資料庫幾乎是一對一。

---

## 2. 我提議的 Supabase 資料模型(草案,請你審 + 補漏)

對應多小孩簡報的 A7。用資料表(per-kid = 多列),不用 localStorage 巢狀 map。

```
families      (id, parent_email, created_at)
kids          (id, family_id→families, name, avatar, age,
               coins, xp, streak, graduation_stage,
               task_on jsonb, manual_unlock jsonb, schedules jsonb)
checkin_events(id, kid_id→kids, behavior_id, kind, coin, xp,
               honest bool, miss_reason, verdict, date, ts)   ← 直接對應現有事件
trust_levels  (kid_id→kids, behavior_id, level, graduated_at)
covenant      (family_id→families, version, terms jsonb, schedules jsonb,
               signatures jsonb, history jsonb)               ← 家庭共享一份
proposals     (id, family_id, kid_id, text, reason, status, at)
pledges       (id, family_id, text)
pledge_log    (pledge_id→pledges, date, done bool)
rewards       (id, family_id, name, cost, icon, visibility jsonb, price_override jsonb)
```

- `currentKid` 是**裝置端**的選擇(存 localStorage),不進資料庫。
- 反手足比較:小孩端查詢只 scope 自己的 `kid_id`;家長端才能跨 kid 查。

---

## 3. 遷移計畫(localStorage → Supabase)

1. 家長第一次登入 → 建立 `family` + 第一個 `kid`(用現有 localStorage 資料,無損)。
2. `checkinEvents` 逐筆寫成 `checkin_events` 列(帶 `kid_id`)。
3. covenant / trustLevel / graduatedAt 各自搬到對應表。
4. 之後才開放「新增第二個小孩」。
5. 保留 localStorage 匯出 JSON 當保險。

---

## 4. ⭐⭐ 請你產出的重點:給家長的「後端上手教學」

**這是我最需要你幫忙的部分。** 請寫成「照著點、每一步都知道在幹嘛」的教學,對象是**完全沒碰過後端的家長**。請至少涵蓋下面每一條,並且**用白話 + 明確到『點哪個按鈕、貼哪段文字、怎麼看有沒有成功』**:

1. **註冊 Supabase、建立 project**:在哪註冊、免費額度夠不夠一個家庭、建 project 時要選什麼、要記下哪些東西。
2. **拿到 project URL + anon key**:在後台哪一頁、長什麼樣、哪個可以公開哪個不能外流。
3. **建資料表**:給家長一段可以「一次貼上就建好全部表」的 SQL(貼在 Supabase SQL Editor 按 Run),而不是叫家長一個一個手點欄位。→ **這段 SQL 我可以幫忙寫,請你確認要不要走這條路。**
4. **RLS(資料列權限)**:用一句白話解釋「這是什麼、為什麼一定要開、不開會怎樣」,並給可貼上的設定。
5. **家長登入怎麼運作**:建議用 **email magic link**(收信點連結就登入,不用記密碼)還是別的?請說明並給設定步驟。
6. **前端怎麼接上後端**:project URL / anon key 要放哪、Vercel 的環境變數在哪個頁面設、設完要不要重新部署。
7. **部署會怎麼變**:現在是純靜態單檔,接了 Supabase 之後——還能不能繼續用 Vercel?build 流程要不要改?(見第 5 節我的傾向)
8. **每一步的「驗收檢查點」**:怎麼知道這一步真的成功了(例:在哪看到第一筆資料進資料庫)。
9. **出錯了怎麼辦**:最常見的三種錯 + 怎麼看錯誤 + 要把什麼資訊貼回來給我(Claude Code)修。

> 分工講清楚:**程式碼、SQL、前端接線由我(Claude Code)寫**;**Supabase / Vercel 後台的點擊操作由家長本人做**(靠你這份教學)。教學寫得越白、家長越做得起來,我這邊就能接著把程式接上。

---

## 5. 我的實作傾向(讓家長「做得起來」是第一優先)

為了讓教學短、家長不被工具鏈勸退,我傾向走**最少步驟**的路,請你 agree / 不 agree:

- **維持單檔架構**:用 `supabase-js` 從 CDN 引入(像現在引 React 那樣),**不導入 npm / Vite / Next**。→ 家長不用碰任何指令列、建置工具。
- **Auth 用 email magic link**:不用設密碼、不用記密碼。
- **建表用一段貼上式 SQL**:家長只要複製→貼到 SQL Editor→按 Run。
- **繼續用 Vercel 靜態部署**:只多設兩個環境變數。

如果你覺得為了長遠該直接上 Vite/Next 正式框架,請說明理由與對「家長自助操作難度」的影響——這會直接決定教學要寫多長。

---

## 6. 需要你(跟我)一起拍板的技術決策

1. **架構**:維持單檔 + CDN supabase-js(我傾向)?還是轉正式框架(Vite/Next)?
2. **Auth**:email magic link(我傾向)/ 密碼 / Google 登入——哪個對家庭最省事又夠安全?
3. **建表方式**:一段貼上式 SQL(我傾向)/ Table Editor 手點?
4. **免費額度**:Supabase 免費方案對「一個家庭、2 個小孩、每天數十筆事件」夠用嗎?有沒有要注意的上限。
5. **同步策略**:即時同步(打卡馬上進雲端)還是進 app 時拉一次?共用平板 vs 各自裝置各建議什麼。
6. **多小孩切換**:切 profile 時大頭像+名字確認(不上密碼,符合誠實哲學)——同意嗎?

---

## 7. 回覆方式

- 第 4 節那份「家長上手教學」是主菜,請盡量具體。
- 第 6 節逐點拍板,我就能開始寫接線程式碼與那段建表 SQL。
- 我沒列的,代表同意照多小孩簡報(MULTI_KID_DESIGN.md)的既有結論做。

*—— 實作者 (Claude Code)*
