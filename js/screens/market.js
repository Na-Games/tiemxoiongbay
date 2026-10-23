/* Bảng giá, bán hàng ngoài chợ, tổng kết ngày */
UI.register('price', {
  enter(root) {
    root.innerHTML = '';
    const wrap = el('div', 'pricing'); root.appendChild(wrap);
    wrap.appendChild(UI.hud({ onMenu: () => pauseMenu() }));
    const street = el('canvas', 'pix scene-cv price-bg'); wrap.appendChild(street);
    const sc = Scenes.market(street); const tick = Loop.add((dt) => sc.update(dt));
    const board = el('div', 'board'); wrap.appendChild(board);
    board.innerHTML = '<h2>BẢNG GIÁ HÔM NAY</h2><div class="board-list"></div><div class="board-foot"></div>';
    const list = $('.board-list', board);
    const ids = DATA.RECIPES.filter((r) => (G.stock[r.id] || 0) > 0).map((r) => r.id);
    const mood = (id) => {
      const r = G.prices[id] / Calc.refPrice(id), tol = Calc.priceTol();
      return r < 0.97 ? ['😍', 'Rẻ, khách đông', 'good'] : r <= tol ? ['🙂', 'Giá hợp lý', 'ok'] : r <= tol + 0.15 ? ['😟', 'Hơi đắt', 'warn'] : ['😡', 'Quá đắt!', 'bad'];
    };
    const row = {};
    ids.forEach((id) => {
      const r = DATA.REC_BY[id]; const d = el('div', 'brow');
      d.appendChild(pixImg(Sprite.bowl(r.color, r.id), 1.7, 'bowl hi'));
      d.appendChild(el('div', 'binfo', '<b>' + r.name + '</b><small>còn ' + G.stock[id] + ' phần · vốn ' + fmtK(Calc.unitCost(r)) + ' · giá chợ ' + fmtK(Calc.refPrice(id)) + '</small><small class="mood"></small>'));
      const st = el('div', 'stepper pr'); const mn = el('button', 'sb minus', '−'), val = el('b', 'val'), pl = el('button', 'sb plus', '+');
      const set = (n) => { const ref = Calc.refPrice(id); G.prices[id] = clamp(Math.round(n / 500) * 500, Math.round(ref * 0.5 / 500) * 500, Math.round(ref * 1.8 / 500) * 500); draw(); Sound.sfx('tap'); };
      mn.onclick = () => set(G.prices[id] - 500); pl.onclick = () => set(G.prices[id] + 500);
      st.appendChild(mn); st.appendChild(val); st.appendChild(pl); d.appendChild(st); list.appendChild(d);
      row[id] = { d, val };
    });
    const draw = () => ids.forEach((id) => { row[id].val.textContent = fmtK(G.prices[id]); const m = mood(id); const s = $('.mood', row[id].d); s.textContent = m[0] + ' ' + m[1]; s.className = 'mood ' + m[2]; });
    draw();
    if (!ids.length) list.innerHTML = '<div class="empty">Chưa có xôi để bán. Hãy về bếp đồ xôi trước nhé!</div>';
    $('.board-foot', board).innerHTML = 'Phí chợ hôm nay: <b>' + fmt(Calc.marketFee()) + '</b>. Giá phải chăng thì đông khách.';
    const btns = el('div', 'foot-btns'); wrap.appendChild(btns);
    const back = el('button', 'btn gray', 'Về bếp'); back.onclick = () => UI.go('kitchen');
    const go = el('button', 'btn red go-btn', 'Bày hàng! <span>➜</span>');
    go.onclick = async () => {
      if (go.dataset.busy) return; go.dataset.busy = 1;
      const fee = Math.min(G.cash, Calc.marketFee()); G.cash -= fee; G.today.fee += fee; Save.save(); UI.moneyFx(-fee);
      Sound.sfx('door');
      // chuyển cảnh: gánh xôi ra chợ
      const ov = el('div', 'cook-ov haul');
      ov.innerHTML = '<div class="cook-box"><div class="cook-title">Gánh xôi ra chợ…</div><div class="walk-strip"><canvas class="pix"></canvas></div><div class="cook-bar"><i></i></div><div class="cook-hint">' + pick(DATA.TIPS) + '</div></div>';
      wrap.appendChild(ov);
      const cv = $('canvas', ov), mk = Scenes.market(cv, { H: 82 }); cv.style.width = '100%';
      const v = Sprite.vendor({ skin: '#d9a070', hair: '#cfcfcf', shirt: '#8a5a38', pants: '#2c2a30' });
      let tt = 0; const bar = $('.cook-bar i', ov);
      const f = Loop.add((dt) => { tt += dt; mk.update(dt); const cx = cv.getContext('2d'); cx.drawImage(v, Math.round(-20 + tt * 55), 40 + Math.round(Math.abs(Math.sin(tt * 7))), 36, 30); bar.style.width = clamp(tt / 1.7 * 100, 0, 100) + '%'; });
      Sound.sfx('whoosh');
      await sleep(1800); Loop.remove(f);
      UI.go('market');
    };
    btns.appendChild(back); btns.appendChild(go);
    UI.updateHud(); Sound.ambient('market'); Sound.setTempo(1.1); if (Sound.ctx) Sound.playMusic();
    Tutor.run('price');
    return () => Loop.remove(tick);
  },
});

const SHOP_SIGNS = ['TẠP HÓA', 'CÀ PHÊ SÁNG', 'RAU QUẢ'];
const PARCEL_X = [34, 50, 66]; // vị trí 3 gói đang chờ giao trên quầy (% chiều rộng cảnh)

UI.register('market', {
  enter(root) {
    root.innerHTML = '';
    const shop = Calc.isShop();
    const M = { t: 0, dur: 105, ended: false, paused: false, custs: [], seq: 0, spawnT: 1.2, bag: {}, parcels: [], pid: 0, focus: null, rev: 0, served: 0, lost: 0, rush: 0, emptyT: 0, auto: 0, tiT: 4, onlineT: 9, vir: false, incN: 0, blackout: 0, pcAt: shop ? rnd(25, 75) : -1 };
    const wrap = el('div', 'market'); root.appendChild(wrap);
    const hud = UI.hud({ clock: true, onMenu: () => {
      const b = el('div', 'menu-list');
      [['▶️ Tiếp tục bán', 'gold', null], ['⚙️ Cài đặt', 'gray', () => Settings.open()], ['❓ Hướng dẫn', 'gray', () => Guide.open('sell')]].forEach(([t, c, f]) => { const x = el('button', 'btn ' + c, t); x.onclick = () => { m.close(); if (f) f(); }; b.appendChild(x); });
      b.appendChild(el('div', 'hint', 'Muốn kết thúc sớm hãy bấm "Dọn hàng". Chợ vẫn chạy khi mở menu!'));
      const m = UI.modal({ title: 'Menu', icon: '☰', body: b, dismiss: true });
    } }); wrap.appendChild(hud);
    const sceneBox = el('div', 'm-scene'); const cv = el('canvas', 'pix scene-cv'); sceneBox.appendChild(cv); wrap.appendChild(sceneBox);
    const sc = Scenes.market(cv, { overlay: true }); sc.staff = staffSprites([26, 88, 12, 100]);
    const wx = weatherLayer(sceneBox, G.weather);
    SHOP_SIGNS.forEach((t, i) => { const s = el('div', 'shop-sign s' + i, t); sceneBox.appendChild(s); });
    sceneBox.appendChild(equipBar());
    const custLayer = el('div', 'cust-layer'); sceneBox.appendChild(custLayer);
    const dark = el('div', 'blackout', '<b>⚡ MẤT ĐIỆN!</b><span>Chờ có điện mới bán được…</span>'); sceneBox.appendChild(dark);
    const seats = Calc.seats();
    const strip = el('div', 'm-strip', '<img class="pix hi sp"><div class="sq"><b>Chợ mở cửa!</b> Khách sắp tới rồi, chuẩn bị bán nào.</div>'); wrap.appendChild(strip);
    const tray = el('div', 'm-tray'); wrap.appendChild(tray);
    const bagLine = el('div', 'bag-line'); wrap.appendChild(bagLine);
    const ctl = el('div', 'm-ctl'); wrap.appendChild(ctl);
    const leafBtn = el('button', 'btn green leaf-btn'), wrapBtn = el('button', 'btn gray wrap-btn', 'Gói lá'), undoBtn = el('button', 'btn blue undo-btn', 'Lấy lại'), rejectBtn = el('button', 'btn gray reject-btn', 'Từ chối'), endBtn = el('button', 'btn red end-btn', 'Dọn hàng');
    [leafBtn, wrapBtn, undoBtn, rejectBtn, endBtn].forEach((b) => ctl.appendChild(b));

    const recs = DATA.RECIPES.filter((r) => (G.stock[r.id] || 0) > 0 || G.recipes[r.id]).filter((r) => (G.stock[r.id] || 0) > 0);
    const cards = {};
    recs.forEach((r) => {
      const c = el('button', 'card', '<span class="cnt"></span><span class="cn">' + r.name + '</span><span class="cp">' + fmtK(G.prices[r.id]) + '</span>');
      c.prepend(pixImg(Sprite.bowl(r.color, r.id), 1.8, 'bowl hi'));
      c.dataset.rid = r.id; c.onclick = () => addBag(r.id, c); tray.appendChild(c); cards[r.id] = c;
    });
    if (!recs.length) tray.innerHTML = '<div class="empty">Không còn xôi. Hãy dọn hàng nhé!</div>';

    const stockLeft = (id) => (G.stock[id] || 0) - (M.bag[id] || 0);
    const bagQty = () => Object.values(M.bag).reduce((a, b) => a + b, 0);
    const orderQty = (o) => Object.values(o).reduce((a, b) => a + b, 0);
    const orderTotal = (o) => Object.entries(o).reduce((s, [k, n]) => s + G.prices[k] * n, 0);
    function sameOrder(a, b) {
      const ks = new Set([...Object.keys(a), ...Object.keys(b)]);
      for (const k of ks) if ((a[k] || 0) !== (b[k] || 0)) return false; return true;
    }
    const waiting = () => M.custs.filter((x) => x.state === 'wait');
    const outOf = (c) => Object.entries(c.order).some(([k, n]) => (G.stock[k] || 0) < n);
    function refresh() {
      recs.forEach((r) => { const c = cards[r.id]; const n = stockLeft(r.id); c.querySelector('.cnt').textContent = n; c.classList.toggle('empty', n <= 0); });
      const items = Object.entries(M.bag).filter(([, n]) => n > 0).map(([k, n]) => '<span class="bi"><img class="bi-img" src="' + Sprite.bowlURL(DATA.REC_BY[k].color, k) + '">' + DATA.REC_BY[k].name.replace('Xôi ', '') + ' ×' + n + '</span>').join('');
      bagLine.innerHTML = '<span>Túi:</span> ' + (items || '<i>trống</i>') + (M.parcels.length ? '<span class="pc-n">📦 ' + M.parcels.length + ' gói chờ giao</span>' : '');
      leafBtn.innerHTML = '🍃 Lá: <b>' + (G.ingr.la || 0) + '</b>';
      leafBtn.classList.toggle('low', (G.ingr.la || 0) < 4);
      wrapBtn.classList.toggle('ready', bagQty() > 0);
      wrapBtn.textContent = Calc.lvl('leaf') ? 'Giao ngay' : 'Gói lá';
      M.custs.forEach((c) => {
        if (c.state !== 'wait') return;
        c.el.classList.toggle('outstock', outOf(c));
        c.el.classList.toggle('recv', M.parcels.some((p) => p.ready && sameOrder(p.order, c.order)));
      });
      rejectBtn.classList.toggle('alert', !!(M.focus && outOf(M.focus)));
      UI.updateHud();
    }
    const orderHtml = (o) => Object.entries(o).map(([k, n]) => { const r = DATA.REC_BY[k]; return '<span class="oi"><img class="oimg" src="' + Sprite.bowlURL(r.color, k) + '"><span class="on">' + r.name + (n > 1 ? ' <b>×' + n + '</b>' : '') + '</span></span>'; }).join('');
    const orderText = (o) => Object.entries(o).map(([k, n]) => '<b>' + n + ' ' + DATA.REC_BY[k].name + '</b>').join(' + ');
    function setFocus(c) {
      M.focus = c; M.custs.forEach((x) => x.el.classList.toggle('focus', x === c));
      if (c) {
        $('.sp', strip).src = portraitURL(c.look, { talk: true }); $('.sp', strip).style.width = '52px';
        $('.sq', strip).innerHTML = '<b>' + c.name + ':</b> ' + c.quip + '<div class="want">Muốn mua: ' + orderText(c.order) + ' = <b>' + fmt(orderTotal(c.order)) + '</b></div>';
        Sound.sfx('talk');
      } else $('.sq', strip).innerHTML = '<b>…</b> Chưa có khách. Chờ chút nhé.';
      refresh();
    }
    const noPower = () => { if (M.blackout > 0) { Sound.sfx('error'); UI.toast('⚡ Đang mất điện, chưa bán được!', 'err'); return true; } return false; };
    function addBag(id, card) {
      if (M.ended || noPower()) return;
      if (stockLeft(id) <= 0) { Sound.sfx('error'); UI.shake(card); return; }
      M.bag[id] = (M.bag[id] || 0) + 1; Sound.sfx('pop'); const p = UI.pos(card); UI.burst(p.x, p.y, 'steam', 3);
      card.classList.remove('bump'); void card.offsetWidth; card.classList.add('bump'); refresh();
      const f = M.focus;
      if (Calc.lvl('leaf') && f && f.state === 'wait' && sameOrder(M.bag, f.order)) setTimeout(() => { if (M.focus === f && f.state === 'wait' && sameOrder(M.bag, f.order)) wrapBag(f); }, 220);
    }
    undoBtn.onclick = () => {
      if (bagQty()) { M.bag = {}; Sound.sfx('whoosh'); refresh(); return; }
      const pc = M.parcels.filter((p) => p.ready).pop();
      if (!pc) { Sound.sfx('error'); return; }
      M.parcels = M.parcels.filter((p) => p !== pc); Object.entries(pc.order).forEach(([k, n]) => { G.stock[k] = (G.stock[k] || 0) + n; });
      pc.el.remove(); Sound.sfx('whoosh'); UI.toast('Đã mở gói, trả xôi về khay (lá chuối mất)', 'info'); refresh();
    };
    leafBtn.onclick = () => {
      const cost = DATA.ING_BY.la.price * 1000;
      if (G.cash < cost) { Sound.sfx('error'); UI.toast('Không đủ tiền mua lá', 'err'); return; }
      G.cash -= cost; G.today.cost += cost; G.ingr.la = (G.ingr.la || 0) + 16; Sound.sfx('leaf'); UI.moneyFx(-cost, leafBtn); refresh();
    };
    wrapBtn.onclick = () => wrapBag(null);
    rejectBtn.onclick = () => {
      const c = M.focus;
      if (!c || c.state !== 'wait') { Sound.sfx('error'); UI.toast('Chạm vào khách muốn từ chối trước nhé', 'info'); return; }
      c.state = 'refused'; G.rep = clamp(G.rep - 0.3, 0, 100); M.refused = (M.refused || 0) + 1;
      const p = UI.pos(c.el, 0.5, 0.1); UI.float('Xin lỗi, hết món này ạ 🙏', p.x, p.y, 'say'); $('.bubble', c.el).innerHTML = '😕'; Sound.sfx('door');
      remove(c, 'angry');
    };
    endBtn.onclick = async () => {
      if (S().confirmEnd && (M.t < M.dur - 8) && !(await UI.confirm('Dọn hàng sớm? Xôi chưa bán hết sẽ phải bỏ (trừ khi có thùng ủ nóng).', 'Dọn hàng', 'Bán tiếp'))) return;
      endDay();
    };

    /* ---- Gói xôi: trải lá, bỏ xôi, gấp lá, buộc dây, rồi đặt lên quầy chờ giao ---- */
    function wrapBag(autoTo) {
      if (M.ended || noPower()) return;
      if (!bagQty()) { Sound.sfx('error'); UI.toast('Túi đang trống. Chạm món xôi ở khay để bỏ vào túi', 'info'); return; }
      if (M.parcels.length >= 3) { Sound.sfx('error'); UI.toast('Quầy chỉ để được 3 gói. Hãy chạm khách để giao bớt!', 'info'); return; }
      const order = Object.assign({}, M.bag), qty = orderQty(order);
      Object.entries(order).forEach(([k, n]) => { G.stock[k] -= n; });
      const hasLeaf = (G.ingr.la || 0) >= qty; if (hasLeaf) G.ingr.la -= qty;
      const used = new Set(M.parcels.map((p) => p.slot)); let slot = 0; while (used.has(slot)) slot++;
      const pc = { id: ++M.pid, order, qty, hasLeaf, slot, ready: false, el: null };
      M.parcels.push(pc); M.bag = {}; refresh();
      makePack(pc, !!Calc.lvl('leaf')).then(() => {
        refresh();
        if (autoTo && autoTo.state === 'wait' && M.parcels.includes(pc)) deliver(autoTo, pc);
        else if (!autoTo) { $('.sq', strip).innerHTML = '<b>Gói xong rồi!</b> <span class="want">Chạm vào <b>khách đang cần món này</b> để giao hàng.</span>'; }
      });
    }
    async function makePack(pc, fast) {
      const names = Object.entries(pc.order).map(([k, n]) => DATA.REC_BY[k].name.replace('Xôi ', '') + (n > 1 ? '×' + n : '')).join(' + ');
      const pk = el('div', 'pack' + (pc.hasLeaf ? '' : ' noleaf'));
      pk.style.left = PARCEL_X[pc.slot % 3] + '%';
      pk.innerHTML = '<div class="pk-label"></div><div class="pk-body"><div class="pk-leaf"></div><div class="pk-rice"></div><div class="pk-flap l"></div><div class="pk-flap r"></div><div class="pk-str"></div><div class="pk-knot"></div></div><div class="pk-tag"></div>';
      const rice = $('.pk-rice', pk); $('.pk-tag', pk).textContent = names;
      Object.keys(pc.order).slice(0, 3).forEach((k) => { const im = new Image(); im.src = Sprite.bowlURL(DATA.REC_BY[k].color, k); rice.appendChild(im); });
      sceneBox.appendChild(pk); pc.el = pk;
      const label = $('.pk-label', pk), gap = fast ? 110 : 260;
      const step = async (n, txt, sfx) => { pk.dataset.step = n; label.textContent = txt; if (sfx) Sound.sfx(sfx); await sleep(gap); };
      await step(1, pc.hasLeaf ? 'Trải lá' : 'Không có lá', 'leaf');
      await step(2, 'Xúc xôi', 'pop');
      const pp = UI.pos(pk, 0.5, 0.4); UI.burst(pp.x, pp.y, 'steam', 3);
      await step(3, 'Gấp lá', 'leaf');
      await step(4, 'Buộc dây', 'tap');
      pk.dataset.step = 5; label.textContent = ''; pk.classList.add('rest'); pc.ready = true; Sound.sfx('pop');
      UI.burst(pp.x, pp.y, 'spark', 5);
    }
    /* Chuyền gói xôi từ quầy sang tay khách */
    async function flyParcel(pk, c) {
      Sound.sfx('whoosh');
      const a = pk.getBoundingClientRect(), b = c.el.getBoundingClientRect();
      const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height * 0.5 - (a.top + a.height * 0.5);
      pk.classList.remove('rest'); pk.classList.add('flying'); $('.pk-tag', pk).textContent = '';
      const fly = pk.animate([{ transform: 'translate(0,0) scale(1) rotate(0)' }, { transform: 'translate(' + dx * 0.5 + 'px,' + (dy * 0.5 - 34) + 'px) scale(1.15) rotate(-12deg)', offset: 0.5 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.6) rotate(8deg)', opacity: 0.95 }], { duration: 460, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
      await fly.finished.catch(() => {});
      const pt = UI.pos(c.el, 0.5, 0.5); UI.burst(pt.x, pt.y, 'spark', 6); Sound.sfx('pop');
      pk.remove();
    }
    /* Tính tiền đúng theo giá bảng giá đã đặt; boa và phạt hiện riêng */
    function settle(c, order, hasLeaf) {
      const qty = orderQty(order), base = orderTotal(order);
      const fastSv = c.pat / c.max > 0.6;
      const boa = Math.round((base * (Calc.tip() + (fastSv ? 0.08 : 0))) / 500) * 500;
      const pen = hasLeaf ? 0 : Math.round((base * 0.2) / 500) * 500;
      const rev = base + boa - pen;
      Object.entries(order).forEach(([k, n]) => { G.today.sold[k] = (G.today.sold[k] || 0) + n; });
      G.cash += rev; G.today.rev += rev; M.rev += rev; M.served++; G.today.served++; G.stats.served++; G.stats.revenue += rev; G.stats.sold += qty;
      G.rep = clamp(G.rep + 0.5 * (1 + Calc.lvl('sign') * 0.25), 0, 100);
      return { base, boa, pen, rev };
    }
    function deliver(c, pc) {
      if (c.state !== 'wait') return;
      M.parcels = M.parcels.filter((p) => p !== pc);
      c.state = 'serving'; Sound.vibrate(25);
      const r = settle(c, pc.order, pc.hasLeaf);
      if (M.focus === c) setFocus(waiting()[0] || null); else refresh();
      flyParcel(pc.el, c).then(() => {
        const p = UI.pos(c.el, 0.5, 0.3); UI.burst(p.x, p.y, 'coin', 8); UI.float('+' + fmt(r.base), p.x, p.y - 20, 'gain'); Sound.sfx('coin');
        if (r.boa) setTimeout(() => UI.float('Boa +' + fmt(r.boa), p.x, p.y - 44, 'gain'), 250);
        if (r.pen) setTimeout(() => UI.float('Không có lá −' + fmt(r.pen), p.x, p.y - 44, 'loss'), 250);
        $('.bubble', c.el).innerHTML = '😋'; remove(c, 'happy'); UI.moneyFx(r.rev);
      });
    }
    /* Chạm vào khách: xem đơn, và giao gói nếu đúng món */
    function tapCust(c) {
      if (M.ended) return;
      setFocus(c);
      if (c.state !== 'wait' || !M.parcels.length) return;
      if (noPower()) return;
      const ready = M.parcels.filter((p) => p.ready);
      if (!ready.length) { UI.toast('Đang gói, chờ một chút nhé', 'info'); return; }
      const pc = ready.find((p) => sameOrder(p.order, c.order));
      if (pc) return deliver(c, pc);
      Sound.sfx('error'); Sound.vibrate(120); UI.shake(c.el); c.pat -= 2.5;
      const p = UI.pos(c.el, 0.5, 0.1); UI.float('Sai món rồi!', p.x, p.y - 20, 'loss');
    }
    function autoServe(name) {
      if (M.blackout > 0) return;
      const c = waiting().find((x) => x !== M.focus) || waiting()[0];
      if (!c || (c === M.focus && bagQty())) return;
      if (outOf(c)) return;
      const order = Object.assign({}, c.order), qty = orderQty(order);
      Object.entries(order).forEach(([k, n]) => { G.stock[k] -= n; });
      const hasLeaf = (G.ingr.la || 0) >= qty; if (hasLeaf) G.ingr.la -= qty;
      c.state = 'serving';
      const pc = { order, qty, hasLeaf, slot: 1, ready: false, el: null };
      const p = UI.pos(c.el, 0.5, 0.1); UI.float(name, p.x, p.y, 'say');
      const r = settle(c, order, hasLeaf);
      if (M.focus === c) setFocus(waiting()[0] || null); else refresh();
      makePack(pc, true).then(() => flyParcel(pc.el, c)).then(() => {
        const q = UI.pos(c.el, 0.5, 0.3); UI.burst(q.x, q.y, 'coin', 6); UI.float('+' + fmt(r.base), q.x, q.y - 20, 'gain'); Sound.sfx('coin');
        $('.bubble', c.el).innerHTML = '😋'; remove(c, 'happy'); UI.moneyFx(r.rev);
      });
    }

    /* ---- Khách hàng ---- */
    const slotX = (i) => (seats === 1 ? 50 : 19 + (i * 62) / (seats - 1));
    function freeSlot() { const used = new Set(M.custs.map((c) => c.slot)); for (let i = 0; i < seats; i++) if (!used.has(i)) return i; return -1; }
    function pickRecipe() {
      const inStock = recs.filter((r) => G.stock[r.id] > 0);
      const unlocked = DATA.RECIPES.filter((r) => G.recipes[r.id]);
      const w = (r) => r.pop * Calc.demandMul(r.id) * (G.stock[r.id] > 0 ? 1 : 0.7) * clamp(Calc.refPrice(r.id) / G.prices[r.id], 0.5, 1.4);
      const pool = (chance(0.8) && inStock.length ? inStock : unlocked);
      let tot = 0; pool.forEach((r) => (tot += w(r))); let x = Math.random() * tot;
      for (const r of pool) { x -= w(r); if (x <= 0) return r; } return pool[0];
    }
    function spawn(force) {
      if (!recs.length && !force) return;
      const slot = freeSlot(); if (slot < 0) return;
      const cd = pick(DATA.CUSTOMERS);
      const r = pickRecipe(); const q = chance(0.55) ? 1 : chance(0.7) ? 2 : 3;
      const order = {}; order[r.id] = q;
      if (q >= 2 && chance(0.25) && inStockCount() > 1) { const r2 = pickRecipe(); if (r2.id !== r.id) { order[r.id] = q - 1; order[r2.id] = 1; } }
      // sản phẩm hết hàng: đa số khách bỏ đi ngay, số còn lại ở lại để người chơi từ chối
      if (Object.keys(order).some((k) => !(G.stock[k] > 0))) { if (chance(0.6)) { M.lost++; G.rep = clamp(G.rep - 0.2, 0, 100); fly('Hết xôi rồi 😢'); return; } }
      // giá quá đắt
      const ratio = G.prices[r.id] / Calc.refPrice(r.id), tol = Calc.priceTol();
      if (ratio > tol && chance(clamp((ratio - tol) * 3.5 + 0.1, 0, 0.92))) { M.lost++; fly('Đắt quá, thôi!'); return; }
      const c = { id: ++M.seq, name: cd.name, look: cd.look, quip: pick(cd.quips), order, slot, pat: Calc.patience() * (0.85 + Math.random() * 0.3), state: 'wait' }; c.max = c.pat;
      const e = el('div', 'cust'); e.style.left = slotX(slot) + '%';
      const img = pixImg(Sprite.charHi(cd.look), cd.look.small ? 0.72 : 0.84, 'sprite hi');
      const st = pixImg(Sprite.stool(slot % 2 ? '#2f7fd0' : '#e04a3a'), 2.2, 'stool');
      e.innerHTML = '<div class="bubble"></div><div class="pat"><i></i></div>'; e.appendChild(st); e.appendChild(img);
      $('.bubble', e).innerHTML = orderHtml(order);
      e.classList.add('enter', slot < seats / 2 ? 'fromL' : 'fromR'); custLayer.appendChild(e);
      e.dataset.order = JSON.stringify(order); e.onpointerdown = () => tapCust(c);
      c.el = e; M.custs.push(c); Sound.sfx('pop');
      if (!M.focus) setFocus(c); else refresh();
    }
    const inStockCount = () => recs.filter((r) => G.stock[r.id] > 0).length;
    function fly(text) { const p = UI.pos(sceneBox, 0.5, 0.35); UI.float(text, p.x, p.y, 'say'); }
    function remove(c, kind) {
      M.custs = M.custs.filter((x) => x !== c); c.state = kind; c.el.classList.add(kind === 'happy' ? 'leave-happy' : 'leave-angry'); setTimeout(() => c.el.remove(), 600);
      if (M.focus === c) { M.bag = {}; setFocus(waiting()[0] || null); } else refresh();
    }

    /* ---- Sự cố: mất điện, côn đồ, trộm, kiểm tra ---- */
    function startBlackout(dur) {
      M.blackout = dur; dark.classList.add('on'); Sound.sfx('door'); Sound.vibrate([80, 40, 120]); UI.shake(sceneBox);
      UI.toast('⚡ Mất điện! Nhà không có máy phát điện nên phải đứng chờ…', 'err');
    }
    function incident() {
      const pool = ['baoke'];
      if (shop) { pool.push('theft', 'theft'); if (!Calc.lvl('lic')) pool.push('lic'); if (!Calc.lvl('atp')) pool.push('atp'); }
      const kind = pick(pool);
      if (kind === 'baoke') {
        if (G.staff.ba || G.staff.vesi) { UI.toast('🛡️ ' + (G.staff.vesi ? 'Vệ sĩ Hổ' : 'Chú Ba') + ' đuổi kẻ gây rối khỏi chợ!', 'ok'); Sound.sfx('success'); return; }
        const loss = Math.min(G.cash, 30000); G.cash -= loss; G.today.fee += loss; G.rep = clamp(G.rep - 2, 0, 100);
        UI.toast('😠 Côn đồ đòi tiền bảo kê: -' + fmt(loss), 'err'); UI.shake(sceneBox); Sound.sfx('hit'); Sound.vibrate([120, 60, 120]);
      } else if (kind === 'theft') {
        const th = el('div', 'thief', '🦹'); sceneBox.appendChild(th); setTimeout(() => th.remove(), 2600);
        if (chance(Calc.theftBlock())) {
          const g = DATA.STAFF.filter((s) => G.staff[s.id] && s.fx.theft).sort((a, b) => b.fx.theft - a.fx.theft)[0];
          th.classList.add('caught'); UI.toast('🛡️ ' + g.name + ' bắt quả tang tên trộm!', 'ok'); Sound.sfx('success');
        } else {
          const loss = Math.min(G.cash, ri(20, 40) * 1000); G.cash -= loss; G.today.fee += loss;
          const have = recs.filter((r) => G.stock[r.id] > 0); let lost = '';
          if (have.length) { const r = pick(have), n = Math.min(G.stock[r.id], ri(2, 4)); G.stock[r.id] -= n; lost = ' và ' + n + ' ' + r.name.toLowerCase(); }
          G.rep = clamp(G.rep - 1, 0, 100); UI.toast('🦹 Kẻ trộm lấy mất ' + fmt(loss) + lost + '! Cần thuê bảo vệ.', 'err'); UI.shake(sceneBox); Sound.sfx('hit'); Sound.vibrate([100, 50, 100]);
        }
      } else if (kind === 'lic') {
        const loss = Math.min(G.cash, 50000); G.cash -= loss; G.today.fee += loss; G.rep = clamp(G.rep - 3, 0, 100);
        UI.toast('📜 Đoàn kiểm tra phạt ' + fmt(loss) + ' vì chưa có giấy phép kinh doanh!', 'err'); UI.shake(sceneBox); Sound.sfx('hit'); Sound.vibrate([120, 60, 120]);
      } else {
        const loss = Math.min(G.cash, 40000); G.cash -= loss; G.today.fee += loss; G.rep = clamp(G.rep - 4, 0, 100);
        UI.toast('🧼 Thanh tra phạt ' + fmt(loss) + ' vì thiếu chứng nhận an toàn thực phẩm!', 'err'); UI.shake(sceneBox); Sound.sfx('hit'); Sound.vibrate([120, 60, 120]);
      }
      UI.updateHud();
    }

    /* ---- Vòng lặp ---- */
    const spawnGap = () => {
      const stocked = recs.filter((r) => G.stock[r.id] > 0); let rs = 0, tw = 0;
      stocked.forEach((r) => { rs += (G.prices[r.id] / Calc.refPrice(r.id)) * G.stock[r.id]; tw += G.stock[r.id]; });
      const avg = tw ? rs / tw : 1; const pf = clamp(1 + (0.98 - avg) * 1.8, 0.6, 1.5);
      return (4.0 / (Calc.custMult() * pf * (M.rush > 0 ? 2.2 : 1))) * (0.7 + Math.random() * 0.6);
    };
    const fn = Loop.add((dt) => {
      sc.update(dt);
      if (M.ended || M.paused) return;
      M.t += dt; M.rush -= dt;
      const mins = 300 + (M.t / M.dur) * 300; $('.hud-time', hud).textContent = clockText(mins); sc.setTime(M.t / M.dur);
      sc.mounds = recs.map((r) => ({ id: r.id, color: r.color, count: G.stock[r.id] || 0 }));
      if (M.blackout > 0) { M.blackout -= dt; if (M.blackout <= 0) { dark.classList.remove('on'); UI.toast('💡 Có điện lại rồi, bán tiếp thôi!', 'ok'); Sound.sfx('bell'); } }
      if (M.pcAt > 0 && M.t >= M.pcAt) { M.pcAt = -1; if (Calc.lvl('gen')) UI.toast('🔌 Mất điện! Máy phát điện chạy, tiệm vẫn sáng đèn', 'ok'); else startBlackout(7); }
      M.spawnT -= dt; if (M.spawnT <= 0) { spawn(); M.spawnT = spawnGap(); }
      // kiên nhẫn
      M.custs.slice().forEach((c) => {
        if (c.state !== 'wait') return;
        c.pat -= dt; const f = clamp(c.pat / c.max, 0, 1); const bar = $('.pat i', c.el); bar.style.width = f * 100 + '%'; bar.className = f < 0.3 ? 'r' : f < 0.6 ? 'y' : '';
        if (c.pat <= 0) { M.lost++; G.today.lost++; G.stats.lost++; G.rep = clamp(G.rep - 1.0, 0, 100); $('.bubble', c.el).innerHTML = '😠'; Sound.sfx('error'); remove(c, 'angry'); }
      });
      // nhân viên & nâng cấp tự động
      if (G.staff.sv) { M.auto += dt; if (M.auto >= 8) { M.auto = 0; autoServe('🎓 Sinh viên'); } }
      if (Calc.lvl('ti')) { M.tiT -= dt; if (M.tiT <= 0) { M.tiT = 6; autoServe('👦 Tí'); } }
      if (G.staff.linh && M.blackout <= 0) { M.onlineT -= dt; if (M.onlineT <= 0) { M.onlineT = 11 + Math.random() * 5; online(); } }
      if (G.staff.genz && !M.vir && M.t > 25 && chance(dt * 0.04)) { M.vir = true; M.rush = 15; UI.toast('🎵 Clip TikTok của Em Gen Z lên xu hướng! Khách đổ về!', 'ok'); Sound.sfx('level'); for (let i = 0; i < 3; i++) setTimeout(() => spawn(), i * 500); }
      if (M.incN < (shop ? 2 : 1) && M.t > 35 && chance(dt * 0.03) && G.day > 1) { M.incN++; incident(); }
      // hết xôi
      if (Calc.totalStock() <= 0 && !M.custs.length && !M.parcels.length && !bagQty()) { M.emptyT += dt; if (M.emptyT > 4.5) endDay(); } else M.emptyT = 0;
      if (M.t >= M.dur) endDay();
    });
    function online() {
      const ids = recs.filter((r) => G.stock[r.id] > 0); if (!ids.length) return;
      const r = pick(ids); const q = Math.min(G.stock[r.id], ri(2, 4)); if (q <= 0) return;
      G.stock[r.id] -= q; G.today.sold[r.id] = (G.today.sold[r.id] || 0) + q; const rev = G.prices[r.id] * q;
      G.cash += rev; G.today.rev += rev; M.rev += rev; G.stats.revenue += rev; G.stats.sold += q;
      const p = UI.pos(hud.querySelector('.hud-cash')); UI.burst(p.x, p.y + 20, 'coin', 6); UI.toast('📱 Đơn online ' + q + ' ' + r.name.toLowerCase() + ': +' + fmt(rev), 'ok'); Sound.sfx('coins'); refresh();
    }
    async function endDay() {
      if (M.ended) return; M.ended = true; Loop.remove(fn); wx && wx();
      // gói chưa giao được trả lại kho
      M.parcels.forEach((p) => { Object.entries(p.order).forEach(([k, n]) => { G.stock[k] = (G.stock[k] || 0) + n; }); if (p.el) p.el.remove(); }); M.parcels = [];
      M.custs.forEach((c) => { c.el.classList.add('leave-angry'); });
      Sound.sfx('bell'); const o = el('div', 'endday', '<b>HẾT CHỢ!</b><span>Dọn hàng về thôi…</span>'); wrap.appendChild(o);
      Save.root.game = G; await sleep(1500); UI.go('summary');
    }
    refresh(); Sound.ambient('market'); Sound.setTempo(1.1);
    Tutor.run('market', { onStart: () => { M.paused = true; }, onEnd: () => { M.paused = false; } });
    return () => { Loop.remove(fn); wx && wx(); };
  },
});

/* ===== Tổng kết ngày ===== */
UI.register('summary', {
  enter(root) {
    const T = G.today;
    const wages = DATA.STAFF.reduce((s, x) => s + (G.staff[x.id] ? Calc.wageOf(x) : 0), 0);
    G.cash -= wages;
    const net = G.cash - T.start;
    // xôi thừa
    const keep = [0, 0.4, 0.7][Calc.lvl('cooler')]; let wasted = 0, kept = 0;
    Object.keys(G.stock).forEach((k) => { const n = G.stock[k] || 0; const kp = Math.floor(n * keep); kept += kp; wasted += n - kp; G.stock[k] = kp; });
    // nguyên liệu dễ hỏng
    let spoilN = 0;
    if (!(Calc.lvl('fridge') || G.staff.tu)) DATA.ING.forEach((i) => { if (i.perish && G.ingr[i.id]) { const l = Math.ceil(G.ingr[i.id] / 2); G.ingr[i.id] -= l; spoilN += l; } });
    const before = G.savings;
    const interest = G.staff.tu ? Math.round(Math.max(0, G.cash - Calc.seed()) * 0.03 / 500) * 500 : 0;
    G.cash += interest;
    G.savings = Math.max(0, G.cash - Calc.seed());
    Save.root.records.best = Math.max(Save.root.records.best, G.savings);
    // uy tín
    if (T.lost === 0 && T.served > 0) G.rep = clamp(G.rep + 2, 0, 100);
    G.phase = 'summary'; Save.save();
    const lines = [
      ['Doanh thu bán xôi', T.rev, 'gain'], ['Mua nguyên liệu', -T.cost, 'loss'], ['Phí chợ & rủi ro', -T.fee, 'loss'], ['Nâng cấp / nhân viên / học món', -(T.upg + T.learn), 'loss'], ['Lương nhân viên', -wages, 'loss'],
    ];
    if (interest) lines.push(['Lãi tiết kiệm (Kế toán Tư)', interest, 'gain']);
    root.innerHTML = `<canvas class="pix scene-full dim"></canvas>
      <div class="summary"><div class="sum-title">Tổng kết ngày ${G.day}</div>
        <div class="sum-card">
          <div class="sum-lines"></div>
          <div class="sum-net ${net + interest >= 0 ? 'gain' : 'loss'}"><span>Lãi ròng hôm nay</span><b></b></div>
        </div>
        <div class="sum-notes"></div>
        <div class="sum-debt"><div class="dh"><span>Quỹ trả nợ</span><b>${fmt(G.savings)} / ${fmt(G.debt)}</b></div><div class="dbar"><i style="width:${clamp((before / G.debt) * 100, 0, 100)}%"></i></div></div>
        <div class="sum-stats">🧺 ${T.served} khách · 😠 ${T.lost} bỏ đi · ⭐ ${Calc.stars()}/5 sao</div>
        <button class="btn red big sum-go"></button></div>`;
    const cv = $('canvas', root); const sc = Scenes.title(cv); const tick = Loop.add((dt) => sc.update(dt));
    const box = $('.sum-lines', root);
    lines.forEach(([n, v, c], i) => { const l = el('div', 'sl ' + c, '<span>' + n + '</span><b>' + (v >= 0 ? '+' : '−') + fmt(Math.abs(v)) + '</b>'); l.style.animationDelay = i * 0.22 + 's'; box.appendChild(l); });
    const notes = [];
    if (wasted) notes.push('🥶 ' + wasted + ' phần xôi thừa bị chua phải bỏ' + (kept ? ' (giữ lại ' + kept + ' phần)' : ''));
    else if (kept) notes.push('📦 Giữ lại ' + kept + ' phần xôi cho sáng mai');
    if (spoilN) notes.push('🥩 ' + spoilN + ' nguyên liệu tươi bị hỏng qua đêm');
    if (T.lost === 0 && T.served > 0) notes.push('🌟 Không khách nào bỏ đi: uy tín +2');
    $('.sum-notes', root).innerHTML = notes.map((n) => '<div>' + n + '</div>').join('');
    // đếm tiền lãi + thanh nợ
    const netEl = $('.sum-net b', root), total = net + interest; let k = 0;
    const cnt = setInterval(() => { k = Math.min(1, k + 0.05); netEl.textContent = (total >= 0 ? '+' : '−') + fmt(Math.abs(total * k)); if (k >= 1) clearInterval(cnt); }, 40);
    setTimeout(() => { $('.dbar i', root).style.width = clamp((G.savings / G.debt) * 100, 0, 100) + '%'; Sound.sfx(total >= 0 ? 'coins' : 'error'); if (total > 0) UI.burst(240, 300, 'coin', 18); }, 1300);
    const win = G.savings >= G.debt, last = G.day >= Calc.maxDays();
    const go = $('.sum-go', root);
    go.textContent = win ? 'Trả nợ cho Sáu Cáo ➜' : last ? 'Gặp Sáu Cáo ➜' : 'Ngày mai ➜';
    go.onclick = () => {
      if (win || last) { if (win) Save.root.records.wins++; G.over = true; Save.save(); UI.go('ending', { win }); return; }
      G.day++; G.phase = 'dayintro'; G.today = null; G.mg.tokens = 3; Save.save(); UI.go('dayintro');
    };
    Sound.ambient('night'); Sound.setTempo(1); if (Sound.ctx) Sound.playMusic();
    return () => { Loop.remove(tick); clearInterval(cnt); };
  },
});
