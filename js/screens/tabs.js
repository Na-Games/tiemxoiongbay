/* Các tab trong bếp: nâng cấp, nhân viên, hội làng (giải trí), điểm danh */
function renderUpgrades(body) {
  const sec = el('div', 'sec');
  sec.innerHTML = '<div class="sec-h"><b>⬆️ Nâng cấp hàng xôi</b></div><div class="hint">Tiền mặt: <b class="cashv">' + fmt(G.cash) + '</b> · nâng cấp có tác dụng ngay và giữ đến hết ván</div>';
  const list = el('div', 'upg-list'); sec.appendChild(list); body.appendChild(sec);
  const draw = () => {
    list.innerHTML = ''; $('.cashv', sec).textContent = fmt(G.cash);
    DATA.UPGRADES.forEach((u) => {
      const lv = Calc.lvl(u.id), max = u.costs.length, maxed = lv >= max, lock = u.venue === 'shop' && !Calc.isShop();
      const row = el('div', 'upg' + (maxed ? ' maxed' : '') + (lock ? ' locked' : ''));
      const pips = Array.from({ length: max }, (_, i) => '<i class="' + (i < lv ? 'on' : '') + '"></i>').join('');
      row.innerHTML = '<span class="ui">' + u.icon + '</span><div class="ui-info"><b>' + u.name + '</b><span class="pips">' + pips + '</span><small>' + u.desc(lv) + '</small>' + (maxed || lock ? '' : '<small class="nxt">➜ ' + u.desc(lv + 1) + '</small>') + (lock ? '<small class="lk">🔒 Dành cho cửa hàng mặt phố (từ Chương 3)</small>' : '') + '</div>';
      const b = el('button', 'btn ' + (maxed || lock ? 'gray' : G.cash >= u.costs[lv] ? 'green' : 'gray') + ' buy', lock ? '🔒' : maxed ? 'Tối đa' : fmtK(u.costs[lv]));
      if (!maxed && !lock) b.onclick = () => {
        const c = u.costs[lv];
        if (G.cash < c) { Sound.sfx('error'); UI.shake(b); UI.toast('Chưa đủ tiền nâng cấp', 'err'); return; }
        G.cash -= c; G.today.upg += c; G.upg[u.id] = lv + 1; Save.save();
        Sound.sfx('level'); Sound.vibrate(60); const p = UI.pos(b); UI.burst(p.x, p.y, 'spark', 16); UI.float('Nâng cấp!', p.x, p.y - 14, 'gain');
        UI.updateHud(); draw(); Kitchen.refreshEquip();
      };
      else b.classList.add('disabled');
      row.appendChild(b); list.appendChild(row);
    });
  };
  draw();
}

function renderStaff(body) {
  const sec = el('div', 'sec');
  const wages = () => DATA.STAFF.reduce((s, x) => s + (G.staff[x.id] ? Calc.wageOf(x) : 0), 0);
  sec.innerHTML = '<div class="sec-h"><b>👥 Nhân viên</b></div><div class="hint">Lương trừ vào cuối ngày: <b class="wagev"></b> · Tiền mặt: <b class="cashv"></b></div>';
  const list = el('div', 'staff-list'); sec.appendChild(list); body.appendChild(sec);
  const draw = () => {
    list.innerHTML = ''; $('.wagev', sec).textContent = fmt(wages()); $('.cashv', sec).textContent = fmt(G.cash);
    const sc = Calc.scn();
    if (sc.hire || sc.wage) list.appendChild(el('div', 'scn-note', sc.icon + ' <b>' + sc.name + ':</b> ' + sc.desc));
    DATA.STAFF.forEach((s) => {
      const hired = !!G.staff[s.id];
      const lockedCh = s.ch && (G.chapter || 1) < s.ch && !hired;
      const hireC = Calc.hireCost(s);
      const card = el('div', 'staff' + (hired ? ' hired' : ''));
      const pt = pixImg(Sprite.portrait(s.look), 2.2, 'pt hi'); card.appendChild(pt);
      const info = el('div', 'st-info', '<b>' + s.name + '</b><span class="role">' + s.role + '</span><small>' + s.desc + '</small><small class="wage">' + (lockedCh ? '🔒 Mở khóa ở Chương ' + s.ch : 'Lương ' + fmtK(Calc.wageOf(s)) + '/ngày') + '</small>');
      card.appendChild(info);
      if (lockedCh) card.classList.add('chlocked');
      const b = el('button', 'btn ' + (hired ? 'gray' : !lockedCh && G.cash >= hireC ? 'green' : 'gray') + ' buy', hired ? 'Cho nghỉ' : lockedCh ? '🔒 Ch.' + s.ch : 'Thuê ' + fmtK(hireC));
      b.onclick = async () => {
        if (hired) { if (await UI.confirm('Cho ' + s.name + ' nghỉ việc? (Tiền thuê không hoàn lại)', 'Cho nghỉ', 'Giữ lại')) { delete G.staff[s.id]; Save.save(); if (Kitchen.scene) Kitchen.scene.staff = staffSprites([26, 104, 12]); Kitchen.refreshEquip(); draw(); } return; }
        if (lockedCh) { Sound.sfx('error'); UI.shake(b); UI.toast('Hoàn thành chương ' + (s.ch - 1) + ' để mở khóa nhân viên này', 'err'); return; }
        if (G.cash < hireC) { Sound.sfx('error'); UI.shake(b); UI.toast('Chưa đủ tiền thuê', 'err'); return; }
        G.cash -= hireC; G.today.upg += hireC; G.staff[s.id] = true; Save.save(); Sound.sfx('level'); if (Kitchen.scene) Kitchen.scene.staff = staffSprites([26, 104, 12]);
        const p = UI.pos(b); UI.burst(p.x, p.y, 'confetti', 14); UI.toast(s.name + ' đã vào làm!', 'ok'); UI.updateHud(); Kitchen.refreshEquip(); draw();
      };
      card.appendChild(b); list.appendChild(card);
    });
  };
  draw();
}

function renderFun(body) {
  const sec = el('div', 'sec');
  sec.innerHTML = '<div class="sec-h"><b>🎎 Hội làng giải trí</b></div><div class="hint">Chơi trò dân gian để kiếm nguyên liệu miễn phí. Vé hội làng: <b class="tokv"></b> (làm mới mỗi ngày)</div>';
  const list = el('div', 'fun-list'); sec.appendChild(list); body.appendChild(sec);
  const draw = () => {
    $('.tokv', sec).textContent = G.mg.tokens + ' 🎫'; list.innerHTML = '';
    Minigames.list.forEach((g) => {
      const c = el('div', 'fun theme-' + g.theme.id);
      c.innerHTML = (g.isNew ? '<span class="new">MỚI</span>' : '') + '<div class="fun-ic">' + g.icon + '</div><div class="fun-info"><b>' + g.name + '</b><span class="fx-tags">' + (g.fx || []).map((f) => '<i class="fxt fx-' + ({ 'nổ': 'no', 'nhảy': 'nhay', 'bay': 'bay', 'combo': 'combo', 'phát sáng': 'sang' })[f] + '">' + ({ 'nổ': '💥', 'nhảy': '🦘', 'bay': '🪽', 'combo': '🔥', 'phát sáng': '✨' })[f] + ' ' + f + '</i>').join('') + '</span><span class="role">' + g.theme.icon + ' ' + g.theme.name + '</span><small>' + g.desc + '</small><small class="frw">Thưởng: ' + g.rewards.map((i) => DATA.ING_BY[i].icon).join(' ') + '</small></div>';
      const b = el('button', 'btn ' + (G.mg.tokens > 0 ? 'red' : 'gray') + ' buy', 'Chơi');
      b.onclick = () => { if (G.mg.tokens <= 0) { Sound.sfx('error'); UI.toast('Hết vé hội làng hôm nay. Mai quay lại nhé!', 'err'); return; } Minigames.play(g, draw); };
      c.appendChild(b); list.appendChild(c);
    });
  };
  draw();
}

function renderCheckin(body) {
  const ci = Save.root.checkin, today = localDate();
  const can = ci.last !== today;
  const sec = el('div', 'sec');
  sec.innerHTML = '<div class="sec-h"><b>📅 Điểm danh hằng ngày</b></div><div class="hint">Đã điểm danh <b>' + ci.total + '</b> ngày · mở game mỗi ngày để nhận quà (ngày thật)</div>';
  const grid = el('div', 'ci-grid');
  DATA.CHECKIN.forEach((r, i) => {
    const done = i < ci.idx || (i === ci.idx && !can && false);
    const cur = i === ci.idx;
    const c = el('div', 'ci' + (done ? ' done' : '') + (cur && can ? ' now' : '') + (i === 6 ? ' big' : ''), '<small>Ngày ' + (i + 1) + '</small><span class="cic">' + r.icon + '</span><b>' + r.label + '</b>' + (done ? '<em>✔</em>' : ''));
    grid.appendChild(c);
  });
  sec.appendChild(grid);
  const b = el('button', 'btn ' + (can ? 'red big' : 'gray big disabled'), can ? '🎁 Nhận quà hôm nay' : 'Đã nhận hôm nay · mai quay lại nhé');
  b.onclick = () => {
    if (!can) return;
    const r = DATA.CHECKIN[ci.idx], parts = [];
    if (r.cash) { G.cash += r.cash; G.today.start += r.cash; parts.push(fmt(r.cash)); }
    if (r.items) Object.entries(r.items).forEach(([k, v]) => { G.ingr[k] = (G.ingr[k] || 0) + v; parts.push(v + ' ' + DATA.ING_BY[k].name); });
    if (r.recipe) { G.recipes[r.recipe] = true; parts.push('công thức ' + DATA.REC_BY[r.recipe].name); }
    ci.last = today; ci.idx = (ci.idx + 1) % DATA.CHECKIN.length; ci.total++; Save.save();
    Sound.sfx('level'); const p = UI.pos(b); UI.burst(p.x, p.y, 'confetti', 30); UI.toast('Nhận: ' + parts.join(', '), 'ok'); UI.updateHud();
    Kitchen.renderTab();
  };
  sec.appendChild(b); body.appendChild(sec);
}
