/* Trạng thái game, lưu trữ và các công thức tính toán */
const DEFAULT_SETTINGS = {
  music: 0.55, sfx: 0.8, ambient: true,
  musicTheme: 'village', sfxTheme: 'classic',
  vibrate: 2, shake: true, particles: 2, floatText: true, weatherFx: true,
  scanlines: false, transitions: true, uiTheme: 'night', fontScale: 1,
  textSpeed: 2, moneyShort: false, confirmEnd: true, hints: true, bigButtons: false,
  hapticTap: true, ripple: true, ambientFx: 'off', vignette: false, brightness: 1, btnStyle: 'pixel',
  autoFull: !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches), keepAwake: false,
};
const Save = {
  KEY: 'tiemxoi_ongbay_v1',
  root: null,
  load() {
    let r = null;
    try { r = JSON.parse(localStorage.getItem(this.KEY)); } catch (e) { r = null; }
    if (!r || typeof r !== 'object') r = {};
    r.settings = Object.assign({}, DEFAULT_SETTINGS, r.settings || {});
    r.checkin = Object.assign({ last: null, idx: 0, total: 0 }, r.checkin || {});
    r.records = Object.assign({ wins: 0, plays: 0, best: 0, minigames: 0 }, r.records || {});
    r.introSeen = !!r.introSeen;
    r.game = r.game || null;
    this.root = r;
    return r;
  },
  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.root)); } catch (e) { /* bỏ qua */ }
  },
  wipe() { try { localStorage.removeItem(this.KEY); } catch (e) { /* */ } },
};
let G = null; // game hiện tại (Save.root.game)
const S = () => Save.root.settings;

function newGame(diff) {
  const d = DATA.DIFF[diff] || DATA.DIFF.normal;
  const g = {
    v: 1, diff, day: 1, debt: d.debt, cash: DATA.SEED, savings: 0, rep: 55,
    ingr: { nep: 2, dau: 1, hanh: 1, la: 8 }, stock: {},
    recipes: { doxanh: true, lac: true, gac: true }, upg: {}, staff: {},
    plan: {}, prices: {}, mkt: {}, mktNext: null, ref: {}, weather: 'sun', event: null,
    stats: { sold: 0, revenue: 0, served: 0, lost: 0 },
    today: null, mg: { tokens: 3, played: 0 }, bonus: 0, intro: false, mktFee: 10000,
  };
  return g;
}

/* ===== Công thức ===== */
const Calc = {
  lvl(id) { return (G.upg && G.upg[id]) || 0; },
  hasStaff(id) { return !!(G.staff && G.staff[id]); },
  staffFx(key) {
    let v = 0;
    DATA.STAFF.forEach((s) => { if (G.staff[s.id] && s.fx[key]) v += s.fx[key]; });
    return v;
  },
  weather() { return DATA.WEATHER.find((w) => w.id === G.weather) || DATA.WEATHER[0]; },
  event() { return G.event ? DATA.EVENTS.find((e) => e.id === G.event) : null; },
  potCap() { return [6, 8, 11, 14][this.lvl('pot')] + this.staffFx('potCap'); },
  cookTime(batches) { // giây
    const speed = 1 - [0, 0.15, 0.3, 0.45][this.lvl('pot')] - [0, 0.2, 0.4][this.lvl('stove')] - this.staffFx('cook');
    return Math.max(4, Math.round((5 + batches * 1.6) * Math.max(0.25, speed)));
  },
  yieldBonus() { return this.staffFx('yield'); },
  seats() { return 3 + this.lvl('chair'); },
  patience() { return 24 * (1 + [0, 0.2, 0.4][this.lvl('tea')] + this.staffFx('patience')); },
  priceTol() { return 1.06 + (this.lvl('scale') ? 0.1 : 0); },
  tip() { const e = this.event(); return (this.lvl('leaf') >= 2 ? 0.1 : 0) + (e && e.tip ? e.tip : 0); },
  marketFee() {
    const e = this.event();
    let fee = G.mktFee + (e && e.fee && !this.hasStaff('ba') ? e.fee : 0);
    return Math.round(fee * (1 - this.staffFx('fee')));
  },
  envMul() {
    const w = this.weather(); let m = w.cust;
    if (w.env && this.lvl('umbrella')) m = 1 - (1 - m) * 0.5;
    return m;
  },
  custMult() {
    const e = this.event();
    const d = DATA.DIFF[G.diff] || DATA.DIFF.normal;
    const repF = 0.6 + 0.8 * (G.rep / 100);
    const boost = 1 + [0, 0.15, 0.3, 0.45][this.lvl('loud')] + [0, 0.08, 0.16, 0.24][this.lvl('sign')] + this.staffFx('cust');
    return repF * boost * this.envMul() * (e && e.cust ? e.cust : 1) * d.cust;
  },
  stars() { return clamp(Math.ceil(G.rep / 20), 1, 5); },
  /* nguyên liệu */
  ingPrice(id) {
    const base = DATA.ING_BY[id].price * 1000;
    const f = G.mkt[id] || 1;
    const e = this.event();
    const em = e && e.ingr && e.ingr[id] ? e.ingr[id] : 1;
    return Math.max(500, Math.round((base * f * em * (1 - this.staffFx('buy'))) / 500) * 500);
  },
  trend(id) {
    const base = DATA.ING_BY[id].price * 1000;
    const r = this.ingPrice(id) / (base * (1 - this.staffFx('buy')));
    return r < 0.93 ? -1 : r > 1.07 ? 1 : 0;
  },
  unitCost(rec) { // vốn mỗi phần theo giá chợ hôm nay
    let s = 0; Object.entries(rec.need).forEach(([k, v]) => { s += this.ingPrice(k) * v; });
    return s / (DATA.PORTIONS * (1 + this.yieldBonus()));
  },
  need(plan) { // tổng nguyên liệu cho kế hoạch {recId: batches}
    const t = {};
    Object.entries(plan).forEach(([rid, b]) => {
      if (!b) return;
      Object.entries(DATA.REC_BY[rid].need).forEach(([k, v]) => { t[k] = (t[k] || 0) + v * b; });
    });
    return t;
  },
  shortage(plan) { // nguyên liệu còn thiếu và tiền mua
    const need = this.need(plan), lack = {}; let cost = 0;
    Object.entries(need).forEach(([k, v]) => {
      const miss = v - (G.ingr[k] || 0);
      if (miss > 0) { lack[k] = miss; cost += miss * this.ingPrice(k); }
    });
    return { lack, cost };
  },
  refPrice(rid) { return G.ref[rid] || DATA.REC_BY[rid].price * 1000; },
  demandMul(rid) { const e = this.event(); return e && e.demand && e.demand[rid] ? e.demand[rid] : 1; },
  totalStock() { return Object.values(G.stock).reduce((a, b) => a + b, 0); },
  remaining() { return Math.max(0, G.debt - G.savings); },
};

/* Sinh giá chợ, thời tiết, sự kiện cho ngày mới */
function rollMarket(rng) {
  const f = {};
  DATA.ING.forEach((i) => {
    let x = 1 + (rng() + rng() + rng() - 1.5) * 0.45;
    f[i.id] = clamp(x, 0.78, 1.32);
  });
  return f;
}
function rollDay() {
  const r = mulberry32(G.day * 7919 + (G.diff.length * 131) + Math.floor(Math.random() * 1000));
  G.mkt = G.mktNext || rollMarket(r);
  G.mktNext = rollMarket(r);
  // thời tiết
  const total = DATA.WEATHER.reduce((a, w) => a + w.w, 0); let x = Math.random() * total;
  G.weather = DATA.WEATHER[0].id;
  for (const w of DATA.WEATHER) { x -= w.w; if (x <= 0) { G.weather = w.id; break; } }
  // sự kiện
  G.event = (G.day > 1 && chance(0.6)) ? pick(DATA.EVENTS).id : null;
  if (G.day === 1) G.weather = 'sun';
  // giá tham khảo để bán
  G.ref = {};
  DATA.RECIPES.forEach((rc) => {
    const fac = 0.94 + Math.random() * 0.14;
    G.ref[rc.id] = Math.round((rc.price * 1000 * fac) / 500) * 500;
  });
  // giá bán mặc định: giá chợ
  DATA.RECIPES.forEach((rc) => { G.prices[rc.id] = G.ref[rc.id]; });
  G.plan = {};
}
