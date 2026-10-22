/* Hội làng: thêm 6 trò dân gian (nhảy bao bố, câu cá, bầu cua, rước đèn, đua thuyền, đi cà kheo) */
Minigames.list.push(
  { id: 'nhaybao', name: 'Nhảy bao bố', icon: '🎒', theme: MG_THEMES.gat, desc: 'Chui vào bao bố, nhảy đua với 3 bạn nhỏ về đích. Chạm đúng nhịp để nhảy xa!', tip: 'Thanh nhịp chạy qua lại: chạm khi vạch sáng nằm giữa vùng xanh lá sẽ nhảy xa nhất. Chạm sai nhịp sẽ vấp ngã.', isNew: true, rewards: ['nep', 'ngo', 'hanh'], per: { nep: 3, ngo: 2, hanh: 3 } },
  { id: 'cauca', name: 'Câu cá', icon: '🎣', theme: MG_THEMES.song, desc: 'Ngồi bờ ao thả câu. Phao chìm mạnh thì giật cần ngay, đừng giật sớm kẻo cá chạy!', tip: 'Phao khẽ rung là cá đang thử mồi, chờ thêm. Phao chìm hẳn mới giật. Coi chừng cá nóc 🐡 và chiếc giày rách 👢.', isNew: true, rewards: ['trung', 'pate', 'mit'], per: { trung: 3, pate: 2, mit: 2 } },
  { id: 'baucua', name: 'Bầu cua', icon: '🎲', theme: MG_THEMES.tet, desc: 'Trò vui ngày Tết: chọn 2 con, lắc ba hạt xí ngầu. Mỗi hạt trùng con bạn chọn được 1 điểm.', tip: 'Có 5 ván. Mỗi ván chọn đúng 2 con rồi bấm LẮC. Hạt nào mở ra trùng với con bạn chọn sẽ được tính điểm.', isNew: true, rewards: ['duong', 'cam', 'sau'], per: { duong: 3, cam: 2, sau: 1 } },
  { id: 'ruocden', name: 'Rước đèn ông sao', icon: '🌟', theme: MG_THEMES.trung, desc: 'Cầm đèn ông sao hứng bánh, kẹo và sao rơi từ trời đêm Trung thu. Tránh tàn lửa!', tip: 'Kéo ngón tay (hoặc phím ← →) để di chuyển đèn. Hứng ⭐ và 🍬 được 1 điểm, bánh 🥮 được 3 điểm. Tàn lửa 🔥 làm mất 2 điểm.', isNew: true, rewards: ['ladua', 'dua', 'gac'], per: { ladua: 3, dua: 2, gac: 1 } },
  { id: 'duathuyen', name: 'Đua thuyền rồng', icon: '🚣', theme: MG_THEMES.song, desc: 'Chèo luân phiên hai bên mạn thuyền để vượt qua ba chiếc thuyền rồng đối thủ.', tip: 'Bấm luân phiên TRÁI – PHẢI – TRÁI – PHẢI thật đều. Bấm trùng một bên liên tiếp thì thuyền chậm lại.', isNew: true, rewards: ['la', 'nep', 'lac'], per: { la: 16, nep: 2, lac: 3 } },
  { id: 'cakheo', name: 'Đi cà kheo', icon: '🦯', theme: MG_THEMES.hoi, desc: 'Bước đi trên đôi cà kheo cao nghều. Nghiêng bên nào thì đẩy ngược lại để giữ thăng bằng.', tip: 'Bấm ◀ khi người ngả sang trái, ▶ khi ngả sang phải. Vạch giữa màu xanh là vùng an toàn. Ngã sẽ mất 2 giây đứng dậy.', isNew: true, rewards: ['mit', 'cam', 'hanh'], per: { mit: 2, cam: 2, hanh: 3 } },
);

/* Vẽ chữ nổi bật có viền trong canvas */
function mgText(x, txt, px, py, col = '#fff', size = 30) {
  x.font = 'bold ' + size + 'px VT323, monospace'; x.textAlign = 'center'; x.lineWidth = 5; x.strokeStyle = 'rgba(0,0,0,.65)'; x.strokeText(txt, px, py); x.fillStyle = col; x.fillText(txt, px, py);
}
/* Thứ hạng người chơi (index 0) theo tiến độ */
function raceRank(ps) { return 1 + ps.slice(1).filter((p) => p > ps[0]).length; }
const RACE_SCORE = [0, 1, 0.75, 0.5, 0.3];

Object.assign(Minigames.games, {
  /* ----- Nhảy bao bố ----- */
  nhaybao(c) {
    c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas><button class="btn big red mg-act">NHẢY!</button>';
    const cv = $('canvas', c.area), x = cv.getContext('2d'), btn = $('.mg-act', c.area);
    const names = ['Bạn', 'Cu Tí', 'Chị Hai', 'Anh Ba'], hats = ['#d82a2a', '#2a8ad8', '#e8b030', '#3aa850'], bags = ['#c8a468', '#b89458', '#d4b078', '#a88450'];
    const rc = names.map(() => ({ p: 0, hop: 0, fall: 0, tk: Math.random() * 0.4 }));
    let t = 0, time = 24, meter = 0, cool = 0, msg = '', mt = 0, ended = false, dust = [];
    const X0 = 34, X1 = 270, laneY = (i) => 78 + i * 74;
    const finish = () => { if (ended) return; ended = true; Loop.remove(fn); const rk = raceRank(rc.map((r) => r.p)); mgSetRank(c, rk); setTimeout(() => c.end(RACE_SCORE[rk], 'Về hạng ' + rk + '/4'), 900); };
    const fn = Loop.add((dt) => {
      if (ended) return;
      t += dt; time -= dt; cool -= dt; mt -= dt; meter = Math.sin(t * 5) * 0.5 + 0.5;
      rc.forEach((r, i) => {
        r.hop = Math.max(0, r.hop - dt * 2.6); r.fall = Math.max(0, r.fall - dt);
        if (i > 0 && r.fall <= 0) { r.tk -= dt; if (r.tk <= 0) { r.tk = 0.45 + Math.random() * 0.12; if (chance(0.06)) { r.fall = 0.7; } else { r.p += 0.019 + Math.random() * 0.009; r.hop = 1; } } }
        if (r.p >= 1 && !ended) finish();
      });
      if (time <= 0) finish();
      x.clearRect(0, 0, 320, 420);
      // đường đua
      for (let i = 0; i < 4; i++) {
        const y = laneY(i); x.fillStyle = i === 0 ? 'rgba(255,230,140,.38)' : 'rgba(120,80,30,.32)'; x.fillRect(14, y - 40, 292, 64);
        x.fillStyle = 'rgba(255,255,255,.35)'; for (let k = 0; k < 10; k++) x.fillRect(14 + ((k * 31 - t * 40 * 0) % 292), y + 24, 14, 2);
      }
      // vạch đích caro
      for (let k = 0; k < 20; k++) { x.fillStyle = k % 2 ? '#fff' : '#111'; x.fillRect(284 + (k % 2) * 8, 38 + (k >> 1) * 14.5 + 0, 8, 14.5); }
      x.fillStyle = '#e8c040'; x.fillRect(282, 30, 4, 292);
      rc.forEach((r, i) => {
        const y = laneY(i), px = X0 + r.p * (X1 - X0), h = Math.sin(r.hop * Math.PI) * 26, fall = r.fall > 0;
        x.fillStyle = 'rgba(0,0,0,.28)'; x.beginPath(); x.ellipse(px + 14, y + 22, 16 - h * 0.2, 4, 0, 0, 6.3); x.fill();
        x.save(); x.translate(px + 14, y + 20 - h); if (fall) x.rotate(1.1);
        // bao bố
        x.fillStyle = bags[i]; x.beginPath(); x.moveTo(-14, 0); x.lineTo(14, 0); x.lineTo(11, -34); x.lineTo(-11, -34); x.closePath(); x.fill();
        x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(-14, -8, 28, 2); x.fillRect(-12, -22, 24, 2); x.fillStyle = 'rgba(255,255,255,.22)'; x.fillRect(-10, -33, 5, 31);
        // thân + đầu
        x.fillStyle = hats[i]; x.fillRect(-9, -46, 18, 14); x.fillStyle = '#d9a070'; x.beginPath(); x.arc(0, -56, 9, 0, 6.3); x.fill();
        x.fillStyle = '#2a1a14'; x.fillRect(-3, -57, 2, 3); x.fillRect(2, -57, 2, 3); x.fillStyle = '#a04a3a'; x.fillRect(-2, -51, 5, 1);
        x.fillStyle = hats[i]; x.beginPath(); x.moveTo(-12, -60); x.lineTo(0, -72); x.lineTo(12, -60); x.closePath(); x.fill();
        x.restore();
        x.font = 'bold 16px VT323, monospace'; x.textAlign = 'left'; x.fillStyle = i === 0 ? '#ffe070' : '#fff'; x.fillText((i === 0 ? '▶ ' : '') + names[i], 18, y - 36);
      });
      dust = dust.filter((d) => (d.l += dt) < 0.5); dust.forEach((d) => { x.fillStyle = 'rgba(220,200,160,' + (1 - d.l * 2) + ')'; x.fillRect(d.x + d.vx * d.l, d.y - d.l * 22, 4, 4); });
      // thanh nhịp
      x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(30, 372, 260, 18); x.fillStyle = '#3f9a44'; x.fillRect(30 + 260 * 0.38, 372, 260 * 0.24, 18); x.fillStyle = '#9ad84a'; x.fillRect(30 + 260 * 0.44, 372, 260 * 0.12, 18);
      x.fillStyle = '#fff'; x.fillRect(28 + 260 * meter, 366, 6, 30); x.strokeStyle = '#000'; x.lineWidth = 2; x.strokeRect(30, 372, 260, 18);
      if (mt > 0) mgText(x, msg, 160, 346, msg.startsWith('Hoàn') ? '#ffe070' : msg === 'Vấp ngã!' ? '#ff8a7a' : '#fff', 32);
      c.stat.textContent = '⏱ ' + Math.max(0, Math.ceil(time)) + 's · hạng ' + raceRank(rc.map((r) => r.p));
    });
    btn.onpointerdown = () => {
      if (ended || cool > 0) return; const r = rc[0]; if (r.fall > 0) return; cool = 0.32;
      const d = Math.abs(meter - 0.5); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
      if (d < 0.12) { r.p += 0.036; msg = 'Hoàn hảo!'; Sound.sfx('coin'); UI.burst(UI.pos(cv, 0.3, 0.3).x, UI.pos(cv, 0.3, 0.3).y, 'spark', 6); }
      else if (d < 0.26) { r.p += 0.023; msg = 'Tốt!'; Sound.sfx('pop'); }
      else if (d < 0.38) { r.p += 0.011; msg = 'Tạm được'; Sound.sfx('tap'); }
      else { r.fall = 0.6; msg = 'Vấp ngã!'; Sound.sfx('error'); Sound.vibrate(70); UI.shake(cv); }
      mt = 0.6; if (r.fall <= 0) { r.hop = 1; for (let i = 0; i < 4; i++) dust.push({ x: X0 + r.p * (X1 - X0) + 8, y: laneY(0) + 22, vx: -20 - Math.random() * 30, l: 0 }); }
    };
    c.onStop(() => { ended = true; Loop.remove(fn); });
  },

  /* ----- Câu cá ----- */
  cauca(c) {
    c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas><button class="btn big red mg-act">GIẬT CẦN!</button>';
    const cv = $('canvas', c.area), x = cv.getContext('2d'), btn = $('.mg-act', c.area);
    const FISH = [['🐟', 1, 50, 'Cá rô!'], ['🐠', 2, 22, 'Cá chép vàng!'], ['🦐', 1, 10, 'Tôm càng!'], ['🐡', -1, 10, 'Cá nóc, xui quá!'], ['👢', 0, 8, 'Chiếc giày rách…']];
    const GOAL = 12;
    let t = 0, time = 30, state = 'wait', wait = 1.4 + Math.random() * 1.2, st = 0, score = 0, ended = false, pending = null, msg = '', mt = 0, flying = null, ring = [], dip = 0;
    const bob = { x: 200, y: 262 };
    const pickFish = () => { let r = Math.random() * 100; for (const f of FISH) { r -= f[2]; if (r <= 0) return f; } return FISH[0]; };
    const fn = Loop.add((dt) => {
      if (ended) return; t += dt; time -= dt; mt -= dt; st += dt;
      if (state === 'wait' && st >= wait) { state = chance(0.4) ? 'nibble' : 'bite'; st = 0; pending = pickFish(); if (state === 'bite') { Sound.sfx('pop'); Sound.vibrate(40, true); ring.push({ x: bob.x, y: bob.y + 6, r: 4 }); } }
      if (state === 'nibble' && st > 1.1) { state = 'bite'; st = 0; Sound.sfx('pop'); Sound.vibrate(40, true); ring.push({ x: bob.x, y: bob.y + 6, r: 4 }); }
      else if (state === 'nibble' && Math.floor(st * 6) !== Math.floor((st - dt) * 6)) ring.push({ x: bob.x, y: bob.y + 6, r: 2 });
      if (state === 'bite' && st > 0.85) { state = 'wait'; st = 0; wait = 1 + Math.random() * 1.6; msg = 'Cá thoát mất!'; mt = 0.9; Sound.sfx('error'); }
      if (state === 'cool' && st > 0.7) { state = 'wait'; st = 0; wait = 1 + Math.random() * 1.6; }
      dip += ((state === 'bite' ? 16 : state === 'nibble' ? 3 + Math.sin(t * 30) * 2 : 0) - dip) * Math.min(1, dt * 14);
      if (time <= 0) { ended = true; Loop.remove(fn); setTimeout(() => c.end(clamp(score / GOAL, 0, 1), score + ' điểm'), 500); }
      x.clearRect(0, 0, 320, 420);
      // mặt nước
      const g = x.createLinearGradient(0, 220, 0, 420); g.addColorStop(0, 'rgba(60,150,210,.55)'); g.addColorStop(1, 'rgba(20,70,130,.8)'); x.fillStyle = g; x.fillRect(0, 220, 320, 200);
      x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 2;
      for (let k = 0; k < 7; k++) { const yy = 240 + k * 26; x.beginPath(); for (let xx = 0; xx <= 320; xx += 8) x.lineTo(xx, yy + Math.sin(xx * 0.05 + t * 1.6 + k) * 3); x.stroke(); }
      ring = ring.filter((r) => (r.r += dt * 40) < 34); ring.forEach((r) => { x.strokeStyle = 'rgba(255,255,255,' + (1 - r.r / 34) * 0.7 + ')'; x.beginPath(); x.ellipse(r.x, r.y, r.r, r.r * 0.35, 0, 0, 6.3); x.stroke(); });
      // bến + người câu
      x.fillStyle = '#7a4a28'; x.fillRect(0, 232, 96, 12); x.fillStyle = '#5a3418'; x.fillRect(8, 244, 6, 40); x.fillRect(78, 244, 6, 40);
      x.fillStyle = '#2a4a8a'; x.fillRect(38, 190, 22, 42); x.fillStyle = '#d9a070'; x.beginPath(); x.arc(49, 178, 11, 0, 6.3); x.fill();
      x.fillStyle = '#e0c080'; x.beginPath(); x.moveTo(26, 176); x.lineTo(49, 152); x.lineTo(72, 176); x.closePath(); x.fill(); x.fillStyle = '#2a1a14'; x.fillRect(53, 177, 3, 3);
      const tip = { x: 140, y: 150 + (state === 'bite' ? 8 : 0) }; x.strokeStyle = '#6a4a28'; x.lineWidth = 4; x.beginPath(); x.moveTo(58, 214); x.lineTo(tip.x, tip.y); x.stroke();
      const by = bob.y + dip; x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(tip.x, tip.y); x.quadraticCurveTo((tip.x + bob.x) / 2, 200, bob.x, by - 8); x.stroke();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(bob.x, by - 4, 8, 3.14, 0); x.fill(); x.fillStyle = '#e83a2a'; x.beginPath(); x.arc(bob.x, by - 4, 8, 0, 3.14); x.fill(); x.fillStyle = '#e83a2a'; x.fillRect(bob.x - 1.5, by - 18, 3, 8);
      if (state === 'bite') mgText(x, '❗', bob.x, by - 26, '#ffe070', 34);
      // cá bay vào xô
      if (flying) { flying.l += dt * 1.6; const f = flying, u = Math.min(1, f.l), fx = bob.x + (40 - bob.x) * u, fy = bob.y + (300 - bob.y) * u - Math.sin(u * Math.PI) * 90; x.font = '34px serif'; x.textAlign = 'center'; x.fillText(f.e, fx, fy); if (f.l >= 1) flying = null; }
      x.fillStyle = '#8a8a96'; x.fillRect(16, 320, 50, 50); x.fillStyle = '#6a6a76'; x.fillRect(16, 320, 50, 6); mgText(x, '🪣' + score, 41, 396, '#fff', 24);
      if (mt > 0) mgText(x, msg, 160, 120, '#ffe070', 30);
      c.stat.textContent = '⏱ ' + Math.max(0, Math.ceil(time)) + 's · 🎣 ' + score;
    });
    btn.onpointerdown = () => {
      if (ended || state === 'cool') return; btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
      if (state === 'bite') {
        const f = pending; score = Math.max(0, score + f[1]); msg = f[3]; mt = 1.1; state = 'cool'; st = 0; flying = { e: f[0], l: 0 };
        const p = UI.pos(cv, bob.x / 320, bob.y / 420);
        if (f[1] > 0) { Sound.sfx('coin'); UI.burst(p.x, p.y, 'spark', 10); UI.float('+' + f[1], p.x, p.y - 20, 'gain'); } else { Sound.sfx('error'); Sound.vibrate(60); if (f[1] < 0) UI.float('-1', p.x, p.y - 20, 'loss'); }
        ring.push({ x: bob.x, y: bob.y + 6, r: 4 });
      } else { msg = 'Giật sớm! Cá chạy rồi'; mt = 0.9; state = 'cool'; st = 0; Sound.sfx('error'); }
    };
    c.onStop(() => { ended = true; Loop.remove(fn); });
  },

  /* ----- Bầu cua tôm cá ----- */
  baucua(c) {
    const SYM = [['🦌', 'Nai'], ['🍐', 'Bầu'], ['🐓', 'Gà'], ['🐟', 'Cá'], ['🦀', 'Cua'], ['🦐', 'Tôm']];
    const RN = 5, GOAL = 7;
    c.area.innerHTML = '<div class="bc"><div class="bc-tiles"></div><div class="bc-table"><div class="bc-bowl"><span class="die">🎲</span><span class="die">🎲</span><span class="die">🎲</span></div><div class="bc-info">Chọn 2 con rồi bấm LẮC</div></div></div><button class="btn big red mg-act">LẮC!</button>';
    const tiles = $('.bc-tiles', c.area), dice = $$('.die', c.area), info = $('.bc-info', c.area), btn = $('.mg-act', c.area), bowl = $('.bc-bowl', c.area);
    let round = 0, score = 0, busy = false, ended = false; const pick2 = new Set();
    SYM.forEach(([e, n], i) => {
      const b = el('button', 'bc-tile', '<span>' + e + '</span><b>' + n + '</b>');
      b.onclick = () => { if (busy || ended) return; if (pick2.has(i)) pick2.delete(i); else { if (pick2.size >= 2) pick2.delete(pick2.values().next().value); pick2.add(i); } $$('.bc-tile', tiles).forEach((t, k) => t.classList.toggle('on', pick2.has(k))); Sound.sfx('tap'); };
      tiles.appendChild(b);
    });
    const stat = () => { c.stat.textContent = '🎲 ' + score + ' điểm · ván ' + Math.min(round + 1, RN) + '/' + RN; };
    stat();
    btn.onclick = async () => {
      if (busy || ended) return;
      if (pick2.size < 2) { Sound.sfx('error'); UI.shake($('.bc-tiles', c.area)); info.textContent = 'Phải chọn đủ 2 con!'; return; }
      busy = true; info.textContent = 'Xóc xóc xóc…'; dice.forEach((d) => { d.textContent = '❔'; d.classList.remove('hit'); }); bowl.classList.add('shaking');
      for (let k = 0; k < 8; k++) { Sound.sfx('tick'); Sound.vibrate(14, true); dice.forEach((d) => { d.textContent = pick(SYM)[0]; }); await sleep(120); if (ended) return; }
      bowl.classList.remove('shaking');
      // thiên vị nhẹ: mỗi hạt có thêm cơ hội ra con người chơi chọn
      const mine = [...pick2]; let hits = 0;
      dice.forEach((d, i) => { const r = chance(0.2) ? mine[ri(0, 1)] : ri(0, 5); d.textContent = SYM[r][0]; const hit = pick2.has(r); d.classList.toggle('hit', hit); if (hit) hits++; setTimeout(() => Sound.sfx(hit ? 'coin' : 'tap'), i * 140); });
      score += hits; round++; stat();
      if (hits) { const p = UI.pos(bowl); UI.burst(p.x, p.y, 'confetti', 8 + hits * 6); UI.float('+' + hits, p.x, p.y - 30, 'gain'); Sound.vibrate(30); }
      info.textContent = hits ? 'Trúng ' + hits + ' hạt! +' + hits + ' điểm' : 'Không trúng, tiếc quá!';
      await sleep(1300); if (ended) return;
      if (round >= RN) { ended = true; c.end(clamp(score / GOAL, 0, 1), score + ' điểm'); return; }
      busy = false; pick2.clear(); $$('.bc-tile', tiles).forEach((t) => t.classList.remove('on')); info.textContent = 'Chọn 2 con rồi bấm LẮC';
    };
    c.onStop(() => { ended = true; });
  },

  /* ----- Rước đèn ông sao ----- */
  ruocden(c) {
    c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas><div class="mg-pad"><button class="btn big gray pad-l">◀</button><button class="btn big gray pad-r">▶</button></div>';
    const cv = $('canvas', c.area), x = cv.getContext('2d');
    const KINDS = [['⭐', 1, 40], ['🍬', 1, 25], ['🥮', 3, 12], ['🔥', -2, 23]];
    const GOAL = 24;
    let t = 0, time = 24, sp = 0.35, px = 160, tx = 160, score = 0, ended = false, items = [], sparks = [], dir = 0, msg = '', mt = 0, hurt = 0;
    const setX = (e) => { const r = cv.getBoundingClientRect(); tx = clamp(((e.clientX - r.left) / r.width) * 320, 30, 290); };
    cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture && cv.setPointerCapture(e.pointerId); setX(e); });
    cv.addEventListener('pointermove', (e) => { if (e.buttons || e.pointerType === 'touch') setX(e); });
    const key = (e) => { if (e.key === 'ArrowLeft') dir = e.type === 'keydown' ? -1 : 0; if (e.key === 'ArrowRight') dir = e.type === 'keydown' ? 1 : 0; };
    document.addEventListener('keydown', key); document.addEventListener('keyup', key);
    const hold = (b, d) => { b.onpointerdown = () => { dir = d; }; b.onpointerup = b.onpointerleave = b.onpointercancel = () => { if (dir === d) dir = 0; }; };
    hold($('.pad-l', c.area), -1); hold($('.pad-r', c.area), 1);
    const fn = Loop.add((dt) => {
      if (ended) return; t += dt; time -= dt; sp -= dt; mt -= dt; hurt -= dt;
      if (dir) tx = clamp(tx + dir * 280 * dt, 30, 290);
      px += (tx - px) * Math.min(1, dt * 12);
      if (sp <= 0) { sp = 0.38 + Math.random() * 0.3; let r = Math.random() * 100, k = KINDS[0]; for (const q of KINDS) { r -= q[2]; if (r <= 0) { k = q; break; } } items.push({ e: k[0], v: k[1], x: 24 + Math.random() * 272, y: -20, vy: 120 + Math.random() * 90 + (24 - time) * 3, rot: Math.random() * 6 }); }
      items = items.filter((it) => {
        it.y += it.vy * dt; it.rot += dt * 3;
        if (it.y > 270 && it.y < 330 && Math.abs(it.x - (px + 18)) < 38) {
          score = Math.max(0, score + it.v); const p = UI.pos(cv, it.x / 320, it.y / 420);
          if (it.v > 0) { Sound.sfx(it.v > 1 ? 'coins' : 'coin'); UI.burst(p.x, p.y, 'spark', it.v > 1 ? 14 : 6); UI.float('+' + it.v, p.x, p.y - 12, 'gain'); msg = it.v > 1 ? 'Bánh dẻo ngon!' : ''; }
          else { Sound.sfx('hit'); Sound.vibrate(60); hurt = 0.5; UI.float('-2', p.x, p.y - 12, 'loss'); msg = 'Cháy tay!'; UI.shake(cv, 250); }
          mt = 0.7; for (let i = 0; i < 6; i++) sparks.push({ x: it.x, y: it.y, vx: (Math.random() - 0.5) * 140, vy: -Math.random() * 120, l: 0 }); return false;
        }
        return it.y < 440;
      });
      if (time <= 0) { ended = true; Loop.remove(fn); document.removeEventListener('keydown', key); document.removeEventListener('keyup', key); setTimeout(() => c.end(clamp(score / GOAL, 0, 1), score + ' điểm'), 500); }
      x.clearRect(0, 0, 320, 420);
      items.forEach((it) => { x.save(); x.translate(it.x, it.y); x.rotate(Math.sin(it.rot) * 0.4); x.font = '34px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(it.e, 0, 0); x.restore(); });
      sparks = sparks.filter((s) => (s.l += dt) < 0.6); sparks.forEach((s) => { x.fillStyle = 'rgba(255,230,120,' + (1 - s.l / 0.6) + ')'; x.fillRect(s.x + s.vx * s.l, s.y + s.vy * s.l + 200 * s.l * s.l, 4, 4); });
      // người rước đèn
      x.fillStyle = '#2a4a8a'; x.fillRect(px - 14, 372, 28, 36); x.fillStyle = '#d9a070'; x.beginPath(); x.arc(px, 362, 10, 0, 6.3); x.fill(); x.fillStyle = '#2a1a14'; x.fillRect(px - 4, 360, 2, 3); x.fillRect(px + 2, 360, 2, 3);
      x.strokeStyle = '#8a5a30'; x.lineWidth = 4; x.beginPath(); x.moveTo(px + 14, 384); x.lineTo(px + 18, 316); x.stroke();
      // đèn ông sao
      const lx = px + 18, ly = 296, pulse = 1 + Math.sin(t * 8) * 0.04;
      const glow = x.createRadialGradient(lx, ly, 6, lx, ly, 56); glow.addColorStop(0, hurt > 0 ? 'rgba(255,90,60,.55)' : 'rgba(255,220,90,.55)'); glow.addColorStop(1, 'rgba(255,200,60,0)'); x.fillStyle = glow; x.fillRect(lx - 60, ly - 60, 120, 120);
      x.save(); x.translate(lx, ly); x.scale(pulse, pulse); x.rotate(Math.sin(t * 2) * 0.08); x.beginPath();
      for (let i = 0; i < 10; i++) { const r = i % 2 ? 11 : 28, a = -Math.PI / 2 + (i * Math.PI) / 5; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath();
      x.fillStyle = hurt > 0 ? '#ff6a4a' : '#e8302a'; x.fill(); x.lineWidth = 3; x.strokeStyle = '#ffd84a'; x.stroke(); x.fillStyle = '#fff2a0'; x.beginPath(); x.arc(0, 0, 7, 0, 6.3); x.fill(); x.restore();
      if (mt > 0 && msg) mgText(x, msg, 160, 200, '#ffe070', 28);
      c.stat.textContent = '⏱ ' + Math.max(0, Math.ceil(time)) + 's · ⭐ ' + score;
    });
    c.onStop(() => { ended = true; Loop.remove(fn); document.removeEventListener('keydown', key); document.removeEventListener('keyup', key); });
  },

  /* ----- Đua thuyền rồng ----- */
  duathuyen(c) {
    c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas><div class="mg-pad"><button class="btn big gold pad-l">◀ TRÁI</button><button class="btn big gold pad-r">PHẢI ▶</button></div>';
    const cv = $('canvas', c.area), x = cv.getContext('2d');
    const cols = ['#d82a2a', '#2a8ad8', '#e8b030', '#3aa850'];
    const bt = cols.map((_, i) => ({ p: 0, v: 0, ph: Math.random() * 6, ai: 0.043 + i * 0.0035 }));
    let t = 0, time = 26, last = '', lastT = 0, ended = false, msg = '', mt = 0;
    const X0 = 40, X1 = 252, laneY = (i) => 92 + i * 76;
    const finish = () => { if (ended) return; ended = true; Loop.remove(fn); const rk = raceRank(bt.map((b) => b.p)); setTimeout(() => c.end(RACE_SCORE[rk], 'Về hạng ' + rk + '/4'), 900); };
    const fn = Loop.add((dt) => {
      if (ended) return; t += dt; time -= dt; mt -= dt;
      bt.forEach((b, i) => {
        if (i === 0) { b.v -= b.v * 0.9 * dt; b.p += b.v * 0.22 * dt; b.ph += b.v * 6 * dt; }
        else { b.p += (b.ai + Math.sin(t * 0.7 + i * 2) * 0.007) * dt; b.ph += 2.4 * dt; }
        if (b.p >= 1) finish();
      });
      if (time <= 0) finish();
      x.clearRect(0, 0, 320, 420);
      // sông
      for (let i = 0; i < 4; i++) {
        const y = laneY(i); const g = x.createLinearGradient(0, y - 34, 0, y + 30); g.addColorStop(0, 'rgba(40,130,200,.5)'); g.addColorStop(1, 'rgba(20,90,160,.7)'); x.fillStyle = g; x.fillRect(10, y - 34, 300, 64);
        x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 2; x.beginPath(); for (let xx = 10; xx <= 310; xx += 8) x.lineTo(xx, y + 22 + Math.sin(xx * 0.08 - t * 3 + i) * 2); x.stroke();
      }
      x.fillStyle = '#e8c040'; x.fillRect(298, 50, 5, 290); for (let k = 0; k < 14; k++) { x.fillStyle = k % 2 ? '#fff' : '#111'; x.fillRect(303, 50 + k * 20, 8, 20); }
      bt.forEach((b, i) => {
        const y = laneY(i) + Math.sin(t * 3 + i) * 1.5, px = X0 + b.p * (X1 - X0);
        // vệt nước
        x.fillStyle = 'rgba(255,255,255,.4)'; for (let k = 0; k < 5; k++) x.fillRect(px - 8 - k * 9, y + 16 + (k % 2) * 2, 7 - k, 2);
        // thân thuyền
        x.fillStyle = cols[i]; x.beginPath(); x.moveTo(px, y + 6); x.lineTo(px + 86, y + 6); x.quadraticCurveTo(px + 100, y - 6, px + 94, y - 14); x.lineTo(px + 84, y - 6); x.lineTo(px + 6, y - 6); x.quadraticCurveTo(px - 6, y - 4, px, y + 6); x.fill();
        x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(px + 6, y + 2, 80, 4); x.fillStyle = '#ffd84a'; x.fillRect(px + 8, y - 4, 76, 2);
        x.fillStyle = '#4a2a14'; x.beginPath(); x.arc(px + 98, y - 18, 6, 0, 6.3); x.fill(); x.fillStyle = cols[i]; x.fillRect(px + 92, y - 26, 6, 4);
        for (let k = 0; k < 6; k++) { // người chèo + mái
          const rx = px + 12 + k * 12, sw = Math.sin(b.ph + k * 0.3);
          x.fillStyle = '#d9a070'; x.beginPath(); x.arc(rx, y - 15, 4.5, 0, 6.3); x.fill(); x.fillStyle = cols[i]; x.fillRect(rx - 4, y - 11, 8, 8);
          x.strokeStyle = '#8a5a30'; x.lineWidth = 2; x.beginPath(); x.moveTo(rx, y - 8); x.lineTo(rx - 6 + sw * 10, y + 20); x.stroke();
        }
        x.font = 'bold 15px VT323, monospace'; x.textAlign = 'left'; x.fillStyle = i === 0 ? '#ffe070' : '#fff'; x.fillText((i === 0 ? '▶ Bạn' : ['', 'Đội Xanh', 'Đội Vàng', 'Đội Lục'][i]), 14, y - 28);
      });
      if (mt > 0) mgText(x, msg, 160, 372, msg.startsWith('Chèo') ? '#ffe070' : '#ff9a8a', 28);
      c.stat.textContent = '⏱ ' + Math.max(0, Math.ceil(time)) + 's · hạng ' + raceRank(bt.map((b) => b.p));
    });
    const paddle = (side) => {
      if (ended) return; const b = bt[0], now = t;
      if (side === last) { b.v *= 0.72; msg = 'Chèo lệch rồi!'; mt = 0.5; Sound.sfx('error'); UI.shake(cv, 200); }
      else { const gap = now - lastT; b.v += gap < 0.45 ? 0.07 : 0.05; msg = gap < 0.45 ? 'Chèo đều!' : ''; mt = 0.4; Sound.sfx('whoosh'); const p = UI.pos(cv, 0.3 + b.p * 0.6, 0.3); UI.burst(p.x, p.y + 50, 'steam', 3); }
      last = side; lastT = now;
    };
    $('.pad-l', c.area).onpointerdown = () => paddle('L'); $('.pad-r', c.area).onpointerdown = () => paddle('R');
    c.onStop(() => { ended = true; Loop.remove(fn); });
  },

  /* ----- Đi cà kheo ----- */
  cakheo(c) {
    c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas><div class="mg-pad"><button class="btn big gold pad-l">◀</button><button class="btn big gold pad-r">▶</button></div>';
    const cv = $('canvas', c.area), x = cv.getContext('2d');
    let t = 0, time = 26, a = 0, w = 0, down = 0, good = 0, dist = 0, ended = false, falls = 0, msg = '', mt = 0, drift = 0, dtk = 0;
    const push = (d) => { if (ended || down > 0) return; w += d * 1.25; Sound.sfx('tap'); };
    $('.pad-l', c.area).onpointerdown = () => push(-1); $('.pad-r', c.area).onpointerdown = () => push(1);
    const key = (e) => { if (e.key === 'ArrowLeft') push(-1); if (e.key === 'ArrowRight') push(1); };
    document.addEventListener('keydown', key);
    const cleanup = () => document.removeEventListener('keydown', key);
    const fn = Loop.add((dt) => {
      if (ended) return; t += dt; time -= dt; mt -= dt;
      if (down > 0) { down -= dt; if (down <= 0) { a = 0; w = 0; } }
      else {
        dtk -= dt; if (dtk <= 0) { dtk = 0.35 + Math.random() * 0.5; drift = (Math.random() - 0.5) * 3.2; }
        w += (a * 2.6 + drift) * dt; w *= 1 - 0.25 * dt; a += w * dt;
        if (Math.abs(a) < 0.55) { good += dt; dist += dt * 28; }
        if (Math.abs(a) > 0.95) { down = 2; falls++; msg = 'Ối! Ngã rồi'; mt = 1.2; Sound.sfx('hit'); Sound.vibrate([70, 40, 90]); UI.shake(cv, 320); }
      }
      if (time <= 0) { ended = true; Loop.remove(fn); cleanup(); setTimeout(() => c.end(clamp(good / 22, 0, 1), 'Thăng bằng ' + Math.round(good) + ' giây'), 500); }
      x.clearRect(0, 0, 320, 420);
      // nền cuộn: cột cờ và lều bên đường
      for (let k = -1; k < 6; k++) { const px = ((k * 80 - dist * 1.2) % 480 + 480) % 480 - 80; x.fillStyle = '#6a4a2a'; x.fillRect(px, 250, 6, 110); x.fillStyle = ['#d82a2a', '#e8b030', '#3aa850'][((k % 3) + 3) % 3]; x.beginPath(); x.moveTo(px + 6, 252); x.lineTo(px + 40, 264); x.lineTo(px + 6, 276); x.fill(); }
      x.fillStyle = '#6a8a3a'; x.fillRect(0, 360, 320, 60); x.fillStyle = '#4a6a2a'; x.fillRect(0, 360, 320, 6);
      x.fillStyle = '#b89a58'; for (let k = 0; k < 9; k++) x.fillRect(((k * 46 - dist * 2.4) % 414 + 414) % 414 - 50, 392, 26, 5);
      // người đi cà kheo xoay quanh gót chân
      const bx = 160, by = 362; x.save(); x.translate(bx, by); x.rotate(down > 0 ? (a > 0 ? 1.5 : -1.5) : a);
      x.fillStyle = '#7a4a28'; x.fillRect(-22, -170, 8, 170); x.fillRect(14, -170, 8, 170); x.fillStyle = '#a8703c'; x.fillRect(-22, -170, 3, 170); x.fillRect(14, -170, 3, 170);
      x.fillStyle = '#3a2418'; x.fillRect(-26, -78, 16, 6); x.fillRect(10, -78, 16, 6);
      x.fillStyle = '#2a2e3a'; x.fillRect(-18, -208, 14, 44); x.fillRect(4, -208, 14, 44);
      x.fillStyle = '#c8402c'; x.fillRect(-22, -258, 44, 54); x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(-22, -258, 8, 54); x.fillStyle = '#ffd84a'; x.fillRect(-22, -214, 44, 6);
      x.fillStyle = '#d9a070'; x.beginPath(); x.arc(0, -276, 14, 0, 6.3); x.fill(); x.fillStyle = '#2a1a14'; x.fillRect(-6, -278, 3, 4); x.fillRect(3, -278, 3, 4); x.fillStyle = '#a04a3a'; x.fillRect(-3, -269, 7, 2);
      x.fillStyle = '#e6c888'; x.beginPath(); x.moveTo(-26, -284); x.lineTo(0, -312); x.lineTo(26, -284); x.closePath(); x.fill(); x.strokeStyle = '#a07a40'; x.lineWidth = 2; x.stroke();
      x.restore();
      // thước thăng bằng
      x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(40, 30, 240, 16); x.fillStyle = '#3f9a44'; x.fillRect(40 + 240 * 0.2, 30, 240 * 0.6, 16);
      x.fillStyle = Math.abs(a) < 0.55 ? '#fff' : '#ff6a5a'; x.fillRect(40 + 240 * clamp(0.5 + a / 1.9, 0, 1) - 3, 25, 6, 26); x.strokeStyle = '#000'; x.lineWidth = 2; x.strokeRect(40, 30, 240, 16);
      if (mt > 0) mgText(x, msg, 160, 90, '#ff9a8a', 30);
      c.stat.textContent = '⏱ ' + Math.max(0, Math.ceil(time)) + 's · ⚖️ ' + Math.round(good) + 's';
    });
    c.onStop(() => { ended = true; Loop.remove(fn); cleanup(); });
  },
});

/* Báo hạng ngay khi đua xong */
function mgSetRank(c, rk) { c.stat.textContent = '🏁 Hạng ' + rk + '/4'; Sound.sfx(rk === 1 ? 'level' : rk <= 2 ? 'success' : 'fail'); }
