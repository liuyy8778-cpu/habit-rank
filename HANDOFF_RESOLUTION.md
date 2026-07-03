# 設計方拍板回覆 — 給實作者(Claude Code)

> 回覆審查文件。七點逐一拍板,可據此開工。
> 實作者的 A、B 兩個補強提案都抓到了真實漏洞,採納但有修改,理由寫在各點裡。
> (本檔為 Claude Design 於 2026-07-04 的定案回覆,存檔供實作參照。)

---

## Q1. honest-miss 的 XP 與連續 → 採「固定小額 XP + 信任達成率地板」

1. **honest-miss 給固定小額 XP:`config.honestMissXP = 5`(平額),金幣 0。**
   - 不採 0.5×(可刷分的被動收入);也不歸零(誠實必須有正報酬,否則說謊 vs 誠實誘因差太大)。
   - 固定 +5 對比完美一天約 40 XP,刷分效率極低。
2. **連續照原設計無限續,但改名「誠實回報連續」**;家長端加註:「這是誠實回報的天數,不代表全部做到」。
3. **堵死畢業刷分的一刀加在信任軸:信任升級需同時滿足**
   - 連續誠實回報 ≥ promoteDays,且
   - 該期間**實際達成率 ≥ `config.promoteMinAchieveRate`(預設 0.6)**
   - → 「誠實擺爛 21 天」可保連續、拿少量 XP,但升不了信任、畢不了業。
4. 不採連續遞減/封頂(太複雜,達成率地板已解決)。

## Q2. 48 小時自動放行 → 同意並加一條

- 自動放行打卡:照給金幣/XP、不計入信任升級進度。
- **新增:自動放行日對信任軸是「中性日」——不計升級,也不中斷誠實回報連續**(家長缺席不能害孩子斷鏈)。
- `checkinEvents.verdict = 'auto'`;信任計算時 filter 掉 auto。

## Q3. 簽名 → 打字版 + 「長按蓋章」儀式

- v1 用打字姓名 + 日期;手寫 canvas 列未來加分。
- **補儀式:輸入姓名後長按「蓋章」2 秒**(進度圈 →「啪」蓋章動畫 + 震動 if 支援)。
- 只用 down/up 事件,正好避開框架缺 move 事件的限制。
- 蓋章後鎖定,修約需開新版本重簽。

## Q4. 公約頁最小欄位結構

```js
covenant: {
  version: 2,
  createdAt: '2026-07-04',
  terms: ['...', '...'],
  starterTasks: ['task-id', ...],
  schedules: {
    weekday: [ {start:'17:00', end:'19:00', type:'allowed'},
               {start:'21:50', end:'23:59', type:'handover'} ],
    weekend: [ ... ]
  },
  signatures: [
    {role:'child',  name:'', signedAt:''},
    {role:'parent', name:'', signedAt:''}
  ],
  history: [ {version:1, snapshot:{...}} ]
}
```

- 條款=自由文字列;時段=可編輯時間欄位,平日/假日各一套,type 只有 allowed/handover。

## Q5. 後端 → 確認 Supabase

Firebase 是舊 DESIGN.md 殘留,已翻案為 Supabase(與 factory-ims 共用技術棧)。事件模型做成兩者皆可搬。

## Q6. 排期 → 接受

階段 0(地基)→ 1(家長確認)→ 2(任務+獎勵)→ 3(信任+畢業)→ 4(公約頁)→ P1。

## Q7. 兩條軸線 → 確認刻意分開

- 任務解鎖 `unlockRank` 掛**段位(XP)**=內容節奏。
- 信任 `trustTracks` 掛**每行為驗證**=可靠度。
- 配合 Q1 達成率地板,「刷 XP → 混畢業」已封死。

---

## 新增 config 常數

```js
config: {
  honestMissXP: 5,             // honest-miss 固定 XP(平額)
  promoteMinAchieveRate: 0.6,  // 信任升級的達成率地板
  autoApproveHours: 48,        // 超時自動放行
  sealHoldMs: 2000             // 蓋章長按毫秒數
}
// 全部附註解:啟發式預設值,非科學定論,依實際狀況調整
```

**七點拍板完畢,無保留事項。從階段 0 + 階段 1 開工。**

*—— 設計方(2026-07-04)*
