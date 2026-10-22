/* Tiện ích dùng chung */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lerp = (a, b, t) => a + (b - a) * t;
function chance(p) { return Math.random() < p; }
function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/* Định dạng tiền: 250.000đ */
function fmt(n) { return Math.round(n).toLocaleString('vi-VN') + 'đ'; }
function fmtK(n) {
  n = Math.round(n);
  if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 ? 2 : 0).replace(/\.?0+$/, '').replace('.', ',') + 'tr';
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 ? 1 : 0).replace('.', ',') + 'k';
  return String(n);
}
function money(n) { return (typeof Save !== 'undefined' && Save.root && Save.root.settings.moneyShort) ? fmtK(n) + 'đ' : fmt(n); }
function localDate(d = new Date()) {
  const p = (x) => String(x).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}
function daysBetween(a, b) {
  return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
}
function clockText(minutes) {
  const h = Math.floor(minutes / 60), m = Math.floor(minutes % 60);
  return h + ':' + String(m).padStart(2, '0');
}
/* Hàm ease */
const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: (t) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
};
/* Vòng lặp animation tập trung */
const Loop = {
  fns: new Set(), last: 0, running: false,
  add(fn) { this.fns.add(fn); this.start(); return fn; },
  remove(fn) { this.fns.delete(fn); },
  start() {
    if (this.running) return;
    this.running = true; this.last = performance.now();
    const step = (t) => {
      const dt = Math.min(0.05, (t - this.last) / 1000); this.last = t;
      this.fns.forEach((f) => f(dt, t / 1000));
      if (this.fns.size) requestAnimationFrame(step); else this.running = false;
    };
    requestAnimationFrame(step);
  },
};
