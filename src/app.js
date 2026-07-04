
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

// ===== 設定常數(啟發式預設值,非科學定論,依實際狀況調整)=====
const CONFIG = {
  honestMissXP: 5,             // 誠實承認沒做到:固定小額 XP(平額,不隨任務浮動)
  promoteMinAchieveRate: 0.6,  // 信任升級的達成率地板(擺爛畢不了業)
  autoApproveHours: 48,        // 待確認超時自動放行(中性日)
  sealHoldMs: 2000,            // 公約蓋章長按毫秒數
  trustPromoteDays: [14, 21],  // 信任 0→1 需連續誠實 14 天;1→2 需 21 天
  spotCheckRate: 0.3,          // 信任等級 1(抽查)被抽中確認的機率
};
const TRUST_NAMES = ['每次確認', '隨機抽查', '已畢業 · 自主'];

// ===== 資料遷移:localStorage schema 版本控管 =====
// 每次啟動檢查版本,舊資料無損升級並先備份到 backup_v1。
const SCHEMA_VERSION = 4;
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
    mode: 'kid', kTab: 'today', pTab: 'pending',
    schemaVersion: 3, checkinEvents: [],
    lastDate: null, dayMode: 'home',
    coins: 0, streak: 0, xp: 0, protects: 0, honest: 0,
    habit: {}, checked: {},
    taskOn: { k1: true, k2: true, ld1: true, bd1: true }, manualUnlock: {},
    trustLevel: {}, graduatedAt: {}, gradModal: null,
    covenant: {
      version: 1,
      terms: ['到約定時間，自己把手機放回充電區', '有做到就打卡；沒做到也誠實回報', '手機留在充電區過夜，不帶回房間'],
      schedules: { weekday: '21:40', weekend: '22:30' },
      signatures: { child: { name: '', at: '' }, parent: { name: '', at: '' } },
      proposals: [],   // B3:小孩提案(pending → 家長採納/婉拒)
      pledges: [],     // B3:家長公開承諾(誠實回報原則對家長同樣適用)
      history: [],     // B3:修訂紀錄(who/when/改了什麼)
    },
    newTerm: '', sealing: null, missAsk: null,
    propText: '', propReason: '', newPledge: '', pledgeDone: {}, proposeOpen: false,
    listed: { s1: true, s2: true, s3: true, s4: true, s5: false, s6: true },
    redeemed: {}, decided: {}, jrSel: 1, saved: false, celebrate: false, fx: null,
    pauses: 0, pausing: false,
  };
  toMode(m) { this.setState({ mode: m }); }
  kGo(t) { this.setState({ kTab: t }); }
  pGo(t) { this.setState({ pTab: t }); }
  // 小孩送出「做到」:建立 pending 事件,不立即入帳(等家長確認)。honestyEligible 任務 XP×1.5。
  submitCheckin(b) {
    this.setState(st => {
      const day = st.lastDate, cur = todayEventOf(st.checkinEvents, b.id, day);
      if (cur && !cur.honest && cur.verdict === 'pending') return { checkinEvents: st.checkinEvents.filter(e => e !== cur) }; // 再按=收回
      if (cur && !cur.honest && (cur.verdict === 'approved' || cur.verdict === 'auto')) return null; // 做到已入帳鎖定
      const rest = cur ? st.checkinEvents.filter(e => e !== cur) : st.checkinEvents;   // 清掉誠實回報 / 已退回
      const refund = (cur && cur.honest) ? CONFIG.honestMissXP : 0;                    // 從誠實回報改為做到 → 退回小額 XP
      const xp = b.honestyEligible ? Math.round(b.xp * 1.5) : b.xp;
      // 依信任等級決定要不要家長確認:0=每次確認;1=30% 抽查、其餘即時入帳;2=畢業自主即時入帳
      const level = (st.trustLevel && st.trustLevel[b.id]) || 0;
      const instant = level >= 2 || (level === 1 && Math.random() >= CONFIG.spotCheckRate);
      const ev = { id: b.id + '-' + day, behaviorId: b.id, label: b.label, icon: b.icon, kind: b.kind, coin: b.coin, xp, honest: false, ts: Date.now(), date: day, verdict: instant ? 'approved' : 'pending' };
      return instant ? { checkinEvents: [...rest, ev], xp: st.xp - refund + xp, coins: st.coins + b.coin } : { checkinEvents: [...rest, ev], xp: st.xp - refund };
    });
  }
  // 「沒做到」= 誠實回報:立即入帳固定小額 XP(無需家長確認,因為承認失敗沒什麼好造假),連續不斷。
  markMiss(b) {
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
  // 家長逐項確認:通過才入帳
  confirmCheckin(id, approve) {
    this.setState(st => {
      const t = st.checkinEvents.find(e => e.id === id && e.verdict === 'pending');
      if (!t) return null;
      const events = st.checkinEvents.map(e => e === t ? { ...e, verdict: approve ? 'approved' : 'rejected' } : e);
      if (approve) return { checkinEvents: events, coins: st.coins + t.coin, xp: st.xp + t.xp };
      // 退回 = 打了卡但實際沒做(不誠實)→ 該行為信任降一級
      const lvl = (st.trustLevel && st.trustLevel[t.behaviorId]) || 0;
      return { checkinEvents: events, trustLevel: { ...st.trustLevel, [t.behaviorId]: Math.max(0, lvl - 1) } };
    });
  }
  // 家長一鍵全過
  approveAll() {
    this.setState(st => {
      let coins = st.coins, xp = st.xp, any = false;
      const events = st.checkinEvents.map(e => { if (e.verdict !== 'pending') return e; coins += e.coin; xp += e.xp; any = true; return { ...e, verdict: 'approved' }; });
      return any ? { checkinEvents: events, coins, xp } : null;
    });
  }
  // 超過 autoApproveHours 未確認:自動放行(中性日),不懲罰小孩
  autoApprove(s) {
    const now = Date.now(), limit = CONFIG.autoApproveHours * 3600000;
    let coins = s.coins, xp = s.xp, changed = false;
    const events = (s.checkinEvents || []).map(e => {
      if (e.verdict === 'pending' && (now - e.ts) > limit) { coins += e.coin; xp += e.xp; changed = true; return { ...e, verdict: 'auto' }; }
      return e;
    });
    return changed ? { ...s, checkinEvents: events, coins, xp } : s;
  }
  toggleTaskOn(id) { this.setState(st => ({ taskOn: { ...st.taskOn, [id]: !st.taskOn[id] } })); }
  unlockTask(id) { this.setState(st => ({ manualUnlock: { ...st.manualUnlock, [id]: true }, taskOn: { ...st.taskOn, [id]: true } })); } // 家長最大:提前解鎖並啟用
  toggleList(id) { this.setState(st => ({ listed: { ...st.listed, [id]: !st.listed[id] } })); }
  jrSel(i) { this.setState({ jrSel: i }); }
  useProtect() { this.setState(st => st.protects > 0 && !st.saved ? { protects: st.protects - 1, streak: st.streak + 1, saved: true } : null); }
  decide(id, d) { this.setState(st => ({ decided: { ...st.decided, [id]: d } })); }
  openCeleb() { this.setState({ celebrate: true }); }
  closeCeleb() { this.setState({ celebrate: false }); }
  openGrad(id) { this.setState({ gradModal: id }); }
  closeGrad() { this.setState({ gradModal: null }); }
  // ===== 家庭公約 =====
  setNewTerm(e) { this.setState({ newTerm: e.target.value }); }
  addTerm() { this.setState(st => { const t = (st.newTerm || '').trim(); if (!t) return null; return { newTerm: '', covenant: { ...st.covenant, terms: [...st.covenant.terms, t] } }; }); }
  delTerm(i) { this.setState(st => ({ covenant: { ...st.covenant, terms: st.covenant.terms.filter((_, x) => x !== i) } })); }
  setSigName(role, e) { const v = e.target.value; this.setState(st => ({ covenant: { ...st.covenant, signatures: { ...st.covenant.signatures, [role]: { ...st.covenant.signatures[role], name: v } } } })); }
  setSched(dayType, e) { const v = e.target.value; this.setState(st => ({ covenant: { ...st.covenant, schedules: { ...st.covenant.schedules, [dayType]: v } } })); }
  sealStart(role) { try { clearTimeout(this._sealT); } catch (e) {} this._sealT = setTimeout(() => this.doSeal(role), CONFIG.sealHoldMs); this.setState({ sealing: role }); }
  sealEnd() { try { clearTimeout(this._sealT); } catch (e) {} this.setState({ sealing: null }); }
  doSeal(role) { this.setState(st => { const n = (st.covenant.signatures[role].name || '').trim(); if (!n) return { sealing: null }; try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) {} return { sealing: null, covenant: { ...st.covenant, signatures: { ...st.covenant.signatures, [role]: { name: n, at: ymd(new Date()) } } } }; }); }
  resign() { this.setState(st => { const nv = st.covenant.version + 1; return { covenant: { ...st.covenant, version: nv, signatures: { child: { name: '', at: '' }, parent: { name: '', at: '' } }, history: [...(st.covenant.history || []), { v: nv, at: ymd(new Date()), note: '修訂公約 · 重新簽署' }] } }; }); }
  // ===== B3:公約雙向化(小孩提案 + 家長承諾 + 修訂紀錄)=====
  setProp(field, e) { const v = e.target.value; this.setState({ [field]: v }); }
  // 小孩提案改公約 → 進家長待確認
  openPropose() { this.setState({ proposeOpen: true }); }
  closePropose() { this.setState({ proposeOpen: false, propText: '', propReason: '' }); }
  submitProposal() {
    this.setState(st => {
      const text = (st.propText || '').trim(); if (!text) return { proposeOpen: false };
      const p = { id: 'p' + Date.now(), text, reason: (st.propReason || '').trim(), at: ymd(new Date()), status: 'pending' };
      return { propText: '', propReason: '', proposeOpen: false, covenant: { ...st.covenant, proposals: [...(st.covenant.proposals || []), p] } };
    });
  }
  // 家長採納/婉拒提案:採納 → 條款加入公約 + 記修訂紀錄
  decideProposal(id, approve) {
    this.setState(st => {
      const p = (st.covenant.proposals || []).find(x => x.id === id && x.status === 'pending');
      if (!p) return null;
      const proposals = st.covenant.proposals.map(x => x === p ? { ...x, status: approve ? 'approved' : 'rejected' } : x);
      if (!approve) return { covenant: { ...st.covenant, proposals } };
      return { covenant: { ...st.covenant, proposals, terms: [...st.covenant.terms, p.text],
        history: [...(st.covenant.history || []), { v: st.covenant.version, at: ymd(new Date()), note: '採納孩子提案:' + p.text }] } };
    });
  }
  setNewPledge(e) { const v = e.target.value; this.setState({ newPledge: v }); }
  addPledge() { this.setState(st => { const t = (st.newPledge || '').trim(); if (!t) return null; return { newPledge: '', covenant: { ...st.covenant, pledges: [...(st.covenant.pledges || []), { id: 'pl' + Date.now(), text: t }] } }; }); }
  delPledge(id) { this.setState(st => ({ covenant: { ...st.covenant, pledges: (st.covenant.pledges || []).filter(p => p.id !== id) } })); }
  // 家長誠實回報今天有沒有做到自己的承諾(小孩看得到)
  togglePledge(id) { this.setState(st => { const k = id + '::' + (st.lastDate || ymd(new Date())); return { pledgeDone: { ...st.pledgeDone, [k]: !st.pledgeDone[k] } }; }); }
  redeem(it) { this.setState(st => { if (st.redeemed[it.id] || st.coins < it.cost) return null; return { coins: st.coins - it.cost, redeemed: { ...st.redeemed, [it.id]: true }, fx: { name: it.name, icon: it.icon, gradient: it.gradient, spent: it.cost, left: st.coins - it.cost } }; }); }
  closeFx() { this.setState({ fx: null }); }
  // ===== 持久化 + 日期感知 =====
  componentDidMount() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('habitRank') || 'null'); } catch (e) {}
    if (saved) saved = migrateToV2(saved);
    const merged = saved ? { ...this.state, ...saved } : { ...this.state };
    this.setState(this.autoApprove(this.rollover(merged, ymd(new Date()))));
  }
  componentDidUpdate() {
    try { const { celebrate, fx, gradModal, sealing, missAsk, proposeOpen, ...persist } = this.state; localStorage.setItem('habitRank', JSON.stringify(persist)); } catch (e) {}
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
    s.checkinEvents = (s.checkinEvents || []).filter(e => dayGap(e.date, today) <= 60); // 事件保留 60 天
    // 信任升級:每行為一條線,連續誠實達標 + 達成率達地板 → 升一級(2=畢業)
    s.trustLevel = { ...(s.trustLevel || {}) }; s.graduatedAt = { ...(s.graduatedAt || {}) };
    LIB.forEach(t => {
      const lvl = s.trustLevel[t.id] || 0;
      if (lvl >= 2) return;
      const need = CONFIG.trustPromoteDays[lvl];
      if (honestStreakOf(s.checkinEvents, t.id, today) >= need && achieveRate(s.checkinEvents, t.id, today, need) >= CONFIG.promoteMinAchieveRate) {
        s.trustLevel[t.id] = lvl + 1;
        if (lvl + 1 === 2) { s.graduatedAt[t.id] = today; s.gradModal = t.id; } // 觸發畢業慶祝
      }
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
    const ok = window.confirm('確定要「重新來過」嗎?\n\n這會清掉所有金幣、XP、段位、打卡紀錄、公約簽名,回到全新狀態,無法復原。\n(建議先「匯出備份」再重置)');
    if (!ok) return;
    try {
      localStorage.removeItem('habitRank');
      localStorage.removeItem('habitRank_backup_v1');
    } catch (e) {}
    try { window.location.reload(); } catch (e) {}
  }
  // 衝動延遲:練習「先暫停」的肌肉
  startPause() { this.setState({ pausing: true }); }
  resistImpulse() { this.setState(st => ({ pausing: false, pauses: (st.pauses || 0) + 1 })); }
  cancelPause() { this.setState({ pausing: false }); }
  renderVals() {
    const S = this.state, ACC = '#5b5bd6', GRAD = 'linear-gradient(135deg,#6d6df0,#5b5bd6)';
    const grads = { indigo:'linear-gradient(150deg,#7b7bf0,#5b5bd6)', teal:'linear-gradient(150deg,#4fd0a8,#2fae8a)', amber:'linear-gradient(150deg,#f5c451,#e0a53a)', magenta:'linear-gradient(150deg,#f56bb8,#d23bd0)', sky:'linear-gradient(150deg,#5bb8f0,#3b8ee0)' };
    // 依家長啟用(taskOn)+ 今天模式(dayMode)決定當天實際顯示的任務。
    // 出門日只留「到哪都能做」的任務(where:anywhere)。
    const mode = S.dayMode || 'home';
    const TIER_XP = [0, 300, 800, 1800, 3500, 6000], TIER_NAMES = ['見習', '銅段', '銀段', '金段', '鑽石', '傳說'];
    const reached = TIER_XP.reduce((m, thr, i) => S.xp >= thr ? i : m, 0);
    // 任務解鎖:段位達到 unlockRank 才可用;家長可提前手動解鎖(manualUnlock)
    const available = (t) => (t.unlockRank || 0) <= reached || !!(S.manualUnlock && S.manualUnlock[t.id]);
    const activeLib = LIB.filter(t => S.taskOn[t.id] && available(t));
    const dayPool = mode === 'out' ? activeLib.filter(t => t.where === 'anywhere') : activeLib;
    const today = S.lastDate || ymd(new Date());
    const check = React.createElement('svg', { style: { width: 15, height: 15 } }, React.createElement('use', { href: '#i-check' }));
    const clock = React.createElement('svg', { style: { width: 15, height: 15 } }, React.createElement('use', { href: '#i-hour' }));
    // 每個行為今天的事件(單一真相):done=非誠實打卡、miss=誠實回報沒做到
    const evOf = (id) => todayEventOf(S.checkinEvents, id, today);
    const habits = dayPool.filter(t => t.type === 'habit').map(h => {
      const tt = (mode !== 'out' && h.times) ? h.times[mode === 'school' ? 'school' : 'home'] : '';
      const desc = h.desc + (tt ? '　⏰ 今天目標 ' + tt + ' 前' : '');
      const ev = evOf(h.id), miss = !!(ev && ev.honest), done = !!(ev && !ev.honest), credited = !!(ev && (ev.verdict === 'approved' || ev.verdict === 'auto'));
      return { key: h.id, label: h.label, desc, reward: h.coin, xp: h.xp, icon: h.icon,
        idle: !ev || ev.verdict === 'rejected', submitted: done, miss, canUndo: done && ev.verdict === 'pending',
        subLabel: credited ? '已確認入帳 ✓' : '已送去給爸媽確認',
        subSub: credited ? ('+' + h.coin + '幣 已入帳') : ('+' + h.coin + '幣 待入帳'),
        onDone: () => this.submitCheckin({ id: h.id, label: h.label, icon: h.icon, kind: 'habit', coin: h.coin, xp: h.xp, honestyEligible: h.honestyEligible }),
        onMiss: () => this.markMiss({ id: h.id, label: h.label, icon: h.icon, kind: 'habit' }) }; });
    const rowFor = (o, sub) => { const ev = evOf(o.id), pending = !!(ev && !ev.honest && ev.verdict === 'pending'), done = !!(ev && !ev.honest && (ev.verdict === 'approved' || ev.verdict === 'auto'));
      return { id: o.id, icon: o.icon, label: o.label, sub,
        rewardLabel: pending ? '待確認' : (done ? '已入帳 ✓' : ('+' + o.xp + 'XP · ' + o.coin + '幣')),
        boxBg: done ? ACC : (pending ? '#f6efe0' : 'transparent'), boxBorder: done ? ACC : (pending ? '#e0a53a' : '#cdd2df'),
        boxIcon: done ? check : (pending ? clock : ''),
        onToggle: () => this.submitCheckin({ id: o.id, label: o.label, icon: o.icon, kind: o.type, coin: o.coin, xp: o.xp, honestyEligible: o.honestyEligible }) }; };
    const dailyTasks = dayPool.filter(t => t.type === 'task').map(t => rowFor(t, t.sub));
    // 任務分頁:把今天的關鍵習慣 + 每日任務合成一份可點清單
    const habitRows = dayPool.filter(t => t.type === 'habit').map(h => rowFor(h, '關鍵習慣'));
    const allToday = [...habitRows, ...dailyTasks];
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
    const jrDefs = [['見習','完全託管，先把節奏建立起來',0,'解鎖每日任務'],['銅段','解鎖 30 分自選時段',300,'自選時段 ×1'],['銀段','週末彈性 +1 小時',800,'週末彈性 +1hr'],['金段','自己設定交機時間',1800,'自訂交機時間'],['鑽石','完全自主，家長只看週報',3500,'完全自主'],['傳說','自律大師 · 名人堂',6000,'名人堂徽章']];
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
      const lvl = (S.trustLevel && S.trustLevel[h.id]) || 0, graduated = lvl >= 2;
      const need = lvl < 2 ? CONFIG.trustPromoteDays[lvl] : 21;
      const streak = honestStreakOf(S.checkinEvents, h.id, today), rate = Math.round(achieveRate(S.checkinEvents, h.id, today, need) * 100);
      return { label: h.label, icon: h.icon, levelName: TRUST_NAMES[lvl], graduated,
        badgeBg: graduated ? '#eef0ff' : (lvl === 1 ? '#e8f6ef' : '#fbf3e2'), badgeColor: graduated ? '#4a4ac2' : (lvl === 1 ? '#2f8a6a' : '#9c6b16'),
        progLabel: graduated ? '已畢業 · 免驗證 · 點看證書 🎓' : ('誠實連續 ' + Math.min(streak, need) + ' / ' + need + ' 天 → ' + TRUST_NAMES[lvl + 1]),
        progPct: graduated ? '100%' : (Math.min(100, Math.round(streak / need * 100)) + '%'),
        rateLabel: '近期達成率 ' + rate + '%', onView: () => graduated && this.openGrad(h.id) };
    });
    const gradCount = trustLines.filter(l => l.graduated).length, allGrad = trackedHabits.length > 0 && gradCount === trackedHabits.length;
    const trust = allGrad
      ? { level: '完全自主', desc: '所有關鍵習慣都畢業了 —— 這是你贏來的', icon: 'i-crown', color: '#5b5bd6', bg: '#eef0ff' }
      : gradCount > 0
      ? { level: gradCount + ' 條習慣已畢業', desc: '免驗證的習慣越來越多,繼續加油', icon: 'i-check', color: '#2f8a6a', bg: '#e8f6ef' }
      : { level: '建立信任中', desc: '連續誠實回報,逐步換到「免檢查」的自主權', icon: 'i-shield', color: '#e0a53a', bg: '#fbf3e2' };
    const tiers = jrDefs.map((t, i) => { const stt = i < reached ? 'done' : (i === reached ? 'now' : 'lock'), lock = stt === 'lock', isSel = i === sel;
      return { name:t[0], thr: t[2] === 0 ? '起點' : (t[2] + ' XP'), reward:t[3], onSel: () => this.jrSel(i),
        nodeBg: lock ? '#e7eaf2' : 'linear-gradient(150deg,#7b7bf0,#5b5bd6)', nodeColor: lock ? '#aab0c0' : '#fff',
        icon: lock ? 'i-lock' : (stt === 'done' ? 'i-check' : 'i-medal'),
        cardBg: isSel ? '#eef0ff' : '#ffffff', cardBorder: isSel ? '#5b5bd6' : '#e7eaf2', nameColor: lock ? '#8890a3' : '#1a1f2e',
        ring: stt === 'now' ? '0 0 0 5px rgba(91,91,214,.18)' : 'none' }; });
    const selState = sel < reached ? 'done' : (sel === reached ? 'now' : 'lock');
    const jr = { tiers, selName: jrDefs[sel][0], selUnlock: jrDefs[sel][1], selReward: jrDefs[sel][3], nextName: jrDefs[Math.min(reached + 1, jrDefs.length - 1)][0],
      selBadge: selState === 'done' ? '已達成' : (selState === 'now' ? '進行中' : '未解鎖'), selBadgeBg: selState === 'lock' ? '#eef0f6' : '#eef0ff', selBadgeColor: selState === 'lock' ? '#8890a3' : '#4a4ac2' };
    const itemsAll = [
      { id:'s1', name:'週末 +30 分 螢幕時段', cost:250, cat:'screen', icon:'i-hour', g:'indigo', tag:'HOT' },
      { id:'s2', name:'電影夜選片權', cost:350, cat:'perk', icon:'i-gift', g:'magenta', tag:'' },
      { id:'s3', name:'朋友來家裡過夜', cost:1200, cat:'outing', icon:'i-spark', g:'amber', tag:'新' },
      { id:'s4', name:'週五交機延 30 分', cost:250, cat:'screen', icon:'i-moon', g:'sky', tag:'' },
      { id:'s5', name:'家庭出遊選地點', cost:800, cat:'outing', icon:'i-target', g:'teal', tag:'' },
      { id:'s6', name:'一次免家事券', cost:450, cat:'perk', icon:'i-shield', g:'indigo', tag:'' },
    ];
    const shop = itemsAll.filter(it => S.listed[it.id]).map(it => { const rd = !!S.redeemed[it.id], afford = S.coins >= it.cost;
      return { ...it, gradient: grads[it.g], costLabel: '' + it.cost, hasTag: !!it.tag,
        btnText: rd ? '已兌換' : (afford ? '兌換' : '金幣不足'), btnBg: rd ? '#eef0f6' : (afford ? GRAD : '#eef0f6'), btnColor: rd ? '#8890a3' : (afford ? '#fff' : '#aab0c0'),
        onRedeem: () => this.redeem({ id: it.id, name: it.name, cost: it.cost, icon: it.icon, gradient: grads[it.g] }) }; });
    const recPat = ['d','d','d','h','d','d','d','d','d','h','d','d','m','d','d','d','d','d','h','d','d','d','d','d','d','h','now','future'];
    const recMap = { d:{ bg:ACC, color:'#fff', ico:'i-check' }, h:{ bg:'#f6efe0', color:'#cf9a2f', ico:'i-heart' }, m:{ bg:'#eef0f6', color:'#aab0c0', ico:'i-close' }, now:{ bg:'#fff', color:'#5b5bd6', ico:'', ring:true }, future:{ bg:'#e9ecf3', color:'#c2c8d6', ico:'' } };
    const recCells = recPat.map(k => { const m = recMap[k]; return { bg: m.bg, color: m.color, ico: m.ico || 'i-check', hasIco: !!m.ico, ringShadow: m.ring ? '0 0 0 2px #5b5bd6 inset' : 'none' }; });
    const rec = { cells: recCells, doneN: recPat.filter(x => x === 'd').length, honestN: recPat.filter(x => x === 'h').length };
    // 家長待確認:真實的 pending 打卡事件(小孩送出的)
    const nowMs = Date.now();
    const pendingEvents = (S.checkinEvents || []).filter(e => e.verdict === 'pending');
    const pItems = pendingEvents.map(e => ({ id: e.id, label: e.label, reward: e.coin, icon: e.icon,
      note: (e.kind === 'habit' ? '關鍵習慣' : '每日任務') + (e.honest ? ' · 誠實回報' : ''), wait: true, ok: false, no: false,
      onOk: () => this.confirmCheckin(e.id, true), onNo: () => this.confirmCheckin(e.id, false) }));
    const pWait = pItems.length;
    const nudgeCount = pendingEvents.filter(e => (nowMs - e.ts) > 24 * 3600000).length;
    const wr = weeklyReport(S.checkinEvents, today, S.taskOn); // B6:真實週報 + 一句話
    const pRewards = itemsAll.map(it => { const on = !!S.listed[it.id]; return { id: it.id, name: it.name, cost: it.cost + '', iconHref: it.icon, gradient: grads[it.g], onToggle: () => this.toggleList(it.id), tgLabel: on ? '上架中' : '已下架', tgBg: on ? '#eef0ff' : '#f2f3f7', tgColor: on ? '#4a4ac2' : '#9098ab', tgDot: on ? '#5b5bd6' : '#c2c8d6' }; });
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
    const gradCert = { show: !!gradItem, name: gradItem ? gradItem.label : '', icon: gradItem ? gradItem.icon : 'i-crown',
      date: gradItem ? (S.graduatedAt[S.gradModal] || today) : '', days: gradDays, onClose: () => this.closeGrad() };
    const K = S.kTab, isKid = S.mode === 'kid';
    return {
      isKid, isParent: S.mode === 'parent', toKid: () => this.toMode('kid'), toParent: () => this.toMode('parent'),
      coins: S.coins, streak: S.streak, xp: S.xp, protects: S.protects, honest: S.honest, honestPct: Math.round(S.honest / 3 * 100) + '%',
      week7, week7Done: week7Done + '/7', week7Good, week7Hint: week7Good ? '狀態很穩,繼續保持' : '斷一天沒關係——看的是這 7 天,不是完美',
      goToday: () => this.kGo('today'), goTasks: () => this.kGo('tasks'), goRank: () => this.kGo('rank'), goShop: () => this.kGo('shop'), goRecord: () => this.kGo('record'),
      pgToday: K === 'today', pgTasks: K === 'tasks', pgRank: K === 'rank', pgShop: K === 'shop', pgRecord: K === 'record',
      colToday: K === 'today' ? ACC : '#a6adbe', colTasks: K === 'tasks' ? ACC : '#a6adbe', colRank: K === 'rank' ? ACC : '#a6adbe', colShop: K === 'shop' ? ACC : '#a6adbe', colRecord: K === 'record' ? ACC : '#a6adbe',
      habits, dailyTasks, allToday, jr, shop, rec, appVersion: APP_VERSION,
      onExport: () => this.exportBackup(),
      onReset: () => this.resetAll(),
      onAddHabit: () => this.setState({ mode: 'parent', pTab: 'rewards' }),
      ...todayRank,
      dayMode: mode,
      onDayHome: () => this.setDayMode('home'), onDaySchool: () => this.setDayMode('school'), onDayOut: () => this.setDayMode('out'),
      dmHomeBg: mode === 'home' ? GRAD : '#eef0f6', dmHomeCol: mode === 'home' ? '#fff' : '#8890a3',
      dmSchoolBg: mode === 'school' ? GRAD : '#eef0f6', dmSchoolCol: mode === 'school' ? '#fff' : '#8890a3',
      dmOutBg: mode === 'out' ? GRAD : '#eef0f6', dmOutCol: mode === 'out' ? '#fff' : '#8890a3',
      dayHint: mode === 'out' ? '🚗 出門日 · 只顯示到哪都能做的任務，連續不中斷' : (mode === 'school' ? '📚 上學日 · 晚到家也 OK，交機時間順延' : '☀️ 在家日 · 完整任務、寬鬆時間'),
      trustLevel: trust.level, trustDesc: trust.desc, trustIcon: trust.icon, trustColor: trust.color, trustBg: trust.bg, trustLines,
      gradShow: gradCert.show, gradName: gradCert.name, gradIcon: gradCert.icon, gradDate: gradCert.date, gradDays: gradCert.days, onCloseGrad: gradCert.onClose,
      missAskShow: !!S.missAsk, missAskLabel: S.missAsk ? S.missAsk.label : '',
      onMissEnv: () => this.setMissReason('environment'), onMissMood: () => this.setMissReason('mood'), onMissForgot: () => this.setMissReason('forgot'), onMissSkip: () => this.skipMissReason(),
      pauses: S.pauses || 0, pausing: !!S.pausing, notPausing: !S.pausing,
      onPauseStart: () => this.startPause(), onResist: () => this.resistImpulse(), onPauseCancel: () => this.cancelPause(),
      pTab: S.pTab, pIsPending: S.pTab === 'pending', pIsReport: S.pTab === 'report', pIsRewards: S.pTab === 'rewards', pIsCovenant: S.pTab === 'covenant',
      pvP: () => this.pGo('pending'), pvR: () => this.pGo('report'), pvG: () => this.pGo('rewards'), pvC: () => this.pGo('covenant'),
      pcP: S.pTab === 'pending' ? ACC : '#8890a3', pcR: S.pTab === 'report' ? ACC : '#8890a3', pcG: S.pTab === 'rewards' ? ACC : '#8890a3', pcC: S.pTab === 'covenant' ? ACC : '#8890a3',
      pbP: S.pTab === 'pending' ? '#eef0ff' : 'transparent', pbR: S.pTab === 'report' ? '#eef0ff' : 'transparent', pbG: S.pTab === 'rewards' ? '#eef0ff' : 'transparent', pbC: S.pTab === 'covenant' ? '#eef0ff' : 'transparent',
      covVersion: S.covenant.version, newTerm: S.newTerm, onNewTerm: (e) => this.setNewTerm(e), onAddTerm: () => this.addTerm(),
      covTerms: S.covenant.terms.map((t, i) => ({ text: t, onDel: () => this.delTerm(i) })),
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
      onOpenPropose: () => this.openPropose(), onClosePropose: () => this.closePropose(),
      onPropText: (e) => this.setProp('propText', e), onPropReason: (e) => this.setProp('propReason', e), onSubmitProposal: () => this.submitProposal(),
      kidProposals: (S.covenant.proposals || []).slice().reverse().map(p => ({ text: p.text,
        statusLabel: p.status === 'pending' ? '審核中' : (p.status === 'approved' ? '已採納 ✓' : '這次沒採納'),
        statusColor: p.status === 'pending' ? '#cf9a2f' : (p.status === 'approved' ? '#2fae8a' : '#a6adbe'),
        statusBg: p.status === 'pending' ? '#f6efe0' : (p.status === 'approved' ? '#e7f6f0' : '#f2f3f7') })),
      kidHasProposals: (S.covenant.proposals || []).length > 0,
      kidPledges: (S.covenant.pledges || []).map(p => { const done = !!(S.pledgeDone && S.pledgeDone[p.id + '::' + today]); return { text: p.text, doneLabel: done ? '今天做到了 ✓' : '今天還沒', doneColor: done ? '#2fae8a' : '#a6adbe', doneBg: done ? '#e7f6f0' : '#f2f3f7' }; }),
      kidHasPledges: (S.covenant.pledges || []).length > 0,
      // 家長端:待審提案
      pProposals: (S.covenant.proposals || []).filter(p => p.status === 'pending').map(p => ({ id: p.id, text: p.text, reason: p.reason, hasReason: !!p.reason,
        onOk: () => this.decideProposal(p.id, true), onNo: () => this.decideProposal(p.id, false) })),
      pHasProposals: (S.covenant.proposals || []).some(p => p.status === 'pending'),
      // 家長端:承諾管理 + 修訂紀錄
      newPledge: S.newPledge, onNewPledge: (e) => this.setNewPledge(e), onAddPledge: () => this.addPledge(),
      covPledges: (S.covenant.pledges || []).map(p => { const done = !!(S.pledgeDone && S.pledgeDone[p.id + '::' + today]); return { id: p.id, text: p.text, onDel: () => this.delPledge(p.id), onToggle: () => this.togglePledge(p.id),
        toggleLabel: done ? '今天做到了' : '標記做到', toggleBg: done ? '#e7f6f0' : '#f2f3f7', toggleColor: done ? '#2fae8a' : '#8890a3', toggleDot: done ? '#2fae8a' : '#c2c8d6' }; }),
      covHistory: (S.covenant.history || []).slice().reverse().map(h => ({ v: 'v' + h.v, at: h.at, note: h.note })),
      covHasHistory: (S.covenant.history || []).length > 0,
      pItems, pWaitLabel: pWait > 0 ? (pWait + ' 筆待確認') : '今天都確認完了', week: wr.week, reportK1: wr.k1Label, reportHonest: wr.honestN + '', reportStreak: (S.streak || 0) + '', reportLine: wr.line, pRewards, pTasks,
      pHasPending: pWait > 0, pAllDone: pWait === 0, pWait, onApproveAll: () => this.approveAll(),
      nudgeShow: nudgeCount > 0, nudgeLabel: '有 ' + nudgeCount + ' 項打卡超過一天還沒看，孩子在等你 👀',
      onUseProtect: () => this.useProtect(), saved: S.saved, protectIdle: !S.saved,
      openCeleb: () => this.openCeleb(), closeCeleb: () => this.closeCeleb(), celebrate: S.celebrate,
      fxShow: !!S.fx, fxName: S.fx ? S.fx.name : '', fxIcon: S.fx ? S.fx.icon : 'i-gift', fxGrad: S.fx ? S.fx.gradient : GRAD, fxSpent: S.fx ? S.fx.spent : 0, fxLeft: S.fx ? S.fx.left : 0, fxClose: () => this.closeFx(),
      confetti,
    };
  }
}
