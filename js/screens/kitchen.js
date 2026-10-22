/* Màn hình bếp: kho nguyên liệu, chọn món, đi chợ & đồ xôi, các tab nâng cấp/nhân viên/hội làng/điểm danh */
const Kitchen = { scene: null, tab: 'bep', root: null, panel: null, cooking: false };

function weatherLayer(host, kind) {
  if (!S().weatherFx) return null;
  const cv = el('canvas', 'wx'); host.appendChild(cv);
  const w = 120, h = 82; cv.width = w; cv.height = h; const x = cv.getContext('2d');
  const drops = Array.from({ length: kind === 'rain' ? 60 : 0 }, () => ({ x: Math.random() * w, y: Math.random() * h, s: 60 + Math.random() * 40 }));
  const rays = kind === 'hot' || kind === 'sun';
  const fn = Loop.add((dt, t) => {
    x.clearRect(0, 0, w, h);
    if (kind === 'rain') {
      x.fillStyle = 'rgba(20,30,60,.18)'; x.fillRect(0, 0, w, h);
      x.fillStyle = 'rgba(190,210,240,.85)';
      drops.forEach((d) => { d.y += d.s * dt; d.x -= 12 * dt; if (d.y > h) { d.y = -4; d.x = Math.random() * w; } x.fillRect(Math.round(d.x), Math.round(d.y), 1, 3); });
    } else if (kind === 'hot') {
      x.fillStyle = 'rgba(255,170,60,' + (0.1 + 0.03 * Math.sin(t * 2)) + ')'; x.fillRect(0, 0, w, h);
    } else if (kind === 'cold') {
      x.fillStyle = 'rgba(180,210,255,.08)'; x.fillRect(0, 0, w, h);
    }
  });
  return () => Loop.remove(fn);
}

UI.register('kitchen', {
  enter(root) {
    Kitchen.root = root; Kitchen.cooking = false;
    root.innerHTML = '';
    const wrap = el('div', 'kitchen'); root.appendChild(wrap);
    const hud = UI.hud({ onMenu: () => pauseMenu() }); wrap.appendChild(hud);
    const sceneBox = el('div', 'k-scene'); const cv = el('canvas', 'pix scene-cv'); sceneBox.appendChild(cv);
    const wx = weatherLayer(sceneBox, G.weather);
    const hot = el('div', 'hotspots'); sceneBox.appendChild(hot);
    wrap.appendChild(sceneBox);
    const ev = Calc.event();
    const wt = Calc.weather();
    const badge = el('div', 'k-badge', wt.icon + ' ' + wt.name + (ev ? ' · ' + ev.icon + ' ' + ev.title : ''));
    sceneBox.appendChild(badge);
    const scene = Scenes.kitchen(cv); Kitchen.scene = scene; scene.staff = staffSprites([26, 104, 12]);
    const tick = Loop.add((dt) => scene.update(dt));
    // điểm chạm trên cảnh
    const spot = (name, fn) => {
      const r = scene.hot[name]; const d = el('div', 'hs');
      d.style.cssText = `left:${(r[0] / scene.W) * 100}%;top:${(r[1] / scene.H) * 100}%;width:${(r[2] / scene.W) * 100}%;height:${(r[3] / scene.H) * 100}%`;
      d.onclick = (e) => { const p = UI.pos(d); fn(p, e); }; hot.appendChild(d);
    };
    const quips = ['Xôi nếp dẻo thơm phải đồ bằng lửa đượm đấy!', 'Hôm nay nhất định bán hết nhé Tí!', 'Ông già rồi nhưng tay nghề không rớt đâu.', 'Nợ nần gì chứ, xôi ngon thì khách tự đến.', 'Nhớ gói lá chuối cho thơm nghe cháu.'];
    spot('stove', (p) => { scene.poke(); Sound.sfx('fire'); UI.burst(p.x, p.y, 'spark', 8); });
    spot('ong', (p) => { UI.float(pick(quips), p.x, p.y - 30, 'say'); Sound.sfx('pop'); });
    spot('cat', (p) => { Sound.sfx('meow'); UI.burst(p.x, p.y, 'heart', 6); UI.float('Meo~', p.x, p.y - 12, 'say'); });
    spot('jar', (p) => { Sound.sfx('tap'); UI.float('Chum tương nhà ông ủ 3 năm đó!', p.x, p.y - 20, 'say'); });
    // bảng điều khiển
    const panel = el('div', 'k-panel'); wrap.appendChild(panel); Kitchen.panel = panel;
    const tabs = el('div', 'tabs');
    const TABS = [['bep', '🍲', 'Bếp'], ['up', '⬆️', 'Nâng cấp'], ['staff', '👥', 'Nhân viên'], ['fun', '🎎', 'Hội làng'], ['daily', '📅', 'Điểm danh']];
    TABS.forEach(([k, i, n]) => { const b = el('button', 'tab', '<span>' + i + '</span><b>' + n + '</b>'); b.dataset.k = k; b.onclick = () => { Kitchen.tab = k; renderTab(); }; tabs.appendChild(b); });
    panel.appendChild(tabs);
    const body = el('div', 'k-body'); panel.appendChild(body);
    const foot = el('div', 'k-foot'); panel.appendChild(foot);
    Kitchen.body = body; Kitchen.foot = foot;
    Kitchen.renderTab = renderTab;
    function renderTab() {
      $$('.tab', tabs).forEach((b) => b.classList.toggle('on', b.dataset.k === Kitchen.tab));
      body.innerHTML = ''; body.scrollTop = 0;
      if (Kitchen.tab === 'bep') renderBep(body, foot);
      else { foot.innerHTML = ''; foot.appendChild(footButtons(false)); ({ up: renderUpgrades, staff: renderStaff, fun: renderFun, daily: renderCheckin })[Kitchen.tab](body); }
      UI.updateHud();
    }
    Kitchen.tab = Kitchen.tab || 'bep'; Kitchen.tab = 'bep';
    renderTab();
    Sound.ambient(G.weather === 'rain' ? 'rain' : 'night'); Sound.setTempo(1); if (Sound.ctx) Sound.playMusic();
    if (G.day === 1 && !G.seenTut && S().hints) { G.seenTut = true; setTimeout(() => UI.toast('💡 Chạm vào kho để mua nguyên liệu, chọn mẻ rồi đồ xôi!', 'info'), 600); }
    return () => { Loop.remove(tick); wx && wx(); };
  },
});

function pauseMenu() {
  const b = el('div', 'menu-list');
  const items = [['▶️ Tiếp tục', 'gold', null], ['⚙️ Cài đặt', 'gray', () => Settings.open()], ['❓ Hướng dẫn', 'gray', () => Guide.open()], ['⛶ Toàn màn hình', 'gray', () => Device.toggle()], ['💾 Lưu & về trang chủ', 'gray', () => { Save.save(); UI.go('title'); }]];
  items.forEach(([t, c, f]) => { const x = el('button', 'btn ' + c, t); x.onclick = () => { m.close(); if (f) f(); }; b.appendChild(x); });
  const m = UI.modal({ title: 'Tạm nghỉ', icon: '☰', body: b, dismiss: true });
}

/* Nút dưới cùng của bảng bếp */
function footButtons(full) {
  const f = el('div', 'foot-btns');
  const a = el('button', 'btn gray cook-btn', 'Đi chợ & Đồ xôi'); a.onclick = () => (full ? Cooking.start() : (Kitchen.tab = 'bep', Kitchen.renderTab()));
  const b = el('button', 'btn red go-btn', 'Gánh ra chợ <span>➜</span>'); b.onclick = () => goMarket();
  if (!full) a.textContent = '🍲 Về bếp';
  f.appendChild(a); f.appendChild(b);
  return f;
}
async function goMarket() {
  if (Calc.totalStock() <= 0) {
    if (!(await UI.confirm('Bạn chưa có xôi nào để bán. Vẫn gánh ra chợ?', 'Vẫn đi', 'Ở lại bếp'))) return;
  }
  Save.save(); UI.go('price');
}

/* ===== Tab Bếp: kho + món ===== */
function renderBep(body, foot) {
  const inv = el('div', 'sec');
  const note = Calc.lvl('note');
  let fore = '';
  if (note && G.mktNext) {
    const dn = DATA.ING.filter((i) => G.mktNext[i.id] < 0.9).slice(0, 3).map((i) => i.icon).join('');
    const up = DATA.ING.filter((i) => G.mktNext[i.id] > 1.15).slice(0, 3).map((i) => i.icon).join('');
    fore = '<span class="fore">Mai: ' + (dn ? '▼' + dn : '') + ' ' + (up ? '▲' + up : '') + '</span>';
  }
  inv.innerHTML = '<div class="sec-h"><b>Kho nguyên liệu</b> · giá chợ hôm nay ' + fore + '</div>';
  const grid = el('div', 'ing-grid'); inv.appendChild(grid); body.appendChild(inv);
  const tiles = {};
  const upTile = (id) => {
    const t = tiles[id], ing = DATA.ING_BY[id]; if (!t) return;
    const n = G.ingr[id] || 0, tr = Calc.trend(id);
    t.querySelector('.cnt').textContent = n;
    t.querySelector('.pr').innerHTML = fmtK(Calc.ingPrice(id)) + (tr < 0 ? '<i class="dn">▼</i>' : tr > 0 ? '<i class="upc">▲</i>' : '');
    t.classList.toggle('has', n > 0);
  };
  DATA.ING.forEach((ing) => {
    const t = el('button', 'tile', '<span class="ico">' + ing.icon + '</span><span class="cnt">0</span><span class="pr"></span><span class="nm">' + ing.name + (ing.pack ? ' ×' + ing.pack : '') + '</span>');
    t.title = ing.name; tiles[ing.id] = t; grid.appendChild(t);
    const buy = (qty) => {
      const price = Calc.ingPrice(ing.id) * qty;
      if (G.cash < price) { Sound.sfx('error'); UI.shake(t); UI.toast('Không đủ tiền!', 'err'); return false; }
      G.cash -= price; G.today.cost += price; G.ingr[ing.id] = (G.ingr[ing.id] || 0) + (ing.pack || 1) * qty;
      Sound.sfx('buy'); const p = UI.pos(t); UI.burst(p.x, p.y, 'coin', 4); UI.float('-' + fmtK(price), p.x, p.y - 8, 'loss');
      upTile(ing.id); UI.updateHud(); refreshPlan(); t.classList.remove('bump'); void t.offsetWidth; t.classList.add('bump'); return true;
    };
    let timer = null, held = false;
    t.addEventListener('pointerdown', () => { held = false; timer = setTimeout(() => { held = true; buy(5); }, 520); });
    const up = () => clearTimeout(timer);
    t.addEventListener('pointerup', (e) => { up(); if (!held) buy(1); });
    t.addEventListener('pointerleave', up); t.addEventListener('pointercancel', up);
    upTile(ing.id);
  });
  inv.appendChild(el('div', 'hint', 'Chạm để mua 1 · giữ để mua 5'));

  // Món
  const rec = el('div', 'sec'); rec.innerHTML = '<div class="sec-h"><b>Chọn món để đồ</b> <span class="potinfo"></span></div>';
  const list = el('div', 'rec-list'); rec.appendChild(list); body.appendChild(rec);
  const stockLine = el('div', 'stock-line'); body.appendChild(stockLine);
  const rows = {};
  DATA.RECIPES.forEach((r) => {
    const known = !!G.recipes[r.id];
    if (r.secret && !known) return;
    const row = el('div', 'rec' + (known ? '' : ' locked'));
    const ic = pixImg(Sprite.bowl(r.color, r.id), 1.5, 'bowl hi');
    const info = el('div', 'rec-info');
    const needs = Object.entries(r.need).map(([k, v]) => '<span class="nd" data-k="' + k + '" data-v="' + v + '">' + DATA.ING_BY[k].icon + '<i>' + v + '</i></span>').join('');
    info.innerHTML = '<b class="rn">' + r.name + '</b><div class="needs">' + needs + '</div><small class="rs"></small>';
    row.appendChild(ic); row.appendChild(info);
    if (known) {
      const st = el('div', 'stepper');
      const mn = el('button', 'sb minus', '−'), val = el('b', 'val', '0'), pl = el('button', 'sb plus', '+');
      mn.onclick = () => setPlan(r.id, (G.plan[r.id] || 0) - 1); pl.onclick = () => setPlan(r.id, (G.plan[r.id] || 0) + 1);
      st.appendChild(mn); st.appendChild(val); st.appendChild(pl); row.appendChild(st);
    } else {
      const lb = el('button', 'btn gold learn', 'Học ' + fmtK(r.unlock));
      lb.onclick = () => {
        if (G.cash < r.unlock) { Sound.sfx('error'); UI.shake(lb); UI.toast('Không đủ tiền học món này', 'err'); return; }
        G.cash -= r.unlock; G.today.learn += r.unlock; G.recipes[r.id] = true; Sound.sfx('level'); const p = UI.pos(lb); UI.burst(p.x, p.y, 'spark', 14);
        UI.toast('Đã học ' + r.name + '!', 'ok'); Save.save(); Kitchen.renderTab();
      };
      row.appendChild(lb);
    }
    list.appendChild(row); rows[r.id] = row;
  });
  list.appendChild(el('div', 'hint', 'Bấm + để chọn số mẻ (1 mẻ = ' + DATA.PORTIONS + ' phần)'));

  function setPlan(id, n) {
    const cap = Calc.potCap();
    const used = Object.entries(G.plan).reduce((s, [k, v]) => s + (k === id ? 0 : v), 0);
    n = clamp(n, 0, Math.max(0, cap - used));
    if (n > (G.plan[id] || 0) && used + n >= cap && (G.plan[id] || 0) + 0 === n - 1 && used + n === cap) { /* đạt trần */ }
    if (n === (G.plan[id] || 0) && n > 0 && used + n >= cap) { UI.toast('Nồi đã đầy (' + cap + ' mẻ). Nâng cấp nồi to hơn nhé!', 'info'); Sound.sfx('error'); }
    G.plan[id] = n; if (!n) delete G.plan[id];
    Sound.sfx('tap'); refreshPlan();
  }
  function refreshPlan() {
    const cap = Calc.potCap(), batches = Object.values(G.plan).reduce((a, b) => a + b, 0);
    Object.entries(rows).forEach(([id, row]) => {
      const r = DATA.REC_BY[id]; const v = row.querySelector('.val'); if (v) v.textContent = G.plan[id] || 0;
      row.classList.toggle('sel', !!G.plan[id]);
      row.querySelectorAll('.nd').forEach((nd) => { const need = +nd.dataset.v * Math.max(1, G.plan[id] || 1); nd.classList.toggle('lack', (G.ingr[nd.dataset.k] || 0) < need); });
      const sm = row.querySelector('.rs');
      sm.textContent = 'Vốn ' + fmtK(Calc.unitCost(r)) + '/phần · giá chợ ' + fmtK(Calc.refPrice(id));
    });
    const { cost } = Calc.shortage(G.plan);
    body.querySelector('.potinfo').textContent = '(nồi ' + batches + '/' + cap + ' mẻ)';
    const t = Calc.cookTime(batches);
    stockLine.innerHTML = '<b>Xôi đã chín:</b> ' + (Calc.totalStock() ? Object.entries(G.stock).filter(([, n]) => n > 0).map(([k, n]) => DATA.REC_BY[k].name.replace('Xôi ', '') + ' <b>' + n + '</b>').join(' · ') : 'Chưa có mẻ nào. Chọn món rồi bấm "Đi chợ & Đồ xôi".');
    foot.querySelector('.plan-sum').innerHTML = batches ? '<b>' + batches + ' mẻ</b> · cần mua thêm <b>' + fmt(cost) + '</b> · ' + t + 's' : 'Bấm + để chọn số mẻ (1 mẻ = ' + DATA.PORTIONS + ' phần)';
    const cb = foot.querySelector('.cook-btn'); cb.classList.toggle('disabled', !batches);
    foot.querySelectorAll('.nd').length;
    UI.updateHud();
  }
  foot.innerHTML = '<div class="plan-sum"></div>'; foot.appendChild(footButtons(true));
  refreshPlan();
  Kitchen.refreshPlan = refreshPlan;
}

/* ===== Đi chợ & Đồ xôi ===== */
const Cooking = {
  async start() {
    if (Kitchen.cooking) return;
    const plan = Object.assign({}, G.plan);
    const batches = Object.values(plan).reduce((a, b) => a + b, 0);
    if (!batches) { Sound.sfx('error'); UI.toast('Hãy chọn ít nhất 1 mẻ để đồ', 'err'); return; }
    const { lack, cost } = Calc.shortage(plan);
    if (cost > G.cash) { Sound.sfx('error'); UI.toast('Thiếu ' + fmt(cost - G.cash) + ' để mua đủ nguyên liệu. Giảm số mẻ nhé!', 'err'); UI.shake($('.k-panel')); return; }
    Kitchen.cooking = true;
    const ov = el('div', 'cook-ov'); Kitchen.root.appendChild(ov);
    const hasLack = Object.keys(lack).length > 0;
    if (hasLack) {
      ov.innerHTML = '<div class="cook-box walk"><div class="cook-title">Đi chợ…</div><div class="walk-strip"><canvas class="pix"></canvas></div><div class="lack"></div></div>';
      const lk = $('.lack', ov);
      Object.entries(lack).forEach(([k, n], i) => { setTimeout(() => { Sound.sfx('buy'); lk.innerHTML += '<span class="nd">' + DATA.ING_BY[k].icon + '<i>+' + n + '</i></span>'; }, 300 + i * 220); });
      const cv = $('canvas', ov), mk = Scenes.market(cv, { H: 82 }); cv.style.width = '100%';
      const v = Sprite.vendor({ skin: '#d9a070', hair: '#cfcfcf', shirt: '#8a5a38', pants: '#2c2a30' });
      let tt = 0; const fn = Loop.add((dt) => { tt += dt; mk.update(dt); const cx = cv.getContext('2d'); cx.drawImage(v, Math.round(-30 + tt * 40) % 150 - 20, 44); });
      await sleep(600 + Object.keys(lack).length * 220 + 500); Loop.remove(fn);
      G.cash -= cost; G.today.cost += cost;
      Object.entries(lack).forEach(([k, n]) => { G.ingr[k] = (G.ingr[k] || 0) + n; });
      UI.updateHud(); UI.moneyFx(-cost);
    }
    // trừ nguyên liệu
    const need = Calc.need(plan); Object.entries(need).forEach(([k, v]) => { G.ingr[k] = (G.ingr[k] || 0) - v; });
    // đồ xôi
    let T = Calc.cookTime(batches), left = T;
    ov.innerHTML = '<div class="cook-box"><div class="cook-title">Đang đồ xôi…</div><div class="cook-bar"><i></i></div><div class="cook-time"></div><button class="btn big gold fan">🪭 Quạt lửa!</button><div class="cook-hint">Chạm liên tục để xôi chín nhanh hơn</div></div>';
    Kitchen.scene.setCooking(true); Sound.sfx('steam');
    const bar = $('.cook-bar i', ov), tm = $('.cook-time', ov), fan = $('.fan', ov);
    fan.addEventListener('pointerdown', () => { left = Math.max(0, left - 0.3 - T * 0.012); Kitchen.scene.poke(); Sound.sfx('fire'); const p = UI.pos(fan); UI.burst(p.x + (Math.random() - 0.5) * 60, p.y - 10, 'spark', 4); fan.classList.remove('bump'); void fan.offsetWidth; fan.classList.add('bump'); });
    let st = 0;
    await new Promise((res) => {
      const f = Loop.add((dt) => {
        left -= dt; st += dt; bar.style.width = clamp((1 - left / T) * 100, 0, 100) + '%'; tm.textContent = Math.max(0, Math.ceil(left)) + 's';
        if (st > 1.3) { st = 0; Sound.sfx('steam'); }
        if (left <= 0) { Loop.remove(f); res(); }
      });
    });
    Kitchen.scene.setCooking(false);
    const got = {}; const yb = 1 + Calc.yieldBonus();
    Object.entries(plan).forEach(([rid, b]) => { const n = Math.round(b * DATA.PORTIONS * yb); G.stock[rid] = (G.stock[rid] || 0) + n; got[rid] = n; });
    G.plan = {}; Save.save();
    Sound.sfx('bell'); Sound.sfx('success'); Sound.vibrate([60, 40, 90]);
    ov.innerHTML = '<div class="cook-box done"><div class="cook-title">🎉 Xôi chín rồi!</div><div class="done-list"></div><button class="btn red big ok">Tuyệt!</button></div>';
    const dl = $('.done-list', ov);
    Object.entries(got).forEach(([rid, n], i) => {
      const r = DATA.REC_BY[rid]; const d = el('div', 'done-item'); d.style.animationDelay = i * 0.12 + 's';
      d.appendChild(pixImg(Sprite.bowl(r.color, r.id), 1.5, 'bowl hi')); d.appendChild(el('b', '', r.name)); d.appendChild(el('span', 'x', '+' + n + ' phần')); dl.appendChild(d);
    });
    const c = UI.pos($('.cook-box', ov)); UI.burst(c.x, c.y, 'confetti', 30);
    await new Promise((res) => { $('.ok', ov).onclick = res; });
    ov.remove(); Kitchen.cooking = false;
    Kitchen.renderTab();
  },
};
