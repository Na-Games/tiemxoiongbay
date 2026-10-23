/* Khung giao diện: màn hình, chuyển cảnh, toast, hộp thoại, hiệu ứng hạt */
const UI = {
  app: null, stage: null, screens: {}, cur: null, curName: null, cleanup: null, busy: false,

  init() {
    this.app = $('#app'); this.stage = $('#stage');
    this.curtain = $('#curtain'); this.toastBox = $('#toasts'); this.modalRoot = $('#modal-root');
    this.fx = $('#fx'); this.fxCtx = this.fx.getContext('2d');
    this.parts = []; this.fxRun = false;
    window.addEventListener('resize', () => this.resizeFx());
    this.resizeFx();
    // âm thanh, rung nhẹ và gợn sóng khi bấm nút
    document.addEventListener('pointerdown', (e) => {
      Sound.init();
      const b = e.target.closest('.btn, .tab, .tile, .card, .chip-btn, .switch, .segb, .tg, .hole, .mcard');
      if (b && !b.classList.contains('disabled') && !b.dataset.nosound) {
        Sound.sfx('click');
        if (S().hapticTap) Sound.vibrate(9, true);
      }
      if (S().ripple && e.target.closest('#app')) this.ripple(e.clientX, e.clientY);
    }, true);
    this.applySettings();
  },
  register(name, mod) {
    const sec = el('section', 'screen'); sec.id = 's-' + name; (this.stage || $('#stage')).appendChild(sec);
    this.screens[name] = { mod, el: sec };
  },
  applySettings() {
    const s = S();
    this._scn = this.scnKey();
    this.app.className = ['theme-' + s.uiTheme, this._scn !== 'plain' && 'scn-' + this._scn, s.scanlines && 'scan', s.bigButtons && 'bigbtn', !s.transitions && 'notrans', s.btnStyle === 'round' && 'round', s.vignette && 'vig', s.pixelFont === false && 'plainfont'].filter(Boolean).join(' ');
    document.documentElement.style.setProperty('--fs', s.fontScale);
    this.app.style.filter = s.brightness && s.brightness !== 1 ? 'brightness(' + s.brightness + ')' : '';
    this.setAmbient(s.ambientFx !== 'off' ? s.ambientFx : ((G && Calc.scn().fx) || 'off'));
    Device.syncWake();
  },
  /* Khóa kịch bản của chương đang chơi (đổi màu cảnh, hiệu ứng nền) */
  scnKey() { try { return G && G.chapter ? (Calc.chapter().scnKey || 'plain') : 'plain'; } catch (e) { return 'plain'; } },
  /* Hiệu ứng nền nhẹ: đom đóm, cánh hoa, bụi vàng, đèn lồng */
  setAmbient(kind) {
    let box = $('#ambient');
    if (!box) { box = el('div'); box.id = 'ambient'; this.app.insertBefore(box, this.fx.nextSibling); }
    if (box.dataset.kind === (kind || 'off')) return;
    box.dataset.kind = kind || 'off'; box.className = 'amb-' + (kind || 'off'); box.innerHTML = '';
    if (!kind || kind === 'off') return;
    for (let i = 0; i < 16; i++) {
      const p = el('i'); p.style.left = rnd(0, 100) + '%'; p.style.animationDelay = -rnd(0, 12) + 's'; p.style.animationDuration = rnd(7, 14) + 's';
      p.style.setProperty('--dx', rnd(-40, 40) + 'px'); p.style.setProperty('--sz', rnd(0.7, 1.4));
      box.appendChild(p);
    }
  },
  ripple(cx, cy) {
    const a = this.app.getBoundingClientRect();
    const r = el('span', 'ripple'); r.style.left = cx - a.left + 'px'; r.style.top = cy - a.top + 'px';
    this.app.appendChild(r); setTimeout(() => r.remove(), 520);
  },
  /* Rung khung game khi thiết bị không có động cơ rung (iPhone, máy tính) */
  buzz(lv) {
    const a = this.app; a.classList.remove('buzz1', 'buzz2', 'buzz3'); void a.offsetWidth; a.classList.add('buzz' + lv);
    clearTimeout(this._bz); this._bz = setTimeout(() => a.classList.remove('buzz1', 'buzz2', 'buzz3'), 320);
  },
  async go(name, params = {}, o = {}) {
    if (this.busy) return;
    this.busy = true;
    const next = this.screens[name];
    if (this._scn !== this.scnKey()) this.applySettings();
    const fast = !S().transitions || o.instant;
    if (!fast && this.cur) { this.curtain.className = 'in'; await sleep(380); }
    if (this.cur) {
      if (this.cleanup) { try { this.cleanup(); } catch (e) { console.error(e); } }
      this.cur.el.classList.remove('active'); this.cur.el.innerHTML = '';
    }
    this.closeModals();
    this.cur = next; this.curName = name; this.cleanup = null;
    next.el.classList.add('active'); next.el.scrollTop = 0;
    try { const c = next.mod.enter(next.el, params); this.cleanup = typeof c === 'function' ? c : null; } catch (e) { console.error(e); }
    if (!fast) { await sleep(60); this.curtain.className = 'out'; await sleep(380); this.curtain.className = ''; }
    this.busy = false;
  },

  /* ----- Toast ----- */
  toast(msg, type = '') {
    const t = el('div', 'toast ' + type, msg); this.toastBox.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2200); setTimeout(() => t.remove(), 2600);
    while (this.toastBox.children.length > 3) this.toastBox.firstChild.remove();
  },

  /* ----- Modal ----- */
  modal(o) {
    const ov = el('div', 'modal-ov'); const box = el('div', 'modal ' + (o.cls || ''));
    if (o.title) box.appendChild(el('h2', 'modal-title', (o.icon ? '<span>' + o.icon + '</span> ' : '') + o.title));
    const body = el('div', 'modal-body');
    if (typeof o.body === 'string') body.innerHTML = o.body; else if (o.body) body.appendChild(o.body);
    box.appendChild(body);
    const close = (v) => { ov.classList.add('out'); setTimeout(() => ov.remove(), 220); if (o.onClose) o.onClose(v); };
    if (o.buttons && o.buttons.length) {
      const bar = el('div', 'modal-btns');
      o.buttons.forEach((b) => {
        const bt = el('button', 'btn ' + (b.cls || ''), b.label);
        bt.onclick = () => { if (b.onClick) { const r = b.onClick(close); if (r === false) return; } if (!b.keep) close(b.value); };
        bar.appendChild(bt);
      });
      box.appendChild(bar);
    }
    ov.appendChild(box); this.modalRoot.appendChild(ov);
    if (o.dismiss) ov.addEventListener('pointerdown', (e) => { if (e.target === ov) close(); });
    requestAnimationFrame(() => ov.classList.add('show'));
    return { close, box, body };
  },
  confirm(msg, yes = 'Đồng ý', no = 'Hủy', title = 'Xác nhận') {
    return new Promise((res) => {
      this.modal({ title, body: '<p class="center">' + msg + '</p>', buttons: [{ label: no, cls: 'gray', value: false }, { label: yes, cls: 'red', value: true }], onClose: (v) => res(!!v) });
    });
  },
  closeModals() { this.modalRoot.innerHTML = ''; },

  /* ----- Hiệu ứng ----- */
  shake(elm, ms = 300) {
    if (!S().shake || !elm) return;
    elm.classList.remove('shake'); void elm.offsetWidth; elm.classList.add('shake');
    setTimeout(() => elm.classList.remove('shake'), ms);
  },
  float(text, x, y, cls = '') {
    if (!S().floatText) return;
    const f = el('div', 'float ' + cls, text); f.style.left = x + 'px'; f.style.top = y + 'px';
    this.app.appendChild(f); setTimeout(() => f.remove(), 1200);
  },
  pos(elm, ox = 0.5, oy = 0.5) { // toạ độ tương đối #app
    const r = elm.getBoundingClientRect(), a = this.app.getBoundingClientRect();
    return { x: r.left - a.left + r.width * ox, y: r.top - a.top + r.height * oy };
  },
  resizeFx() {
    const r = this.app.getBoundingClientRect(); const d = Math.min(2, window.devicePixelRatio || 1);
    this.fx.width = Math.round(r.width * d); this.fx.height = Math.round(r.height * d); this.fxD = d;
  },
  burst(x, y, kind = 'spark', n = 12) {
    const q = S().particles; if (!q) return; if (q === 1) n = Math.ceil(n / 2.5);
    const cols = {
      coin: ['#ffd23a', '#ffe98a', '#d8a020'], spark: ['#fff2a0', '#ffd070', '#ff9a40'], leaf: ['#6bbf59', '#3f8a3f', '#9ad870'],
      steam: ['#f4f6fa', '#d8dee8'], confetti: ['#ff5a5a', '#ffd23a', '#5ad0ff', '#7aff7a', '#ff7aff'], heart: ['#ff5a7a', '#ff8aa0'], dust: ['#d8c8a8', '#b8a888'],
    }[kind] || ['#fff'];
    for (let i = 0; i < n; i++) {
      const a = kind === 'coin' ? -Math.PI / 2 + (Math.random() - 0.5) * 1.6 : Math.random() * Math.PI * 2;
      const sp = kind === 'steam' ? 20 + Math.random() * 20 : 70 + Math.random() * 130;
      this.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * (kind === 'steam' ? -1 : 1) - (kind === 'steam' ? 10 : 40), g: kind === 'steam' ? -10 : kind === 'leaf' ? 120 : 420, l: 0, max: 0.7 + Math.random() * 0.7, s: kind === 'steam' ? 5 : 3 + Math.floor(Math.random() * 2) * 2, c: pick(cols), kind });
    }
    if (!this.fxRun) { this.fxRun = true; Loop.add(this._fxStep = (dt) => this.stepFx(dt)); }
  },
  stepFx(dt) {
    const c = this.fxCtx, d = this.fxD; c.clearRect(0, 0, this.fx.width, this.fx.height);
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i]; p.l += dt;
      if (p.l > p.max) { this.parts.splice(i, 1); continue; }
      p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      c.globalAlpha = Math.min(1, (1 - p.l / p.max) * 1.4); c.fillStyle = p.c;
      const s = p.s * d;
      c.fillRect(Math.round(p.x * d), Math.round(p.y * d), s, s);
    }
    c.globalAlpha = 1;
    if (!this.parts.length) { this.fxRun = false; Loop.remove(this._fxStep); c.clearRect(0, 0, this.fx.width, this.fx.height); }
  },

  /* ----- Thanh HUD dùng chung ----- */
  hud(opts = {}) {
    const h = el('div', 'hud');
    h.innerHTML = `
      <div class="hud-left"><div class="hud-day">Ngày 1/7</div><div class="hud-stars"></div></div>
      ${opts.clock ? '<div class="hud-clock"><span class="ic">⏰</span><b class="hud-time">5:00</b></div>' : ''}
      <div class="hud-cash chip"><span class="coin"></span><b class="hud-money">0đ</b></div>
      <button class="hud-btn btn mini" data-act="menu" title="Menu">☰</button>
      <button class="hud-btn btn mini" data-act="mute" title="Âm thanh">🔊</button>
      <div class="hud-debt">Nợ Sáu Cáo: <b class="hud-debtv"></b></div>`;
    h.querySelector('[data-act="menu"]').onclick = () => opts.onMenu && opts.onMenu();
    h.querySelector('[data-act="mute"]').onclick = () => { Settings.toggleMute(); UI.updateHud(); };
    return h;
  },
  updateHud() {
    if (!G) return;
    $$('.hud-day').forEach((e) => { e.textContent = 'Ngày ' + G.day + '/' + Calc.maxDays(); });
    $$('.hud-stars').forEach((e) => { const n = Calc.stars(); e.innerHTML = '★'.repeat(n) + '<i>' + '★'.repeat(5 - n) + '</i>'; });
    $$('.hud-money').forEach((e) => { e.textContent = money(G.cash); });
    $$('.hud-debtv').forEach((e) => { e.textContent = money(Calc.remaining()); });
    $$('[data-act="mute"]').forEach((e) => { e.textContent = (S().music + S().sfx) <= 0 ? '🔇' : '🔊'; });
  },
  /* Hiệu ứng số tiền nhảy */
  moneyFx(delta, srcEl) {
    UI.updateHud();
    const m = $('.hud-cash'); if (m) { m.classList.remove('pulse'); void m.offsetWidth; m.classList.add('pulse'); }
    if (srcEl) { const p = UI.pos(srcEl); UI.float((delta > 0 ? '+' : '') + fmt(delta), p.x, p.y, delta > 0 ? 'gain' : 'loss'); }
  },
  typewriter(node, text, speed, onTick) {
    let i = 0, stopped = false, tm;
    const total = text.length;
    return new Promise((res) => {
      const step = () => {
        if (stopped) return;
        i = Math.min(total, i + 1); node.textContent = text.slice(0, i);
        if (onTick && i % 2 === 0 && text[i - 1] !== ' ') onTick();
        if (i >= total) res(true); else tm = setTimeout(step, speed);
      };
      node._finish = () => { stopped = true; clearTimeout(tm); node.textContent = text; res(true); };
      step();
    });
  },
};

/* ===== Hộp thoại nhân vật dùng chung (cốt truyện, kết thúc, sự kiện) ===== */
function runDialogue(container, lines, o = {}) {
  return new Promise((resolve) => {
    container.innerHTML = '';
    const scene = el('div', 'dlg-scene');
    const cv = el('canvas', 'pix dlg-bg'); scene.appendChild(cv);
    const kit = Scenes.kitchen(cv, { W: 120, H: 234, floorY: 96, char: false, bare: true });
    const tick = Loop.add((dt) => kit.update(dt));
    const actor = el('div', 'dlg-actor'); const img = el('img', 'hi actor-img'); actor.appendChild(img);
    const shadow = el('div', 'actor-shadow'); actor.appendChild(shadow);
    scene.appendChild(actor);
    const box = el('div', 'dlg-box');
    box.innerHTML = '<div class="dlg-portrait"><img class="hi"></div><div class="dlg-main"><div class="dlg-name"></div><div class="dlg-text"></div></div><div class="dlg-next">▼</div>';
    scene.appendChild(box);
    const skip = el('button', 'btn mini dlg-skip', 'Bỏ qua ⏭'); scene.appendChild(skip);
    const prog = el('div', 'dlg-prog'); scene.appendChild(prog);
    container.appendChild(scene);
    let i = 0, typing = false, done = false, blinkT = null;
    const finish = () => { if (done) return; done = true; Loop.remove(tick); clearInterval(blinkT); resolve(); };
    const speed = [60, 38, 22, 10][S().textSpeed] || 24;
    async function show() {
      if (i >= lines.length) return finish();
      const ln = lines[i], ch = DATA.CHARS[ln.who] || { name: ln.name || '???', look: ln.look };
      prog.textContent = (i + 1) + '/' + lines.length;
      actor.classList.remove('enter'); void actor.offsetWidth; actor.classList.add('enter');
      img.src = charURL(ch.look); img.style.width = '230px';
      $('.dlg-portrait img', box).src = portraitURL(ch.look, { talk: true }); $('.dlg-portrait img', box).style.width = '80px';
      $('.dlg-name', box).textContent = ch.name;
      const tx = $('.dlg-text', box); tx.textContent = ''; box.classList.remove('ready'); typing = true;
      Sound.sfx('pop');
      let flip = false;
      await UI.typewriter(tx, ln.text, speed, () => { Sound.sfx('talk'); flip = !flip; });
      typing = false; box.classList.add('ready');
    }
    scene.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.dlg-skip')) return;
      if (typing) { const tx = $('.dlg-text', box); if (tx._finish) tx._finish(); return; }
      i++; show();
    });
    skip.onclick = (e) => { e.stopPropagation(); Sound.sfx('click'); finish(); };
    show();
    container._dlgStop = finish;
  });
}
