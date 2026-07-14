
// ===== 自律任務庫(模組層級:rollover 與 renderVals 共用)=====
// where: anywhere=到哪都能做(出門日仍顯示) / home=需在家
// times: 兩套目標時間(home 在家日 / school 上學日),供螢幕/作息類習慣顯示
const LIB = [
  { id:'k1',  type:'habit', dom:'螢幕自律', domColor:'indigo',  where:'home',     times:{home:'22:30',school:'21:40'}, label:'睡前準時交機',        desc:'把手機放到充電座、離開房間。這是「能放下」最核心的一塊肌肉。', coin:20, xp:15, honestyEligible:true, unlockRank:0, icon:'i-moon' },
  { id:'k2',  type:'habit', dom:'螢幕自律', domColor:'indigo',  where:'home',     times:{home:'22:00',school:'21:20'}, label:'準時結束今天的螢幕',    desc:'到約定時間，自己收手——不是被關掉，是自己停。',            coin:15, xp:12, honestyEligible:true, unlockRank:0, icon:'i-hour' },
  { id:'sc3', type:'task',  dom:'螢幕自律', domColor:'indigo',  where:'anywhere', label:'今天完全沒偷超時',      sub:'一整天都在約定內',   coin:8, xp:6, unlockRank:0, icon:'i-check' },
  { id:'sc4', type:'task',  dom:'螢幕自律', domColor:'indigo',  where:'home',     label:'起床後 30 分不碰手機',  sub:'醒來先不抓手機',     coin:8, xp:6, unlockRank:1, icon:'i-bolt' },
  { id:'sc5', type:'task',  dom:'螢幕自律', domColor:'indigo',  where:'home',     label:'用完手機主動放回充電座', sub:'不用被提醒',        coin:5, xp:4, unlockRank:3, icon:'i-shield' },
  { id:'sc6', type:'task',  dom:'螢幕自律', domColor:'indigo',  where:'anywhere', label:'吃飯時不看螢幕',        sub:'專心吃飯、聊天',     coin:5, xp:4, unlockRank:3, icon:'i-heart' },
  { id:'sl1', type:'habit', dom:'作息自律', domColor:'sky',     where:'anywhere', times:{home:'22:45',school:'22:00'}, label:'準時上床睡覺',        desc:'到睡覺時間就上床，讓身體記住入睡的節奏。',              coin:15, xp:12, honestyEligible:true, unlockRank:2, icon:'i-moon' },
  { id:'sl2', type:'task',  dom:'作息自律', domColor:'sky',     where:'anywhere', label:'鬧鐘響第一次就起床',    sub:'不賴床、不按貪睡',   coin:10, xp:8, unlockRank:1, icon:'i-hour' },
  { id:'sl3', type:'task',  dom:'作息自律', domColor:'sky',     where:'home',     label:'睡前準備好明天的東西',  sub:'書包、衣服先備好',   coin:5, xp:4, unlockRank:3, icon:'i-brief' },
  { id:'ld1', type:'task',  dom:'學習自律', domColor:'teal',    where:'home',     label:'回家先寫完作業再玩',    sub:'不用催',             coin:10, xp:8, unlockRank:0, icon:'i-brief' },
  { id:'ld2', type:'task',  dom:'學習自律', domColor:'teal',    where:'home',     label:'專注讀書 30 分',        sub:'中途不滑手機',       coin:10, xp:8, unlockRank:2, icon:'i-chart' },
  { id:'ld3', type:'task',  dom:'學習自律', domColor:'teal',    where:'anywhere', label:'主動多做一點',          sub:'預習或複習',         coin:6, xp:5, unlockRank:3, icon:'i-spark' },
  { id:'bd1', type:'task',  dom:'身體自律', domColor:'amber',   where:'anywhere', label:'離線運動 30 分',        sub:'跑步 · 球類 · 騎車', coin:8, xp:6, unlockRank:0, icon:'i-bolt' },
  { id:'bd2', type:'task',  dom:'身體自律', domColor:'amber',   where:'anywhere', label:'喝足夠的水',            sub:'一天喝滿水',         coin:4, xp:3, unlockRank:3, icon:'i-target' },
  { id:'bd3', type:'task',  dom:'身體自律', domColor:'amber',   where:'anywhere', label:'好好吃完正餐',          sub:'不挑食',             coin:4, xp:3, unlockRank:2, icon:'i-heart' },
  { id:'rp1', type:'task',  dom:'責任自律', domColor:'teal',    where:'home',     label:'完成一件家事',          sub:'不用被叫',           coin:8, xp:6, unlockRank:1, icon:'i-check' },
  { id:'rp2', type:'task',  dom:'責任自律', domColor:'teal',    where:'home',     label:'自己整理房間 / 書桌',   sub:'保持整齊',           coin:5, xp:4, unlockRank:3, icon:'i-gear' },
  { id:'rp3', type:'task',  dom:'責任自律', domColor:'teal',    where:'home',     label:'東西用完歸位',          sub:'物歸原處',           coin:4, xp:3, unlockRank:4, icon:'i-target' },
  { id:'em1', type:'task',  dom:'情緒自律', domColor:'magenta', where:'anywhere', label:'情緒踩煞車',            sub:'想生氣時先暫停深呼吸', coin:8, xp:6, unlockRank:0, icon:'i-heart' },
  { id:'em2', type:'task',  dom:'情緒自律', domColor:'magenta', where:'anywhere', label:'說到做到',              sub:'答應的事有做',       coin:8, xp:6, unlockRank:2, icon:'i-shield' },
];
const ymd = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const parseYmd = (s) => new Date(s + 'T00:00:00');
const dayGap = (a, b) => Math.round((parseYmd(b) - parseYmd(a)) / 86400000);
// 依日期決定當天預設模式:週末→在家;平日→暑假(7、8 月)在家,否則上學日
const defaultDayMode = (dateStr) => { const d = parseYmd(dateStr), dow = d.getDay(), m = d.getMonth() + 1; if (dow === 0 || dow === 6) return 'home'; return (m === 7 || m === 8) ? 'home' : 'school'; };
// 版本號:@@BUILD@@ 於 build.py 打包時自動代入(日期 · 建置編號),用來判斷手機/網頁是否同版
const APP_VERSION = 'v2.0 · @@BUILD@@';
// ===== 規則頁「阿爸的承諾」(靜態;改規則就改這裡的常數 + 日期,再跑 build.py)=====
const RULES_UPDATED = '2026-07-07';
const RULES_TITLE = '🏛️ 阿爸的承諾';
const RULES_SUBTITLE = '本頁規則大於一切口頭說法';
const RULES_SECTIONS = [
  { h: '一、你的錢幣', items: [
    '你賺到的錢幣就是你的，永遠不會被沒收',
    '錢幣不會因為任何處罰、吵架、或表現不好而扣除'] },
  { h: '二、誠實最大', items: [
    '沒做到就照實回報，不會被罵，紀錄不會歸零',
    '誠實回報永遠比假裝完美更有價值'] },
  { h: '三、規則只有一個改法方向（單向棘輪）', items: [
    '對你們「有利」的改動：馬上生效（例：降價、上新商品、新的賺幣方式）',
    '對你們「不利」的改動：提前 7 天公告（例：漲價、調整規則）'] },
  { h: '四、商城異動規則', items: [
    '降價、上新品 → 馬上生效',
    '漲價 → 提前 7 天公告，公告期間仍可用「舊價」購買',
    '下架 → 提前 7 天公告；如果你已經在存錢要買它，跟阿爸講，一定提供等值的替代選擇（祖父條款）'] },
  { h: '五、永久保證', items: [
    '螢幕使用時間永遠不會出現在商城裡',
    '兄弟姊妹的商品價格一律相同',
    '覺得哪裡不合理、發現 bug → 直接跟阿爸講'] },
];
// 本機建置編號(從版本戳記解析);與雲端 version.json 的 n 比對,偵測有沒有新版
const LOCAL_BUILD = parseInt((APP_VERSION.match(/b(\d+)/) || [])[1] || '0', 10);

// ===== Supabase 後端(家庭雲端空間)=====
// publishable key 設計上可公開(靠 RLS 保護),放進前端安全。service_role / DB 密碼永不進前端。
const SUPA_URL = 'https://zsngoedhnkeeateoyexl.supabase.co';
const SUPA_KEY = 'sb_publishable_QwG4T28jqwU1cqSNwI79UA_0wNHOdpR';

// ===== 設定常數(啟發式預設值,非科學定論,依實際狀況調整)=====
const CONFIG = {
  honestMissXP: 5,             // 誠實承認沒做到:固定小額 XP(平額,不隨任務浮動)
  promoteMinAchieveRate: 0.6,  // 信任升級的達成率地板(擺爛畢不了業)
  autoApproveHours: 48,        // 待確認超時自動放行(中性日)
  sealHoldMs: 2000,            // 公約蓋章長按毫秒數
  trustThresholds: [14, 35],   // 信任分數 T 門檻:T≥14→L1、T≥35→L2(天當量)
  trustGain: 1,                // 誠實達成 ΔT(啟發式,靠 #3 數據校準)
  trustLiePenalty: 5,          // 說謊被抓 ΔT = −5(可 5 個誠實達成日補回,不整級退回)
  spotCheckRate: 0.3,          // 信任等級 1(抽查)被抽中確認的機率
};
const TRUST_NAMES = ['每次確認', '隨機抽查', '已畢業 · 自主'];

// ===== 商城 items 主檔的內建示範品(seed)=====
// 商城鐵律:螢幕時間/裝置額度永不上架;稀缺角標(HOT/新/限量)禁用;唯一允許角標=「你提案的」。
// 這些是新家庭的預設商品,會被 seed 進 items 主檔(本機 + 雲端),之後家長可自行管理。
// category:'privilege' = 特權/體驗類(現有商品全部);'cosmetic' = 外觀類(人物/家園),slot 分槽、art 為呈現用 emoji。
// 外觀鐵律:全數低於特權最低價(350);目錄總價值不超過特權類;走同一本帳本、同一支 purchase_item()。
const DEFAULT_ITEMS = [
  { id: 's5', name: '決定一次全家晚餐', cost: 600, icon: 'i-heart',  g: 'magenta', builtin: true, active: true, category: 'privilege' },
  { id: 's2', name: '家庭電影選片權',   cost: 350, icon: 'i-gift',   g: 'indigo',  builtin: true, active: true, category: 'privilege' },
  { id: 's7', name: '跟爸爸單獨出門半天', cost: 800, icon: 'i-spark',  g: 'amber',   builtin: true, active: true, category: 'privilege' },
  { id: 's8', name: '家庭出遊選地點',   cost: 800, icon: 'i-target', g: 'teal',    builtin: true, active: true, category: 'privilege' },
  { id: 's6', name: '一次免家事券',     cost: 450, icon: 'i-shield', g: 'indigo',  builtin: true, active: true, category: 'privilege' },
  // 外觀示範品(本波:hat + home 各 2 件;outfit 槽保留、示範品併下一波「寧缺勿醜」)
  { id: 'c_hat1',  name: '皇冠',     cost: 120, icon: 'i-crown', g: 'amber',   builtin: true, active: true, category: 'cosmetic', slot: 'hat',  art: '👑' },
  { id: 'c_hat2',  name: '學士帽',   cost: 200, icon: 'i-medal', g: 'indigo',  builtin: true, active: true, category: 'cosmetic', slot: 'hat',  art: '🎓' },
  { id: 'c_home1', name: '溫馨小屋', cost: 220, icon: 'i-heart', g: 'amber',   builtin: true, active: true, category: 'cosmetic', slot: 'home', art: '🏠' },
  { id: 'c_home2', name: '森林露營', cost: 180, icon: 'i-spark', g: 'teal',    builtin: true, active: true, category: 'cosmetic', slot: 'home', art: '🏕️' },
];
// 外觀槽位定義(schema 一次到位 3 槽;本波展示層只上 hat+home)
const COSMETIC_SLOTS = ['hat', 'outfit', 'home'];
const SLOT_LABEL = { hat: '帽子', outfit: '衣服', home: '家園' };
// 免費預設家園:未購買任何 home 外觀時的完整底景(獲得框架,非鎖非空白)。脫下購買的 home 一律退回這個,永不家徒四壁。
const DEFAULT_HOME = { art: '🏡', g: 'sky' };
// 補種缺漏的內建品:雲端 items 表非空時(既有 family 已 seed 過特權品),算出 DEFAULT_ITEMS 裡「還沒上雲」的 builtin id。
// 只回缺漏、insert-only、idempotent(重複登入 → 已存在 → 回空 → 不重插)。純函式,方便單測。
function missingBuiltinIds(cloudRowIds) {
  const have = new Set(cloudRowIds || []);
  return DEFAULT_ITEMS.filter(d => d.builtin && !have.has(d.id)).map(d => d.id);
}
// 穿戴合法性「單一出口」:equipped 只是指標,真相是背包(inventoryOf)+ category。
// 必須擁有(inventoryOf>0)且 category==='cosmetic' 且 slot 相符,才算真的穿著;否則視為未穿。
// ledger_reset 後 inventoryOf 清空 → 這裡自動回傳 null = 自動脫下,無需額外 reset 邏輯。
function cosmeticEquipped(equipped, items, ledger) {
  const inv = inventoryOf(ledger);
  const out = { hat: null, outfit: null, home: null };
  COSMETIC_SLOTS.forEach(slot => {
    const id = equipped && equipped[slot];
    if (!id) return;
    const it = (items || []).find(x => x.id === id);
    if (it && it.category === 'cosmetic' && it.slot === slot && inv[id] > 0) out[slot] = it;
  });
  return out;
}

// ===== 金幣結餘 = 純事件推導(單一真相)=====
// 收入 = checkin_events 已入帳(approved/auto)的 coin 總和;支出 = ledger_events 的 coin_spend 總和。
// kids.coins 只是顯示快取,任何業務邏輯(含購買餘額檢查)一律用這個推導值,不讀快取。「金幣只花不扣」:系統從不主動扣款。
// 「重新來過」= append 一筆 ledger_reset 盤點事件(帳本永不 delete);推導一律以「最後一筆 reset 之後」起算,歷史保留可稽核。
function lastResetTs(ledger) {
  let t = 0;
  (ledger || []).forEach(l => { if (l && l.kind === 'ledger_reset' && (l.ts || 0) > t) t = l.ts; });
  return t;
}
function deriveCoins(events, ledger) {
  const rt = lastResetTs(ledger);
  let c = 0;
  (events || []).forEach(e => { if (e && e.behaviorId && (e.verdict === 'approved' || e.verdict === 'auto') && (e.ts || 0) > rt) c += (e.coin || 0); });
  (ledger || []).forEach(l => { if (l && l.kind === 'coin_spend' && (l.ts || 0) > rt) c -= (l.amount || 0); });
  return c;
}
// 背包 = ledger_events 推導結餘:入包(item_acquire)− 出包(item_consume),不建持有快照表。同樣以最後 reset 之後起算。
function inventoryOf(ledger) {
  const rt = lastResetTs(ledger);
  const m = {};
  (ledger || []).forEach(l => {
    if (!l || !l.itemId || (l.ts || 0) <= rt) return;
    if (l.kind === 'item_acquire') m[l.itemId] = (m[l.itemId] || 0) + (l.qty || 1);
    else if (l.kind === 'item_consume') m[l.itemId] = (m[l.itemId] || 0) - (l.qty || 1);
  });
  return m;
}

// ===== 資料遷移:localStorage schema 版本控管 =====
// 每次啟動檢查版本,舊資料無損升級並先備份到 backup_v1。
const SCHEMA_VERSION = 10;
function migrateToV2(s) {
  if (!s || s.schemaVersion === SCHEMA_VERSION) return s;
  let v = s.schemaVersion || 1;
  const m = { ...s };
  if (v < 2) {
    try { localStorage.setItem('habitRank_backup_v1', JSON.stringify(s)); } catch (e) {}
    if (!Array.isArray(m.checkinEvents)) m.checkinEvents = [];   // append-only 打卡事件流(未來搬 Supabase)
    v = 2;
  }
  if (v < 3) {                                                   // 誠實值 → 一次性 XP(1:1),移除獨立貨幣
    if (m.honest) { m.xp = (m.xp || 0) + m.honest; m.honest = 0; }
    v = 3;
  }
  if (v < 4) {                                                   // B3:公約雙向化欄位
    m.covenant = { ...(m.covenant || {}) };
    if (!Array.isArray(m.covenant.proposals)) m.covenant.proposals = [];
    if (!Array.isArray(m.covenant.pledges)) m.covenant.pledges = [];
    if (!Array.isArray(m.covenant.history)) m.covenant.history = [];
    if (!m.pledgeDone) m.pledgeDone = {};
    if (typeof m.propText !== 'string') m.propText = '';
    if (typeof m.propReason !== 'string') m.propReason = '';
    if (typeof m.newPledge !== 'string') m.newPledge = '';
    v = 4;
  }
  if (v < 5) {                                                   // B1:畢業階段(0=正常,1=週回顧,2=僅公約,3=已畢業)
    if (typeof m.graduationStage !== 'number') m.graduationStage = 0;
    v = 5;
  }
  if (v < 6) {                                                   // #2:信任改由事件推導,舊 trustLevel → 種一筆 checkpoint 當基線
    const tl = m.trustLevel || {}, scores = {}, thr = [0, 14, 35]; // L0/L1/L2 的 T 基線
    Object.keys(tl).forEach(bid => { const lv = tl[bid] || 0; scores[bid] = { t: thr[lv] || 0, level: lv }; });
    if (Object.keys(scores).length) {
      const nowTs = (typeof Date.now === 'function') ? Date.now() : 1;
      m.checkinEvents = [...(m.checkinEvents || []), { type: 'trust_checkpoint', date: ymd(new Date()), ts: nowTs, scores }];
    }
    v = 6;                                                       // trustLevel 欄位保留不刪(防回滾),但新程式不再讀它
  }
  if (v < 7) {                                                   // #4:proposals/pledges id 正規化成 uuid(才塞得進雲端),並改寫 pledgeDone key
    m.covenant = { ...(m.covenant || {}) };
    const remap = {};
    m.covenant.pledges = (m.covenant.pledges || []).map(pl => { const nid = newId(); if (pl && pl.id) remap[pl.id] = nid; return { ...pl, id: nid }; });
    m.covenant.proposals = (m.covenant.proposals || []).map(pp => ({ ...pp, id: newId() }));
    if (m.pledgeDone) { const nd = {}; Object.keys(m.pledgeDone).forEach(k => { const i = k.indexOf('::'); if (i < 0) { nd[k] = m.pledgeDone[k]; return; } const pid = k.slice(0, i), rest = k.slice(i); nd[(remap[pid] || pid) + rest] = m.pledgeDone[k]; }); m.pledgeDone = nd; }
    if (!Array.isArray(m.pendingDeletes)) m.pendingDeletes = [];
    v = 7;
  }
  if (v < 8) {                                                   // 商城重構:custom_shop → items 主檔(收編內建示範品);金幣改事件推導;新增 ledger 帳本
    const custom = Array.isArray(m.customShop)
      ? m.customShop.map(x => ({ ...x, builtin: false, active: !x.delisted })) : [];
    const seeded = DEFAULT_ITEMS.map(d => {
      const it = { ...d };
      if (m.listed && m.listed[d.id] === false) it.active = false;   // 舊 listed 開關 → active
      return it;
    });
    m.items = [...seeded, ...custom];
    if (!Array.isArray(m.ledgerEvents)) m.ledgerEvents = [];
    delete m.customShop; delete m.listed; delete m.redeemed;         // 舊一次性兌換旗標廢除(改事件推導)
    v = 8;
  }
  if (v < 9) {                                                       // ②外觀系統:items 加 category、新增內建外觀示範品;kids 加 equipped 穿戴快取
    m.items = Array.isArray(m.items) ? m.items.map(it => ({ ...it, category: it.category || 'privilege' })) : [];
    const have = new Set(m.items.map(it => it.id));
    DEFAULT_ITEMS.filter(d => d.category === 'cosmetic' && !have.has(d.id)).forEach(d => m.items.push({ ...d })); // 補入內建外觀(舊用戶也看得到)
    if (!m.equipped || typeof m.equipped !== 'object') m.equipped = {}; // 穿戴指標 { hat, outfit, home }
    v = 9;
  }
  if (v < 10) {                                                     // 自訂任務(custom_tasks):family 共享目錄,啟用走 kidId(非 taskOn),reset-proof
    if (!Array.isArray(m.customTasks)) m.customTasks = [];
    v = 10;
  }
  m.schemaVersion = SCHEMA_VERSION;
  return m;
}
// 取某行為「今天」最新的打卡事件(單一真相來源)
function todayEventOf(events, id, day) {
  const evs = (events || []).filter(e => e.behaviorId === id && e.date === day);
  return evs.length ? evs[evs.length - 1] : null;
}
const dateMinus = (dateStr, n) => ymd(new Date(parseYmd(dateStr).getTime() - n * 86400000));
// 誠實回報連續(從昨天往回數):approved/誠實回報=+1;auto=中性(不計不斷);rejected/沒回報=斷
function honestStreakOf(events, id, today) {
  let streak = 0;
  for (let d = 1; d <= 60; d++) {
    const ev = todayEventOf(events, id, dateMinus(today, d));
    if (!ev || ev.verdict === 'rejected') break;
    if (ev.verdict === 'auto') continue;
    streak++;
  }
  return streak;
}
// 達成率 = 做到 ÷(做到 + 誠實沒做到),排除 auto/rejected;取最近 windowDays 天
function achieveRate(events, id, today, windowDays) {
  let done = 0, report = 0;
  for (let d = 1; d <= windowDays; d++) {
    const ev = todayEventOf(events, id, dateMinus(today, d));
    if (!ev || ev.verdict === 'rejected' || ev.verdict === 'auto') continue;
    report++; if (!ev.honest) done++;
  }
  return report ? done / report : 0;
}

// ===== #2 信任重設計(方案 A):信任分數 T 由 append-only 事件流「推導」,不存可變欄位 =====
// 一筆事件對 T 的貢獻:誠實達成 +1 / 誠實回報失敗 0 / 說謊被抓(rejected) −5 / pending 0
function eventDelta(ev) {
  if (!ev) return 0;
  if (ev.verdict === 'rejected') return -CONFIG.trustLiePenalty;        // 說謊被抓 −5
  if (ev.honest) return 0;                                              // 誠實回報失敗:不扣分
  if (ev.verdict === 'approved' || ev.verdict === 'auto') return CONFIG.trustGain; // 誠實達成 +1
  return 0;                                                            // pending:未計
}
// T→等級的上限(純由 T)。降級用它;升級另需達成率地板。
function tCap(T) { return T >= CONFIG.trustThresholds[1] ? 2 : (T >= CONFIG.trustThresholds[0] ? 1 : 0); }
// 取某行為最近的 checkpoint(以 ts 最大者為準;checkpoint 事件用 scores map,無 behaviorId)
function latestCkpt(events, bid) {
  let best = null;
  (events || []).forEach(e => { if (e.type === 'trust_checkpoint' && e.scores && e.scores[bid] != null && (!best || e.ts > best.ts)) best = e; });
  return best ? { t: best.scores[bid].t, level: best.scores[bid].level, ts: best.ts } : { t: 0, level: 0, ts: 0 };
}
// 信任分數 T:最近 checkpoint 的 t + 其後(ts 更新)每天最新事件的 ΔT,夾在 [0,∞)
function trustScoreOf(events, bid, today) {
  const cp = latestCkpt(events, bid), byDay = {};
  (events || []).forEach(e => { if (e.behaviorId === bid && e.type !== 'trust_checkpoint' && e.ts > cp.ts && e.date <= today) byDay[e.date] = e; });
  let t = cp.t; Object.keys(byDay).forEach(d => { t += eventDelta(byDay[d]); });
  return Math.max(0, t);
}
// 目前等級 = min(checkpoint 等級, T 上限)。升級只在 rollover 過地板才發生,故 live 只會「往下修」不會偷升。
function trustLiveLevel(events, bid, today) {
  const cp = latestCkpt(events, bid);
  return Math.min(cp.level, tCap(trustScoreOf(events, bid, today)));
}
// 升級判定(rollover 用):先套用降級(T 掉了就掉級),再逐級檢查「T≥門檻 且 達成率地板」才升
function nextCkptLevel(prevLevel, T, rate30) {
  let L = Math.min(prevLevel, tCap(T));
  while (L < 2 && T >= CONFIG.trustThresholds[L] && rate30 >= CONFIG.promoteMinAchieveRate) L++;
  return L;
}
// 滾動 30 天達成率(升級專用,永不用於降級)
function achieveRate30(events, bid, today) { return achieveRate(events, bid, today, 30); }
// #4:產生 uuid(塞得進 Supabase uuid 主鍵欄);crypto.randomUUID 優先,退而求其次
function newId() { try { if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {} return 'id-' + Date.now() + '-' + Math.round(Math.random() * 1e9); }
// #3:打卡延遲(分鐘)= 現在時刻 − 該習慣今日目標時間;+ 表示晚、− 表示提早;無目標時間回 null
function latencyOf(behaviorId, mode) {
  const lib = LIB.find(x => x.id === behaviorId);
  if (!lib || !lib.times || mode === 'out') return null;
  const tt = lib.times[mode === 'school' ? 'school' : 'home'];
  if (!tt) return null;
  const p = tt.split(':'), target = (+p[0]) * 60 + (+p[1]), d = new Date();
  return (d.getHours() * 60 + d.getMinutes()) - target;
}

// ===== #3 反向指標埋點:三個最小事件的聚合(純推導,不開新表)=====
// 1.打卡延遲(習慣事件的 latencyMin,近30天) 2.session 停留(session 事件,近14天) 3.退回後隔天打卡率(近30天)
function dataProbe(events, today) {
  const evs = events || [];
  let latSum = 0, latN = 0, sesSum = 0, sesN = 0;
  evs.forEach(e => {
    if (e.behaviorId && typeof e.latencyMin === 'number' && !e.honest && e.verdict !== 'rejected' && dayGap(e.date, today) <= 30) { latSum += e.latencyMin; latN++; }
    if (e.type === 'session' && typeof e.durationSec === 'number' && dayGap(e.date, today) <= 14) { sesSum += e.durationSec; sesN++; }
  });
  // 退回後隔天回來打卡率:找「當天最新事件仍為 rejected」的 (行為,日),看隔天有沒有回來
  const rejDays = {};
  evs.forEach(e => { if (e.behaviorId && e.date && dayGap(e.date, today) <= 30) { const l = todayEventOf(evs, e.behaviorId, e.date); if (l && l.verdict === 'rejected') rejDays[e.behaviorId + '|' + e.date] = true; } });
  let rejN = 0, recov = 0;
  Object.keys(rejDays).forEach(k => { const i = k.indexOf('|'), bid = k.slice(0, i), date = k.slice(i + 1); rejN++; const nev = todayEventOf(evs, bid, dateMinus(date, -1)); if (nev && nev.verdict !== 'rejected') recov++; });
  return { latAvg: latN ? Math.round(latSum / latN) : null, latN, sesAvg: sesN ? Math.round(sesSum / sesN) : null, sesN, recovRate: rejN ? Math.round(recov / rejN * 100) : null, rejN };
}
// 家長 view 強制起點:每次進入一律回收件匣、清掉子頁/詳情(行動導向儀表板核心,不沿用上次停留)
const PARENT_START = { pTab: 'inbox', pManage: null, pDetailKid: null };
// ===== APP 化手勢:分頁順序 + 純方向判斷(嚴格防誤觸)=====
const TAB_ORDER = ['today', 'tasks', 'rank', 'shop', 'record'];
// 方向鎖:回傳 'h'(水平)/ 'v'(垂直)/ null(未定)。水平需 |dx| > |dy|×2 且 >10px。
function hAxisLock(dx, dy) {
  const ax = Math.abs(dx), ay = Math.abs(dy);
  if (ax > ay * 2 && ax > 10) return 'h';
  if (ay > ax && ay > 10) return 'v';
  return null;
}
// 切頁判定:水平位移過門檻(|dx| > |dy|×2 且 >60px)→ 'next'(左滑)/ 'prev'(右滑)/ null。
function hCommit(dx, dy) {
  const ax = Math.abs(dx), ay = Math.abs(dy);
  return (ax > ay * 2 && ax > 60) ? (dx < 0 ? 'next' : 'prev') : null;
}
// ===== A1-補:提案審核輔助(純函式,只鋪事實、不給准駁建議)=====
function dailyCoinAvg(events, today) {                            // 近 14 天日均 coin 收入(已入帳、非誠實回報)
  let sum = 0;
  (events || []).forEach(e => { if (e.behaviorId && e.date && dayGap(e.date, today) <= 14 && (e.verdict === 'approved' || e.verdict === 'auto') && !e.honest) sum += (e.coin || 0); });
  return sum / 14;
}
function taskPriceBand(bounty) {                                  // 對照任務池定價尺(LIB task coin 區間)
  const cs = LIB.filter(t => t.type === 'task').map(t => t.coin);
  if (!cs.length || !bounty || bounty <= 0) return null;
  const lo = Math.min.apply(null, cs), hi = Math.max.apply(null, cs);
  return { lo, hi, band: bounty < lo ? '偏低' : (bounty > hi ? '偏高' : '合理') };
}
function rewardPriceBand(days) {                                  // 商城定價尺:以「相當幾天收入」對照(小 2–3 天 / 中 1–2 週 / 大 3–5 週)
  if (days == null || days <= 0) return null;
  if (days < 2) return { band: '偏低 · 比小獎還便宜' };
  if (days <= 3) return { band: '小獎區間(約 2–3 天收入)' };
  if (days < 7) return { band: '小～中之間' };
  if (days <= 14) return { band: '中獎區間(約 1–2 週收入)' };
  if (days < 21) return { band: '中～大之間' };
  if (days <= 35) return { band: '大獎區間(約 3–5 週收入)' };
  return { band: '偏高 · 超過大獎上限' };
}
function shopRuleFlag(text) {                                     // 商城鐵律關鍵字提示(只提示不擋)
  const t = text || '';
  if (/螢幕|交機|手機時間|上網|時段|遊戲時間|開機|平板/.test(t)) return '螢幕時間 / 裝置額度類 —— 商城鐵律不放此類(Premack)';
  if (/過夜|留宿|朋友來|交友|網友/.test(t)) return '社交需求類 —— 不宜標價';
  return null;
}
function termProvenance(history, term) {                          // 從修訂史推導某條公約來自誰的提案(Bug 2:孩子端顯示來源)
  const h = (history || []).find(x => x && x.note && x.note.indexOf('採納「') === 0 && x.note.indexOf('」提案:' + term) >= 0);
  if (!h) return null;
  const m = h.note.match(/^採納「(.+?)」提案:/);
  return { by: m ? m[1] : '孩子', at: h.at || '' };
}
// NFC 打卡解析 + 裝置核對分流(純函式,方便測試)。a={token,tokens,session,guestMode,deviceMode,currentKidId,events,today}
function nfcResolve(a) {
  if (!a || !a.token) return null;
  if (!a.session && !a.guestMode) return { state: 'login', tok: null };
  const tok = (a.tokens || []).find(t => t.token === a.token) || null;
  if (!tok) return { state: 'invalid', tok: null };
  if (a.deviceMode === 'parent') return { state: 'parent', tok };      // 家長裝置:唯讀,不得以孩子名義打卡
  if (a.deviceMode !== 'kid') return { state: 'nodevice', tok };       // 未設定裝置:無從核對物理在場
  if (a.currentKidId !== tok.kidId) return { state: 'wrongkid', tok }; // 綁定 kid ≠ token 的 kid:防手足代打
  const ev = todayEventOf(a.events, tok.behaviorId, a.today);
  if (ev && !ev.honest && ev.verdict !== 'rejected') return { state: 'done', tok, ev }; // 今日已打卡
  return { state: 'go', tok };                                          // 通過 → 寫入
}
function termRemoval(history, term) {                             // 從修訂史找某條公約的移除紀錄(孩子端顯示自己提案被廢止 + 原因)
  const h = (history || []).find(x => x && x.note && x.note.indexOf('移除:' + term + ',原因:') === 0);
  if (!h) return null;
  const m = h.note.match(/^移除:[\s\S]+?,原因:([\s\S]+)$/);
  return { at: h.at || '', reason: m ? m[1] : '' };
}
function similarLibLabel(text) {                                  // 與現有核心習慣/任務池文字高度相似 → 回傳該項名稱(字元 Jaccard ≥ .45)
  const norm = s => (s || '').replace(/[\s·、,，。.\/]/g, '');
  const a = norm(text); if (a.length < 2) return null;
  const setA = new Set(a.split(''));
  let best = null, bestScore = 0;
  LIB.forEach(t => { const b = norm(t.label); if (!b) return; const setB = new Set(b.split(''));
    let inter = 0; setA.forEach(c => { if (setB.has(c)) inter++; });
    const uni = new Set([...setA, ...setB]).size, score = uni ? inter / uni : 0;
    if (score > bestScore) { bestScore = score; best = t.label; } });
  return bestScore >= 0.45 ? best : null;
}
// 孩子端 PIN 閘門的純決策(方便測試):guard(家長 PIN 放行)/ set(兩次)/ enter(連錯5次只收家長 PIN)
function kidPinEval(mode, stage, entry, firstEntry, targetPin, parentPin, attempts) {
  if (mode === 'guard') return (parentPin && entry === parentPin) ? { r: 'toSet' } : { r: 'err', msg: '家長 PIN 不對' };
  if (mode === 'set') {
    if (stage === 2) return (entry === firstEntry) ? { r: 'setDone' } : { r: 'setMismatch' };
    return { r: 'setFirst' };
  }
  const locked = (attempts || 0) >= 5;                           // 連錯 5 次 → 只收家長 PIN
  if ((!locked && targetPin && entry === targetPin) || (parentPin && entry === parentPin)) return { r: 'switch' };
  const na = (attempts || 0) + 1;
  return { r: 'wrong', attempts: na, msg: (na >= 5 ? '太多次了,請家長輸入 PIN' : '密碼不對,再試一次') };
}
// 除錯/測試用:純函式暴露到 window(唯讀,無副作用)
if (typeof window !== 'undefined') window.__trust = { trustScoreOf, trustLiveLevel, achieveRate30, nextCkptLevel, eventDelta, tCap, dataProbe, kidPinEval, hAxisLock, hCommit, dailyCoinAvg, taskPriceBand, similarLibLabel, rewardPriceBand, shopRuleFlag, nfcResolve, deriveCoins, inventoryOf, cosmeticEquipped, missingBuiltinIds };

// ===== B6:家長週報 =====
// 規則式(不需 LLM)從 checkinEvents 近 7 天算出數據 + 一句「對話起點」。
// 每個小孩各自一份、不並排;呈現的是溝通句而非儀表板。
const WEEKDAY_CN = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
function weeklyReport(events, today, taskOn) {
  const evs = events || [];
  const days = []; for (let d = 6; d >= 0; d--) days.push(dateMinus(today, d)); // 近 7 天(含今天)
  const activeHabits = LIB.filter(t => t.type === 'habit' && taskOn && taskOn[t.id]);
  const doneOn = (id, day) => { const ev = todayEventOf(evs, id, day); return !!(ev && !ev.honest && ev.verdict !== 'rejected'); };
  const week = days.map(day => {
    const tot = activeHabits.length || 1;
    let done = 0; activeHabits.forEach(h => { if (doneOn(h.id, day)) done++; });
    const pct = Math.round(done / tot * 100);
    return { label: WEEKDAY_CN[parseYmd(day).getDay()].slice(1), h: Math.round(Math.max(pct, 4) * 0.72) + 'px',
      barBg: pct >= 80 ? 'linear-gradient(180deg,#7b7bf0,#5b5bd6)' : (pct > 0 ? '#c9cdf0' : '#dfe3ee') };
  });
  const k1Days = days.filter(day => doneOn('k1', day)).length;         // 準時交機天數
  const misses = evs.filter(e => e.honest && days.indexOf(e.date) >= 0); // 本週誠實回報「沒做到」
  const honestN = misses.length;
  const prevDays = []; for (let d = 13; d >= 7; d--) prevDays.push(dateMinus(today, d));
  const prevMiss = evs.filter(e => e.honest && prevDays.indexOf(e.date) >= 0).length;
  // 規則式一句話:同一 weekday 重複 > 同一 missReason 佔多數 > 連續改善 > 誠實肯定
  let line = '這週還在累積紀錄——多打幾天卡,週報就會給出更具體的觀察。';
  if (honestN === 0 && days.some(day => activeHabits.some(h => doneOn(h.id, day)))) {
    line = '這週沒有「沒做到」的回報——孩子把答應的事穩定做到了,值得肯定。';
  } else if (honestN > 0) {
    const byDow = {}; misses.forEach(m => { const w = parseYmd(m.date).getDay(); byDow[w] = (byDow[w] || 0) + 1; });
    const topDow = Object.keys(byDow).sort((a, b) => byDow[b] - byDow[a])[0];
    const reasoned = misses.filter(m => m.missReason);
    const byReason = {}; reasoned.forEach(m => { byReason[m.missReason] = (byReason[m.missReason] || 0) + 1; });
    const topReason = Object.keys(byReason).sort((a, b) => byReason[b] - byReason[a])[0];
    const reasonLine = {
      environment: '這週多數「沒做到」是環境干擾——也許不是不想做,是環境需要調一下(固定的時間、地點會有幫助)。',
      mood: '這週多數「沒做到」跟心情有關——比起追進度,也許先聊聊最近是不是累了、煩了。',
      forgot: '這週多數「沒做到」是忘記了——這是「提示」問題,設個固定鬧鐘或看得到的提醒,可能就解決了。',
    };
    if (topDow != null && byDow[topDow] >= 2) {
      line = '這週的「沒做到」多落在' + WEEKDAY_CN[topDow] + '——要不要聊聊' + WEEKDAY_CN[topDow] + '的安排、或交機時間是不是需要調整?';
    } else if (topReason && byReason[topReason] >= 2 && byReason[topReason] >= Math.ceil(reasoned.length / 2)) {
      line = reasonLine[topReason];
    } else if (prevMiss > honestN) {
      line = '這週的「沒做到」比上週少——正在往好的方向走,值得鼓勵。';
    } else {
      line = '這週有 ' + honestN + ' 次誠實回報——孩子選擇說實話,比「看起來全勤」更值得肯定。';
    }
  }
  return { week, k1Label: k1Days + '/7', honestN, line };
}

class Component extends DCLogic {
  constructor(props) {
    super(props);
    if (typeof document === 'undefined' || document.getElementById('app-icon-sprite')) return;
    const d = document.createElement('div');
    d.id = 'app-icon-sprite'; d.setAttribute('aria-hidden', 'true'); d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML = '<svg><defs>'
      + '<symbol id="i-target" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></symbol>'
      + '<symbol id="i-medal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M9 2 12 8 15 2"/><circle cx="12" cy="15" r="6"/><path d="M12 12.5 12.9 14.3 14.8 14.6 13.4 16 13.7 17.9 12 17 10.3 17.9 10.6 16 9.2 14.6 11.1 14.3z" fill="currentColor" stroke="none"/></symbol>'
      + '<symbol id="i-coin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.2"/></symbol>'
      + '<symbol id="i-flame" viewBox="0 0 24 24"><path d="M12 3c2.6 4 5.5 6 5.5 9.8A5.5 5.5 0 0 1 6.5 12.8C6.5 10.5 8 9.5 8.4 8c1.6 1 2 2.4 2 3.6.9-.6 1.4-2 1.6-8.6z" fill="currentColor"/></symbol>'
      + '<symbol id="i-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 10-13h-7z"/></symbol>'
      + '<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17.5 19.5 7"/></symbol>'
      + '<symbol id="i-moon" viewBox="0 0 24 24"><path d="M20.5 14.2A8 8 0 1 1 10.2 3.7 6.4 6.4 0 0 0 20.5 14.2z" fill="currentColor"/></symbol>'
      + '<symbol id="i-gift" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="4" y="9" width="16" height="11.5" rx="1.6"/><path d="M4 12.6h16M12 9v11.5"/><path d="M12 9C12 6 9.5 5 8.4 6.2 7.4 7.2 9 9 12 9zM12 9c0-3 2.5-4 3.6-2.8C16.6 7.2 15 9 12 9z"/></symbol>'
      + '<symbol id="i-chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 20V12M12 20V5M19 20v-6"/></symbol>'
      + '<symbol id="i-brief" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12.5" rx="2.4"/><path d="M8.5 8V6.2A2.2 2.2 0 0 1 10.7 4h2.6a2.2 2.2 0 0 1 2.2 2.2V8"/></symbol>'
      + '<symbol id="i-hour" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 21h12M7 3c0 5.5 10 5.5 10 0M7 21c0-5.5 10-5.5 10 0"/></symbol>'
      + '<symbol id="i-gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3.4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/></symbol>'
      + '<symbol id="i-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></symbol>'
      + '<symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 2.5 13.9 9.6 21 11.5 13.9 13.4 12 20.5 10.1 13.4 3 11.5 10.1 9.6z" fill="currentColor"/></symbol>'
      + '<symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>'
      + '<symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6 18 18M18 6 6 18"/></symbol>'
      + '<symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M8.5 12 11 14.5 15.5 9.5" stroke-width="2.2" stroke-linecap="round"/></symbol>'
      + '<symbol id="i-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></symbol>'
      + '<symbol id="i-crown" viewBox="0 0 24 24" fill="currentColor"><path d="M3 8.5 7.5 12 12 4.5 16.5 12 21 8.5 19 20H5z"/></symbol>'
      + '<symbol id="i-heart" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5C3.5 14.8 4 8.2 8.6 8.2c2.3 0 3.4 1.9 3.4 1.9s1.1-1.9 3.4-1.9C20 8.2 20.5 14.8 12 20.5z"/></symbol>'
      + '</defs></svg>';
    document.body.appendChild(d);
  }
  state = {
    mode: 'kid', kTab: 'today', pTab: 'inbox', pManage: null, pDetailKid: null,
    schemaVersion: 3, checkinEvents: [],
    lastDate: null, dayMode: 'home',
    coins: 0, streak: 0, xp: 0, protects: 0, honest: 0,
    habit: {}, checked: {},
    taskOn: { k1: true, k2: true, sc3: true, ld1: true, bd1: true, em1: true }, manualUnlock: {},
    trustLevel: {}, graduatedAt: {}, gradModal: null, graduationStage: 0, retroOpen: false,
    covenant: {
      version: 1,
      terms: ['到約定時間，自己把手機放回充電區', '有做到就打卡；沒做到也誠實回報', '手機留在充電區過夜，不帶回房間'],
      schedules: { weekday: '21:40', weekend: '22:30' },
      signatures: { child: { name: '', at: '' }, parent: { name: '', at: '' } },
      proposals: [],   // B3:小孩提案(pending → 家長採納/婉拒)
      pledges: [],     // B3:家長公開承諾(誠實回報原則對家長同樣適用)
      history: [],     // B3:修訂紀錄(who/when/改了什麼)
      nfcTokens: [],   // NFC 打卡點 token(family 共享):{token,kidId,behaviorId,createdAt}
    },
    newTerm: '', sealing: null, missAsk: null,
    propText: '', propReason: '', newPledge: '', pledgeDone: {}, proposeOpen: false, proposeKind: 'covenant', pendingDeletes: [],
    items: DEFAULT_ITEMS.map(d => ({ ...d })),   // 商城 items 主檔(family 共享;雲端 items 表,本機 seed 內建示範品)
    customTasks: [],    // 自訂任務(family 共享目錄,鏡像 items);啟用 = 該列 active 且 kidId===當前孩子(不走 taskOn,reset 掃不到)
    ledgerEvents: [],   // 金幣/道具帳本(append-only:coin_spend / item_acquire / item_consume)。餘額與背包皆由此推導
    equipped: {},       // ②外觀:當前穿戴指標 { hat, outfit, home }(per-kid 顯示快取,非帳本;真相走 inventoryOf)
    shopTab: 'shop',    // 商城頁子分頁:'shop'=商城 / 'bag'=背包 / 'home'=家園(不持久化)
    // 商城表單(不持久化)
    sfOpen: false, sfEdit: null, sfName: '', sfCost: '', sfDesc: '', sfRank: '',
    decided: {}, jrSel: 1, saved: false, celebrate: false, fx: null,
    pauses: 0, pausing: false,
    // 登入狀態(不持久化):authReady=已檢查 session,session=已登入,supaOff=後端不可用時退回本機
    authReady: false, session: null, authEmail: '', authSent: false, authError: '', supaOff: false, guestMode: false,
    syncStatus: '', // 雲端同步狀態(不持久化):''|'syncing'|'ok'|'error:...'
    // 階段 3:多小孩(不持久化;來自雲端)。currentKidId 另存 device 層級 key。
    kids: [], currentKidId: null, kidSwitchOpen: false, newKidName: '', newKidAvatar: '🦊',
    // 家長 PIN 關卡(不持久化;PIN 本身另存 device key habitRank_pin)
    pinMode: null, pinEntry: '', pinError: '', pinStage: 1, parentUnlocked: false,
    rejectConfirm: null, // #2:退回二次確認對話框(不持久化)
    termRemove: null,    // 公約條款移除確認 + 原因(不持久化)
    approveForm: null,   // 提案採納前微調表單(任務/獎品;不持久化)
    nfcToken: null, nfcSrc: 'nfc', tokenRegen: null,   // NFC 打卡(不持久化);tokenRegen=重新產生二次確認
    rulesOpen: false,   // 規則頁「阿爸的承諾」overlay(不持久化)
    // 孩子端身分保護:切換時的 PIN 閘門(不持久化;孩子密碼存雲端 kids.pin + 記憶體 _kidPins)
    kidPinMode: null, kidPinTarget: null, kidPinEntry: '', kidPinError: '', kidPinStage: 1,
    // 裝置模式(不持久化;鏡像 localStorage habitRank_device)。deviceStep=一次性精靈;pinGoal=家長 PIN 用途
    deviceMode: null, deviceStep: null, pinGoal: 'view',
    // APP 化手勢(不持久化):slideDir=進場動畫方向('l'/'r'/null);pullRefreshing=下拉刷新中
    slideDir: null, pullRefreshing: false,
    updateReady: false,   // 偵測到雲端有新版(不持久化)
    schedInfoOpen: false, // 段位頁「排程券」說明卡展開(不持久化)
    preview: false,       // 家長裝置唯讀檢視孩子畫面(不持久化)
  };
  toMode(m) { this.setState({ mode: m }); }
  openRules() { this.setState({ rulesOpen: true }); }
  closeRules() { this.setState({ rulesOpen: false }); }
  // ===== 家長 PIN(家庭層級,存雲端 families.parent_pin;localStorage 為離線快取)=====
  _readPin() { if (this._parentPin != null) return this._parentPin; try { return localStorage.getItem('habitRank_pin'); } catch (e) { return null; } }
  _writePin(p) {                                                 // 寫記憶體 + 本機快取 + 雲端(家庭唯一)
    this._parentPin = p;
    try { localStorage.setItem('habitRank_pin', p); } catch (e) {}
    if (this._supa && this._familyId) { try { this._supa.from('families').update({ parent_pin: p }).eq('id', this._familyId).then(() => {}, () => {}); } catch (e) {} }
  }
  enterParent() {
    if (this.state.deviceMode === 'kid') return;                 // 孩子裝置:不進家長路徑
    if (this.state.parentUnlocked) { this.setState({ mode: 'parent', ...PARENT_START }); return; }  // 強制起點:收件匣
    const pin = this._readPin();
    this.setState({ pinMode: pin ? 'enter' : 'set', pinEntry: '', pinError: '', pinStage: 1, pinGoal: 'view' });
  }
  goKid() { this.setState({ mode: 'kid', parentUnlocked: false }); }  // 回小孩即上鎖,下次進家長要再輸入
  pinPress(d) {
    const st = this.state; if (!st.pinMode || st.pinEntry.length >= 4) return;
    const e = st.pinEntry + d, goal = st.pinGoal || 'view';
    if (e.length < 4) { this.setState({ pinEntry: e, pinError: '' }); return; }
    if (st.pinMode === 'enter') {
      if (e === this._readPin()) this._pinSuccess(goal);
      else this.setState({ pinEntry: '', pinError: 'PIN 不對,再試一次' });
      return;
    }
    if (st.pinStage === 2) {                                     // set 模式:兩次確認
      if (e === this._pinFirst) { this._writePin(e); this._pinSuccess(goal); }
      else this.setState({ pinEntry: '', pinStage: 1, pinError: '兩次不一樣,重設一次' });
      return;
    }
    this._pinFirst = e; this.setState({ pinEntry: '', pinStage: 2, pinError: '' });
  }
  _pinSuccess(goal) {
    const base = { pinMode: null, pinEntry: '', pinStage: 1, pinError: '', pinGoal: 'view' };
    if (goal === 'device-kid') { this.setState({ ...base, deviceStep: null }); this._setDevice('kid'); return; }
    if (goal === 'device-parent') { this._setDevice('parent'); this.setState({ ...base, parentUnlocked: true, mode: 'parent', ...PARENT_START }); return; }
    this.setState({ ...base, parentUnlocked: true, mode: 'parent', ...PARENT_START });   // 一般進家長 view · 強制起點:收件匣
  }
  pinDelete() { this.setState(st => ({ pinEntry: st.pinEntry.slice(0, -1), pinError: '' })); }
  pinCancel() { this.setState({ pinMode: null, pinEntry: '', pinStage: 1, pinError: '', pinGoal: 'view' }); }
  // ===== 裝置模式:孩子裝置不出現家長入口 =====
  chooseDeviceRole(role) { if (role === 'parent') this._setDevice('parent'); else this.setState({ deviceStep: 'kidpick' }); }
  pickDeviceKid(id) {
    const proceed = () => { const has = this._readPin(); this.setState({ deviceStep: 'setpin', pinMode: has ? 'enter' : 'set', pinEntry: '', pinError: '', pinStage: 1, pinGoal: 'device-kid' }); };
    if (id === this.state.currentKidId || !this._supa) proceed();  // 精靈內切換不需孩子 PIN(家長在操作)
    else this._doSwitch(id).then(proceed, proceed);
  }
  _setDevice(mode) {
    try { localStorage.setItem('habitRank_device', mode); } catch (e) {}
    this.setState({ deviceMode: mode, deviceStep: null, mode: mode === 'kid' ? 'kid' : 'parent', parentUnlocked: mode === 'parent', kidSwitchOpen: false, ...(mode === 'parent' ? PARENT_START : {}) });
  }
  // 長按版本號(僅孩子裝置)→ 家長 PIN → 切回家長模式
  verPressStart() { if (this.state.deviceMode !== 'kid') return; try { clearTimeout(this._verT); } catch (e) {} this._verT = setTimeout(() => this._verLong(), 2000); }
  verPressEnd() { try { clearTimeout(this._verT); } catch (e) {} }
  _verLong() {
    if (this.state.deviceMode !== 'kid') return;
    const has = this._readPin();
    this.setState({ pinMode: has ? 'enter' : 'set', pinEntry: '', pinError: '', pinStage: 1, pinGoal: 'device-parent' });
  }
  kGo(t) {
    const cur = this.state.kTab;
    if (t === cur) return;
    const dir = TAB_ORDER.indexOf(t) > TAB_ORDER.indexOf(cur) ? 'r' : 'l';  // 往後→新頁自右滑入(r);往前→自左(l)
    this.setState({ kTab: t, slideDir: dir });
    try { clearTimeout(this._slideTimer); } catch (e) {}
    this._slideTimer = setTimeout(() => this.setState({ slideDir: null }), 240); // 動畫完成後清除,讓後續拖動的 transform 生效
  }
  // 分頁切換(手勢或點擊共用):dir 'next'(左滑,往後一頁)/ 'prev'(右滑,往前一頁)
  swipeTab(dir) {
    const i = TAB_ORDER.indexOf(this.state.kTab);
    const ni = dir === 'next' ? i + 1 : i - 1;
    if (ni < 0 || ni >= TAB_ORDER.length) return false;
    this.kGo(TAB_ORDER[ni]);
    return true;
  }
  // 下拉刷新:重新從雲端載入目前小孩(僅登入時)。無雲端則只做視覺回饋。
  async cloudRefresh() {
    if (this.state.pullRefreshing) return;
    const kid = (this.state.kids || []).find(k => k.id === this.state.currentKidId);
    if (!this._supa || !this._cloudReady || !this.state.session || !kid) return;
    this.setState({ pullRefreshing: true });
    try { await this.cloudLoad(kid); } catch (e) {}
    setTimeout(() => this.setState({ pullRefreshing: false }), 400);  // 至少顯示一下,避免閃爍
  }
  // ===== APP 化手勢:離開頁跟手 + 新頁滑入;下拉刷新。EVENT_MAP 無 touchmove,手動掛 document 監聽 =====
  _gestureOK() {                                                  // 只在孩子端、無任何遮罩/對話框時啟用
    const s = this.state;
    if (s.mode !== 'kid') return false;
    if (s.gradModal || s.celebrate || s.sealing || s.missAsk || s.proposeOpen || s.retroOpen || s.fx) return false;
    if (s.kidSwitchOpen || s.pinMode || s.kidPinMode || s.deviceStep || s.rejectConfirm) return false;
    if (!s.session && !s.guestMode) return false;                 // 登入閘門仍在
    return true;
  }
  _onTouchStart(e) {
    this._gReset();
    if (!this._gestureOK() || !e.touches || e.touches.length !== 1) return;
    const el = e.target && e.target.closest ? e.target.closest('.scroll') : null;
    if (!el) return;
    const t = e.touches[0];
    this._gEl = el; this._gx0 = t.clientX; this._gy0 = t.clientY;
    this._gLock = null; this._gMode = null; this._gTop = el.scrollTop <= 0;
    el.style.transition = '';                                      // 拖動期間即時跟手,不要過渡
  }
  _onTouchMove(e) {
    if (!this._gEl || !e.touches || e.touches.length !== 1) return;
    const t = e.touches[0], dx = t.clientX - this._gx0, dy = t.clientY - this._gy0;
    this._gLastX = t.clientX; this._gLastY = t.clientY;           // 記最後位置(touchend 無 touches)
    if (!this._gLock) { this._gLock = hAxisLock(dx, dy); if (!this._gLock) return; }
    if (this._gLock === 'h') {
      const dir = dx < 0 ? 'next' : 'prev';
      const i = TAB_ORDER.indexOf(this.state.kTab);
      const edge = (dir === 'next' && i >= TAB_ORDER.length - 1) || (dir === 'prev' && i <= 0);
      this._gMode = 'h';
      const off = edge ? dx * 0.3 : dx;                            // 邊界阻尼:跟手距離 × 0.3
      this._gEl.style.transform = 'translateX(' + off + 'px)';
      if (e.cancelable) e.preventDefault();                        // 接管水平 → 阻止原生捲動
    } else if (this._gLock === 'v') {
      if (dy > 0 && this._gTop && !this.state.pullRefreshing) {    // 頁面已在頂端且下拉 → 準備刷新
        this._gMode = 'v';
        this._gPullDist = dy;
        if (e.cancelable) e.preventDefault();
      }
    }
  }
  _onTouchEnd() {
    const el = this._gEl;
    if (!el) { this._gReset(); return; }
    if (this._gMode === 'h') {
      const dx = this._gLastDx();
      const cm = hCommit(dx, this._gLastDy());
      const i = TAB_ORDER.indexOf(this.state.kTab);
      const canGo = cm && ((cm === 'next' && i < TAB_ORDER.length - 1) || (cm === 'prev' && i > 0));
      if (canGo) {
        el.style.transition = 'transform .18s ease-out';          // 離開頁:剩餘位移滑出,不跳變
        el.style.transform = 'translateX(' + (cm === 'next' ? '-100%' : '100%') + ')';
        setTimeout(() => this.swipeTab(cm), 170);                 // 動畫將盡再換頁,新頁 CSS keyframe 滑入
      } else {
        el.style.transition = 'transform .15s ease-out';          // 未達門檻/邊界:平滑回彈,非瞬移
        el.style.transform = 'translateX(0)';
        setTimeout(() => { if (el) el.style.transition = ''; }, 160);
      }
    } else if (this._gMode === 'v' && this._gPullDist > 64) {
      this.cloudRefresh();
    }
    this._gReset();
  }
  _gLastDx() { return this._gLastX != null ? this._gLastX - this._gx0 : 0; }
  _gLastDy() { return this._gLastY != null ? this._gLastY - this._gy0 : 0; }
  _gReset() { this._gEl = null; this._gLock = null; this._gMode = null; this._gPullDist = 0; this._gLastX = null; this._gLastY = null; }
  pGo(t) { this.setState({ pTab: t, pManage: null, pDetailKid: null }); }   // 切 L1 分頁時清掉 L2 狀態
  pManageGo(k) { this.setState({ pManage: k }); }                           // 進管理子頁
  pManageBack() { this.setState({ pManage: null }); }                       // 返回管理 hub
  pOpenKidDetail(id) { this.setState({ pDetailKid: id }); if (id && id !== this.state.currentKidId) this.switchKid(id); } // 週報內點孩子名 → 詳情(必要時先切換載入)
  pCloseKidDetail() { this.setState({ pDetailKid: null }); }
  // 唯讀檢視:家長裝置看孩子畫面的唯一入口(週報→詳情→檢視)。mode 切 kid 但 preview 旗標鎖住互動
  enterPreview() { this.setState({ preview: true, mode: 'kid', kTab: 'today', slideDir: null }); }
  exitPreview() { this.setState({ preview: false, mode: 'parent', pTab: 'report' }); }
  // 閒置鎖:家長裝置(有 PIN)閒置 5 分鐘 → 回家長 PIN 鎖屏,保護家長功能
  _armIdle() {
    try { clearTimeout(this._idleT); } catch (e) {}
    if (this.state.deviceMode !== 'parent' || !this._readPin()) return;
    this._idleT = setTimeout(() => this._idleLock(), 5 * 60 * 1000);
  }
  _idleLock() {
    if (this.state.deviceMode !== 'parent' || !this._readPin()) return;
    this.setState({ preview: false, mode: 'parent', parentUnlocked: false, pinMode: 'enter', pinEntry: '', pinError: '', pinStage: 1, pinGoal: 'view' });
  }
  // 小孩送出「做到」:建立 pending 事件,不立即入帳(等家長確認)。honestyEligible 任務 XP×1.5。
  submitCheckin(b) {
    if (this.state.preview) return;   // 唯讀檢視:封死以孩子名義偽打卡
    this.setState(st => {
      const day = st.lastDate, cur = todayEventOf(st.checkinEvents, b.id, day);
      if (cur && !cur.honest && cur.verdict === 'pending') return { checkinEvents: st.checkinEvents.filter(e => e !== cur) }; // 再按=收回
      if (cur && !cur.honest && (cur.verdict === 'approved' || cur.verdict === 'auto')) return null; // 做到已入帳鎖定
      const rest = cur ? st.checkinEvents.filter(e => e !== cur) : st.checkinEvents;   // 清掉誠實回報 / 已退回
      const refund = (cur && cur.honest) ? CONFIG.honestMissXP : 0;                    // 從誠實回報改為做到 → 退回小額 XP
      const xp = b.honestyEligible ? Math.round(b.xp * 1.5) : b.xp;
      // 依信任等級決定要不要家長確認:0=每次確認;1=30% 抽查、其餘即時入帳;2=畢業自主即時入帳
      const level = trustLiveLevel(st.checkinEvents, b.id, day);   // #2:等級由事件推導
      const instant = level >= 2 || (level === 1 && Math.random() >= CONFIG.spotCheckRate);
      const ev = { id: b.id + '-' + day, behaviorId: b.id, label: b.label, icon: b.icon, kind: b.kind, coin: b.coin, xp, honest: false, latencyMin: latencyOf(b.id, st.dayMode), ts: Date.now(), date: day, verdict: instant ? 'approved' : 'pending' };
      return instant ? { checkinEvents: [...rest, ev], xp: st.xp - refund + xp, coins: deriveCoins([...rest, ev], st.ledgerEvents) } : { checkinEvents: [...rest, ev], xp: st.xp - refund };
    });
  }
  // 「沒做到」= 誠實回報:立即入帳固定小額 XP(無需家長確認,因為承認失敗沒什麼好造假),連續不斷。
  markMiss(b) {
    if (this.state.preview) return;
    this.setState(st => {
      const day = st.lastDate, cur = todayEventOf(st.checkinEvents, b.id, day);
      if (cur && cur.honest) return { checkinEvents: st.checkinEvents.filter(e => e !== cur), xp: st.xp - CONFIG.honestMissXP, missAsk: null }; // 再按=收回並退回 XP
      if (cur && !cur.honest && (cur.verdict === 'approved' || cur.verdict === 'auto')) return null; // 已入帳鎖定
      const rest = cur ? st.checkinEvents.filter(e => e !== cur) : st.checkinEvents;
      const ev = { id: b.id + '-' + day, behaviorId: b.id, label: b.label, icon: b.icon, kind: b.kind, coin: 0, xp: CONFIG.honestMissXP, honest: true, missReason: null, ts: Date.now(), date: day, verdict: 'approved' };
      // B5:回報後多問一題「為什麼沒做到」(B=MAT 診斷),三選一可跳過,不影響金幣/XP
      return { checkinEvents: [...rest, ev], xp: st.xp + CONFIG.honestMissXP, missAsk: { id: b.id, label: b.label } };
    });
  }
  // B5:記錄 miss 原因(environment/mood/forgot)。純診斷,不影響任何獎勵。
  setMissReason(reason) {
    this.setState(st => {
      if (!st.missAsk) return { missAsk: null };
      const cur = todayEventOf(st.checkinEvents, st.missAsk.id, st.lastDate);
      if (!cur) return { missAsk: null };
      return { checkinEvents: st.checkinEvents.map(e => e === cur ? { ...e, missReason: reason } : e), missAsk: null };
    });
  }
  skipMissReason() { this.setState({ missAsk: null }); }
  // 家長逐項確認:通過才入帳。退回 = 打了卡但實際沒做 → verdict='rejected',信任 −5 由 trustScoreOf 推導(不再 mutate 等級)
  confirmCheckin(id, approve) {
    this.setState(st => {
      const t = st.checkinEvents.find(e => e.id === id && e.verdict === 'pending');
      if (!t) return null;
      const events = st.checkinEvents.map(e => e === t ? { ...e, verdict: approve ? 'approved' : 'rejected' } : e);
      if (approve) return { checkinEvents: events, coins: deriveCoins(events, st.ledgerEvents), xp: st.xp + t.xp, rejectConfirm: null };
      return { checkinEvents: events, rejectConfirm: null };   // 退回:不入帳;−5 推導
    });
  }
  // #2:退回前二次確認(app 內對話框,非 window.confirm)
  askReject(id) { this.setState(st => { const t = st.checkinEvents.find(e => e.id === id && e.verdict === 'pending'); return t ? { rejectConfirm: { id, label: t.label } } : null; }); }
  cancelReject() { this.setState({ rejectConfirm: null }); }
  doReject() { const rc = this.state.rejectConfirm; if (rc) this.confirmCheckin(rc.id, false); }
  // #2:家長撤回退回(看錯了)→ append 一筆更正事件蓋掉 rejected,並補回當初的金幣/XP(淨 0 信任)
  undoReject(behaviorId, date) {
    this.setState(st => {
      const r = todayEventOf(st.checkinEvents, behaviorId, date);   // 只看最新事件
      if (!r || r.verdict !== 'rejected') return null;              // 已更正過 → 不重複補
      const fix = { id: behaviorId + '-' + date + '-fix' + Date.now(), behaviorId, label: r.label, icon: r.icon, kind: r.kind,
        coin: r.coin, xp: r.xp, honest: false, missReason: null, correction: true, ts: Date.now(), date, verdict: 'approved' };
      return { checkinEvents: [...st.checkinEvents, fix], coins: deriveCoins([...st.checkinEvents, fix], st.ledgerEvents), xp: st.xp + (r.xp || 0) };
    });
  }
  // 家長一鍵全過
  approveAll() {
    this.setState(st => {
      let xp = st.xp, any = false;
      const events = st.checkinEvents.map(e => { if (e.verdict !== 'pending') return e; xp += e.xp; any = true; return { ...e, verdict: 'approved' }; });
      return any ? { checkinEvents: events, coins: deriveCoins(events, st.ledgerEvents), xp } : null;
    });
  }
  // 超過 autoApproveHours 未確認:自動放行(中性日),不懲罰小孩
  autoApprove(s) {
    const now = Date.now(), limit = CONFIG.autoApproveHours * 3600000;
    let xp = s.xp, changed = false;
    const events = (s.checkinEvents || []).map(e => {
      if (e.verdict === 'pending' && (now - e.ts) > limit) { xp += e.xp; changed = true; return { ...e, verdict: 'auto' }; }
      return e;
    });
    return changed ? { ...s, checkinEvents: events, coins: deriveCoins(events, s.ledgerEvents), xp } : s;
  }
  toggleTaskOn(id) { this.setState(st => ({ taskOn: { ...st.taskOn, [id]: !st.taskOn[id] } })); }
  unlockTask(id) { this.setState(st => ({ manualUnlock: { ...st.manualUnlock, [id]: true }, taskOn: { ...st.taskOn, [id]: true } })); } // 家長最大:提前解鎖並啟用
  // ===== Phase 2:商城 CRUD(家長端)=====
  openShopForm(it) {
    if (it) this.setState({ sfOpen: true, sfEdit: it.id, sfName: it.name, sfCost: String(it.cost), sfDesc: it.desc || '', sfRank: (it.unlockRank != null ? String(it.unlockRank) : '') });
    else this.setState({ sfOpen: true, sfEdit: null, sfName: '', sfCost: '', sfDesc: '', sfRank: '' });
  }
  closeShopForm() { this.setState({ sfOpen: false, sfEdit: null, sfName: '', sfCost: '', sfDesc: '', sfRank: '' }); }
  setSf(field, e) { this.setState({ ['sf' + field]: e.target.value }); }
  saveShopItem() {
    this.setState(st => {
      const name = (st.sfName || '').trim(), cost = parseInt((st.sfCost || '').replace(/[^0-9]/g, ''), 10) || 0;
      if (!name || cost <= 0) return { sfOpen: false, sfEdit: null };
      const rank = st.sfRank !== '' ? (parseInt(st.sfRank, 10) || 0) : null;
      const desc = (st.sfDesc || '').trim();
      let list = [...(st.items || [])];
      if (st.sfEdit) {                                            // 編輯:name/desc/rank 即時;漲價走 7 天保價、降價即時
        list = list.map(x => {
          if (x.id !== st.sfEdit) return x;
          const up = { ...x, name, desc, unlockRank: rank };
          if (cost > x.cost) up.pending = { type: 'price', newCost: cost, effAt: dateMinus(st.lastDate, -7) };
          else { up.cost = cost; if (up.pending && up.pending.type === 'price') delete up.pending; }
          return up;
        });
      } else {                                                   // 新增即時上架
        list.push({ id: newId(), name, cost, desc, unlockRank: rank, icon: 'i-gift', g: 'magenta', proposed: false, builtin: false, active: true, createdAt: st.lastDate });
      }
      return { items: list, sfOpen: false, sfEdit: null, sfName: '', sfCost: '', sfDesc: '', sfRank: '' };
    });
  }
  scheduleDelist(id) { this.setState(st => ({ items: (st.items || []).map(x => x.id === id ? { ...x, pending: { type: 'delist', effAt: dateMinus(st.lastDate, -7) } } : x) })); }
  cancelSchedule(id) { this.setState(st => ({ items: (st.items || []).map(x => { if (x.id !== id) return x; const y = { ...x }; delete y.pending; return y; }) })); } // 冷靜期可逆
  toggleItemActive(id) { this.setState(st => ({ items: (st.items || []).map(x => x.id === id ? { ...x, active: x.active === false } : x) })); } // 內建示範品上/下架
  delCustomShop(id) {
    if (this._supa && this._cloudReady) { try { this._supa.from('items').delete().eq('id', id).then(() => {}, () => {}); } catch (e) {} }
    this.setState(st => ({ items: (st.items || []).filter(x => x.id !== id) }));   // 尚未公告的新增可直接刪
  }
  jrSel(i) { this.setState({ jrSel: i }); }
  toggleSchedInfo() { this.setState(st => ({ schedInfoOpen: !st.schedInfoOpen })); }
  useProtect() { if (this.state.preview) return; this.setState(st => st.protects > 0 && !st.saved ? { protects: st.protects - 1, streak: st.streak + 1, saved: true } : null); }
  decide(id, d) { this.setState(st => ({ decided: { ...st.decided, [id]: d } })); }
  openCeleb() { this.setState({ celebrate: true }); }
  closeCeleb() { this.setState({ celebrate: false }); }
  openGrad(id) { this.setState({ gradModal: id }); }
  closeGrad() { this.setState({ gradModal: null }); }
  // ===== B1:畢業機制 —— 分階段降低監督強度(鷹架不是牢籠)=====
  advanceGraduation() { this.setState(st => ({ graduationStage: Math.min(3, (st.graduationStage || 0) + 1) })); }
  openRetro() { this.setState({ retroOpen: true }); }
  closeRetro() { this.setState({ retroOpen: false }); }
  // ===== 家庭公約 =====
  setNewTerm(e) { this.setState({ newTerm: e.target.value }); }
  addTerm() { this.setState(st => { const t = (st.newTerm || '').trim(); if (!t) return null; return { newTerm: '', covenant: { ...st.covenant, terms: [...st.covenant.terms, t] } }; }); }
  // 公約條款移除 = 修訂事件:從 active terms 拿掉 + append 一筆撤銷紀錄到修訂史(禁止直接刪紀錄,審計留痕)
  askRemoveTerm(i) { this.setState(st => ({ termRemove: { idx: i, text: st.covenant.terms[i] || '', reason: '' } })); }
  setRemoveReason(e) { const v = e.target.value; this.setState(st => (st.termRemove ? { termRemove: { ...st.termRemove, reason: v, err: '' } } : null)); }
  cancelRemoveTerm() { this.setState({ termRemove: null }); }
  confirmRemoveTerm() {
    this.setState(st => {
      const tr = st.termRemove; if (!tr) return { termRemove: null };
      const reason = (tr.reason || '').trim();
      if (!reason) return { termRemove: { ...tr, err: '原因必填——廢止比拒絕更重,要留一行說明' } };  // 必填:與提案准駁理由一致
      const terms = st.covenant.terms.filter((_, x) => x !== tr.idx);
      const note = '移除:' + tr.text + ',原因:' + reason;
      return { termRemove: null, covenant: { ...st.covenant, terms, history: [...(st.covenant.history || []), { v: st.covenant.version, at: ymd(new Date()), note }] } };
    });
  }
  setSigName(role, e) { const v = e.target.value; this.setState(st => ({ covenant: { ...st.covenant, signatures: { ...st.covenant.signatures, [role]: { ...st.covenant.signatures[role], name: v } } } })); }
  setSched(dayType, e) { const v = e.target.value; this.setState(st => ({ covenant: { ...st.covenant, schedules: { ...st.covenant.schedules, [dayType]: v } } })); }
  sealStart(role) { try { clearTimeout(this._sealT); } catch (e) {} this._sealT = setTimeout(() => this.doSeal(role), CONFIG.sealHoldMs); this.setState({ sealing: role }); }
  sealEnd() { try { clearTimeout(this._sealT); } catch (e) {} this.setState({ sealing: null }); }
  doSeal(role) { this.setState(st => { const n = (st.covenant.signatures[role].name || '').trim(); if (!n) return { sealing: null }; try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) {} return { sealing: null, covenant: { ...st.covenant, signatures: { ...st.covenant.signatures, [role]: { name: n, at: ymd(new Date()) } } } }; }); }
  resign() { this.setState(st => { const nv = st.covenant.version + 1; return { covenant: { ...st.covenant, version: nv, signatures: { child: { name: '', at: '' }, parent: { name: '', at: '' } }, history: [...(st.covenant.history || []), { v: nv, at: ymd(new Date()), note: '修訂公約 · 重新簽署' }] } }; }); }
  // ===== B3:公約雙向化(小孩提案 + 家長承諾 + 修訂紀錄)=====
  setProp(field, e) { const v = e.target.value; this.setState({ [field]: v }); }
  // 小孩提案改公約 → 進家長待確認
  openPropose() { if (this.state.preview) return; this.setState({ proposeOpen: true, proposeKind: 'covenant' }); }        // 我想改公約
  openTaskPropose() { if (this.state.preview) return; this.setState({ proposeOpen: true, proposeKind: 'task' }); }         // 我想提新任務(提案權,非呼叫家長)
  openRewardPropose() { if (this.state.preview) return; this.setState({ proposeOpen: true, proposeKind: 'reward' }); }     // 我想上架一個獎品
  closePropose() { this.setState({ proposeOpen: false, propText: '', propReason: '', proposeKind: 'covenant' }); }
  submitProposal() {
    this.setState(st => {
      const text = (st.propText || '').trim(); if (!text) return { proposeOpen: false, proposeKind: 'covenant' };
      const kind = st.proposeKind || 'covenant';
      // task:propReason 當「自提賞金」;covenant:propReason 當理由
      const p = { id: newId(), text, reason: (st.propReason || '').trim(), at: ymd(new Date()), status: 'pending', kind };
      return { propText: '', propReason: '', proposeOpen: false, proposeKind: 'covenant', covenant: { ...st.covenant, proposals: [...(st.covenant.proposals || []), p] } };
    });
  }
  // ===== 自訂任務原語(鏡像 items;啟用走 kidId 而非 taskOn,故「重新來過」reset 掃不到)=====
  // 純建構:把提案/表單定稿值 → 一筆 catalog 任務物件。xp 自動導出 Math.round(coin*0.75)(對齊 LIB coin:xp 眾數 0.75)。
  // 段位預設 unlockRank=null(全開);active:true;kidId=啟用歸屬(核准當下的提案孩子);type 恆 'task'(不入信任軸)。
  _makeCustomTask(spec, kidId) {
    const coin = Math.max(0, parseInt(spec.coin, 10) || 0);
    return { id: newId(), type: 'task',
      label: (spec.label || '').trim() || '自訂任務', sub: (spec.sub || '').trim(),
      coin, xp: Math.round(coin * 0.75), icon: spec.icon || 'i-spark',
      dom: spec.dom || '自訂', domColor: spec.domColor || 'teal', where: spec.where || 'anywhere',
      unlockRank: (spec.unlockRank != null ? spec.unlockRank : null),
      proposed: !!spec.proposed, active: true, kidId: kidId || null, createdAt: this.state.lastDate };
  }
  // 標準呼叫端①:核准任務提案(decideProposal / confirmApprove 的 task 分支,已於各自 setState 內用 _makeCustomTask 併入)。
  // 標準呼叫端②(接點預留,本次不實作):家長「直接新增任務」按鈕 → createCustomTask(spec, 選定kid),proposed:false、跳過提案。
  createCustomTask(spec, kidId) {   // 獨立入口:建列(啟用不寫 taskOn)→ 去抖 cloudSave → pushCustomTasks 上雲。
    if (this.state.preview) return;
    this.setState(st => ({ customTasks: [...(st.customTasks || []), this._makeCustomTask(spec, kidId)] }));
  }
  // 家長採納/婉拒提案:公約提案採納 → 條款加入公約;任務提案採納 → 建入自訂任務(自訂任務原語);不塞進公約條款
  decideProposal(id, approve) {
    this.setState(st => {
      const p = (st.covenant.proposals || []).find(x => x.id === id && x.status === 'pending');
      if (!p) return null;
      const proposals = st.covenant.proposals.map(x => x === p ? { ...x, status: approve ? 'approved' : 'rejected' } : x);
      if (!approve) return { covenant: { ...st.covenant, proposals } };
      if (p.kind === 'task' || p.kind === 'reward') {              // 任務 / 獎品提案:不動公約條款,留採納紀錄
        const kindCn = p.kind === 'reward' ? '獎品提案' : '任務提案';
        const note = '採納' + kindCn + ':' + p.text + (p.reason ? '(開價 ' + p.reason + ')' : '');
        const out = { covenant: { ...st.covenant, proposals, history: [...(st.covenant.history || []), { v: st.covenant.version, at: ymd(new Date()), note }] } };
        if (p.kind === 'reward') {                                 // 核准獎品提案 → 建入商城,掛「你提案的」角標(可事後編輯定價)
          const cost = parseInt((p.reason || '').replace(/[^0-9]/g, ''), 10) || 0;
          out.items = [...(st.items || []), { id: newId(), name: p.text, cost: cost > 0 ? cost : 100, desc: '', unlockRank: null, icon: 'i-gift', g: 'magenta', proposed: true, builtin: false, active: true, createdAt: st.lastDate }];
        } else {                                                   // 核准任務提案 → 建入自訂任務;啟用歸該提案孩子(st.currentKidId),xp 自動導出。提案開價(p.reason)當賞金
          const coin = parseInt((p.reason || '').replace(/[^0-9]/g, ''), 10) || 0;
          out.customTasks = [...(st.customTasks || []), this._makeCustomTask({ label: p.text, coin, proposed: true }, st.currentKidId)];
        }
        return out;
      }
      // 公約提案採納 = 修法:條文實際寫入公約 terms + 一筆可解析的修訂紀錄(帶提案者,供孩子端顯示來源)
      const kidName = ((st.kids || []).find(k => k.id === st.currentKidId) || {}).name || '孩子';
      return { covenant: { ...st.covenant, proposals, terms: [...st.covenant.terms, p.text],
        history: [...(st.covenant.history || []), { v: st.covenant.version, at: ymd(new Date()), note: '採納「' + kidName + '」提案:' + p.text }] } };
    });
  }
  // Bug 1b:孩子提錯入口是必然事件——家長可將提案改道至正確管道(covenant / reward / task),之後走正確流程處理
  reclassifyProposal(id, kind) {
    this.setState(st => ({ covenant: { ...st.covenant, proposals: (st.covenant.proposals || []).map(p => (p.id === id && p.status === 'pending') ? { ...p, kind } : p) } }));
  }
  // 採納前微調(任務/獎品通用):採納 → 預填可編輯表單(名稱/說明/賞金),確認才建入;留「原文→定稿」痕跡
  startApprove(id) {
    this.setState(st => {
      const p = (st.covenant.proposals || []).find(x => x.id === id && x.status === 'pending');
      if (!p) return null;
      const bounty = parseInt((p.reason || '').replace(/[^0-9]/g, ''), 10) || 0;
      return { approveForm: { id, kind: p.kind || 'covenant', name: p.text, desc: '', bounty: bounty ? String(bounty) : '' } };
    });
  }
  setApf(field, e) { const v = e.target.value; this.setState(st => (st.approveForm ? { approveForm: { ...st.approveForm, [field]: v } } : null)); }
  cancelApprove() { this.setState({ approveForm: null }); }
  confirmApprove() {
    this.setState(st => {
      const af = st.approveForm; if (!af) return { approveForm: null };
      const p = (st.covenant.proposals || []).find(x => x.id === af.id && x.status === 'pending');
      if (!p) return { approveForm: null };
      const name = (af.name || '').trim() || p.text, desc = (af.desc || '').trim();
      const bounty = parseInt((af.bounty || '').replace(/[^0-9]/g, ''), 10) || 0;
      const origBounty = parseInt((p.reason || '').replace(/[^0-9]/g, ''), 10) || 0;
      const edited = name !== p.text || !!desc || bounty !== origBounty;
      const final = { text: name, desc, bounty };
      const proposals = st.covenant.proposals.map(x => x === p ? { ...x, status: 'approved', original: { text: p.text, reason: p.reason }, final } : x);
      const kindCn = p.kind === 'reward' ? '獎品' : '任務';
      const note = '採納' + kindCn + '提案:' + (edited ? (p.text + ' → ' + name) : name) + (bounty ? '(' + bounty + '幣)' : '');
      const out = { approveForm: null, covenant: { ...st.covenant, proposals, history: [...(st.covenant.history || []), { v: st.covenant.version, at: ymd(new Date()), note }] } };
      if (p.kind === 'reward') out.items = [...(st.items || []), { id: newId(), name, cost: bounty > 0 ? bounty : 100, desc, unlockRank: null, icon: 'i-gift', g: 'magenta', proposed: true, builtin: false, active: true, createdAt: st.lastDate }];
      else if (p.kind === 'task') out.customTasks = [...(st.customTasks || []), this._makeCustomTask({ label: name, sub: desc, coin: bounty, proposed: true }, st.currentKidId)];  // 定稿名/說明/賞金 → 自訂任務;啟用歸該提案孩子
      return out;
    });
  }
  // ===== NFC 單嗶交機打卡 =====
  _nfcState() {   // 目前解析結果(衍生)
    const S = this.state;
    return nfcResolve({ token: S.nfcToken, tokens: (S.covenant && S.covenant.nfcTokens) || [], session: S.session, guestMode: S.guestMode, deviceMode: S.deviceMode, currentKidId: S.currentKidId, events: S.checkinEvents, today: S.lastDate });
  }
  _nfcWrite(tok) {   // 通過核對 → 寫入打卡事件(沿用信任流程 verdict),加 source + deviceKid 佐證
    const b = LIB.find(x => x.id === tok.behaviorId); if (!b) return;
    this.setState(st => {
      const day = st.lastDate, cur = todayEventOf(st.checkinEvents, b.id, day);
      if (cur && !cur.honest && cur.verdict !== 'rejected') return null;   // 已打卡不重複
      const rest = cur ? st.checkinEvents.filter(e => e !== cur) : st.checkinEvents;
      const refund = (cur && cur.honest) ? CONFIG.honestMissXP : 0;
      const xp = b.honestyEligible ? Math.round(b.xp * 1.5) : b.xp;
      const level = trustLiveLevel(st.checkinEvents, b.id, day);
      const instant = level >= 2 || (level === 1 && Math.random() >= CONFIG.spotCheckRate);
      const ev = { id: b.id + '-' + day, behaviorId: b.id, label: b.label, icon: b.icon, kind: b.kind, coin: b.coin, xp, honest: false, latencyMin: latencyOf(b.id, st.dayMode), ts: Date.now(), date: day, verdict: instant ? 'approved' : 'pending', source: st.nfcSrc || 'nfc', deviceKid: st.currentKidId };
      return instant ? { checkinEvents: [...rest, ev], xp: st.xp - refund + xp, coins: st.coins + b.coin } : { checkinEvents: [...rest, ev], xp: st.xp - refund };
    });
  }
  exitNfc() { try { history.replaceState(null, '', location.pathname); } catch (e) {} this.setState({ nfcToken: null }); }  // 回到正常 app
  // Token 管理(家庭設定):每個孩子一個交機打卡點
  seedTokens() {   // 一鍵為每個孩子建立「睡前準時交機」token(尚未有的才建)
    this.setState(st => {
      const toks = [...((st.covenant && st.covenant.nfcTokens) || [])];
      (st.kids || []).forEach(k => { if (!toks.some(t => t.kidId === k.id && t.behaviorId === 'k1')) toks.push({ token: newId(), kidId: k.id, behaviorId: 'k1', createdAt: st.lastDate }); });
      return { covenant: { ...st.covenant, nfcTokens: toks } };
    });
  }
  askRegenToken(id) { this.setState({ tokenRegen: id }); }   // 二次確認:重生 = 舊貼紙立刻失效
  cancelRegenToken() { this.setState({ tokenRegen: null }); }
  confirmRegenToken() {
    this.setState(st => {
      const id = st.tokenRegen; if (!id) return { tokenRegen: null };
      const toks = ((st.covenant && st.covenant.nfcTokens) || []).map(t => (t.kidId + '|' + t.behaviorId) === id ? { ...t, token: newId(), createdAt: st.lastDate } : t);
      return { tokenRegen: null, covenant: { ...st.covenant, nfcTokens: toks } };
    });
  }
  setNewPledge(e) { const v = e.target.value; this.setState({ newPledge: v }); }
  addPledge() { this.setState(st => { const t = (st.newPledge || '').trim(); if (!t) return null; return { newPledge: '', covenant: { ...st.covenant, pledges: [...(st.covenant.pledges || []), { id: newId(), text: t }] } }; }); }
  // #4:刪承諾 → 本機移除 + 清該承諾的 pledgeDone;登入則試刪雲端,失敗記 pendingDeletes 由 cloudSave 重試(防復活)
  delPledge(id) {
    this.setState(st => {
      const pledgeDone = { ...st.pledgeDone };
      Object.keys(pledgeDone).forEach(k => { if (k.indexOf(id + '::') === 0) delete pledgeDone[k]; });
      return { covenant: { ...st.covenant, pledges: (st.covenant.pledges || []).filter(p => p.id !== id) }, pledgeDone };
    });
    if (this._supa && this.state.session) {
      Promise.resolve().then(() => this._supa.from('pledges').delete().eq('id', id))
        .then(r => { if (r && r.error) this._queueDelete(id); }).catch(() => this._queueDelete(id));
    }
  }
  _queueDelete(id) { this.setState(st => ({ pendingDeletes: (st.pendingDeletes || []).indexOf(id) >= 0 ? st.pendingDeletes : [...(st.pendingDeletes || []), id] })); }
  // #2 第二波:孩子申訴「我真的有做到」→ append 一筆 pending(appeal)回家長複審。
  // 通過→更正(+1、補金幣/XP);再退→維持 −5(每天最新事件模型,不額外扣)
  appealReject(behaviorId) {
    this.setState(st => {
      const day = st.lastDate, r = todayEventOf(st.checkinEvents, behaviorId, day);
      if (!r || r.verdict !== 'rejected' || r.honest || r.appeal) return null;   // 只有「非申訴的退回」可申訴一次
      const ev = { id: behaviorId + '-' + day + '-appeal' + Date.now(), behaviorId, label: r.label, icon: r.icon, kind: r.kind,
        coin: r.coin, xp: r.xp, honest: false, missReason: null, appeal: true, latencyMin: (typeof r.latencyMin === 'number' ? r.latencyMin : null),
        ts: Date.now(), date: day, verdict: 'pending' };
      return { checkinEvents: [...st.checkinEvents, ev] };
    });
  }
  // 家長誠實回報今天有沒有做到自己的承諾(小孩看得到)
  togglePledge(id) { this.setState(st => { const k = id + '::' + (st.lastDate || ymd(new Date())); return { pledgeDone: { ...st.pledgeDone, [k]: !st.pledgeDone[k] } }; }); }
  // ===== 商城購買 → append-only 帳本 =====
  // 餘額檢查一律用事件推導值(不讀快取)。雲端:走 Postgres RPC purchase_item(單一 transaction 內
  // 校驗餘額 → 插 coin_spend + item_acquire 兩列,帳平鎖在後端)。本機/訪客:單執行緒同步 append(同一 setState 帳平)。
  setShopTab(t) { this.setState({ shopTab: t }); }
  buy(it) {
    if (this.state.preview) return;
    const full = (this.state.items || []).find(x => x.id === it.id) || it;
    // Q4:外觀道具不重複購買(前端擋;RPC 不動)。已擁有 → 直接返回
    if (full.category === 'cosmetic' && inventoryOf(this.state.ledgerEvents)[it.id] > 0) return;
    const bal = deriveCoins(this.state.checkinEvents, this.state.ledgerEvents);
    if (bal < it.cost) return;   // 餘額不足(以推導值判斷)
    if (this._supa && this._cloudReady && this._kidId) {          // 雲端:原子 RPC
      this.setState({ syncStatus: 'syncing' });
      this._supa.rpc('purchase_item', { p_kid: this._kidId, p_item: it.id }).then(({ data, error }) => {
        if (error) { this.setState({ syncStatus: 'error:' + (error.message || error) }); return; }
        this._reloadLedger();   // ledger 為 append-only:只重拉、絕不 delete 重灌
        this.setState({ syncStatus: 'ok', fx: { name: it.name, icon: it.icon, gradient: it.gradient, spent: it.cost, left: (data && data.balance != null) ? data.balance : (bal - it.cost) } });
      }, (e) => this.setState({ syncStatus: 'error:' + e }));
      return;
    }
    this.setState(st => {                                          // 本機/訪客:同步 append
      const b2 = deriveCoins(st.checkinEvents, st.ledgerEvents);
      if (b2 < it.cost) return null;
      const ts = Date.now(), day = st.lastDate || ymd(new Date());
      const spend = { id: newId(), kind: 'coin_spend', itemId: it.id, amount: it.cost, qty: null, ts, date: day };
      const acq = { id: newId(), kind: 'item_acquire', itemId: it.id, amount: null, qty: 1, ts, date: day };
      const ledger = [...st.ledgerEvents, spend, acq];
      return { ledgerEvents: ledger, coins: deriveCoins(st.checkinEvents, ledger),
        fx: { name: it.name, icon: it.icon, gradient: it.gradient, spent: it.cost, left: deriveCoins(st.checkinEvents, ledger) } };
    });
  }
  // 出包:使用一件背包道具 → append item_consume(不動金幣;金幣只花不扣)
  useItem(itemId) {
    if (this.state.preview) return;
    if (this._supa && this._cloudReady && this._kidId) {
      const ev = { family_id: this._familyId, kid_id: this._kidId, kind: 'item_consume', item_id: itemId, amount: null, qty: 1, date: this.state.lastDate || ymd(new Date()), ts: new Date().toISOString() };
      this._supa.from('ledger_events').insert(ev).then(({ error }) => { if (!error) this._reloadLedger(); }, () => {});
      return;
    }
    this.setState(st => {
      const inv = inventoryOf(st.ledgerEvents);
      if (!(inv[itemId] > 0)) return null;
      const ev = { id: newId(), kind: 'item_consume', itemId, amount: null, qty: 1, ts: Date.now(), date: st.lastDate || ymd(new Date()) };
      return { ledgerEvents: [...st.ledgerEvents, ev] };
    });
  }
  // ②外觀:穿/脫(toggle)。純顯示快取 kids.equipped,不寫帳本(外觀不消耗)。
  // 合法性:只能穿「擁有(inventoryOf>0)且 category==='cosmetic'」的道具;點已戴的=脫下。
  // 雲端由 componentDidUpdate 去抖 cloudSave → pushKid 更新 kids.equipped(無 RPC)。
  equip(itemId) {
    if (this.state.preview) return;
    const it = (this.state.items || []).find(x => x.id === itemId);
    if (!it || it.category !== 'cosmetic' || !it.slot) return;
    if (!(inventoryOf(this.state.ledgerEvents)[itemId] > 0)) return;   // 只能穿擁有的
    this.setState(st => {
      const eq = { ...(st.equipped || {}) };
      eq[it.slot] = (eq[it.slot] === itemId) ? null : itemId;         // toggle:已戴→脫下
      return { equipped: eq };
    });
  }
  async _reloadLedger() {
    if (!this._supa || !this._kidId) return;
    try {
      const { data } = await this._supa.from('ledger_events').select('*').eq('kid_id', this._kidId);
      const led = (data || []).map(r => ({ id: r.id, kind: r.kind, itemId: r.item_id, amount: r.amount, qty: r.qty, ts: r.ts ? Date.parse(r.ts) : Date.now(), date: r.date }));
      this.setState(st => ({ ledgerEvents: led, coins: deriveCoins(st.checkinEvents, led) }));   // 快取回寫由 RPC/pushKid 負責
    } catch (e) {}
  }
  closeFx() { this.setState({ fx: null }); }
  // ===== 持久化 + 日期感知 =====
  componentDidMount() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('habitRank') || 'null'); } catch (e) {}
    if (saved) saved = migrateToV2(saved);
    const merged = saved ? { ...this.state, ...saved } : { ...this.state };
    // 裝置模式:讀本機;孩子裝置強制 kid view
    let dev = null; try { dev = localStorage.getItem('habitRank_device'); } catch (e) {}
    merged.deviceMode = (dev === 'parent' || dev === 'kid') ? dev : null;
    if (merged.deviceMode === 'kid') merged.mode = 'kid';
    // NFC 打卡:網址帶 token → 進打卡模式;src=qr 走同一條路
    try { const q = new URLSearchParams(location.search); const tk = q.get('token'); if (tk) { merged.nfcToken = tk; merged.nfcSrc = (q.get('src') === 'qr') ? 'qr' : 'nfc'; } } catch (e) {}
    const boot = this.autoApprove(this.rollover(merged, ymd(new Date())));
    boot.coins = deriveCoins(boot.checkinEvents, boot.ledgerEvents);   // 金幣結餘=事件推導(單一真相)
    if (!Array.isArray(boot.items) || !boot.items.length) boot.items = DEFAULT_ITEMS.map(d => ({ ...d }));
    if (!Array.isArray(boot.ledgerEvents)) boot.ledgerEvents = [];
    this.setState(boot);
    this.initSupabase();
    // #3:session 停留埋點 —— app 被切到背景/關閉時記一筆停留秒數(append-only 事件)
    this._sessionStart = Date.now();
    if (typeof document !== 'undefined') {
      this._visHandler = () => {
        if (document.visibilityState === 'hidden') { this.recordSession(); this._sessionStart = null; }
        else if (document.visibilityState === 'visible') { if (!this._sessionStart) this._sessionStart = Date.now(); this.checkVersion(); }
      };
      document.addEventListener('visibilitychange', this._visHandler);
      // 版本自動更新偵測:載入時查一次 + 回前景查 + 每 30 分鐘查
      this.checkVersion();
      this._verPoll = setInterval(() => this.checkVersion(), 30 * 60 * 1000);
      // APP 化手勢:手動掛 document touch 監聽(touchmove 需 passive:false 才能 preventDefault)
      this._tsH = (e) => this._onTouchStart(e);
      this._tmH = (e) => this._onTouchMove(e);
      this._teH = () => this._onTouchEnd();
      document.addEventListener('touchstart', this._tsH, { passive: true });
      document.addEventListener('touchmove', this._tmH, { passive: false });
      document.addEventListener('touchend', this._teH, { passive: true });
      document.addEventListener('touchcancel', this._teH, { passive: true });
      // 閒置鎖:家長裝置的活動偵測(重置 5 分鐘計時)
      this._idleH = () => this._armIdle();
      document.addEventListener('pointerdown', this._idleH, { passive: true });
      document.addEventListener('keydown', this._idleH, { passive: true });
      this._armIdle();
    }
  }
  // 版本偵測:抓 version.json(不吃快取),雲端建置編號 > 本機 → 顯示更新提示條
  checkVersion() {
    if (this.state.updateReady || LOCAL_BUILD <= 0 || typeof fetch === 'undefined') return;
    fetch('version.json?t=' + Date.now(), { cache: 'no-store' })   // 時間戳繞過瀏覽器 + CDN 邊緣快取
      .then(r => r.ok ? r.json() : null)
      .then(j => { const n = j && typeof j.n === 'number' ? j.n : 0; if (n > LOCAL_BUILD) { this._cloudBuild = n; this.setState({ updateReady: true }); } })
      .catch(() => {});
  }
  // 點更新:換上帶版本 query 的網址強制繞過快取重載(孩子裝置不會有人主動清快取)
  applyUpdate() {
    try { const bust = (this._cloudBuild || Date.now()); location.replace(location.pathname + '?v=' + bust); }
    catch (e) { try { location.reload(); } catch (e2) {} }
  }
  recordSession() {
    if (!this._sessionStart) return;
    const durationSec = Math.round((Date.now() - this._sessionStart) / 1000);
    if (durationSec < 5) return;                                  // 忽略太短的雜訊
    const day = this.state.lastDate || ymd(new Date());
    this.setState(st => ({ checkinEvents: [...(st.checkinEvents || []), { type: 'session', date: day, ts: Date.now(), durationSec }] }));
  }
  componentWillUnmount() { try { this.recordSession(); if (this._verPoll) clearInterval(this._verPoll); if (this._visHandler) document.removeEventListener('visibilitychange', this._visHandler);
    if (this._tsH) { document.removeEventListener('touchstart', this._tsH); document.removeEventListener('touchmove', this._tmH); document.removeEventListener('touchend', this._teH); document.removeEventListener('touchcancel', this._teH); }
    if (this._idleH) { document.removeEventListener('pointerdown', this._idleH); document.removeEventListener('keydown', this._idleH); } try { clearTimeout(this._idleT); } catch (e) {} } catch (e) {} }
  componentDidUpdate() {
    try { const { celebrate, fx, gradModal, sealing, missAsk, proposeOpen, proposeKind, retroOpen,
      authReady, session, authEmail, authSent, authError, supaOff, guestMode, syncStatus,
      kids, currentKidId, kidSwitchOpen, newKidName, newKidAvatar,
      pinMode, pinEntry, pinError, pinStage, parentUnlocked, rejectConfirm, termRemove, approveForm,
      kidPinMode, kidPinTarget, kidPinEntry, kidPinError, kidPinStage,
      deviceMode, deviceStep, pinGoal, pManage, pDetailKid, slideDir, pullRefreshing, updateReady, schedInfoOpen, preview,
      sfOpen, sfEdit, sfName, sfCost, sfDesc, sfRank, nfcToken, nfcSrc, tokenRegen, rulesOpen, shopTab, ...persist } = this.state;
      localStorage.setItem('habitRank', JSON.stringify(persist)); } catch (e) {}
    // 裝置精靈:只要「已登入 + 尚未設定 deviceMode」就顯示 —— 用反應式偵測,不綁 cloudInit 成功與否,
    // 既有已登入裝置(功能上線前就登入的)下次載入也會觸發。guestMode 無 session → 不觸發。
    const S = this.state;
    if (S.authReady && S.session && !S.deviceMode && !S.deviceStep && !S.pinMode && !S.kidPinMode && !this._devicePrompted) {
      this._devicePrompted = true;
      this.setState({ deviceStep: 'role' });
    }
    // 防呆:孩子裝置若因 bug 進到家長 view,一律導回孩子頁
    if (this.state.deviceMode === 'kid' && this.state.mode === 'parent') { this.setState({ mode: 'kid', parentUnlocked: false }); }
    // NFC 打卡:解析通過 → 寫入一次(單次副作用,guard 防重)
    if (this.state.nfcToken && !this._nfcWritten) {
      const r = this._nfcState();
      if (r && r.state === 'go') { this._nfcWritten = true; this._nfcWrite(r.tok); }
    }
    // 家長裝置固定停留家長 view:非 preview 下若跑到孩子互動頁 → 導回家長(封死以孩子名義操作)。
    // dev 要完整孩子視圖:改 localStorage habitRank_device→kid(既有能力),非 UI 路徑。
    if (this.state.deviceMode === 'parent' && this.state.mode === 'kid' && !this.state.preview) { this.setState({ mode: 'parent', preview: false }); }
    // 階段 2:登入後把變更鏡像到雲端(去抖動、盡力而為;失敗不影響本機)
    if (this._supa && this._cloudReady && this.state.session && !this._hydrating) {
      try { clearTimeout(this._saveTimer); } catch (e) {}
      this._saveTimer = setTimeout(() => this.cloudSave(), 1500);
    }
  }
  // ===== 階段 1:登入(email magic link)。後端不可用時 supaOff → 退回純本機,不鎖死 app =====
  initSupabase() {
    const g = (typeof window !== 'undefined') ? window : {};
    if (!g.supabase || !g.supabase.createClient) { this.setState({ supaOff: true, authReady: true }); return; }
    try { this._supa = g.supabase.createClient(SUPA_URL, SUPA_KEY); }
    catch (e) { this.setState({ supaOff: true, authReady: true }); return; }
    this._supa.auth.getSession()
      .then(({ data }) => { const s = data && data.session; this.setState({ authReady: true, session: s ? { email: s.user.email } : null }); if (s) this.cloudInit(); })
      .catch(() => this.setState({ authReady: true }));
    this._supa.auth.onAuthStateChange((_evt, sess) => { this.setState({ session: sess ? { email: sess.user.email } : null, authReady: true, authSent: false }); if (sess) this.cloudInit(); });
  }
  setAuthEmail(e) { this.setState({ authEmail: e.target.value, authError: '' }); }
  sendMagicLink() {
    const email = (this.state.authEmail || '').trim();
    if (!email || !this._supa) return;
    this.setState({ authError: '' });
    const redirect = (typeof location !== 'undefined') ? location.href.split('#')[0] : undefined;
    this._supa.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect } })
      .then(({ error }) => this.setState(error ? { authError: error.message } : { authSent: true }))
      .catch((err) => this.setState({ authError: String((err && err.message) || err) }));
  }
  skipLogin() { this.setState({ guestMode: true }); }
  signOut() { try { if (this._supa) this._supa.auth.signOut(); } catch (e) {} try { localStorage.removeItem('habitRank_pin'); } catch (e) {} this._cloudReady = false; this._familyId = null; this._kidId = null; this._parentPin = null; this.setState({ session: null, guestMode: false, authSent: false, syncStatus: '', parentUnlocked: false, pinMode: null, mode: 'kid' }); }
  // ===== 階段 2:雲端資料層(家庭空間 → 小孩 → 打卡/信任/公約)=====
  // 只鏡像「核心進度」:kid 彙總 + checkin_events + trust_levels + covenant。
  // proposals / pledges / rewards 暫留本機(id 穩定性待階段 2b 處理)。
  syncHash() {
    const S = this.state;
    return JSON.stringify({ c: S.coins, x: S.xp, s: S.streak, g: S.graduationStage, t: S.taskOn, m: S.manualUnlock,
      eq: S.equipped,   // ②外觀:穿戴變更觸發 cloudSave → pushKid
      ev: S.checkinEvents, ga: S.graduatedAt,   // #2:信任由 checkinEvents(含 checkpoint)推導,不再單獨 hash trustLevel
      cov: { v: S.covenant.version, t: S.covenant.terms, s: S.covenant.schedules, sig: S.covenant.signatures, h: S.covenant.history },
      pr: S.covenant.proposals, pl: S.covenant.pledges, pdn: S.pledgeDone, pdel: S.pendingDeletes, itm: S.items, ct: S.customTasks, nft: S.covenant.nfcTokens });   // #4 + items 主檔 + 自訂任務 + NFC(ledger 走 RPC/append,不進 hash)
  }
  async cloudInit() {
    if (!this._supa || this._cloudReady || this._cloudBusy) return;
    this._cloudBusy = true;
    try {
      this.setState({ syncStatus: 'syncing' });
      const u = await this._supa.auth.getUser();
      const uid = u && u.data && u.data.user && u.data.user.id;
      if (!uid) throw new Error('no user');
      let { data: fams, error: fe } = await this._supa.from('families').select('id, parent_pin').eq('owner_id', uid).limit(1);
      if (fe) throw fe;
      let familyId = (fams && fams.length) ? fams[0].id : null;
      let cloudPin = (fams && fams.length) ? fams[0].parent_pin : null;
      if (!familyId) { const { data: ins, error: ie } = await this._supa.from('families').insert({ owner_id: uid }).select('id').single(); if (ie) throw ie; familyId = ins.id; }
      this._familyId = familyId;
      // 家長 PIN 家庭層級:雲端有 → 進記憶體+快取;雲端沒有但本機有(舊裝置)→ 遷移上雲成為全家唯一
      let localPin = null; try { localPin = localStorage.getItem('habitRank_pin'); } catch (e) {}
      if (cloudPin) { this._parentPin = cloudPin; try { localStorage.setItem('habitRank_pin', cloudPin); } catch (e) {} }
      else if (localPin) { this._parentPin = localPin; try { await this._supa.from('families').update({ parent_pin: localPin }).eq('id', familyId); } catch (e) {} }
      else { this._parentPin = null; }
      await this.cloudLoadItems(familyId);   // items 主檔:family 共享;空表 → seed 內建示範品 + 遷入本機自建商品
      await this.cloudLoadCustomTasks(familyId);   // 自訂任務目錄:family 共享;須先於 cloudLoad(還原打卡 label/icon 要查得到)
      let { data: rows, error: ke } = await this._supa.from('kids').select('*').eq('family_id', familyId).order('created_at');
      if (ke) throw ke;
      rows = rows || [];
      if (!rows.length) { await this.cloudMigrate(familyId); const r2 = await this._supa.from('kids').select('*').eq('family_id', familyId).order('created_at'); rows = r2.data || []; }
      // 選目前檢視的小孩:device 記憶的 → 否則第一個
      let curId = null; try { curId = localStorage.getItem('habitRank_kid'); } catch (e) {}
      const cur = rows.find(k => k.id === curId) || rows[0];
      this._kidPins = {}; rows.forEach(k => { if (k.pin) this._kidPins[k.id] = k.pin; }); // 身分保護:密碼進記憶體,不進渲染 state
      this.setState({ kids: rows.map(k => ({ id: k.id, name: k.name, avatar: k.avatar || '🦊', hasPin: !!k.pin })), currentKidId: cur ? cur.id : null });
      if (cur) { await this.cloudLoad(cur); try { localStorage.setItem('habitRank_kid', cur.id); } catch (e) {} }
      this._cloudReady = true;
      this.setState({ syncStatus: 'ok' });
      if (!this.state.deviceMode) this.setState({ deviceStep: 'role' });   // 首次登入 → 一次性裝置精靈
    } catch (e) { this.setState({ syncStatus: 'error:' + ((e && e.message) || e) }); }
    this._cloudBusy = false;
  }
  async cloudMigrate(familyId) {
    const S = this.state;
    const name = (S.covenant && S.covenant.signatures && S.covenant.signatures.child && S.covenant.signatures.child.name) || '孩子';
    const { data: kid, error } = await this._supa.from('kids').insert({
      family_id: familyId, name, coins: S.coins || 0, xp: S.xp || 0, streak: S.streak || 0,
      graduation_stage: S.graduationStage || 0, task_on: S.taskOn || {}, manual_unlock: S.manualUnlock || {},
      equipped: S.equipped || {},   // ②外觀:穿戴快取
      schedules: (S.covenant && S.covenant.schedules) || {},
    }).select('*').single();
    if (error) throw error;
    this._kidId = kid.id;
    await this.pushEvents(); await this.pushTrust(); await this.pushCovenant();
    await this.pushPledges(); await this.pushProposals(); await this.pushPledgeLog();   // #4
    await this.pushLedgerMigrate();   // 訪客期間的購買帳本(insert-only 遷入,永不 delete)
    this._lastSyncHash = this.syncHash();
  }
  // items 主檔(family 共享):空表就 seed 內建示範品 + 遷入本機自建商品;
  // 非空表則以雲端為準,但「補種缺漏的內建品」(如②外觀 c_hat*/c_home*——既有 family 於①上線已 seed 過特權品,
  // 表非空,新內建品若不補種就永遠不會上雲)。補種只 insert 缺的 builtin id,不動家長自建品、不覆蓋既有列;idempotent。
  async cloudLoadItems(familyId) {
    try {
      let { data, error } = await this._supa.from('items').select('*').eq('family_id', familyId).order('created_at');
      if (error) throw error;
      if (!data || !data.length) {                                   // 首次:seed 全部 + 遷入本機 state.items
        const seedRows = (this.state.items || []).map(it => this._itemRow(it, familyId));
        if (seedRows.length) { const { error: ie } = await this._supa.from('items').insert(seedRows); if (ie) throw ie; }
        const r2 = await this._supa.from('items').select('*').eq('family_id', familyId).order('created_at');
        data = r2.data || [];
      } else {                                                       // 非空:補種缺漏的內建品(只補 DEFAULT_ITEMS 的 builtin id)
        const missIds = new Set(missingBuiltinIds(data.map(r => r.id)));
        const missing = DEFAULT_ITEMS.filter(d => missIds.has(d.id)).map(d => this._itemRow(d, familyId));
        if (missing.length) {
          // upsert + ignoreDuplicates:只插缺漏,既有列一律不覆蓋;兼防多裝置同時登入的競態(重複 id 直接略過)
          const { error: me } = await this._supa.from('items').upsert(missing, { onConflict: 'id', ignoreDuplicates: true }); if (me) throw me;
          const r3 = await this._supa.from('items').select('*').eq('family_id', familyId).order('created_at');
          data = r3.data || data;
        }
      }
      this.setState({ items: data.map(r => this._itemFromRow(r)) });
    } catch (e) { /* 讀不到就沿用本機 seed;不擋登入 */ }
  }
  _itemRow(it, familyId) {   // state → DB 列
    return { id: it.id, family_id: familyId, name: it.name, cost: it.cost || 0, icon: it.icon || 'i-gift',
      grad: it.g || 'magenta', unlock_rank: (it.unlockRank != null ? it.unlockRank : null), builtin: !!it.builtin,
      proposed: !!it.proposed, active: it.active !== false, pending: it.pending || null,
      category: it.category || 'privilege', slot: it.slot || null, art: it.art || null };   // ②外觀分類
  }
  _itemFromRow(r) {   // DB 列 → state(可見性一律由 active 決定,不另存 delisted)
    return { id: r.id, name: r.name, cost: r.cost || 0, icon: r.icon || 'i-gift', g: r.grad || 'magenta',
      unlockRank: (r.unlock_rank != null ? r.unlock_rank : null), builtin: !!r.builtin, proposed: !!r.proposed,
      active: r.active !== false, pending: r.pending || undefined, createdAt: r.created_at,
      category: r.category || 'privilege', slot: r.slot || undefined, art: r.art || undefined };   // ②外觀分類
  }
  // 自訂任務目錄(family 共享;鏡像 cloudLoadItems,但內建任務留在 LIB code、不下 DB → 不需 missingBuiltinIds 補種)。
  // 必須先於 cloudLoad 執行:cloudLoad 還原打卡 label/icon 時要能在 catalog 查到自訂任務。
  async cloudLoadCustomTasks(familyId) {
    try {
      let { data, error } = await this._supa.from('custom_tasks').select('*').eq('family_id', familyId).order('created_at');
      if (error) throw error;
      if (!data || !data.length) {                                 // 首次:把本機(訪客期)自訂任務遷上雲(需合法 kidId 才插得進,FK/not-null)
        const seedRows = (this.state.customTasks || []).map(t => this._customTaskRow(t, familyId)).filter(r => r.kid_id);
        if (seedRows.length) { const { error: ie } = await this._supa.from('custom_tasks').insert(seedRows); if (ie) throw ie; }
        const r2 = await this._supa.from('custom_tasks').select('*').eq('family_id', familyId).order('created_at');
        data = r2.data || [];
      }
      this.setState({ customTasks: data.map(r => this._customTaskFromRow(r)) });
    } catch (e) { /* 讀不到就沿用本機;不擋登入 */ }
  }
  _customTaskRow(t, familyId) {   // state → DB 列
    return { id: t.id, family_id: familyId, kid_id: t.kidId || null, label: t.label, sub: t.sub || null,
      coin: t.coin || 0, xp: (t.xp != null ? t.xp : Math.round((t.coin || 0) * 0.75)), icon: t.icon || 'i-spark',
      dom: t.dom || '自訂', dom_color: t.domColor || 'teal', where_at: t.where || 'anywhere',
      unlock_rank: (t.unlockRank != null ? t.unlockRank : null), proposed: !!t.proposed, active: t.active !== false };
  }
  _customTaskFromRow(r) {   // DB 列 → state(type 恆 'task';啟用歸屬走 kidId,非 taskOn)
    return { id: r.id, type: 'task', label: r.label, sub: r.sub || '', coin: r.coin || 0,
      xp: (r.xp != null ? r.xp : Math.round((r.coin || 0) * 0.75)), icon: r.icon || 'i-spark',
      dom: r.dom || '自訂', domColor: r.dom_color || 'teal', where: r.where_at || 'anywhere',
      unlockRank: (r.unlock_rank != null ? r.unlock_rank : null), proposed: !!r.proposed,
      active: r.active !== false, kidId: r.kid_id || null, createdAt: r.created_at };
  }
  async cloudLoad(kid) {
    this._kidId = kid.id;
    const res = await Promise.all([
      this._supa.from('checkin_events').select('*').eq('kid_id', kid.id),
      this._supa.from('trust_levels').select('*').eq('kid_id', kid.id),
      this._supa.from('covenant').select('*').eq('family_id', this._familyId).maybeSingle(),
      this._supa.from('proposals').select('*').eq('kid_id', kid.id),        // #4:提案 per-kid
      this._supa.from('pledges').select('*').eq('family_id', this._familyId),   // #4:承諾 family 共用
      this._supa.from('pledge_log').select('*').eq('family_id', this._familyId),
      this._supa.from('ledger_events').select('*').eq('kid_id', kid.id),    // 金幣/道具帳本 per-kid
    ]);
    const evs = res[0].data || [], tl = res[1].data || [], cov = res[2].data || null;
    const cProps = res[3].data || [], cPledges = res[4].data || [], cPlog = res[5].data || [];
    const cLedger = res[6].data || [];
    const ledgerEvents = cLedger.map(r => ({ id: r.id, kind: r.kind, itemId: r.item_id, amount: r.amount, qty: r.qty, ts: r.ts ? Date.parse(r.ts) : Date.now(), date: r.date }));
    const proposals = cProps.map(r => ({ id: r.id, text: r.text, reason: r.reason || '', at: r.at ? String(r.at).slice(0, 10) : '', status: r.status || 'pending', kind: r.kind || 'covenant' }));   // kind 讀回:舊列 null → 'covenant'(行為不變);task/reward 提案的 kind 才不會在雲端往返後掉光
    const pledges = cPledges.map(r => ({ id: r.id, text: r.text }));
    const pledgeDone = {}; cPlog.forEach(r => { if (r.done) pledgeDone[r.pledge_id + '::' + String(r.date).slice(0, 10)] = true; });
    const cat = LIB.concat(this.state.customTasks || []);   // catalog:自訂任務打卡的 label/icon 也要能還原(cloudLoadCustomTasks 已先於本函式執行)
    const checkinEvents = evs.map(r => { const lib = cat.find(x => x.id === r.behavior_id) || {}; return {
      id: r.behavior_id + '-' + r.date, behaviorId: r.behavior_id, label: lib.label || r.behavior_id, icon: lib.icon || 'i-check',
      kind: r.kind, coin: r.coin, xp: r.xp, honest: !!r.honest, missReason: r.miss_reason || null,
      ts: r.ts ? Date.parse(r.ts) : Date.now(), date: r.date, verdict: r.verdict }; });
    // #2:從 trust_levels 的 t_score/level 種一筆 checkpoint 當信任基線(雲端為準,避免 60 天窗蒸發)
    const graduatedAt = {}, scores = {};
    tl.forEach(r => { scores[r.behavior_id] = { t: (typeof r.t_score === 'number') ? r.t_score : 0, level: r.level || 0 };
      if (r.graduated_at) graduatedAt[r.behavior_id] = String(r.graduated_at).slice(0, 10); });
    const seeded = Object.keys(scores).length ? [{ type: 'trust_checkpoint', date: (this.state.lastDate || ymd(new Date())), ts: Date.now(), scores }] : [];
    this._hydrating = true;
    this.setState(st => {
      const gs = Number.isInteger(kid.graduation_stage) ? kid.graduation_stage : (st.graduationStage || 0);
      const base = cov ? { version: cov.version || st.covenant.version,
        terms: Array.isArray(cov.terms) ? cov.terms : st.covenant.terms,
        schedules: (cov.schedules && Object.keys(cov.schedules).length) ? cov.schedules : st.covenant.schedules,
        signatures: (cov.signatures && Object.keys(cov.signatures).length) ? cov.signatures : st.covenant.signatures,
        history: Array.isArray(cov.history) ? cov.history : (st.covenant.history || []),
        nfcTokens: Array.isArray(cov.nfc_tokens) ? cov.nfc_tokens : (st.covenant.nfcTokens || []) } : {};
      const covenant = { ...st.covenant, ...base, proposals, pledges };   // #4:提案/承諾以雲端為準
      const allEvents = [...checkinEvents, ...seeded];
      return { coins: deriveCoins(allEvents, ledgerEvents), xp: kid.xp || 0, streak: kid.streak || 0, graduationStage: gs,   // 金幣以事件推導為準,不讀 kid.coins 快取
        taskOn: (kid.task_on && Object.keys(kid.task_on).length) ? kid.task_on : st.taskOn,
        equipped: (kid.equipped && typeof kid.equipped === 'object') ? kid.equipped : {},   // ②外觀:穿戴快取(per-kid,雲端為準)
        manualUnlock: kid.manual_unlock || {}, checkinEvents: allEvents, ledgerEvents, graduatedAt, covenant, pledgeDone };
    }, () => { this._hydrating = false; this._lastSyncHash = this.syncHash(); });
  }
  async pushKid() {
    const S = this.state;
    const { error } = await this._supa.from('kids').update({ coins: deriveCoins(S.checkinEvents, S.ledgerEvents), xp: S.xp || 0, streak: S.streak || 0,   // coins 只是顯示快取,寫入推導值
      graduation_stage: S.graduationStage || 0, task_on: S.taskOn || {}, manual_unlock: S.manualUnlock || {},
      equipped: S.equipped || {},   // ②外觀:穿戴快取(per-kid)
      schedules: (S.covenant && S.covenant.schedules) || {} }).eq('id', this._kidId);
    if (error) throw error;
  }
  // items 主檔(family 共享,可變目錄):upsert 全量;刪除由 delCustomShop 直接打 DB
  async pushItems() {
    const rows = (this.state.items || []).map(it => this._itemRow(it, this._familyId));
    if (!rows.length) return;
    const { error } = await this._supa.from('items').upsert(rows, { onConflict: 'id' }); if (error) throw error;
  }
  // 自訂任務目錄(family 共享):upsert 全量。只推有合法 kidId 的列(FK/not-null)。啟用歸屬走 kid_id,不經 task_on。
  async pushCustomTasks() {
    const rows = (this.state.customTasks || []).map(t => this._customTaskRow(t, this._familyId)).filter(r => r.kid_id);
    if (!rows.length) return;
    const { error } = await this._supa.from('custom_tasks').upsert(rows, { onConflict: 'id' }); if (error) throw error;
  }
  // ledger_events 遷移:訪客期間本機累積的帳本一次性 insert 上雲(append-only,永不 delete)
  async pushLedgerMigrate() {
    const kid = this._kidId, fam = this._familyId;
    const rows = (this.state.ledgerEvents || []).map(l => ({ family_id: fam, kid_id: kid, kind: l.kind, item_id: l.itemId || null,
      amount: (l.amount != null ? l.amount : null), qty: (l.qty != null ? l.qty : null),
      date: l.date, ts: l.ts ? new Date(l.ts).toISOString() : new Date().toISOString() }));
    if (rows.length) { const { error } = await this._supa.from('ledger_events').insert(rows); if (error) throw error; }
  }
  async pushEvents() {
    const kid = this._kidId, fam = this._familyId;
    await this._supa.from('checkin_events').delete().eq('kid_id', kid);
    const rows = (this.state.checkinEvents || []).filter(e => e.behaviorId && e.type !== 'trust_checkpoint' && e.type !== 'session').map(e => ({ family_id: fam, kid_id: kid, behavior_id: e.behaviorId,
      kind: e.kind, coin: e.coin || 0, xp: e.xp || 0, honest: !!e.honest, miss_reason: e.missReason || null,
      verdict: e.verdict, date: e.date, ts: e.ts ? new Date(e.ts).toISOString() : new Date().toISOString() }));
    if (rows.length) { const { error } = await this._supa.from('checkin_events').insert(rows); if (error) throw error; }
  }
  async pushTrust() {
    const kid = this._kidId, fam = this._familyId, S = this.state, today = S.lastDate || ymd(new Date());
    const rows = [];
    LIB.forEach(t => {
      const T = trustScoreOf(S.checkinEvents, t.id, today), lvl = trustLiveLevel(S.checkinEvents, t.id, today);
      const grad = (S.graduatedAt && S.graduatedAt[t.id]) || null;
      if (T > 0 || lvl > 0 || grad) rows.push({ family_id: fam, kid_id: kid, behavior_id: t.id, level: lvl, t_score: T, graduated_at: grad });
    });
    if (rows.length) { const { error } = await this._supa.from('trust_levels').upsert(rows, { onConflict: 'kid_id,behavior_id' }); if (error) throw error; }
  }
  async pushCovenant() {
    const c = this.state.covenant;
    const { error } = await this._supa.from('covenant').upsert({ family_id: this._familyId, version: c.version,
      terms: c.terms || [], schedules: c.schedules || {}, signatures: c.signatures || {}, history: c.history || [],
      nfc_tokens: c.nfcTokens || [] }, { onConflict: 'family_id' });   // NFC token,family 共享(商城已移出至 items 主檔)
    if (error) throw error;
  }
  // #4:提案(per-kid)、承諾(family)、承諾打卡(family)
  async pushProposals() {
    const props = this.state.covenant.proposals || []; if (!props.length) return;
    const rows = props.map(p => ({ id: p.id, family_id: this._familyId, kid_id: this._kidId, text: p.text, reason: p.reason || null, status: p.status || 'pending', at: p.at || null, kind: p.kind }));   // kind 落庫(寫原值,不 ||'covenant':遺漏的 kind 以 null 現形、可揪出,不被靜靜洗成公約)。讀回在 cloudLoad 才 || 'covenant'
    const { error } = await this._supa.from('proposals').upsert(rows, { onConflict: 'id' }); if (error) throw error;
  }
  async pushPledges() {
    const plgs = this.state.covenant.pledges || []; if (!plgs.length) return;
    const rows = plgs.map(p => ({ id: p.id, family_id: this._familyId, text: p.text }));
    const { error } = await this._supa.from('pledges').upsert(rows, { onConflict: 'id' }); if (error) throw error;
  }
  async pushPledgeLog() {
    const pd = this.state.pledgeDone || {};
    const rows = Object.keys(pd).map(k => { const i = k.indexOf('::'); return { pledge_id: k.slice(0, i), family_id: this._familyId, date: k.slice(i + 2), done: !!pd[k] }; }).filter(r => r.pledge_id);
    if (!rows.length) return;
    const { error } = await this._supa.from('pledge_log').upsert(rows, { onConflict: 'pledge_id,date' }); if (error) throw error;
  }
  // #4:重試離線刪除的承諾(防復活),成功才移出 pendingDeletes
  async retryPendingDeletes() {
    const pd = this.state.pendingDeletes || []; if (!pd.length) return;
    const stillFail = [];
    for (const id of pd) { try { const { error } = await this._supa.from('pledges').delete().eq('id', id); if (error) stillFail.push(id); } catch (e) { stillFail.push(id); } }
    if (stillFail.length !== pd.length) this.setState({ pendingDeletes: stillFail });
  }
  async cloudSave() {
    if (!this._supa || !this._cloudReady || !this._kidId) return true;
    const h = this.syncHash();
    if (h === this._lastSyncHash) return true;    // 沒變 → 不打雲端(也避免 setState 迴圈)
    try {
      this.setState({ syncStatus: 'syncing' });
      await this.pushKid(); await this.pushTrust(); await this.pushCovenant(); await this.pushEvents();
      await this.pushPledges(); await this.pushProposals(); await this.pushPledgeLog();   // #4(承諾先於承諾打卡:FK)
      await this.pushItems();   // items 主檔(family 共享);ledger 走 RPC/append,不在此推
      await this.pushCustomTasks();   // 自訂任務目錄(family 共享)
      await this.retryPendingDeletes();
      this._lastSyncHash = h;
      this.setState({ syncStatus: 'ok' });
      return true;
    } catch (e) { this.setState({ syncStatus: 'error:' + ((e && e.message) || e) }); return false; }
  }
  // ===== 階段 3:多小孩(切換 / 新增)。每個小孩進度各自獨立、公約全家共用、絕不並排比較 =====
  openKidSwitch() {
    if (this.state.mode === 'parent') { this.setState({ kidSwitchOpen: true }); return; } // 家長已通過家長 PIN,可任意切換
    const cur = this.state.currentKidId;
    if (cur && !this._kidPin(cur)) { this._startKidPin('set', cur); return; } // 離開自己空間前先鎖住它(自己設,不需家長 PIN)
    this.setState({ kidSwitchOpen: true });
  }
  closeKidSwitch() { this.setState({ kidSwitchOpen: false, newKidName: '' }); }
  setNewKidName(e) { this.setState({ newKidName: e.target.value }); }
  setNewKidAvatar(a) { this.setState({ newKidAvatar: a }); }
  _kidPin(id) { return (this._kidPins || {})[id]; }
  _startKidPin(mode, target) { this._pinAttempts = 0; this.setState({ kidPinMode: mode, kidPinTarget: target, kidPinEntry: '', kidPinError: '', kidPinStage: 1, kidSwitchOpen: false }); }
  // 從切換清單選另一個孩子
  switchKid(id) {
    if (!this._supa || id === this.state.currentKidId) { this.setState({ kidSwitchOpen: false }); return; }
    if (this.state.mode === 'parent') { this.setState({ kidSwitchOpen: false }); this._doSwitch(id); return; } // 家長直接切
    if (this._kidPin(id)) this._startKidPin('enter', id);        // 有密碼 → 輸入
    else this._startKidPin('guard', id);                         // 沒密碼(替非本人設定)→ 先家長 PIN(防搶註)
  }
  // 實際切換:先存好目前孩子,再載入目標孩子
  async _doSwitch(id) {
    const ok = await this.cloudSave();
    if (!ok) { this.setState({ syncStatus: 'error:切換前存檔失敗,先不切換' }); return; }
    try {
      const { data: kid, error } = await this._supa.from('kids').select('*').eq('id', id).single();
      if (error) throw error;
      if (kid.pin) this._kidPins[id] = kid.pin;
      this._lastSyncHash = null;
      await this.cloudLoad(kid);
      this.setState({ currentKidId: id, kidSwitchOpen: false, syncStatus: 'ok' });
      try { localStorage.setItem('habitRank_kid', id); } catch (e) {}
    } catch (e) { this.setState({ syncStatus: 'error:' + ((e && e.message) || e) }); }
  }
  // 孩子端 PIN 鍵盤:guard(家長 PIN 放行去設定)/ set(輸兩次)/ enter(比對,連錯 5 次只收家長 PIN)
  kidPinPress(d) {
    const st = this.state; if (!st.kidPinMode || st.kidPinEntry.length >= 4) return;
    const e = st.kidPinEntry + d, target = st.kidPinTarget;
    if (e.length < 4) { this.setState({ kidPinEntry: e, kidPinError: '' }); return; }
    const out = kidPinEval(st.kidPinMode, st.kidPinStage, e, this._kidPinFirst, this._kidPin(target), this._readPin(), this._pinAttempts);
    if (out.r === 'toSet') { this.setState({ kidPinMode: 'set', kidPinEntry: '', kidPinStage: 1, kidPinError: '' }); }
    else if (out.r === 'setFirst') { this._kidPinFirst = e; this.setState({ kidPinEntry: '', kidPinStage: 2, kidPinError: '' }); }
    else if (out.r === 'setMismatch') { this.setState({ kidPinEntry: '', kidPinStage: 1, kidPinError: '兩次不一樣,重設一次' }); }
    else if (out.r === 'setDone') { this._saveKidPin(target, e); this._afterKidPinOk(target); }
    else if (out.r === 'switch') { this._pinAttempts = 0; this.setState({ kidPinMode: null, kidPinEntry: '' }); this._doSwitch(target); }
    else if (out.r === 'wrong') { this._pinAttempts = out.attempts; this.setState({ kidPinEntry: '', kidPinError: out.msg }); }
    else this.setState({ kidPinEntry: '', kidPinError: out.msg || '' });   // 'err'
  }
  kidPinDelete() { this.setState(st => ({ kidPinEntry: st.kidPinEntry.slice(0, -1), kidPinError: '' })); }
  kidPinCancel() { this._pinAttempts = 0; this.setState({ kidPinMode: null, kidPinTarget: null, kidPinEntry: '', kidPinStage: 1, kidPinError: '' }); }
  _afterKidPinOk(target) {
    this.setState({ kidPinMode: null, kidPinEntry: '', kidPinStage: 1, kidPinError: '' });
    if (target === this.state.currentKidId) this.setState({ kidSwitchOpen: true }); // 鎖好自己 → 開切換清單
    else this._doSwitch(target);                                                    // 幫他設好 → 切到他
  }
  _saveKidPin(id, pin) {
    this._kidPins = this._kidPins || {}; this._kidPins[id] = pin;
    this.setState(st => ({ kids: st.kids.map(k => k.id === id ? { ...k, hasPin: true } : k) }));
    if (this._supa) { try { this._supa.from('kids').update({ pin }).eq('id', id).then(() => {}, () => {}); } catch (e) {} }
  }
  resetKidPin(id) {                                              // 家長重設某孩子密碼(下次進要重設)
    this._kidPins = this._kidPins || {}; delete this._kidPins[id];
    this.setState(st => ({ kids: st.kids.map(k => k.id === id ? { ...k, hasPin: false } : k) }));
    if (this._supa) { try { this._supa.from('kids').update({ pin: null }).eq('id', id).then(() => {}, () => {}); } catch (e) {} }
  }
  async addKid() {
    const name = (this.state.newKidName || '').trim();
    if (!name || !this._supa || !this._familyId) return;
    const ok = await this.cloudSave();
    if (!ok) { this.setState({ syncStatus: 'error:新增前存檔失敗' }); return; }
    try {
      const { data: kid, error } = await this._supa.from('kids').insert({
        family_id: this._familyId, name, avatar: this.state.newKidAvatar || '🦊',
        coins: 0, xp: 0, streak: 0, graduation_stage: 0,
        task_on: { k1: true, k2: true, sc3: true, ld1: true, bd1: true, em1: true }, manual_unlock: {},
        schedules: (this.state.covenant && this.state.covenant.schedules) || {},
      }).select('*').single();
      if (error) throw error;
      this._lastSyncHash = null;
      await this.cloudLoad(kid);                        // 載入新小孩的乾淨狀態(公約仍是全家共用)
      this.setState(st => ({ kids: [...st.kids, { id: kid.id, name: kid.name, avatar: kid.avatar || '🦊' }],
        currentKidId: kid.id, kidSwitchOpen: false, newKidName: '', syncStatus: 'ok' }));
      try { localStorage.setItem('habitRank_kid', kid.id); } catch (e) {}
    } catch (e) { this.setState({ syncStatus: 'error:' + ((e && e.message) || e) }); }
  }
  async renameKid(id) {
    const cur = ((this.state.kids || []).find(k => k.id === id) || {}).name || '';
    const name = (typeof window !== 'undefined' && window.prompt) ? window.prompt('幫這個小孩改名字', cur) : null;
    if (name == null) return;
    const nm = name.trim(); if (!nm || !this._supa) return;
    try {
      const { error } = await this._supa.from('kids').update({ name: nm }).eq('id', id);
      if (error) throw error;
      this.setState(st => ({ kids: st.kids.map(k => k.id === id ? { ...k, name: nm } : k) }));
    } catch (e) { this.setState({ syncStatus: 'error:' + ((e && e.message) || e) }); }
  }
  // 換日結算:評估昨天的連續、重置當日完成狀態、套用新的一天預設模式
  rollover(st, today) {
    const s = { ...st };
    if (!s.lastDate) { s.lastDate = today; s.dayMode = defaultDayMode(today); return s; }
    if (s.lastDate === today) return s;
    const wasOut = s.dayMode === 'out';
    const success = wasOut || this.dayWasSuccessful(s);
    const gap = dayGap(s.lastDate, today);
    if (wasOut) { if (gap > 1) s.streak = 0; }          // 出門日保護連續(隔太多天仍中斷)
    else { s.streak = (gap === 1 && success) ? (s.streak || 0) + 1 : 0; }
    s.habit = {}; s.checked = {}; s.decided = {}; s.saved = false; s.fx = null; s.celebrate = false;
    s.checkinEvents = (s.checkinEvents || []).filter(e => dayGap(e.date, today) <= 60); // 事件保留 60 天(含 checkpoint)
    // #2 信任:每行為由事件推導 T;rollover 寫一筆 checkpoint(升級過地板才升、降級由 T,單次不跨兩級)
    const prevDay = s.lastDate;
    s.graduatedAt = { ...(s.graduatedAt || {}) };
    const scores = {};
    LIB.forEach(t => {
      const T = trustScoreOf(s.checkinEvents, t.id, prevDay);
      const rate = achieveRate30(s.checkinEvents, t.id, prevDay);
      const prevLevel = latestCkpt(s.checkinEvents, t.id).level;
      const level = nextCkptLevel(prevLevel, T, rate);
      if (level >= 2 && prevLevel < 2) { s.graduatedAt[t.id] = today; s.gradModal = t.id; } // 觸發畢業慶祝
      if (T > 0 || level > 0) scores[t.id] = { t: T, level };
    });
    if (Object.keys(scores).length) s.checkinEvents = [...s.checkinEvents, { type: 'trust_checkpoint', date: prevDay, ts: Date.now(), scores }];
    // Phase 2 保價:排程到期(今天 ≥ effAt)→ 套用(漲價換新價 / 下架標記),清 pending
    s.items = (s.items || []).map(x => {
      if (x.pending && dayGap(x.pending.effAt, today) <= 0) {
        const y = { ...x }; if (y.pending.type === 'price') y.cost = y.pending.newCost; if (y.pending.type === 'delist') { y.delisted = true; y.active = false; } delete y.pending; return y;
      }
      return x;
    });
    s.lastDate = today; s.dayMode = defaultDayMode(today);
    return s;
  }
  // 昨天算「成功」= 所有啟用的關鍵習慣當天都有打卡(未被退回)
  dayWasSuccessful(s) {
    const ah = LIB.filter(t => t.type === 'habit' && s.taskOn && s.taskOn[t.id]);
    if (!ah.length) return false;
    return ah.every(h => (s.checkinEvents || []).some(e => e.behaviorId === h.id && e.date === s.lastDate && e.verdict !== 'rejected'));
  }
  setDayMode(m) { this.setState({ dayMode: m }); }
  // append-only 打卡事件(階段 1 家長確認、未來 Supabase 都讀這條)
  appendCheckin(behaviorId, honest, verdict) {
    this.setState(st => ({ checkinEvents: [...(st.checkinEvents || []), { behaviorId, ts: ymd(new Date()), source: 'manual', honest: !!honest, verdict: verdict || 'pending' }] }));
  }
  // 匯出整份資料為 JSON 檔(手動備份)
  exportBackup() {
    try {
      const blob = new Blob([JSON.stringify(this.state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'habit-rank-backup-' + ymd(new Date()) + '.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {}
  }
  // 重新來過:清掉全部進度回到全新狀態(測試用)。清 localStorage 後重載,保證乾淨。
  resetAll() {
    if (typeof window === 'undefined') return;
    const loggedIn = !!(this._supa && this._cloudReady && this._kidId);
    const msg = loggedIn
      ? '確定要「重新來過」嗎?\n\n這會清空「目前這個小孩」在雲端的所有進度(金幣、XP、段位、打卡、信任),連同本機資料一起歸零,無法復原。\n(建議先「匯出備份」)'
      : '確定要「重新來過」嗎?\n\n這會清掉本機所有金幣、XP、段位、打卡紀錄、簽名,回到全新狀態,無法復原。\n(建議先「匯出備份」)';
    if (!window.confirm(msg)) return;
    const finish = () => {
      try { localStorage.removeItem('habitRank'); localStorage.removeItem('habitRank_backup_v1'); localStorage.removeItem('habitRank_pin'); localStorage.removeItem('habitRank_kid'); } catch (e) {}
      try { window.location.reload(); } catch (e) {}
    };
    if (loggedIn) { this._resetCloud().then(finish, finish); } else { finish(); } // 先清雲端再重載;失敗也重載(至少清本機)
  }
  // 清空目前小孩的雲端資料 + 家庭公約,讓重載後不會又被雲端蓋回舊資料
  async _resetCloud() {
    const kid = this._kidId, fam = this._familyId;
    this._cloudReady = false;  // 停止背景鏡像,避免清完又被推回
    try { await this._supa.from('checkin_events').delete().eq('kid_id', kid); } catch (e) {}
    // 帳本永不 delete:「重新來過」= append 一筆 ledger_reset 盤點事件(推導從它之後起算,舊帳保留可稽核)
    try { await this._supa.from('ledger_events').insert({ family_id: fam, kid_id: kid, kind: 'ledger_reset', item_id: null, amount: null, qty: null, date: ymd(new Date()), ts: new Date().toISOString() }); } catch (e) {}
    try { await this._supa.from('trust_levels').delete().eq('kid_id', kid); } catch (e) {}
    try { await this._supa.from('kids').update({ coins: 0, xp: 0, streak: 0, graduation_stage: 0, task_on: { k1: true, k2: true, sc3: true, ld1: true, bd1: true, em1: true }, manual_unlock: {} }).eq('id', kid); } catch (e) {}
    try { await this._supa.from('covenant').delete().eq('family_id', fam); } catch (e) {}
    try { await this._supa.from('proposals').delete().eq('kid_id', kid); } catch (e) {}   // #4
    try { await this._supa.from('pledges').delete().eq('family_id', fam); } catch (e) {}   // pledge_log 連帶 cascade
  }
  // 衝動延遲:練習「先暫停」的肌肉
  startPause() { this.setState({ pausing: true }); }
  resistImpulse() { this.setState(st => ({ pausing: false, pauses: (st.pauses || 0) + 1 })); }
  cancelPause() { this.setState({ pausing: false }); }
  renderVals() {
    const S = this.state, ACC = '#5b5bd6', GRAD = 'linear-gradient(135deg,#6d6df0,#5b5bd6)';
    const curKid = (S.kids || []).find(k => k.id === S.currentKidId) || null; // 階段 3:目前檢視的小孩
    // ===== NFC 打卡畫面(衍生)=====
    const nfcR = S.nfcToken ? nfcResolve({ token: S.nfcToken, tokens: (S.covenant && S.covenant.nfcTokens) || [], session: S.session, guestMode: S.guestMode, deviceMode: S.deviceMode, currentKidId: S.currentKidId, events: S.checkinEvents, today: S.lastDate }) : null;
    const nfcTok = nfcR ? nfcR.tok : null, nfcSt = nfcR ? nfcR.state : null;
    const nfcEvt = nfcTok ? todayEventOf(S.checkinEvents, nfcTok.behaviorId, S.lastDate) : null;
    const nfcTime = (nfcEvt && nfcEvt.ts) ? new Date(nfcEvt.ts).toTimeString().slice(0, 5) : '';
    const nfcKidNm = nfcTok ? (((S.kids || []).find(k => k.id === nfcTok.kidId) || {}).name || '那個孩子') : '';
    const nfcBehLbl = nfcTok ? ((LIB.find(x => x.id === nfcTok.behaviorId) || {}).label || '打卡') : '';
    const nfcTokens = (S.covenant && S.covenant.nfcTokens) || [];
    const grads = { indigo:'linear-gradient(150deg,#7b7bf0,#5b5bd6)', teal:'linear-gradient(150deg,#4fd0a8,#2fae8a)', amber:'linear-gradient(150deg,#f5c451,#e0a53a)', magenta:'linear-gradient(150deg,#f56bb8,#d23bd0)', sky:'linear-gradient(150deg,#5bb8f0,#3b8ee0)' };
    // 依家長啟用(taskOn)+ 今天模式(dayMode)決定當天實際顯示的任務。
    // 出門日只留「到哪都能做」的任務(where:anywhere)。
    const mode = S.dayMode || 'home';
    const TIER_XP = [0, 300, 800, 1800, 3500, 6000], TIER_NAMES = ['見習', '銅段', '銀段', '金段', '鑽石', '傳說'];
    const reached = TIER_XP.reduce((m, thr, i) => S.xp >= thr ? i : m, 0);
    // 任務解鎖:段位達到 unlockRank 才可用;家長可提前手動解鎖(manualUnlock)
    const available = (t) => (t.unlockRank || 0) <= reached || !!(S.manualUnlock && S.manualUnlock[t.id]);
    // 自訂任務啟用 = 該列 active 且 kidId===當前孩子(不走 taskOn,故 reset 掃不到);再套段位 available()。LIB 側維持 taskOn 過濾。
    const myCustomTasks = (S.customTasks || []).filter(t => t.active !== false && t.kidId === S.currentKidId);
    const activeLib = LIB.filter(t => S.taskOn[t.id] && available(t)).concat(myCustomTasks.filter(available));
    const dayPool = mode === 'out' ? activeLib.filter(t => t.where === 'anywhere') : activeLib;
    const today = S.lastDate || ymd(new Date());
    const check = React.createElement('svg', { style: { width: 15, height: 15 } }, React.createElement('use', { href: '#i-check' }));
    const clock = React.createElement('svg', { style: { width: 15, height: 15 } }, React.createElement('use', { href: '#i-hour' }));
    // 每個行為今天的事件(單一真相):done=非誠實打卡、miss=誠實回報沒做到
    const evOf = (id) => todayEventOf(S.checkinEvents, id, today);
    const habits = dayPool.filter(t => t.type === 'habit').map(h => {
      const tt = (mode !== 'out' && h.times) ? h.times[mode === 'school' ? 'school' : 'home'] : '';
      const desc = h.desc;
      const ev = evOf(h.id), miss = !!(ev && ev.honest), done = !!(ev && !ev.honest), credited = !!(ev && (ev.verdict === 'approved' || ev.verdict === 'auto'));
      const rejected = !!(ev && ev.verdict === 'rejected' && !ev.honest);
      return { key: h.id, label: h.label, desc, hasTime: !!tt, timeLabel: tt, reward: h.coin, xp: h.xp, icon: h.icon,
        idle: !ev || ev.verdict === 'rejected', submitted: done, miss, canUndo: done && ev.verdict === 'pending',
        rejected, canAppeal: rejected && !ev.appeal,   // 一次退回只給申訴一次
        subLabel: credited ? '已確認入帳 ✓' : '已送去給爸媽確認',
        subSub: credited ? ('+' + h.coin + '幣 已入帳') : ('+' + h.coin + '幣 待入帳'),
        onDone: () => this.submitCheckin({ id: h.id, label: h.label, icon: h.icon, kind: 'habit', coin: h.coin, xp: h.xp, honestyEligible: h.honestyEligible }),
        onMiss: () => this.markMiss({ id: h.id, label: h.label, icon: h.icon, kind: 'habit' }),
        onAppeal: () => this.appealReject(h.id) }; });
    const rowFor = (o, sub) => { const ev = evOf(o.id), pending = !!(ev && !ev.honest && ev.verdict === 'pending'), done = !!(ev && !ev.honest && (ev.verdict === 'approved' || ev.verdict === 'auto'));
      return { id: o.id, icon: o.icon, label: o.label, sub,
        rewardLabel: pending ? '待確認' : (done ? '已入帳 ✓' : ('+' + o.xp + 'XP · ' + o.coin + '幣')),
        boxBg: done ? ACC : (pending ? '#f6efe0' : 'transparent'), boxBorder: done ? ACC : (pending ? '#e0a53a' : '#cdd2df'),
        boxIcon: done ? check : (pending ? clock : ''),
        onToggle: () => this.submitCheckin({ id: o.id, label: o.label, icon: o.icon, kind: o.type, coin: o.coin, xp: o.xp, honestyEligible: o.honestyEligible }) }; };
    const dailyTasks = dayPool.filter(t => t.type === 'task').map(t => rowFor(t, t.sub));
    // 任務分頁 = 自己挑的任務池(只有任務,關鍵習慣留在今日頁)。picked=今天已挑(送出未退回)的數量
    const pickedCount = dayPool.filter(t => t.type === 'task').filter(t => { const ev = evOf(t.id); return ev && !ev.honest && ev.verdict !== 'rejected'; }).length;
    // ===== B2:彈性連續 —— 滾動 7 天,而非單一「連幾天」數字(防 what-the-hell effect)=====
    const daySuccess = (day) => { const ah = LIB.filter(t => t.type === 'habit' && S.taskOn[t.id]); return ah.length > 0 && ah.every(h => { const ev = todayEventOf(S.checkinEvents, h.id, day); return ev && !ev.honest && ev.verdict !== 'rejected'; }); };
    const dayHadActivity = (day) => (S.checkinEvents || []).some(e => e.date === day);
    const week7 = [];
    for (let d = 6; d >= 0; d--) {
      const day = dateMinus(today, d), isToday = d === 0, ok = daySuccess(day);
      let st2 = ok ? 'done' : (dayHadActivity(day) ? 'miss' : 'none');
      if (isToday && !ok) st2 = 'today';
      week7.push({ label: WEEKDAY_CN[parseYmd(day).getDay()].slice(1),
        bg: st2 === 'done' ? ACC : (st2 === 'miss' ? '#e9ecf3' : (st2 === 'today' ? '#fff' : '#f2f3f7')),
        ring: st2 === 'today' ? '0 0 0 2px #5b5bd6 inset' : 'none',
        mark: st2 === 'done' ? check : '', isToday });
    }
    const week7Done = week7.filter(c => c.mark).length;
    const week7Good = week7Done >= 6; // 滾動 7 天達成 ≥6 = 好狀態
    const jrDefs = [['見習','完全託管，先把節奏建立起來',0,'解鎖每日任務'],['銅段','每週 1 張排程券：一件該做的事，時間你自己決定',300,'排程券 ×1（每週）'],['銀段','週末彈性 +1 小時',800,'週末彈性 +1hr'],['金段','自己設定交機時間',1800,'自訂交機時間'],['鑽石','完全自主，家長只看週報',3500,'完全自主'],['傳說','自律大師 · 名人堂',6000,'名人堂徽章']];
    const sel = S.jrSel;
    // 今日分頁的段位進度卡:全部依目前 XP 動態計算
    const atMaxTier = reached >= jrDefs.length - 1;
    const curTier = jrDefs[reached], nextTier = jrDefs[Math.min(reached + 1, jrDefs.length - 1)];
    const rankPctNum = atMaxTier ? 100 : Math.max(0, Math.min(100, Math.round((S.xp - curTier[2]) / (nextTier[2] - curTier[2]) * 100)));
    const todayRank = {
      rankName: curTier[0], rankDesc: curTier[1],
      rankNextLabel: atMaxTier ? '已達最高段位' : ('距離「' + nextTier[0] + '」解鎖'),
      rankProg: atMaxTier ? 'MAX' : (S.xp + ' / ' + nextTier[2]),
      rankPct: rankPctNum + '%',
    };
    // 信任子系統(與段位脫鉤):每個關鍵習慣一條線,連續誠實 → 抽查 → 畢業
    const trackedHabits = LIB.filter(t => t.type === 'habit' && S.taskOn[t.id] && available(t));
    const trustLines = trackedHabits.map(h => {
      const T = trustScoreOf(S.checkinEvents, h.id, today), lvl = trustLiveLevel(S.checkinEvents, h.id, today), graduated = lvl >= 2;
      const need = CONFIG.trustThresholds[Math.min(lvl, 1)], rate = Math.round(achieveRate30(S.checkinEvents, h.id, today) * 100);
      const hstreak = honestStreakOf(S.checkinEvents, h.id, today);
      return { label: h.label, icon: h.icon, levelName: TRUST_NAMES[lvl], graduated,
        badgeBg: graduated ? '#eef0ff' : (lvl === 1 ? '#e8f6ef' : '#fbf3e2'), badgeColor: graduated ? '#4a4ac2' : (lvl === 1 ? '#2f8a6a' : '#9c6b16'),
        progLabel: graduated ? '已畢業 · 免驗證 · 點看證書 🎓' : ('信任分數 ' + Math.min(T, need) + ' / ' + need + ' → ' + TRUST_NAMES[lvl + 1]),
        progPct: graduated ? '100%' : (Math.min(100, Math.round(T / need * 100)) + '%'),
        rateLabel: '近30天達成率 ' + rate + '% · 誠實回報連續 ' + hstreak + ' 天', onView: () => graduated && this.openGrad(h.id) };
    });
    const gradCount = trustLines.filter(l => l.graduated).length, allGrad = trackedHabits.length > 0 && gradCount === trackedHabits.length;
    const trust = allGrad
      ? { level: '完全自主', desc: '所有關鍵習慣都畢業了 —— 這是你贏來的', icon: 'i-crown', color: '#5b5bd6', bg: '#eef0ff' }
      : gradCount > 0
      ? { level: gradCount + ' 條習慣已畢業', desc: '免驗證的習慣越來越多,繼續加油', icon: 'i-check', color: '#2f8a6a', bg: '#e8f6ef' }
      : { level: '建立信任中', desc: '連續誠實回報,逐步換到「免檢查」的自主權', icon: 'i-shield', color: '#e0a53a', bg: '#fbf3e2' };
    // ===== B1:畢業機制 —— app 的成功是「小孩不再需要它」 =====
    const gStage = S.graduationStage || 0, readyGrad = allGrad; // 所有關鍵習慣都畢業(trust 2)= 可畢業
    const gStageInfo = [
      { title: '準備畢業了 🎓', desc: '所有關鍵習慣都畢業了。可以開始降低 app 的存在感——它本來就是為了有一天用不到。', next: '開始每週回顧' },
      { title: '每週回顧', desc: '不用每天打卡了,改成每週日一起回顧就好。你已經自己在走。', next: '進到「只留公約」' },
      { title: '只留公約', desc: '連回顧都可以放下了,留著那張全家一起簽的約定就夠。', next: '完成畢業儀式' },
      { title: '已畢業 ✨', desc: '這個 app 完成任務了。自律已經是你的一部分,不再需要它提醒。', next: '' },
    ][gStage];
    // 歷程回顧資料
    const evAll2 = S.checkinEvents || [];
    const doneEv = evAll2.filter(e => !e.honest && (e.verdict === 'approved' || e.verdict === 'auto'));
    const honestEv = evAll2.filter(e => e.honest);
    const datesSorted = evAll2.map(e => e.date).sort();
    const retroGradList = Object.keys(S.graduatedAt || {}).map(id => { const t = LIB.find(x => x.id === id); return t ? { label: t.label, icon: t.icon, at: S.graduatedAt[id] } : null; }).filter(Boolean);
    const retroTiers = TIER_NAMES.map((nm, i) => ({ name: nm, reachedBg: i <= reached ? 'linear-gradient(150deg,#7b7bf0,#5b5bd6)' : '#eef0f6', reachedColor: i <= reached ? '#fff' : '#aab0c0', cur: i === reached }));
    const tiers = jrDefs.map((t, i) => { const stt = i < reached ? 'done' : (i === reached ? 'now' : 'lock'), lock = stt === 'lock', isSel = i === sel;
      return { name:t[0], thr: t[2] === 0 ? '起點' : (t[2] + ' XP'), reward:t[3], onSel: () => this.jrSel(i),
        nodeBg: lock ? '#e7eaf2' : 'linear-gradient(150deg,#7b7bf0,#5b5bd6)', nodeColor: lock ? '#aab0c0' : '#fff',
        icon: lock ? 'i-lock' : (stt === 'done' ? 'i-check' : 'i-medal'),
        cardBg: isSel ? '#eef0ff' : '#ffffff', cardBorder: isSel ? '#5b5bd6' : '#e7eaf2', nameColor: lock ? '#8890a3' : '#1a1f2e',
        ring: stt === 'now' ? '0 0 0 5px rgba(91,91,214,.18)' : 'none' }; });
    const selState = sel < reached ? 'done' : (sel === reached ? 'now' : 'lock');
    const jr = { tiers, selName: jrDefs[sel][0], selUnlock: jrDefs[sel][1], selReward: jrDefs[sel][3], nextName: jrDefs[Math.min(reached + 1, jrDefs.length - 1)][0],
      selIsSched: jrDefs[sel][0] === '銅段',   // 排程券說明卡入口只在銅段
      selBadge: selState === 'done' ? '已達成' : (selState === 'now' ? '進行中' : '未解鎖'), selBadgeBg: selState === 'lock' ? '#eef0f6' : '#eef0ff', selBadgeColor: selState === 'lock' ? '#8890a3' : '#4a4ac2' };
    // 商城鐵律:螢幕時間/裝置額度永不作為商品(Premack:被標價的東西會升值,與教養目標相反);
    // 社交需求不標價。示範資料一律為特權/體驗類。稀缺型角標(HOT/新)已移除,唯一角標=「你提案的」。
    // 商城 = items 主檔(內建示範 + 家長自建/孩子提案)未下架且上架中;段位鎖沿用 available()。金幣結餘 = 事件推導。
    const coinBal = deriveCoins(S.checkinEvents, S.ledgerEvents);
    const shopTab = (S.shopTab === 'bag' || S.shopTab === 'home') ? S.shopTab : 'shop';   // 商城 / 背包 / 家園
    const invMap = inventoryOf(S.ledgerEvents);   // 背包推導(shop 卡片判「已擁有」、家園衣櫥皆用)
    const eqView = cosmeticEquipped(S.equipped, S.items, S.ledgerEvents);   // ②穿戴合法性單一出口
    const activeItems = (S.items || []).filter(it => it.active !== false && !it.delisted);
    // Q4:同架同幣,但分兩組——特權/體驗在上、外觀/家園在下。外觀已擁有 → 按鈕灰「已擁有」(不重複購買)
    const mkCard = (it) => { const afford = coinBal >= it.cost, locked = !available(it);
      const owned = it.category === 'cosmetic' && invMap[it.id] > 0;
      const short = Math.max(0, it.cost - (coinBal || 0)), g = it.g || 'indigo';
      const pend = it.pending, announce = pend ? ('⏳ ' + (pend.effAt || '').slice(5) + ' 起 ' + (pend.type === 'delist' ? '下架' : '調整為 ' + pend.newCost + ' 幣')) : '';
      return { ...it, gradient: grads[g], costLabel: '' + it.cost, proposed: !!it.proposed, icon: it.icon || 'i-gift',
        hasArt: !!it.art, noArt: !it.art, art: it.art || '',
        locked, lockLabel: locked ? ('🔒 ' + TIER_NAMES[it.unlockRank || 0] + '解鎖') : '',
        hasAnnounce: !!announce, announce, owned,
        btnText: owned ? '已擁有' : (locked ? ('🔒 ' + TIER_NAMES[it.unlockRank || 0] + '解鎖') : (afford ? '購買' : '再存 ' + short + ' 幣')),
        btnBg: owned ? '#eef0ff' : (locked ? '#f2f3f7' : (afford ? GRAD : '#f2f3f7')), btnColor: owned ? '#8a8ac2' : (locked ? '#9098ab' : (afford ? '#fff' : '#8890a3')),
        showProg: !owned && !locked && !afford, progPct: Math.min(100, Math.round((coinBal || 0) / it.cost * 100)) + '%',
        onRedeem: () => { if (locked || owned) return; this.buy({ id: it.id, name: it.name, cost: it.cost, icon: it.icon || 'i-gift', gradient: grads[g] }); } }; };
    const shopPriv = activeItems.filter(it => (it.category || 'privilege') !== 'cosmetic').map(mkCard);
    const shopCosmetic = activeItems.filter(it => it.category === 'cosmetic').map(mkCard);
    const hasCosmeticShelf = shopCosmetic.length > 0;
    // 背包 = ledger_events 推導結餘(入包 item_acquire − 出包 item_consume),不建持有快照表。
    // 外觀道具不消耗:背包按鈕改為「穿上/脫下」(走 equip),特權道具維持「使用」(走 useItem 消耗)。
    const bag = Object.keys(invMap).filter(id => invMap[id] > 0).map(id => {
      const it = (S.items || []).find(x => x.id === id) || { name: id, icon: 'i-gift', g: 'indigo' };
      const isCos = it.category === 'cosmetic' && !!it.slot;
      const worn = isCos && eqView[it.slot] && eqView[it.slot].id === id;
      return { id, name: it.name, qty: invMap[id], qtyLabel: '×' + invMap[id], icon: it.icon || 'i-gift', gradient: grads[it.g || 'indigo'],
        hasArt: !!it.art, noArt: !it.art, art: it.art || '', isCosmetic: isCos, isPrivilege: !isCos,
        useLabel: worn ? '脫下' : '穿上',
        onUse: () => this.useItem(id), onEquip: () => this.equip(id) };
    });
    const bagEmpty = bag.length === 0;
    const bagTotal = bag.reduce((n, b) => n + b.qty, 0);
    // ②家園:靜態圖層疊加(家園背景 → 人物 avatar → 帽子)。穿戴一律讀 eqView(單一出口),不散落判斷。
    // 免費預設場景 DEFAULT_HOME:未購買任何 home 時的完整家園(獲得框架)——預設就是一個完整的家,
    // 購買外觀是錦上添花;絕不空白、不灰鎖、不出現「快去解鎖」文案(不做「沒買=家徒四壁」損失框架)。
    const homeHat = eqView.hat, homeScene = eqView.home || DEFAULT_HOME;
    const homeStage = {
      bg: grads[homeScene.g] || grads.sky,
      sceneArt: homeScene.art,   // 一律有場景(購買的 or 免費預設),模板不再有空白分支
      avatar: (curKid && curKid.avatar) || '🙂',
      hasHat: !!homeHat, hatArt: homeHat ? homeHat.art : '' };
    // 衣櫥:本波只上 hat + home 槽(outfit 槽保留、示範品下一波)。各列「擁有的」外觀,點選穿/脫。
    const wardrobeSlots = ['hat', 'home'].map(slot => {
      const owned = activeItems.filter(it => it.category === 'cosmetic' && it.slot === slot && invMap[it.id] > 0);
      return { slot, label: SLOT_LABEL[slot], hasItems: owned.length > 0,
        items: owned.map(it => { const worn = eqView[slot] && eqView[slot].id === it.id;
          return { id: it.id, name: it.name, art: it.art || '', worn,
            chipBg: worn ? '#eef0ff' : '#fff', chipBorder: worn ? '#5b5bd6' : '#e7eaf2',
            wornLabel: worn ? '穿戴中' : '穿上', onTap: () => this.equip(it.id) }; }) };
    });
    const wardrobeEmpty = wardrobeSlots.every(s => !s.hasItems);
    const recPat = ['d','d','d','h','d','d','d','d','d','h','d','d','m','d','d','d','d','d','h','d','d','d','d','d','d','h','now','future'];
    const recMap = { d:{ bg:ACC, color:'#fff', ico:'i-check' }, h:{ bg:'#f6efe0', color:'#cf9a2f', ico:'i-heart' }, m:{ bg:'#eef0f6', color:'#aab0c0', ico:'i-close' }, now:{ bg:'#fff', color:'#5b5bd6', ico:'', ring:true }, future:{ bg:'#e9ecf3', color:'#c2c8d6', ico:'' } };
    const recCells = recPat.map(k => { const m = recMap[k]; return { bg: m.bg, color: m.color, ico: m.ico || 'i-check', hasIco: !!m.ico, ringShadow: m.ring ? '0 0 0 2px #5b5bd6 inset' : 'none' }; });
    const rec = { cells: recCells, doneN: recPat.filter(x => x === 'd').length, honestN: recPat.filter(x => x === 'h').length };
    // 家長待確認:真實的 pending 打卡事件(小孩送出的)
    const nowMs = Date.now();
    const pendingEvents = (S.checkinEvents || []).filter(e => e.verdict === 'pending');
    const pItems = pendingEvents.map(e => ({ id: e.id, label: e.label, reward: e.coin, icon: e.icon, kind: e.kind,
      note: (e.kind === 'habit' ? '關鍵習慣' : '每日任務') + (e.honest ? ' · 誠實回報' : '') + (e.appeal ? ' · 🙋 申訴,請再看' : ''), wait: true, ok: false, no: false,
      hasSrc: !!e.source, srcLabel: e.source === 'nfc' ? '📟 NFC 打卡' : (e.source === 'qr' ? '📷 QR 打卡' : ''),   // 來源佐證:手機曾物理接觸打卡點
      onOk: () => this.confirmCheckin(e.id, true), onNo: () => this.askReject(e.id) }));   // #2:退回走二次確認
    const pWait = pItems.length;
    // 收件匣分區:待確認打卡(關鍵習慣)/ 待確認任務(每日任務)。申訴第二波暫混在打卡區(note 標「🙋 申訴」)
    const pHabitItems = pItems.filter(it => it.kind === 'habit');
    const pTaskItems = pItems.filter(it => it.kind === 'task');
    // #2:今天被退回的項目 → 家長可「撤回退回(看錯了)」。看「該行為當天最新事件」是否 rejected(更正後最新變 approved → 自動消失)
    const rejectedItems = []; const seenRej = {};
    (S.checkinEvents || []).forEach(e => {
      if (!e.behaviorId || e.date !== today || e.type === 'trust_checkpoint' || seenRej[e.behaviorId]) return;
      seenRej[e.behaviorId] = true;
      const latest = todayEventOf(S.checkinEvents, e.behaviorId, today);
      if (latest && latest.verdict === 'rejected' && !latest.honest) {
        const lib = LIB.find(x => x.id === e.behaviorId) || {};
        rejectedItems.push({ label: latest.label || lib.label, icon: latest.icon || lib.icon, onUndo: () => this.undoReject(e.behaviorId, today) });
      }
    });
    const pendingProps = (S.covenant.proposals || []).filter(p => p.status === 'pending').length;
    const inboxEmpty = pWait === 0 && pendingProps === 0 && rejectedItems.length === 0; // 四區全空 → 空狀態
    const kidDailyCoin = dailyCoinAvg(S.checkinEvents, today);   // A1-補:近14天日均 coin,換算提案開價相當幾天收入
    // 商城 CRUD(家長端):items 主檔拆兩區——內建示範品(可上/下架)與 自建/孩子提案(完整 CRUD)
    const builtinItems = (S.items || []).filter(it => it.builtin);
    const customItems = (S.items || []).filter(it => !it.builtin);
    const pRewards = builtinItems.map(it => { const on = it.active !== false && !it.delisted; return { id: it.id, name: it.name, cost: it.cost + '', iconHref: it.icon || 'i-gift', gradient: grads[it.g || 'indigo'], onToggle: () => this.toggleItemActive(it.id), tgLabel: on ? '上架中' : '已下架', tgBg: on ? '#eef0ff' : '#f2f3f7', tgColor: on ? '#4a4ac2' : '#9098ab', tgDot: on ? '#5b5bd6' : '#c2c8d6' }; });
    const pCustomShop = customItems.map(it => ({ id: it.id, name: it.name, costLabel: it.cost + ' 幣', desc: it.desc || '', hasDesc: !!it.desc,
      proposed: !!it.proposed, delisted: !!it.delisted,
      rankLabel: (it.unlockRank != null ? TIER_NAMES[it.unlockRank] + '專屬' : ''), hasRank: it.unlockRank != null,
      hasPending: !!it.pending, pendingLabel: it.pending ? ('排程 ' + (it.pending.effAt || '').slice(5) + ' 起 ' + (it.pending.type === 'delist' ? '下架' : '調整為 ' + it.pending.newCost + ' 幣') + ' · 可取消') : '',
      onEdit: () => this.openShopForm(it), onDelist: () => this.scheduleDelist(it.id), onCancel: () => this.cancelSchedule(it.id), onDel: () => this.delCustomShop(it.id) }));
    const sfCostNum = parseInt((S.sfCost || '').replace(/[^0-9]/g, ''), 10) || 0;
    const sfDays = (sfCostNum > 0 && kidDailyCoin > 0) ? Math.round(sfCostNum / kidDailyCoin * 10) / 10 : null;
    const sfBand = rewardPriceBand(sfDays), sfFlag = shopRuleFlag(S.sfName);
    // 採納微調表單的定價輔助
    const afIsReward2 = !!(S.approveForm && S.approveForm.kind === 'reward');
    const afCostNum = parseInt(((S.approveForm && S.approveForm.bounty) || '').replace(/[^0-9]/g, ''), 10) || 0;
    const afDays = (afCostNum > 0 && kidDailyCoin > 0) ? Math.round(afCostNum / kidDailyCoin * 10) / 10 : null;
    const afBandObj = afIsReward2 ? rewardPriceBand(afDays) : (afCostNum > 0 ? taskPriceBand(afCostNum) : null);
    const afFlagStr = afIsReward2 ? shopRuleFlag((S.approveForm && S.approveForm.name) || '') : null;
    const nudgeCount = pendingEvents.filter(e => (nowMs - e.ts) > 24 * 3600000).length;
    const wr = weeklyReport(S.checkinEvents, today, S.taskOn); // B6:真實週報 + 一句話
    const probe = dataProbe(S.checkinEvents, today); // #3:反向指標數據自查
    // 家長任務管理:任務庫全部列出。鎖定的顯示解鎖段位,家長可提前解鎖(家長最大)
    const pTasks = LIB.map(t => { const on = !!S.taskOn[t.id], locked = !available(t);
      const rt = '+' + t.xp + 'XP · ' + t.coin + '幣';
      return { id: t.id, name: t.label, iconHref: t.icon, gradient: locked ? 'linear-gradient(150deg,#c9cdda,#aab0c0)' : (grads[t.domColor] || grads.indigo),
        cost: t.dom + ' · ' + rt + (locked ? ' · 🔒 ' + TIER_NAMES[t.unlockRank] + '解鎖' : ''),
        onToggle: () => locked ? this.unlockTask(t.id) : this.toggleTaskOn(t.id),
        tgLabel: locked ? '提前解鎖' : (on ? '啟用中' : '已停用'),
        tgBg: locked ? '#fbf3e2' : (on ? '#eef0ff' : '#f2f3f7'), tgColor: locked ? '#9c6b16' : (on ? '#4a4ac2' : '#9098ab'), tgDot: locked ? '#e0a53a' : (on ? '#5b5bd6' : '#c2c8d6') }; });
    const colors = ['#5b5bd6','#7b7bf0','#35b28a','#cf9a2f','#e0a53a'];
    const confetti = Array.from({ length: 16 }, (_, i) => ({ left: (5 + i * 5.7) + '%', delay: ((i % 6) * 0.11) + 's', dur: (1.1 + (i % 4) * 0.28) + 's', color: colors[i % colors.length], size: (7 + (i % 3) * 3) + 'px' }));
    // 畢業證書
    const gradItem = S.gradModal ? LIB.find(t => t.id === S.gradModal) : null;
    const gradDays = S.gradModal ? new Set((S.checkinEvents || []).filter(e => e.behaviorId === S.gradModal && e.verdict !== 'rejected').map(e => e.date)).size : 0;
    const gradCert = { show: S.mode === 'kid' && !!gradItem, name: gradItem ? gradItem.label : '', icon: gradItem ? gradItem.icon : 'i-crown',
      date: gradItem ? (S.graduatedAt[S.gradModal] || today) : '', days: gradDays, onClose: () => this.closeGrad() };
    // B8:核心習慣數量(啟用中的 type:'habit'),> 7 顯示警告
    const coreHabitsAll = LIB.filter(t => t.type === 'habit' && S.taskOn[t.id]);
    const coreHabitCount = coreHabitsAll.length;
    const coreHabitList = coreHabitsAll.map(h => ({ label: h.label, icon: h.icon, meta: h.dom + ' · +' + h.xp + 'XP · ' + h.coin + '幣' }));
    const K = S.kTab, isKid = S.mode === 'kid';
    return {
      isKid, isParent: S.mode === 'parent', toKid: () => this.goKid(), toParent: () => this.enterParent(),
      isKidDevice: S.deviceMode === 'kid', notKidDevice: S.deviceMode !== 'kid',
      // 家長 PIN 關卡(標題/副標依用途 pinGoal)
      showPinGate: !!S.pinMode, pinIsEnter: S.pinMode === 'enter', pinIsSet: S.pinMode === 'set',
      pinTitle: S.pinMode === 'enter' ? (S.pinGoal === 'device-kid' ? '確認家長 PIN' : '輸入家長 PIN') : (S.pinStage === 2 ? '再輸入一次確認' : '設定家長 PIN'),
      pinSubtitle: (function () {
        if (S.pinGoal === 'device-kid') return S.pinMode === 'enter' ? '設為孩子裝置前,請家長確認身分。' : (S.pinStage === 2 ? '確認一下,避免打錯。' : '這個家庭還沒有家長 PIN,先設一組(之後切回家長模式用)。');
        if (S.pinGoal === 'device-parent') return '切回家長模式 —— 請輸入家長 PIN。';
        return S.pinMode === 'enter' ? '只有家長進得來——批准打卡、改任務、看週報。' : (S.pinStage === 2 ? '確認一下,避免打錯。' : '第一次進家長,先設一組 4 位數 PIN。小孩不知道就進不來。'); })(),
      pinDots: [0, 1, 2, 3].map(i => ({ dotBg: i < S.pinEntry.length ? '#fff' : 'transparent' })),
      pinError: S.pinError, hasPinError: !!S.pinError,
      pinKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'blank', '0', 'del'].map(k => ({
        label: k === 'del' ? '⌫' : (k === 'blank' ? '' : k),
        keyBg: k === 'blank' ? 'transparent' : 'rgba(255,255,255,.18)',
        onPress: k === 'del' ? (() => this.pinDelete()) : (k === 'blank' ? (() => {}) : (() => this.pinPress(k))) })),
      onPinCancel: () => this.pinCancel(),
      // 裝置精靈 + 版本號長按(切回家長)
      showDeviceRole: S.deviceStep === 'role', showDeviceKidPick: S.deviceStep === 'kidpick',
      onDeviceParent: () => this.chooseDeviceRole('parent'), onDeviceKid: () => this.chooseDeviceRole('kid'),
      deviceKidList: (S.kids || []).map(k => ({ name: k.name, avatar: k.avatar || '🦊', onPick: () => this.pickDeviceKid(k.id) })),
      onVerDown: () => this.verPressStart(), onVerUp: () => this.verPressEnd(),
      // 階段 1:登入閘門
      showAuthLoading: !S.supaOff && !S.guestMode && !S.authReady,
      showLogin: !S.supaOff && !S.guestMode && S.authReady && !S.session,
      authEmail: S.authEmail, authSent: S.authSent, notAuthSent: !S.authSent, authError: S.authError, hasAuthError: !!S.authError,
      onAuthEmail: (e) => this.setAuthEmail(e), onSendMagic: () => this.sendMagicLink(), onSkipLogin: () => this.skipLogin(),
      loggedIn: !!S.session, sessionEmail: S.session ? S.session.email : '', onSignOut: () => this.signOut(),
      // 階段 3:多小孩切換
      kidSwitchable: !!S.session && (S.kids || []).length >= 1, notKidSwitchable: !(!!S.session && (S.kids || []).length >= 1),
      // 家長裝置純家長模式:移除「小孩」切換鈕 + 頂部下拉(改靜態);孩子選擇改走週報詳情
      showKidToggle: S.deviceMode !== 'parent',
      parentSwitcher: (!!S.session && (S.kids || []).length >= 1) && S.deviceMode !== 'parent',
      parentSwitcherStatic: !((!!S.session && (S.kids || []).length >= 1) && S.deviceMode !== 'parent'),
      // 唯讀檢視模式
      preview: !!S.preview, notPreview: !S.preview, onExitPreview: () => this.exitPreview(),
      onEnterPreview: () => this.enterPreview(), previewClass: S.preview ? 'previewing' : '',
      currentKidName: (curKid && curKid.name) || '小孩', currentKidAvatar: (curKid && curKid.avatar) || '🙂',
      kidSwitchOpen: !!S.kidSwitchOpen, onOpenKidSwitch: () => this.openKidSwitch(), onCloseKidSwitch: () => this.closeKidSwitch(),
      kidList: (S.kids || []).map(k => ({ id: k.id, name: k.name, avatar: k.avatar || '🦊', isCurrent: k.id === S.currentKidId,
        rowBg: k.id === S.currentKidId ? '#eef0ff' : '#fff', rowBorder: k.id === S.currentKidId ? '#5b5bd6' : '#e7eaf2',
        canReset: S.mode === 'parent' && !!k.hasPin, onResetPin: () => this.resetKidPin(k.id),   // 家長端可重設孩子密碼
        onPick: () => this.switchKid(k.id), onRename: () => this.renameKid(k.id) })),
      // 孩子端身分保護:PIN 閘門
      showKidPinGate: !!S.kidPinMode,
      kidPinTitle: S.kidPinMode === 'guard' ? '家長確認' : (S.kidPinMode === 'enter' ? '輸入密碼' : (S.kidPinStage === 2 ? '再輸入一次確認' : (S.kidPinTarget === S.currentKidId ? '設定你的密碼' : '設定專屬密碼'))),
      kidPinSubtitle: (function () { const nm = ((S.kids || []).find(k => k.id === S.kidPinTarget) || {}).name || '孩子';
        if (S.kidPinMode === 'guard') return '幫 ' + nm + ' 開通專屬空間,請家長輸入 PIN';
        if (S.kidPinMode === 'enter') return '這是 ' + nm + ' 的空間,請輸入他的密碼';
        if (S.kidPinStage === 2) return '確認一下,避免打錯。';
        return S.kidPinTarget === S.currentKidId ? '設一個只有你知道的密碼 🔒 這是你的專屬空間' : ('這是 ' + nm + ' 的專屬空間,設一個只有他知道的密碼'); })(),
      kidPinDots: [0, 1, 2, 3].map(i => ({ dotBg: i < S.kidPinEntry.length ? '#fff' : 'transparent' })),
      kidPinError: S.kidPinError, hasKidPinError: !!S.kidPinError,
      kidPinKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'blank', '0', 'del'].map(k => ({
        label: k === 'del' ? '⌫' : (k === 'blank' ? '' : k), keyBg: k === 'blank' ? 'transparent' : 'rgba(255,255,255,.18)',
        onPress: k === 'del' ? (() => this.kidPinDelete()) : (k === 'blank' ? (() => {}) : (() => this.kidPinPress(k))) })),
      onKidPinCancel: () => this.kidPinCancel(),
      newKidName: S.newKidName, onNewKidName: (e) => this.setNewKidName(e), onAddKid: () => this.addKid(),
      kidAvatarOptions: ['🦊', '🐯', '🐰', '🐻', '🐨', '🦁', '🐼', '🐧'].map(a => ({ a, selBg: a === S.newKidAvatar ? '#eef0ff' : '#f2f3f7', selRing: a === S.newKidAvatar ? '0 0 0 2px #5b5bd6 inset' : 'none', onPick: () => this.setNewKidAvatar(a) })),
      syncLabel: S.syncStatus === 'syncing' ? '☁️ 同步中…' : (S.syncStatus === 'ok' ? '☁️ 已同步' : (String(S.syncStatus).indexOf('error') === 0 ? '⚠️ 同步失敗' : '')),
      syncIsError: String(S.syncStatus).indexOf('error') === 0, syncErr: String(S.syncStatus).indexOf('error') === 0 ? S.syncStatus.slice(6) : '',
      coins: S.coins, streak: S.streak, xp: S.xp, protects: S.protects, honest: S.honest, honestPct: Math.round(S.honest / 3 * 100) + '%',
      week7, week7Done: week7Done + '/7', week7Good, week7Hint: week7Good ? '狀態很穩,繼續保持' : '斷一天沒關係——看的是這 7 天,不是完美',
      goToday: () => this.kGo('today'), goTasks: () => this.kGo('tasks'), goRank: () => this.kGo('rank'), goShop: () => this.kGo('shop'), goRecord: () => this.kGo('record'),
      pgToday: K === 'today', pgTasks: K === 'tasks', pgRank: K === 'rank', pgShop: K === 'shop', pgRecord: K === 'record',
      slideAnim: this.state.slideDir === 'r' ? 'slideInR .22s ease-out' : this.state.slideDir === 'l' ? 'slideInL .22s ease-out' : 'none',
      pullRefreshing: this.state.pullRefreshing,
      colToday: K === 'today' ? ACC : '#a6adbe', colTasks: K === 'tasks' ? ACC : '#a6adbe', colRank: K === 'rank' ? ACC : '#a6adbe', colShop: K === 'shop' ? ACC : '#a6adbe', colRecord: K === 'record' ? ACC : '#a6adbe',
      habits, dailyTasks, jr, rec, appVersion: APP_VERSION,
      shopPriv, shopCosmetic, hasCosmeticShelf,   // Q4:商城分兩組(特權 / 外觀)
      bag, bagEmpty, bagTotalLabel: bagTotal + ' 件',   // 背包(事件推導)
      homeStage, wardrobeSlots, wardrobeEmpty,   // ②家園:人物/場景圖層 + 衣櫥
      pgShopMain: shopTab === 'shop', pgBag: shopTab === 'bag', pgHome: shopTab === 'home',
      onShopTab: () => this.setShopTab('shop'), onBagTab: () => this.setShopTab('bag'), onHomeTab: () => this.setShopTab('home'),
      shopTabBg: shopTab === 'shop' ? '#fff' : 'transparent', shopTabColor: shopTab === 'shop' ? '#1a1f2e' : '#8890a3',
      bagTabBg: shopTab === 'bag' ? '#fff' : 'transparent', bagTabColor: shopTab === 'bag' ? '#1a1f2e' : '#8890a3',
      homeTabBg: shopTab === 'home' ? '#fff' : 'transparent', homeTabColor: shopTab === 'home' ? '#1a1f2e' : '#8890a3',
      updateReady: !!this.state.updateReady, onApplyUpdate: () => this.applyUpdate(),
      schedInfoOpen: !!S.schedInfoOpen, onToggleSchedInfo: () => this.toggleSchedInfo(), schedInfoCaret: S.schedInfoOpen ? '▴' : '▾',
      hasDailyTasks: dailyTasks.length > 0, noDailyTasks: dailyTasks.length === 0, pickedLabel: pickedCount + ' 個',
      onExport: () => this.exportBackup(),
      onReset: () => this.resetAll(),
      // #3:數據自查(開發用,只給家長看)
      probeLatency: probe.latN ? ((probe.latAvg >= 0 ? '晚 ' + probe.latAvg : '早 ' + (-probe.latAvg)) + ' 分 · ' + probe.latN + ' 筆') : '尚無資料',
      probeSession: probe.sesN ? (probe.sesAvg + ' 秒 · ' + probe.sesN + ' 次') : '尚無資料',
      probeRecovery: probe.rejN ? (probe.recovRate + '% · ' + probe.rejN + ' 次退回') : '尚無退回',
      ...todayRank,
      dayMode: mode,
      onDayHome: () => this.setDayMode('home'), onDaySchool: () => this.setDayMode('school'), onDayOut: () => this.setDayMode('out'),
      dmHomeBg: mode === 'home' ? GRAD : '#eef0f6', dmHomeCol: mode === 'home' ? '#fff' : '#8890a3',
      dmSchoolBg: mode === 'school' ? GRAD : '#eef0f6', dmSchoolCol: mode === 'school' ? '#fff' : '#8890a3',
      dmOutBg: mode === 'out' ? GRAD : '#eef0f6', dmOutCol: mode === 'out' ? '#fff' : '#8890a3',
      dayHint: mode === 'out' ? '🚗 出門日 · 只顯示到哪都能做的任務，連續不中斷' : (mode === 'school' ? '📚 上學日 · 晚到家也 OK，交機時間順延' : '☀️ 休息日 · 完整任務、寬鬆時間'),
      trustLevel: trust.level, trustDesc: trust.desc, trustIcon: trust.icon, trustColor: trust.color, trustBg: trust.bg, trustLines,
      gradShow: gradCert.show, gradName: gradCert.name, gradIcon: gradCert.icon, gradDate: gradCert.date, gradDays: gradCert.days, onCloseGrad: gradCert.onClose,
      // B1:畢業里程 + 歷程回顧
      gradMilestoneShow: gStage > 0 || readyGrad, gradStageTitle: gStageInfo.title, gradStageDesc: gStageInfo.desc,
      gradCanAdvance: gStage < 3 && (gStage > 0 || readyGrad), gradAdvanceLabel: gStageInfo.next, onAdvanceGrad: () => this.advanceGraduation(),
      onOpenRetro: () => this.openRetro(), retroOpen: !!S.retroOpen, onCloseRetro: () => this.closeRetro(),
      retroStart: datesSorted.length ? datesSorted[0] : '—', retroDone: doneEv.length + '', retroHonest: honestEv.length + '',
      retroXp: S.xp + '', retroCoins: S.coins + '', retroTier: TIER_NAMES[reached], retroTiers,
      retroGradList, retroHasGrad: retroGradList.length > 0, retroGradCount: retroGradList.length + '',
      missAskShow: !!S.missAsk, missAskLabel: S.missAsk ? S.missAsk.label : '',
      onMissEnv: () => this.setMissReason('environment'), onMissMood: () => this.setMissReason('mood'), onMissForgot: () => this.setMissReason('forgot'), onMissSkip: () => this.skipMissReason(),
      pauses: S.pauses || 0, pausing: !!S.pausing, notPausing: !S.pausing,
      onPauseStart: () => this.startPause(), onResist: () => this.resistImpulse(), onPauseCancel: () => this.cancelPause(),
      // ===== 家長端 L1 導覽:收件匣 · 週報 · 管理 =====
      pIsInbox: S.pTab === 'inbox', pIsReport: S.pTab === 'report', pIsManage: S.pTab === 'manage',
      pvInbox: () => this.pGo('inbox'), pvReport: () => this.pGo('report'), pvManage: () => this.pGo('manage'),
      pcInbox: S.pTab === 'inbox' ? ACC : '#8890a3', pcReport: S.pTab === 'report' ? ACC : '#8890a3', pcManage: S.pTab === 'manage' ? ACC : '#8890a3',
      pbInbox: S.pTab === 'inbox' ? '#eef0ff' : 'transparent', pbReport: S.pTab === 'report' ? '#eef0ff' : 'transparent', pbManage: S.pTab === 'manage' ? '#eef0ff' : 'transparent',
      // 收件匣分區資料 + 空狀態
      pHabitItems, pTaskItems, pHasHabitItems: pHabitItems.length > 0, pHasTaskItems: pTaskItems.length > 0, inboxEmpty,
      // ===== 家長端 L2:管理 hub + 子頁 =====
      pManageHub: S.pTab === 'manage' && !S.pManage,     // hub(六入口)
      pmTasks: S.pManage === 'tasks', pmHabits: S.pManage === 'habits', pmShop: S.pManage === 'shop',
      pmPledges: S.pManage === 'pledges', pmSettings: S.pManage === 'settings',
      onManageTasks: () => this.pManageGo('tasks'), onManageHabits: () => this.pManageGo('habits'), onManageShop: () => this.pManageGo('shop'),
      onManagePledges: () => this.pManageGo('pledges'), onManageKids: () => this.openKidSwitch(), onManageSettings: () => this.pManageGo('settings'),
      onManageBack: () => this.pManageBack(),
      // 核心習慣管理(Phase 1:唯讀清單 + 數量警告)
      coreHabitList: coreHabitList, coreHabitCount: coreHabitCount, coreOverflow: coreHabitCount > 7,
      // ===== 週報內:孩子詳情(一次一人,不並排)=====
      reportKids: (S.kids || []).map(k => ({ id: k.id, name: k.name, avatar: k.avatar || '🦊', isCurrent: k.id === S.currentKidId,
        chipBg: k.id === S.currentKidId ? '#eef0ff' : '#fff', chipBorder: k.id === S.currentKidId ? '#5b5bd6' : '#e7eaf2',
        chipColor: k.id === S.currentKidId ? '#4a4ac2' : '#5a6070', onOpen: () => this.pOpenKidDetail(k.id) })),
      hasReportKids: (S.kids || []).length > 0,
      pReportSummary: S.pTab === 'report' && !S.pDetailKid,
      pDetailShow: S.pTab === 'report' && !!S.pDetailKid, onCloseDetail: () => this.pCloseKidDetail(),
      detailName: (curKid && curKid.name) || '小孩', detailAvatar: (curKid && curKid.avatar) || '🙂',
      detailXp: S.xp + '', detailCoins: S.coins + '', detailRank: todayRank.rankName, detailRankProg: todayRank.rankProg,
      detailRankPct: todayRank.rankPct, detailRankNext: todayRank.rankNextLabel, detailRate: (wr.k1Label || '—'),
      detailTrust: trustLines, detailHasTrust: trustLines.length > 0,
      covVersion: S.covenant.version, newTerm: S.newTerm, onNewTerm: (e) => this.setNewTerm(e), onAddTerm: () => this.addTerm(),
      covTerms: S.covenant.terms.map((t, i) => ({ text: t, onDel: () => this.askRemoveTerm(i) })),
      termRemoveShow: !!S.termRemove, termRemoveText: S.termRemove ? S.termRemove.text : '', termRemoveReason: S.termRemove ? S.termRemove.reason : '',
      termRemoveErr: (S.termRemove && S.termRemove.err) ? S.termRemove.err : '', termRemoveHasErr: !!(S.termRemove && S.termRemove.err),
      onRemoveReason: (e) => this.setRemoveReason(e), onConfirmRemoveTerm: () => this.confirmRemoveTerm(), onCancelRemoveTerm: () => this.cancelRemoveTerm(),
      schedWeekday: S.covenant.schedules.weekday, schedWeekend: S.covenant.schedules.weekend,
      onSchedWeekday: (e) => this.setSched('weekday', e), onSchedWeekend: (e) => this.setSched('weekend', e),
      sigChildName: S.covenant.signatures.child.name, sigChildSealed: !!S.covenant.signatures.child.at, sigChildAt: S.covenant.signatures.child.at,
      sigParentName: S.covenant.signatures.parent.name, sigParentSealed: !!S.covenant.signatures.parent.at, sigParentAt: S.covenant.signatures.parent.at,
      onSigChild: (e) => this.setSigName('child', e), onSigParent: (e) => this.setSigName('parent', e),
      onSealChildStart: () => this.sealStart('child'), onSealParentStart: () => this.sealStart('parent'), onSealEnd: () => this.sealEnd(),
      sealingChild: S.sealing === 'child', sealingParent: S.sealing === 'parent',
      sigChildUnsealed: !S.covenant.signatures.child.at, sigParentUnsealed: !S.covenant.signatures.parent.at,
      notSealingChild: S.sealing !== 'child', notSealingParent: S.sealing !== 'parent', onResign: () => this.resign(),
      // ===== B3:公約雙向化 =====
      // 小孩端:提案表單 + 自己的提案狀態 + 看得到家長承諾今天做到沒
      propText: S.propText, propReason: S.propReason, proposeOpen: !!S.proposeOpen,
      onOpenPropose: () => this.openPropose(), onOpenTaskPropose: () => this.openTaskPropose(), onOpenRewardPropose: () => this.openRewardPropose(), onClosePropose: () => this.closePropose(),
      onPropText: (e) => this.setProp('propText', e), onPropReason: (e) => this.setProp('propReason', e), onSubmitProposal: () => this.submitProposal(),
      // 提案 modal 文案依 proposeKind 切換(公約 / 任務 / 獎品)
      proposeTitle: S.proposeKind === 'reward' ? '💡 我想上架一個獎品' : (S.proposeKind === 'task' ? '💡 我想提一個新任務' : '💡 我想改公約'),
      proposeSubtitle: S.proposeKind === 'reward'
        ? '你想要什麼獎品?覺得值多少幣?爸媽會看到你的提案,通過後就會上架到商城。這是你的提案權。'
        : (S.proposeKind === 'task'
          ? '你想多做什麼?覺得值多少幣?爸媽會看到你的提案,通過後就會加進任務池。這是你的提案權。'
          : '寫下你想改的規則、和為什麼。爸媽會看到，通過就會更新公約。這是你的聲音。'),
      propTextPlaceholder: S.proposeKind === 'reward' ? '你想要什麼?(例:選一部電影全家一起看)' : (S.proposeKind === 'task' ? '你想多做什麼?(例:每天整理書桌)' : '想改成…(例:上學日交機改成 22:00)'),
      propReasonPlaceholder: S.proposeKind === 'reward' ? '覺得值多少幣?(開個價)' : (S.proposeKind === 'task' ? '覺得值多少幣?(開個價,例:8)' : '為什麼?(說清楚理由，比較有說服力)'),
      kidProposals: (S.covenant.proposals || []).slice().reverse().map(p => {
        const edited = p.status === 'approved' && p.final && p.final.text && p.final.text !== p.text;   // 家長微調過 → 孩子看得到定稿
        const isCov = p.kind !== 'task' && p.kind !== 'reward';
        const rm = (isCov && p.status === 'approved') ? termRemoval(S.covenant.history, p.text) : null;  // 我提案加入的條款後來被廢止 → 看得到移除紀錄+原因
        return { text: (p.kind === 'reward' ? '🎁 獎品:' : (p.kind === 'task' ? '🧩 任務:' : '📜 公約:')) + p.text,
          statusLabel: rm ? '已移除' : (p.status === 'pending' ? '審核中' : (p.status === 'approved' ? '已採納 ✓' : '這次沒採納')),
          statusColor: rm ? '#c05a5a' : (p.status === 'pending' ? '#cf9a2f' : (p.status === 'approved' ? '#2fae8a' : '#a6adbe')),
          statusBg: rm ? '#fdf3f3' : (p.status === 'pending' ? '#f6efe0' : (p.status === 'approved' ? '#e7f6f0' : '#f2f3f7')),
          hasEdited: !!edited && !rm, editedNote: edited ? ('以此版本上架:' + p.final.text) : '',
          hasRemoved: !!rm, removedNote: rm ? (rm.at.slice(5) + ' 已從公約移除 · 原因:' + rm.reason) : '' };
      }),
      kidHasProposals: (S.covenant.proposals || []).length > 0,
      // Bug 2:孩子端「家庭公約」實際條文(採納即修法,白紙黑字看得到)+ 來源標註
      covTermsKid: (S.covenant.terms || []).map(t => { const pv = termProvenance(S.covenant.history, t); return { text: t, hasSource: !!pv, sourceLabel: pv ? ((pv.at || '').slice(5) + ' 由 ' + pv.by + ' 提案加入') : '' }; }),
      kidHasTerms: (S.covenant.terms || []).length > 0,
      kidPledges: (S.covenant.pledges || []).map(p => { const done = !!(S.pledgeDone && S.pledgeDone[p.id + '::' + today]); return { text: p.text, doneLabel: done ? '今天做到了 ✓' : '今天還沒', doneColor: done ? '#2fae8a' : '#a6adbe', doneBg: done ? '#e7f6f0' : '#f2f3f7' }; }),
      kidHasPledges: (S.covenant.pledges || []).length > 0,
      // 家長端:待審提案
      pProposals: (S.covenant.proposals || []).filter(p => p.status === 'pending').map(p => {
        const isTask = p.kind === 'task', isReward = p.kind === 'reward', priced = isTask || isReward;
        const bounty = priced ? (parseInt((p.reason || '').replace(/[^0-9]/g, ''), 10) || 0) : 0;
        const days = (priced && bounty > 0 && kidDailyCoin > 0) ? Math.round(bounty / kidDailyCoin * 10) / 10 : null;
        const tb = isTask ? taskPriceBand(bounty) : null;                       // 任務定價尺
        const rb = isReward ? rewardPriceBand(days) : null;                     // 商城定價尺(以天數對照)
        const dup = isTask ? similarLibLabel(p.text) : null;                    // 任務相似重複偵測
        const ruleFlag = isReward ? shopRuleFlag(p.text) : null;               // 商城鐵律關鍵字提示
        const prefix = isReward ? '🎁 新獎品:' : (isTask ? '🧩 新任務:' : '📜 改公約:');
        return { id: p.id,
          text: prefix + p.text,
          reason: priced ? '' : p.reason, hasReason: priced ? false : !!p.reason,
          isTask, okLabel: isReward ? '採納這個獎品' : (isTask ? '採納這個任務' : '採納，加入公約'),
          // A1-補:事實比對(不給准駁)——任務 & 獎品共用
          assistShow: priced,
          assistIncome: !priced ? '' : (days != null
            ? ('他開價 ' + bounty + ' 幣 ≈ 他 ' + days + ' 天收入(近 14 天日均)')
            : ('他開價 ' + bounty + ' 幣 · 近 14 天尚無足夠收入可換算')),
          assistPrice: tb ? ('任務池定價尺 ' + tb.lo + '–' + tb.hi + ' 幣 · 此開價' + tb.band)
            : (rb ? ('商城定價尺:' + rb.band) : ''),
          hasAssistPrice: !!(tb || rb),
          dupShow: !!dup, dupLabel: dup ? ('可能與「' + dup + '」重複') : '',
          ruleFlagShow: !!ruleFlag, ruleFlagLabel: ruleFlag || '',
          // Bug 1b:改道至正確管道(排除目前 kind)
          reclassOpts: [['covenant', '📜 改公約'], ['reward', '🎁 商城獎品'], ['task', '🧩 新任務']]
            .filter(([k]) => k !== (p.kind || 'covenant'))
            .map(([k, label]) => ({ label, onPick: () => this.reclassifyProposal(p.id, k) })),
          checklist: isReward
            ? '螢幕時間/裝置額度? · 社交需求標價? · 定價對過尺? · 確定性無隨機?'
            : '與核心習慣重複計酬? · 是「多做的行動」而非「沒有違規」? · 完成可驗證? · 價格對過定價尺?',
          // 任務/獎品:採納 → 進微調表單;公約:直接加入(可先改道)
          onOk: () => (priced ? this.startApprove(p.id) : this.decideProposal(p.id, true)), onNo: () => this.decideProposal(p.id, false) };
      }),
      pHasProposals: (S.covenant.proposals || []).some(p => p.status === 'pending'),
      // ===== NFC 打卡畫面 =====
      // ===== 規則頁「阿爸的承諾」=====
      rulesOpen: !!S.rulesOpen, onOpenRules: () => this.openRules(), onCloseRules: () => this.closeRules(),
      rulesTitle: RULES_TITLE, rulesSubtitle: RULES_SUBTITLE, rulesUpdated: RULES_UPDATED,
      rulesSections: RULES_SECTIONS.map(s => ({ h: s.h, items: s.items.map(t => ({ t })) })),
      nfcActive: !!S.nfcToken, onExitNfc: () => this.exitNfc(),
      nfcIsLogin: nfcSt === 'login', nfcIsInvalid: nfcSt === 'invalid', nfcIsParent: nfcSt === 'parent',
      nfcIsNodevice: nfcSt === 'nodevice', nfcIsWrongkid: nfcSt === 'wrongkid', nfcIsSuccess: nfcSt === 'go' || nfcSt === 'done',
      nfcKidName: nfcKidNm, nfcTime: nfcTime, nfcBehLabel: nfcBehLbl, nfcSrcLabel: (S.nfcSrc === 'qr' ? 'QR 掃碼' : 'NFC 感應'),
      // ===== NFC token 管理(家庭設定)=====
      pTokens: nfcTokens.map(t => { const kid = (S.kids || []).find(k => k.id === t.kidId), beh = LIB.find(x => x.id === t.behaviorId);
        return { id: t.kidId + '|' + t.behaviorId, kidName: kid ? kid.name : '(孩子)', behLabel: beh ? beh.label : t.behaviorId,
          url: ((typeof location !== 'undefined' ? location.origin : '') + '/checkin?token=' + t.token), onRegen: () => this.askRegenToken(t.kidId + '|' + t.behaviorId) }; }),
      hasTokens: nfcTokens.length > 0, canSeedTokens: (S.kids || []).length > 0, onSeedTokens: () => this.seedTokens(),
      tokenRegenShow: !!S.tokenRegen, onConfirmRegen: () => this.confirmRegenToken(), onCancelRegen: () => this.cancelRegenToken(),
      // 採納前微調表單(任務/獎品)+ 定價輔助
      afShow: !!S.approveForm, afIsReward: !!(S.approveForm && S.approveForm.kind === 'reward'),
      afTitle: (S.approveForm && S.approveForm.kind === 'reward') ? '採納並上架獎品(可微調)' : '採納並建入任務(可微調)',
      afName: S.approveForm ? S.approveForm.name : '', afDesc: S.approveForm ? S.approveForm.desc : '', afBounty: S.approveForm ? S.approveForm.bounty : '',
      onAfName: (e) => this.setApf('name', e), onAfDesc: (e) => this.setApf('desc', e), onAfBounty: (e) => this.setApf('bounty', e),
      onConfirmApprove: () => this.confirmApprove(), onCancelApprove: () => this.cancelApprove(),
      afBountyLabel: (S.approveForm && S.approveForm.kind === 'reward') ? '價格(幣)' : '賞金(幣)',
      afHasCost: afCostNum > 0, afIncome: afDays != null ? ('≈ 他 ' + afDays + ' 天收入') : '近14天尚無收入可換算',
      afBand: afBandObj ? (afIsReward2 ? afBandObj.band : ('任務池尺 ' + afBandObj.lo + '–' + afBandObj.hi + ' 幣 · ' + afBandObj.band)) : '', afHasBand: !!afBandObj,
      afFlag: afFlagStr || '', afHasFlag: !!afFlagStr,
      // 家長端:承諾管理 + 修訂紀錄
      newPledge: S.newPledge, onNewPledge: (e) => this.setNewPledge(e), onAddPledge: () => this.addPledge(),
      covPledges: (S.covenant.pledges || []).map(p => { const done = !!(S.pledgeDone && S.pledgeDone[p.id + '::' + today]); return { id: p.id, text: p.text, onDel: () => this.delPledge(p.id), onToggle: () => this.togglePledge(p.id),
        toggleLabel: done ? '今天做到了' : '標記做到', toggleBg: done ? '#e7f6f0' : '#f2f3f7', toggleColor: done ? '#2fae8a' : '#8890a3', toggleDot: done ? '#2fae8a' : '#c2c8d6' }; }),
      covHistory: (S.covenant.history || []).slice().reverse().map(h => ({ v: 'v' + h.v, at: h.at, note: h.note })),
      covHasHistory: (S.covenant.history || []).length > 0,
      pItems, pWaitLabel: pWait > 0 ? (pWait + ' 筆待確認') : '今天都確認完了', week: wr.week, reportK1: wr.k1Label, reportHonest: wr.honestN + '', reportStreak: (S.streak || 0) + '', reportLine: wr.line, pRewards, pTasks,
      // Phase 2 商城 CRUD
      pCustomShop, hasCustomShop: pCustomShop.length > 0,
      sfOpen: !!S.sfOpen, sfEditing: !!S.sfEdit, sfFormTitle: S.sfEdit ? '編輯商品' : '新增商品',
      sfName: S.sfName, sfCost: S.sfCost, sfDesc: S.sfDesc,
      onOpenShopForm: () => this.openShopForm(null), onCloseShopForm: () => this.closeShopForm(),
      onSfName: (e) => this.setSf('Name', e), onSfCost: (e) => this.setSf('Cost', e), onSfDesc: (e) => this.setSf('Desc', e), onSaveShop: () => this.saveShopItem(),
      sfRankVal: S.sfRank, sfRankOptions: [{ v: '', label: '不限段位' }].concat(TIER_NAMES.map((n, i) => ({ v: String(i), label: n + '專屬' }))),
      onSfRank: (e) => this.setSf('Rank', e),
      sfHasCost: sfCostNum > 0, sfIncome: sfDays != null ? ('≈ 他 ' + sfDays + ' 天收入(近14天日均)') : '近14天尚無足夠收入可換算',
      sfBand: sfBand ? sfBand.band : '', sfHasBand: !!sfBand, sfFlag: sfFlag || '', sfHasFlag: !!sfFlag,
      pHasPending: pWait > 0, pAllDone: pWait === 0, pWait, onApproveAll: () => this.approveAll(),
      // #2:退回二次確認 + 撤回退回
      rejectedItems, hasRejected: rejectedItems.length > 0,
      rejectConfirmShow: !!S.rejectConfirm, rejectConfirmLabel: S.rejectConfirm ? S.rejectConfirm.label : '',
      onDoReject: () => this.doReject(), onCancelReject: () => this.cancelReject(),
      nudgeShow: nudgeCount > 0, nudgeLabel: '有 ' + nudgeCount + ' 項打卡超過一天還沒看，孩子在等你 👀',
      onUseProtect: () => this.useProtect(), saved: S.saved, protectIdle: !S.saved,
      openCeleb: () => this.openCeleb(), closeCeleb: () => this.closeCeleb(), celebrate: isKid && S.celebrate,
      fxShow: isKid && !!S.fx, fxName: S.fx ? S.fx.name : '', fxIcon: S.fx ? S.fx.icon : 'i-gift', fxGrad: S.fx ? S.fx.gradient : GRAD, fxSpent: S.fx ? S.fx.spent : 0, fxLeft: S.fx ? S.fx.left : 0, fxClose: () => this.closeFx(),
      confetti,
    };
  }
}
