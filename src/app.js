
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
    coins: 0, streak: 0, xp: 0, protects: 0, honest: 0,
    habit: {}, checked: {},
    listed: { s1: true, s2: true, s3: true, s4: true, s5: false, s6: true },
    redeemed: {}, decided: {}, jrSel: 1, saved: false, celebrate: false, fx: null,
  };
  toMode(m) { this.setState({ mode: m }); }
  kGo(t) { this.setState({ kTab: t }); }
  pGo(t) { this.setState({ pTab: t }); }
  doHabit(k, v, reward, xp) { this.setState(st => { const cur = st.habit[k] || null, nv = cur === v ? null : v; let coins = st.coins, x = st.xp; if (nv === 'done' && cur !== 'done') { coins += reward; x += xp; } if (cur === 'done' && nv !== 'done') { coins -= reward; x -= xp; } return { habit: { ...st.habit, [k]: nv }, coins, xp: x }; }); }
  toggleTask(id, coin, xp) { this.setState(st => { const was = !!st.checked[id]; return { checked: { ...st.checked, [id]: !was }, coins: st.coins + (was ? -coin : coin), xp: st.xp + (was ? -xp : xp) }; }); }
  toggleList(id) { this.setState(st => ({ listed: { ...st.listed, [id]: !st.listed[id] } })); }
  jrSel(i) { this.setState({ jrSel: i }); }
  useProtect() { this.setState(st => st.protects > 0 && !st.saved ? { protects: st.protects - 1, streak: st.streak + 1, saved: true } : null); }
  decide(id, d) { this.setState(st => ({ decided: { ...st.decided, [id]: d } })); }
  openCeleb() { this.setState({ celebrate: true }); }
  closeCeleb() { this.setState({ celebrate: false }); }
  redeem(it) { this.setState(st => { if (st.redeemed[it.id] || st.coins < it.cost) return null; return { coins: st.coins - it.cost, redeemed: { ...st.redeemed, [it.id]: true }, fx: { name: it.name, icon: it.icon, gradient: it.gradient, spent: it.cost, left: st.coins - it.cost } }; }); }
  closeFx() { this.setState({ fx: null }); }
  renderVals() {
    const S = this.state, ACC = '#5b5bd6', GRAD = 'linear-gradient(135deg,#6d6df0,#5b5bd6)';
    const grads = { indigo:'linear-gradient(150deg,#7b7bf0,#5b5bd6)', teal:'linear-gradient(150deg,#4fd0a8,#2fae8a)', amber:'linear-gradient(150deg,#f5c451,#e0a53a)', magenta:'linear-gradient(150deg,#f56bb8,#d23bd0)', sky:'linear-gradient(150deg,#5bb8f0,#3b8ee0)' };
    const habits = [
      { key:'h1', label:'睡前準時交機', desc:'把手機放到充電座、離開房間。這是「能放下」最核心的一塊肌肉。', reward:30, xp:30, icon:'#i-moon' },
      { key:'h2', label:'準時結束今天的螢幕', desc:'到約定時間，自己收手——不是被關掉，是自己停。', reward:20, xp:20, icon:'#i-hour' },
    ].map(h => ({ ...h, idle: !S.habit[h.key], done: S.habit[h.key] === 'done', miss: S.habit[h.key] === 'miss', onDone: () => this.doHabit(h.key, 'done', h.reward, h.xp), onMiss: () => this.doHabit(h.key, 'miss', h.reward, h.xp) }));
    const check = React.createElement('svg', { style: { width: 15, height: 15 } }, React.createElement('use', { href: '#i-check' }));
    const dailyTasks = [
      { id:'t1', icon:'#i-check', label:'今天沒有偷超時', sub:'一整天都在約定內', xp:3, coin:12 },
      { id:'t2', icon:'#i-bolt', label:'做一件離線的事 30 分', sub:'運動 · 讀書 · 幫忙', xp:3, coin:12 },
      { id:'t3', icon:'#i-hour', label:'用完手機主動放回充電座', sub:'不用被提醒', xp:2, coin:8 },
    ].map(t => { const on = !!S.checked[t.id]; return { ...t, boxBg: on ? ACC : 'transparent', boxBorder: on ? ACC : '#cdd2df', boxIcon: on ? check : '', onToggle: () => this.toggleTask(t.id, t.coin, t.xp) }; });
    const manage = [
      { label:'睡前準時交機', streak:6, icon:'#i-moon', tag:'關鍵習慣', tagBg:'#ebebfb', tagColor:'#4a4ac2' },
      { label:'準時結束今天的螢幕', streak:6, icon:'#i-hour', tag:'關鍵習慣', tagBg:'#ebebfb', tagColor:'#4a4ac2' },
      { label:'每天離線 30 分', streak:4, icon:'#i-bolt', tag:'加分', tagBg:'#e7f6f0', tagColor:'#2f8a6a' },
    ];
    const jrDefs = [['見習','完全託管，先把節奏建立起來',0,'解鎖每日任務'],['銅段','解鎖 30 分自選時段',150,'自選時段 ×1'],['銀段','週末彈性 +1 小時',400,'週末彈性 +1hr'],['金段','自己設定交機時間',800,'自訂交機時間'],['鑽石','完全自主，家長只看週報',1500,'完全自主'],['傳說','自律大師 · 名人堂',2500,'名人堂徽章']];
    const reached = jrDefs.reduce((m, t, i) => S.xp >= t[2] ? i : m, 0), sel = S.jrSel;
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
    const tiers = jrDefs.map((t, i) => { const stt = i < reached ? 'done' : (i === reached ? 'now' : 'lock'), lock = stt === 'lock', isSel = i === sel;
      return { name:t[0], thr: t[2] === 0 ? '起點' : (t[2] + ' XP'), reward:t[3], onSel: () => this.jrSel(i),
        nodeBg: lock ? '#e7eaf2' : 'linear-gradient(150deg,#7b7bf0,#5b5bd6)', nodeColor: lock ? '#aab0c0' : '#fff',
        icon: lock ? '#i-lock' : (stt === 'done' ? '#i-check' : '#i-medal'),
        cardBg: isSel ? '#eef0ff' : '#ffffff', cardBorder: isSel ? '#5b5bd6' : '#e7eaf2', nameColor: lock ? '#8890a3' : '#1a1f2e',
        ring: stt === 'now' ? '0 0 0 5px rgba(91,91,214,.18)' : 'none' }; });
    const selState = sel < reached ? 'done' : (sel === reached ? 'now' : 'lock');
    const jr = { tiers, selName: jrDefs[sel][0], selUnlock: jrDefs[sel][1], selReward: jrDefs[sel][3], nextName: jrDefs[Math.min(reached + 1, jrDefs.length - 1)][0],
      selBadge: selState === 'done' ? '已達成' : (selState === 'now' ? '進行中' : '未解鎖'), selBadgeBg: selState === 'lock' ? '#eef0f6' : '#eef0ff', selBadgeColor: selState === 'lock' ? '#8890a3' : '#4a4ac2' };
    const itemsAll = [
      { id:'s1', name:'週末 +30 分 螢幕時段', cost:120, cat:'screen', icon:'#i-hour', g:'indigo', tag:'HOT' },
      { id:'s2', name:'電影夜選片權', cost:200, cat:'perk', icon:'#i-gift', g:'magenta', tag:'' },
      { id:'s3', name:'朋友來家裡過夜', cost:500, cat:'outing', icon:'#i-spark', g:'amber', tag:'新' },
      { id:'s4', name:'週五交機延 30 分', cost:150, cat:'screen', icon:'#i-moon', g:'sky', tag:'' },
      { id:'s5', name:'家庭出遊選地點', cost:350, cat:'outing', icon:'#i-target', g:'teal', tag:'' },
      { id:'s6', name:'一次免家事券', cost:180, cat:'perk', icon:'#i-shield', g:'indigo', tag:'' },
    ];
    const shop = itemsAll.filter(it => S.listed[it.id]).map(it => { const rd = !!S.redeemed[it.id], afford = S.coins >= it.cost;
      return { ...it, gradient: grads[it.g], costLabel: '' + it.cost, hasTag: !!it.tag,
        btnText: rd ? '已兌換' : (afford ? '兌換' : '金幣不足'), btnBg: rd ? '#eef0f6' : (afford ? GRAD : '#eef0f6'), btnColor: rd ? '#8890a3' : (afford ? '#fff' : '#aab0c0'),
        onRedeem: () => this.redeem({ id: it.id, name: it.name, cost: it.cost, icon: it.icon, gradient: grads[it.g] }) }; });
    const recPat = ['d','d','d','h','d','d','d','d','d','h','d','d','m','d','d','d','d','d','h','d','d','d','d','d','d','h','now','future'];
    const recMap = { d:{ bg:ACC, color:'#fff', ico:'#i-check' }, h:{ bg:'#f6efe0', color:'#cf9a2f', ico:'#i-heart' }, m:{ bg:'#eef0f6', color:'#aab0c0', ico:'#i-close' }, now:{ bg:'#fff', color:'#5b5bd6', ico:'', ring:true }, future:{ bg:'#e9ecf3', color:'#c2c8d6', ico:'' } };
    const recCells = recPat.map(k => { const m = recMap[k]; return { bg: m.bg, color: m.color, ico: m.ico || '#i-check', hasIco: !!m.ico, ringShadow: m.ring ? '0 0 0 2px #5b5bd6 inset' : 'none' }; });
    const rec = { cells: recCells, doneN: recPat.filter(x => x === 'd').length, honestN: recPat.filter(x => x === 'h').length };
    const pendBase = [
      { id:'p1', label:'睡前準時交機', reward:30, note:'21:32 放回充電座', icon:'#i-moon' },
      { id:'p2', label:'準時結束今天的螢幕', reward:20, note:'到點自己收手', icon:'#i-hour' },
      { id:'p3', label:'離線做一件事 30 分', reward:12, note:'讀了 30 分鐘', icon:'#i-bolt' },
    ];
    const pItems = pendBase.map(it => { const status = S.decided[it.id] || 'wait'; return { ...it, wait: status === 'wait', ok: status === 'ok', no: status === 'no', onOk: () => this.decide(it.id, 'ok'), onNo: () => this.decide(it.id, 'no') }; });
    const pWait = pItems.filter(i => i.wait).length;
    const week = [['一',100],['二',100],['三',80],['四',100],['五',100],['六',55],['日',100]].map(w => ({ label: w[0], h: Math.round(w[1] * 0.72) + 'px', barBg: w[1] >= 80 ? 'linear-gradient(180deg,#7b7bf0,#5b5bd6)' : '#dfe3ee' }));
    const pRewards = itemsAll.map(it => { const on = !!S.listed[it.id]; return { id: it.id, name: it.name, cost: it.cost + '', iconHref: it.icon, gradient: grads[it.g], onToggle: () => this.toggleList(it.id), tgLabel: on ? '上架中' : '已下架', tgBg: on ? '#eef0ff' : '#f2f3f7', tgColor: on ? '#4a4ac2' : '#9098ab', tgDot: on ? '#5b5bd6' : '#c2c8d6' }; });
    const colors = ['#5b5bd6','#7b7bf0','#35b28a','#cf9a2f','#e0a53a'];
    const confetti = Array.from({ length: 16 }, (_, i) => ({ left: (5 + i * 5.7) + '%', delay: ((i % 6) * 0.11) + 's', dur: (1.1 + (i % 4) * 0.28) + 's', color: colors[i % colors.length], size: (7 + (i % 3) * 3) + 'px' }));
    const K = S.kTab, isKid = S.mode === 'kid';
    return {
      isKid, isParent: S.mode === 'parent', toKid: () => this.toMode('kid'), toParent: () => this.toMode('parent'),
      coins: S.coins, streak: S.streak, xp: S.xp, protects: S.protects, honest: S.honest, honestPct: Math.round(S.honest / 3 * 100) + '%',
      goToday: () => this.kGo('today'), goTasks: () => this.kGo('tasks'), goRank: () => this.kGo('rank'), goShop: () => this.kGo('shop'), goRecord: () => this.kGo('record'),
      pgToday: K === 'today', pgTasks: K === 'tasks', pgRank: K === 'rank', pgShop: K === 'shop', pgRecord: K === 'record',
      colToday: K === 'today' ? ACC : '#a6adbe', colTasks: K === 'tasks' ? ACC : '#a6adbe', colRank: K === 'rank' ? ACC : '#a6adbe', colShop: K === 'shop' ? ACC : '#a6adbe', colRecord: K === 'record' ? ACC : '#a6adbe',
      habits, dailyTasks, manage, jr, shop, rec,
      ...todayRank,
      pTab: S.pTab, pIsPending: S.pTab === 'pending', pIsReport: S.pTab === 'report', pIsRewards: S.pTab === 'rewards',
      pvP: () => this.pGo('pending'), pvR: () => this.pGo('report'), pvG: () => this.pGo('rewards'),
      pcP: S.pTab === 'pending' ? ACC : '#8890a3', pcR: S.pTab === 'report' ? ACC : '#8890a3', pcG: S.pTab === 'rewards' ? ACC : '#8890a3',
      pbP: S.pTab === 'pending' ? '#eef0ff' : 'transparent', pbR: S.pTab === 'report' ? '#eef0ff' : 'transparent', pbG: S.pTab === 'rewards' ? '#eef0ff' : 'transparent',
      pItems, pWaitLabel: pWait > 0 ? (pWait + ' 筆待確認') : '今天都確認完了', week, pRewards,
      onUseProtect: () => this.useProtect(), saved: S.saved, protectIdle: !S.saved,
      openCeleb: () => this.openCeleb(), closeCeleb: () => this.closeCeleb(), celebrate: S.celebrate,
      fxShow: !!S.fx, fxName: S.fx ? S.fx.name : '', fxIcon: S.fx ? S.fx.icon : '#i-gift', fxGrad: S.fx ? S.fx.gradient : GRAD, fxSpent: S.fx ? S.fx.spent : 0, fxLeft: S.fx ? S.fx.left : 0, fxClose: () => this.closeFx(),
      confetti,
    };
  }
}
