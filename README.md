# 家庭自律養成 App

一個幫助家庭一起養成自律習慣的單頁應用程式(SPA),以「段位 / 自律值」的遊戲化機制,讓孩子在完成日常任務的過程中累積成就感,家長也能同步掌握進度。

## 功能特色

- **5 個分頁**:完整的分頁式介面,涵蓋任務、進度、獎勵等面向。
- **段位 / 自律值機制**:透過完成任務累積自律值(XP),逐步提升段位。
- **小孩與家長雙視角**:分別對應孩子執行任務與家長管理設定的需求。
- **兌換與升級動畫**:完成兌換獎勵與升級段位時的互動動畫回饋。
- **本機資料儲存**:資料存於瀏覽器 `localStorage`,無需後端伺服器。

## 專案結構(可編輯版)

這個 app 原本是 Claude Design 匯出的「打包好的」單一 HTML(所有程式碼被壓縮成亂碼塞在一個檔案裡,無法手動編輯)。專案已經把它**拆解成可編輯的原始碼**:

```
habit-rank/
├── index.html          ← 部署用的成品(由 build.py 自動產生,請勿手改)
├── build.py            ← 打包腳本:把 src/ 重新組回 index.html
├── src/
│   ├── app.js          ← 【主要編輯檔】app 邏輯:遊戲數值、獎勵、段位、任務文字
│   └── template.html   ← 版面模板:畫面排版、顏色、樣式
└── vendor/             ← 框架與字型(請勿編輯)
    ├── loader.html     ← 打包容器骨架
    ├── runtime.js      ← Claude Design 執行環境(唯讀參考)
    └── assets.json     ← 內嵌的 React runtime + Noto Sans TC 字型
```

### 最常調整的「旋鈕」都在 `src/app.js`

例如:

```js
// 初始數值
coins: 128,   // 起始金幣
streak: 6,    // 連續天數
xp: 96,       // 自律值(決定目前段位)
protects: 2,  // 護盾數量

// 每日習慣與獎勵金幣
{ label:'睡前準時交機',      reward:30 }
{ label:'準時結束今天的螢幕', reward:20 }

// 段位門檻(名稱、所需 XP、解鎖內容)
見習 0 → 銅段 150 → 銀段 400 → 金段 800 → 鑽石 1500 → 傳說 2500
```

## 修改流程

1. 編輯 `src/app.js`(數值/邏輯/文字)或 `src/template.html`(版面/樣式)。
2. 重新打包:

   ```bash
   python3 build.py
   ```

   會重新產生根目錄的 `index.html`。
3. commit 並 push,Vercel 會自動重新部署。

## 部署(Vercel)

根目錄的 `index.html` 是純靜態單一檔案,Vercel 匯入專案後:

- Framework Preset 選 **Other**(不需 build 步驟)。
- 直接 Deploy,Vercel 會以 `index.html` 作為入口頁。

> App 執行時會從 unpkg.com CDN 載入 React 與 Babel,因此需要網路連線(Vercel 環境沒問題)。

## 資料儲存說明

所有進度與設定皆儲存於瀏覽器的 `localStorage`,資料僅保存在目前使用的裝置與瀏覽器中。清除瀏覽器資料或更換裝置後,先前的紀錄將不會保留。
