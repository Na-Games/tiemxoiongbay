/* Hội làng: thêm 6 trò mới với hiệu ứng combo, bay, nhảy, nổ, phát sáng
   (hứng xôi, thả diều, nhảy dây, bóng bay nổ, đá cầu, bắn pháo hoa) */
Minigames.list.push(
  { id: 'hungxoi', name: 'Hứng xôi bay', icon: '🧺', theme: MG_THEMES.dong, fx: ['combo', 'bay', 'phát sáng'], desc: 'Kéo chiếc rổ hứng xôi, lạc, ngô rơi từ trời. Hứng liên tiếp để nhân điểm combo!', tip: 'Kéo ngón tay (hoặc phím ← →) để di chuyển rổ. Hứng liền không sót để lên combo ×2 ×3… Mật ong 🍯 được 3 điểm. Tránh bom 💣!', isNew: true, rewards: ['nep', 'lac', 'ngo'], per: { nep: 3, lac: 3, ngo: 2 } },
  { id: 'thadieu', name: 'Thả diều', icon: '🪁', theme: MG_THEMES.dong, fx: ['bay', 'phát sáng', 'combo'], desc: 'Giữ để diều bay lên, thả để diều hạ xuống. Bay qua thật nhiều ngôi sao, né chim!', tip: 'Giữ nút BAY LÊN (hoặc giữ ngón tay trên màn hình) để diều lên cao, thả ra diều sẽ rơi. Ăn sao liên tiếp để lên combo, chạm chim 🐦 sẽ mất combo.', isNew: true, rewards: ['dua', 'ladua', 'mit'], per: { dua: 2, ladua: 3, mit: 2 } },
  { id: 'nhaydey', name: 'Nhảy dây', icon: '🪢', theme: MG_THEMES.gat, fx: ['nhảy', 'combo'], desc: 'Hai bạn quay dây, bạn nhảy qua. Dây càng lúc càng nhanh, nhảy đúng nhịp để có combo!', tip: 'Bấm NHẢY khi dây sắp quét tới chân. Nhảy sớm quá hoặc muộn quá sẽ vướng dây. Nhảy đúng đỉnh được PERFECT.', isNew: true, rewards: ['hanh', 'dau', 'cam'], per: { hanh: 3, dau: 3, cam: 2 } },
  { id: 'baybong', name: 'Bóng bay nổ', icon: '🎈', theme: MG_THEMES.tet, fx: ['nổ', 'combo', 'bay'], desc: 'Chạm bóng bay để nổ. Những quả cùng màu nằm gần nhau sẽ nổ dây chuyền, điểm càng lớn!', tip: 'Chạm một quả bóng, các quả cùng màu ở gần cũng nổ theo. Nổ được 4 quả trở lên là nổ lớn. Tránh quả bom đen 💣.', isNew: true, rewards: ['duong', 'gac', 'trung'], per: { duong: 3, gac: 1, trung: 3 } },
  { id: 'dacau', name: 'Đá cầu', icon: '🏸', theme: MG_THEMES.hoi, fx: ['nhảy', 'bay', 'phát sáng'], desc: 'Giữ quả cầu không chạm đất. Bấm đúng lúc cầu rơi xuống tầm chân để đá lên cao!', tip: 'Bấm ĐÁ khi quả cầu rơi vào vùng sáng gần chân. Vào đúng giữa vùng được PERFECT, cầu bay cao hơn. Có 3 lượt rơi.', isNew: true, rewards: ['trung', 'pate', 'nep'], per: { trung: 3, pate: 2, nep: 3 } },
  { id: 'phaohoa', name: 'Bắn pháo hoa', icon: '🎆', theme: MG_THEMES.trung, fx: ['nổ', 'phát sáng', 'combo'], desc: 'Chạm lên trời để bắn pháo. Pháo nổ trúng đèn lồng nào, đèn đó vỡ thành chùm sao!', tip: 'Chạm vào vị trí muốn pháo nổ. Pháo nổ ở chỗ có nhiều đèn lồng sẽ ăn combo. Đèn lồng vàng 🏮 được 3 điểm. Có 16 quả pháo.', isNew: true, rewards: ['gac', 'cam', 'sau'], per: { gac: 2, cam: 2, sau: 1 } },
);

/* Gắn nhãn hiệu ứng cho các trò cũ để hiện trong danh sách */
const MG_FX_OLD = { dapnieu: ['nổ', 'combo'], nemcon: ['bay', 'phát sáng'], batga: ['nhảy', 'combo'], latden: ['phát sáng', 'combo'], keoco: ['combo'], nhaybao: ['nhảy', 'combo'], cauca: ['bay', 'combo'], baucua: ['phát sáng', 'combo'], ruocden: ['bay', 'phát sáng', 'combo'], duathuyen: ['combo', 'bay'], cakheo: ['nhảy'] };
Minigames.list.forEach((g) => { if (!g.fx) g.fx = MG_FX_OLD[g.id] || []; });

/* Hệ thống hiệu ứng canvas dùng chung: hạt, vòng nổ, chữ bay, rung, chớp sáng */
function MgFx() {
  const ps = [], rings = [], pops = [];
  let shake = 0, flash = 0, flashCol = '#fff';
  return {
    burst(x, y, cols, n = 16, sp = 240, g = 520, size = 5) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283, v = sp * (0.3 + Math.random() * 0.7);
        ps.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - sp * 0.2, g, l: 0, max: 0.45 + Math.random() * 0.6, c: Array.isArray(cols) ? pick(cols) : cols, s: size * (0.6 + Math.random() * 0.9) });
      }
    },
    ring(x, y, col = '#fff', max = 60) { rings.push({ x, y, col, l: 0, max, r: 4 }); },
    pop(txt, x, y, col = '#ffe070', size = 28) { pops.push({ txt, x, y, col, size, l: 0 }); },
    shake(v = 8) { shake = Math.max(shake, v); },
    flash(v = 0.45, col = '#fff') { flash = v; flashCol = col; },
    begin(x, dt) { shake = Math.max(0, shake - dt * 36); x.save(); if (shake > 0.3) x.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); },
    end(x, dt) {
      x.globalCompositeOperation = 'lighter';
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]; p.l += dt; if (p.l > p.max) { ps.splice(i, 1); continue; }
        p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        const a = 1 - p.l / p.max; x.globalAlpha = a; x.fillStyle = p.c;
        x.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
        x.globalAlpha = a * 0.25; x.fillRect(p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i]; r.l += dt * 2.4; if (r.l >= 1) { rings.splice(i, 1); continue; }
        x.globalAlpha = (1 - r.l) * 0.85; x.strokeStyle = r.col; x.lineWidth = 4 * (1 - r.l) + 1;
        x.beginPath(); x.arc(r.x, r.y, r.r + (r.max - r.r) * ease.out(r.l), 0, 6.283); x.stroke();
      }
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i]; p.l += dt; if (p.l > 0.95) { pops.splice(i, 1); continue; }
        const k = p.l / 0.95, sc = k < 0.18 ? 0.6 + k * 4 : 1; x.globalAlpha = k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1;
        x.save(); x.translate(p.x, p.y - k * 46); x.scale(sc, sc); mgText(x, p.txt, 0, 0, p.col, p.size); x.restore();
      }
      x.globalAlpha = 1; x.restore();
      if (flash > 0.01) { x.fillStyle = flashCol; x.globalAlpha = flash; x.fillRect(0, 0, 320, 420); x.globalAlpha = 1; flash = Math.max(0, flash - dt * 2.2); }
    },
  };
}
/* Vòng sáng mờ (phát sáng) */
function mgGlow(x, cx, cy, r, col, a = 0.5) {
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.save(); x.globalCompositeOperation = 'lighter'; x.globalAlpha = a; x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 6.283); x.fill(); x.restore();
}
function mgPt(cv, e) { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) * 320) / r.width, y: ((e.clientY - r.top) * 420) / r.height }; }
function mgEmoji(x, e, px, py, size, rot = 0) {
  x.save(); x.translate(px, py); if (rot) x.rotate(rot); x.font = size + 'px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, 0, 0); x.restore();
}
const mgMult = (combo) => Math.min(5, 1 + Math.floor(combo / 5));

Object.assign(Minigames.games, {
  /* ----- Hứng xôi bay: combo + phát sáng ----- */
  hungxoi(c) {
    c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas>';
    const cv = $('canvas', c.area), x = cv.getContext('2d'), fx = MgFx();
    const KINDS = [{ e: '🍚', p: 1, w: 44 }, { e: '🥜', p: 1, w: 18 }, { e: '🌽', p: 1, w: 14 }, { e: '🍯', p: 3, w: 9, gold: true }, { e: '💣', p: 0, w: 15, bomb: true }];
    const GOAL = 45, BY = 352;
    let px = 160, tx = 160, t = 0, time = 30, score = 0, combo = 0, best = 0, spawn = 0.3, ended = false, items = [], key = 0, lastC = 0;
    const roll = () => { let r = Math.random() * 100; for (const k of KINDS) { r -= k.w; if (r <= 0) return k; } return KINDS[0]; };
    const fn = Loop.add((dt) => {
      if (ended) return; t += dt; time -= dt; spawn -= dt;
      tx = clamp(tx + key * dt * 360, 36, 284); px += (tx - px) * Math.min(1, dt * 16);
      if (spawn <= 0) { spawn = Math.max(0.28, 0.62 - t * 0.008) * (0.7 + Math.random() * 0.6); const k = roll(); items.push({ k, x: 24 + Math.random() * 272, y: -20, vy: 130 + t * 3.2 + Math.random() * 40, rot: 0, vr: (Math.random() - 0.5) * 6 }); }
      x.clearRect(0, 0, 320, 420);
      fx.begin(x, dt);
      // quầng sáng combo
      if (combo >= 5) mgGlow(x, px, BY - 6, 70 + mgMult(combo) * 12, mgMult(combo) >= 4 ? '#ff7ad8' : '#ffd23a', 0.5 + Math.sin(t * 8) * 0.12);
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i]; it.y += it.vy * dt; it.rot += it.vr * dt;
        if (it.k.gold) mgGlow(x, it.x, it.y, 26, '#ffd23a', 0.55);
        if (it.k.bomb) mgGlow(x, it.x, it.y, 20, '#ff3a2a', 0.25 + Math.sin(t * 14) * 0.15);
        mgEmoji(x, it.k.e, it.x, it.y, 32, it.rot);
        if (it.y > BY - 22 && it.y < BY + 10 && Math.abs(it.x - px) < 40) {
          items.splice(i, 1);
          if (it.k.bomb) { combo = 0; score = Math.max(0, score - 3); Sound.sfx('smash'); Sound.vibrate(80); fx.burst(it.x, it.y, ['#ff5a2a', '#ffd23a', '#fff'], 30, 330); fx.ring(it.x, it.y, '#ff6a3a', 80); fx.shake(14); fx.flash(0.4, '#ff3a2a'); fx.pop('BÙM! -3', it.x, it.y - 20, '#ff8a7a'); }
          else {
            combo++; best = Math.max(best, combo); const m = mgMult(combo), gain = it.k.p * m; score += gain; Sound.sfx(it.k.gold ? 'coins' : 'pop');
            fx.burst(it.x, it.y, it.k.gold ? ['#ffd23a', '#fff6b0'] : ['#fff6d8', '#ffe070'], it.k.gold ? 16 : 8, 180);
            fx.pop('+' + gain, it.x, it.y - 24, m > 1 ? '#ffb0f0' : '#fff', 24 + m * 2);
            if (combo % 5 === 0) { Sound.sfx('star'); Sound.vibrate(30); fx.ring(px, BY, '#ffd23a', 100); fx.burst(px, BY - 10, ['#ffd23a', '#ff7ad8', '#7ad8ff'], 26, 300); fx.pop('COMBO ×' + mgMult(combo) + '!', 160, 150, '#ffe070', 40); }
          }
        } else if (it.y > 410) { items.splice(i, 1); if (!it.k.bomb && combo > 0) { if (combo >= 5) fx.pop('Mất combo', it.x, 380, '#ff9a9a', 22); combo = 0; } }
      }
      // rổ
      x.fillStyle = 'rgba(0,0,0,.25)'; x.beginPath(); x.ellipse(px, BY + 24, 38, 7, 0, 0, 6.3); x.fill();
      x.fillStyle = '#a8783c'; x.beginPath(); x.moveTo(px - 40, BY - 14); x.lineTo(px + 40, BY - 14); x.lineTo(px + 30, BY + 22); x.lineTo(px - 30, BY + 22); x.closePath(); x.fill();
      x.strokeStyle = '#7a4a1c'; x.lineWidth = 3; for (let k = -2; k <= 2; k++) { x.beginPath(); x.moveTo(px + k * 14, BY - 12); x.lineTo(px + k * 11, BY + 20); x.stroke(); }
      x.fillStyle = '#d8a458'; x.fillRect(px - 42, BY - 18, 84, 7); x.fillStyle = '#e8c478'; x.fillRect(px - 42, BY - 18, 84, 2);
      if (combo >= 2) mgText(x, 'COMBO ×' + mgMult(combo) + ' · ' + combo, 160, 40, mgMult(combo) >= 3 ? '#ffb0f0' : '#ffe070', 26);
      mgText(x, '⏱ ' + Math.max(0, Math.ceil(time)) + 's', 40, 400, '#fff', 20);
      fx.end(x, dt);
      c.stat.textContent = '⭐ ' + score + '/' + GOAL + ' · ⏱ ' + Math.max(0, Math.ceil(time));
      if (time <= 0) { ended = true; Loop.remove(fn); setTimeout(() => c.end(clamp(score / GOAL, 0, 1), score + ' điểm · combo cao nhất ' + best), 500); }
    });
    const move = (e) => { tx = mgPt(cv, e).x; };
    cv.onpointerdown = (e) => { cv.setPointerCapture && cv.setPointerCapture(e.pointerId); move(e); }; cv.onpointermove = (e) => { if (e.buttons || e.pointerType === 'touch') move(e); };
    const kd = (e) => { if (e.key === 'ArrowLeft') key = -1; else if (e.key === 'ArrowRight') key = 1; }, ku = (e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') key = 0; };
    document.addEventListener('keydown', kd); document.addEventListener('keyup', ku);
    c.onStop(() => { ended = true; Loop.remove(fn); document.removeEventListener('keydown', kd); document.removeEventListener('keyup', ku); });
  },

  /* ----- Thả diều: bay + phát sáng ----- */
  thadieu(c) {
    c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas><button class="btn big red mg-act">GIỮ ĐỂ BAY LÊN</button>';
    const cv = $('canvas', c.area), x = cv.getContext('2d'), btn = $('.mg-act', c.area), fx = MgFx();
    const GOAL = 34, KX = 90;
    let t = 0, time = 28, ky = 220, kv = 0, hold = false, score = 0, combo = 0, best = 0, hit = 0, spawn = 0.4, ended = false, objs = [], trail = [], clouds = Array.from({ length: 5 }, (_, i) => ({ x: i * 90, y: 40 + Math.random() * 200, s: 0.6 + Math.random() * 0.8 }));
    const fn = Loop.add((dt) => {
      if (ended) return; t += dt; time -= dt; spawn -= dt; hit = Math.max(0, hit - dt);
      const spd = 120 + t * 2.4;
      kv += ((hold ? -520 : 300) * dt); kv = clamp(kv, -230, 260); ky += kv * dt; if (ky < 34) { ky = 34; kv = 0; } if (ky > 352) { ky = 352; kv = -120; }
      if (spawn <= 0) {
        spawn = 0.55 + Math.random() * 0.55; const y = 60 + Math.random() * 270, r = Math.random();
        if (r < 0.2) objs.push({ k: 'bird', x: 350, y, vy: (Math.random() - 0.5) * 40, ph: Math.random() * 6 });
        else if (r < 0.28) objs.push({ k: 'big', x: 350, y, ph: 0 });
        else { const n = 1 + (Math.random() * 3 | 0); for (let i = 0; i < n; i++) objs.push({ k: 'star', x: 350 + i * 34, y: y + Math.sin(i * 0.9) * 22, ph: i }); }
      }
      x.clearRect(0, 0, 320, 420);
      fx.begin(x, dt);
      clouds.forEach((cl) => { cl.x -= dt * 14 * cl.s; if (cl.x < -70) { cl.x = 380; cl.y = 40 + Math.random() * 220; } x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.ellipse(cl.x, cl.y, 36 * cl.s, 12 * cl.s, 0, 0, 6.3); x.ellipse(cl.x + 20 * cl.s, cl.y - 7 * cl.s, 22 * cl.s, 11 * cl.s, 0, 0, 6.3); x.fill(); });
      // gió
      x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 2; for (let i = 0; i < 6; i++) { const wy = 70 + i * 55, wx = ((t * spd * 0.9 + i * 77) % 380); x.beginPath(); x.moveTo(320 - wx, wy); x.lineTo(320 - wx + 34, wy); x.stroke(); }
      for (let i = objs.length - 1; i >= 0; i--) {
        const o = objs[i]; o.x -= spd * dt * (o.k === 'bird' ? 1.35 : 1);
        if (o.k === 'bird') { o.y += o.vy * dt; o.ph += dt * 12; mgEmoji(x, '🐦', o.x, o.y + Math.sin(o.ph) * 3, 30); }
        else { o.ph += dt * 4; const pul = 0.8 + Math.sin(o.ph) * 0.2; mgGlow(x, o.x, o.y, (o.k === 'big' ? 40 : 26) * pul, '#ffe070', 0.6); mgEmoji(x, o.k === 'big' ? '🌟' : '⭐', o.x, o.y, o.k === 'big' ? 40 : 28, Math.sin(o.ph) * 0.25); }
        const d = Math.hypot(o.x - KX, o.y - ky);
        if (d < (o.k === 'big' ? 34 : 26)) {
          objs.splice(i, 1);
          if (o.k === 'bird') { combo = 0; hit = 0.8; kv = 180; Sound.sfx('error'); Sound.vibrate(70); fx.shake(10); fx.burst(o.x, o.y, ['#fff', '#ffd0a0'], 14, 200); fx.pop('Ối!', KX, ky - 30, '#ff9a9a'); }
          else { combo++; best = Math.max(best, combo); const m = mgMult(combo), g = (o.k === 'big' ? 3 : 1) * m; score += g; Sound.sfx(o.k === 'big' ? 'coins' : 'star'); fx.burst(o.x, o.y, ['#fff6b0', '#ffd23a', '#ff9ad8'], o.k === 'big' ? 26 : 12, 200, 100); fx.ring(o.x, o.y, '#ffe070', 44); fx.pop('+' + g, o.x, o.y - 14, m > 1 ? '#ffb0f0' : '#fff', 22 + m * 2); if (combo % 5 === 0) { Sound.vibrate(30); fx.pop('COMBO ×' + mgMult(combo), 160, 130, '#ffe070', 38); fx.flash(0.2, '#ffe070'); } }
        } else if (o.x < -40) objs.splice(i, 1);
      }
      // đuôi diều phát sáng
      trail.unshift({ x: KX - 6, y: ky + 14 }); trail.forEach((p) => { p.x -= spd * dt * 0.9; }); if (trail.length > 22) trail.pop();
      trail.forEach((p, i) => { mgGlow(x, p.x, p.y + Math.sin(t * 8 + i * 0.6) * 4, 7 - i * 0.25, combo >= 5 ? '#ff7ad8' : '#7ad8ff', 0.55 * (1 - i / 22)); });
      // diều
      const tilt = clamp(kv / 500, -0.5, 0.5);
      x.save(); x.translate(KX, ky); x.rotate(tilt + (hit > 0 ? Math.sin(t * 40) * 0.25 : 0));
      if (combo >= 5) mgGlow(x, 0, 0, 52, '#ff7ad8', 0.45);
      x.fillStyle = '#e8402c'; x.beginPath(); x.moveTo(0, -28); x.lineTo(22, 0); x.lineTo(0, 30); x.lineTo(-22, 0); x.closePath(); x.fill();
      x.fillStyle = '#ffd23a'; x.beginPath(); x.moveTo(0, -28); x.lineTo(22, 0); x.lineTo(0, 0); x.closePath(); x.fill(); x.beginPath(); x.moveTo(0, 30); x.lineTo(-22, 0); x.lineTo(0, 0); x.closePath(); x.fill();
      x.strokeStyle = '#6a2a14'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, -28); x.lineTo(0, 30); x.moveTo(-22, 0); x.lineTo(22, 0); x.stroke();
      x.restore();
      // dây diều xuống người thả
      x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(KX, ky + 30); x.quadraticCurveTo(KX - 30, (ky + 400) / 2, 40, 392); x.stroke();
      x.fillStyle = '#4a9a3a'; x.fillRect(0, 396, 320, 24); x.fillStyle = '#2a5a24'; x.fillRect(0, 396, 320, 4);
      mgEmoji(x, '🧒', 40, 384, 34);
      if (combo >= 2) mgText(x, 'COMBO ×' + mgMult(combo) + ' · ' + combo, 160, 36, mgMult(combo) >= 3 ? '#ffb0f0' : '#fff', 26);
      fx.end(x, dt);
      c.stat.textContent = '⭐ ' + score + '/' + GOAL + ' · ⏱ ' + Math.max(0, Math.ceil(time));
      if (time <= 0) { ended = true; Loop.remove(fn); setTimeout(() => c.end(clamp(score / GOAL, 0, 1), score + ' điểm · combo cao nhất ' + best), 500); }
    });
    const dn = (e) => { hold = true; btn.classList.add('bump'); if (e && e.cancelable) e.preventDefault(); }, up = () => { hold = false; btn.classList.remove('bump'); };
    btn.onpointerdown = dn; cv.onpointerdown = dn; ['pointerup', 'pointercancel', 'pointerleave'].forEach((n) => { btn['on' + n] = up; cv['on' + n] = up; });
    c.onStop(() => { ended = true; Loop.remove(fn); });
  },

  /* ----- Nhảy dây: nhảy + combo ----- */
  nhaydey(c) {
    c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas><button class="btn big red mg-act">NHẢY!</button>';
    const cv = $('canvas', c.area), x = cv.getContext('2d'), btn = $('.mg-act', c.area), fx = MgFx();
    const GOAL = 24, GY = 330, D = 0.56, HMAX = 74;
    let t = 0, time = 32, phi = 0, jt = D, jumps = 0, combo = 0, best = 0, ended = false, bad = 0, T = 1.2, perfect = 0;
    const height = () => (jt >= D ? 0 : 4 * HMAX * (jt / D) * (1 - jt / D));
    const fn = Loop.add((dt) => {
      if (ended) return; t += dt; time -= dt; if (jt < D) jt += dt; bad = Math.max(0, bad - dt);
      T = Math.max(0.62, 1.2 - jumps * 0.022);
      const prev = phi; phi += (dt * 6.283) / T;
      if (Math.floor((phi - 1.5708) / 6.283) !== Math.floor((prev - 1.5708) / 6.283)) { // dây quét qua chân
        const h = height();
        if (h > 16) { jumps++; combo++; best = Math.max(best, combo); const pf = Math.abs(jt - D / 2) < 0.1; if (pf) perfect++; Sound.sfx(pf ? 'coins' : 'coin'); fx.burst(160, GY + 4, pf ? ['#ffe070', '#ff9ad8', '#7ad8ff'] : ['#fff6d8', '#ffd070'], pf ? 24 : 10, 220); fx.pop(pf ? 'PERFECT!' : 'Tốt!', 160, GY - 120, pf ? '#ffe070' : '#fff', pf ? 34 : 26); if (pf) fx.ring(160, GY + 4, '#ffe070', 70); if (combo % 5 === 0) { Sound.sfx('star'); Sound.vibrate(30); fx.pop('COMBO ' + combo + '!', 160, 110, '#ffb0f0', 38); fx.burst(160, 200, ['#ff5a5a', '#ffd23a', '#5ad0ff', '#7aff7a'], 34, 300); } }
        else { combo = 0; bad = 0.6; Sound.sfx('error'); Sound.vibrate(80); fx.shake(12); fx.flash(0.3, '#ff3a2a'); fx.burst(160, GY, ['#ff8a6a', '#fff'], 14, 200); fx.pop('Vướng dây!', 160, GY - 110, '#ff9a9a', 30); }
      }
      x.clearRect(0, 0, 320, 420);
      fx.begin(x, dt);
      // sân
      x.fillStyle = 'rgba(70,40,12,.55)'; x.fillRect(0, GY + 20, 320, 100); x.fillStyle = 'rgba(255,230,160,.22)'; x.fillRect(0, GY + 20, 320, 3);
      // hai bạn quay dây
      [[52, '#d8402a'], [268, '#2a78c8']].forEach(([hx, col], i) => {
        const sw = Math.sin(phi + i) * 3; x.fillStyle = col; x.fillRect(hx - 12, GY - 50, 24, 56); x.fillStyle = '#d9a070'; x.beginPath(); x.arc(hx, GY - 62, 11, 0, 6.3); x.fill(); x.fillStyle = '#2a1a14'; x.fillRect(hx - 11, GY - 74, 22, 6);
        x.fillStyle = '#1a1a28'; x.fillRect(hx - 10, GY + 6, 8, 16); x.fillRect(hx + 2, GY + 6, 8, 16);
        x.fillStyle = '#d9a070'; x.fillRect(hx + (i ? -22 : 14), GY - 30 + sw, 8, 8);
      });
      // dây
      const cph = Math.cos(phi), sph = Math.sin(phi);
      x.strokeStyle = bad > 0 ? '#ff6a4a' : '#f4e6b0'; x.lineWidth = 4; x.lineCap = 'round'; x.shadowColor = '#ffe070'; x.shadowBlur = 10;
      x.beginPath(); for (let u = 0; u <= 20; u++) { const q = u / 20, rx = 66 + 188 * q, ry = GY - 22 - Math.sin(Math.PI * q) * 150 * cph; if (u === 0) x.moveTo(rx, ry); else x.lineTo(rx, ry); } x.stroke(); x.shadowBlur = 0;
      // người nhảy
      const h = height(), sq = h > 0 ? 1 + (1 - Math.abs(2 * (jt / D) - 1)) * 0.08 : 1;
      x.fillStyle = 'rgba(0,0,0,.3)'; x.beginPath(); x.ellipse(160, GY + 22, 22 - h * 0.12, 6, 0, 0, 6.3); x.fill();
      if (combo >= 5) mgGlow(x, 160, GY - h - 30, 60, '#ffd23a', 0.45);
      x.save(); x.translate(160, GY + 20 - h); x.scale(1 / sq, sq);
      x.fillStyle = '#1a1a28'; x.fillRect(-9, -14, 8, 14 - (h > 0 ? 5 : 0)); x.fillRect(1, -14, 8, 14 - (h > 0 ? 5 : 0));
      x.fillStyle = '#3aa850'; x.fillRect(-12, -52, 24, 40); x.fillStyle = '#2a8040'; x.fillRect(-12, -22, 24, 6);
      x.fillStyle = '#d9a070'; x.beginPath(); x.arc(0, -64, 12, 0, 6.3); x.fill(); x.fillStyle = '#2a1a14'; x.fillRect(-12, -77, 24, 8); x.fillRect(-14, -70, 4, 12); x.fillRect(10, -70, 4, 12); x.fillRect(-4, -66, 2, 3); x.fillRect(3, -66, 2, 3);
      x.fillStyle = '#d9a070'; const arm = h > 0 ? -10 : 8; x.fillRect(-20, -48 + arm, 8, 8); x.fillRect(12, -48 + arm, 8, 8);
      x.restore();
      mgText(x, 'Nhảy ' + jumps + ' · combo ' + combo, 160, 40, combo >= 5 ? '#ffb0f0' : '#fff', 26);
      mgText(x, '⏱ ' + Math.max(0, Math.ceil(time)) + 's', 40, 402, '#fff', 20);
      fx.end(x, dt);
      c.stat.textContent = '🪢 ' + jumps + '/' + GOAL + ' · ⏱ ' + Math.max(0, Math.ceil(time));
      if (time <= 0) { ended = true; Loop.remove(fn); setTimeout(() => c.end(clamp(jumps / GOAL, 0, 1), jumps + ' lần nhảy · ' + perfect + ' PERFECT'), 500); }
    });
    btn.onpointerdown = () => { if (ended || jt < D) return; jt = 0; Sound.sfx('whoosh'); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); fx.burst(160, GY + 22, ['#d8c8a8', '#b8a888'], 5, 120, 200, 4); };
    cv.onpointerdown = btn.onpointerdown;
    c.onStop(() => { ended = true; Loop.remove(fn); });
  },

  /* ----- Bóng bay nổ: nổ dây chuyền + combo ----- */
  baybong(c) {
    c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas>';
    const cv = $('canvas', c.area), x = cv.getContext('2d'), fx = MgFx();
    const COLS = ['#e8402c', '#ffd23a', '#3aa8e8', '#5ac84a', '#c85ad8'], GOAL = 70, R0 = 27;
    let t = 0, time = 28, score = 0, spawn = 0.2, ended = false, bl = [], bestChain = 0;
    const mk = (y) => { const bomb = Math.random() < 0.09; bl.push({ x: 34 + Math.random() * 252, y, vy: -(46 + Math.random() * 46 + t * 0.9), col: bomb ? '#2a2a34' : pick(COLS), bomb, ph: Math.random() * 6 }); };
    for (let i = 0; i < 9; i++) mk(160 + Math.random() * 280);
    const fn = Loop.add((dt) => {
      if (ended) return; t += dt; time -= dt; spawn -= dt;
      if (spawn <= 0) { spawn = 0.32 + Math.random() * 0.32; mk(450); }
      x.clearRect(0, 0, 320, 420);
      fx.begin(x, dt);
      bl = bl.filter((b) => { b.y += b.vy * dt; b.x += Math.sin(t * 1.6 + b.ph) * 14 * dt; return b.y > -60; });
      bl.forEach((b) => {
        x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(b.x, b.y + R0 + 6); x.quadraticCurveTo(b.x + Math.sin(t * 3 + b.ph) * 8, b.y + R0 + 26, b.x, b.y + R0 + 42); x.stroke();
        if (!b.bomb) mgGlow(x, b.x, b.y, R0 + 12, b.col, 0.22);
        x.fillStyle = b.col; x.beginPath(); x.ellipse(b.x, b.y, R0 * 0.88, R0, 0, 0, 6.3); x.fill();
        x.beginPath(); x.moveTo(b.x - 4, b.y + R0 - 1); x.lineTo(b.x + 4, b.y + R0 - 1); x.lineTo(b.x, b.y + R0 + 6); x.fill();
        x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.ellipse(b.x - 9, b.y - 11, 5, 8, -0.5, 0, 6.3); x.fill();
        if (b.bomb) mgEmoji(x, '💣', b.x, b.y + 2, 26);
      });
      mgText(x, 'Điểm ' + score + '/' + GOAL, 160, 36, '#fff', 26);
      mgText(x, '⏱ ' + Math.max(0, Math.ceil(time)) + 's', 40, 406, '#fff', 20);
      fx.end(x, dt);
      c.stat.textContent = '🎈 ' + score + '/' + GOAL + ' · ⏱ ' + Math.max(0, Math.ceil(time));
      if (time <= 0) { ended = true; Loop.remove(fn); setTimeout(() => c.end(clamp(score / GOAL, 0, 1), score + ' điểm · nổ dây chuyền dài nhất ' + bestChain), 500); }
    });
    cv.onpointerdown = (e) => {
      if (ended) return; const p = mgPt(cv, e);
      const hitB = bl.find((b) => Math.hypot(b.x - p.x, (b.y - p.y) * 0.9) < R0 + 8); if (!hitB) return;
      if (hitB.bomb) { bl = bl.filter((b) => b !== hitB); score = Math.max(0, score - 6); Sound.sfx('smash'); Sound.vibrate(100); fx.burst(hitB.x, hitB.y, ['#ff5a2a', '#ffd23a', '#fff', '#555'], 40, 360); fx.ring(hitB.x, hitB.y, '#ff6a3a', 110); fx.shake(16); fx.flash(0.45, '#ff3a2a'); fx.pop('BÙM! -6', hitB.x, hitB.y - 20, '#ff8a7a', 32); return; }
      const chain = [hitB], seen = new Set([hitB]);
      for (let i = 0; i < chain.length; i++) bl.forEach((b) => { if (!seen.has(b) && !b.bomb && b.col === hitB.col && Math.hypot(b.x - chain[i].x, b.y - chain[i].y) < 84) { seen.add(b); chain.push(b); } });
      bl = bl.filter((b) => !seen.has(b)); const n = chain.length, gain = n === 1 ? 1 : Math.round(n * n * 0.8 + n); score += gain; bestChain = Math.max(bestChain, n);
      chain.forEach((b, i) => setTimeout(() => { if (ended) return; fx.burst(b.x, b.y, [b.col, '#fff', shade(b.col, 40)], n > 3 ? 20 : 12, 260, 400, 6); fx.ring(b.x, b.y, b.col, 50 + n * 4); Sound.sfx(i % 2 ? 'pop' : 'tap'); }, i * 60));
      Sound.sfx(n >= 4 ? 'smash' : 'pop'); Sound.vibrate(n >= 4 ? [40, 20, 60] : 20);
      fx.pop(n > 1 ? 'x' + n + '  +' + gain : '+1', hitB.x, hitB.y - 18, n >= 4 ? '#ffe070' : '#fff', 22 + Math.min(16, n * 3));
      if (n >= 4) { fx.shake(10); fx.flash(0.28, hitB.col); }
      if (n >= 6) fx.pop('SIÊU NỔ!', 160, 150, '#ffb0f0', 42);
    };
    c.onStop(() => { ended = true; Loop.remove(fn); });
  },

  /* ----- Đá cầu: nhảy + bay + phát sáng ----- */
  dacau(c) {
    c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas><button class="btn big red mg-act">ĐÁ!</button>';
    const cv = $('canvas', c.area), x = cv.getContext('2d'), btn = $('.mg-act', c.area), fx = MgFx();
    const GOAL = 34, GY = 370, ZY = 318;
    let t = 0, time = 36, lives = 3, score = 0, combo = 0, best = 0, kick = 0, cool = 0, ended = false, trail = [], wait = 0;
    const sh = { x: 160, y: 40, vx: 0, vy: 0, rot: 0 };
    const serve = () => { sh.x = 120 + Math.random() * 80; sh.y = 30; sh.vx = (Math.random() - 0.5) * 30; sh.vy = 0; trail = []; };
    serve();
    const fn = Loop.add((dt) => {
      if (ended) return; t += dt; time -= dt; kick = Math.max(0, kick - dt * 4); cool = Math.max(0, cool - dt);
      if (wait > 0) { wait -= dt; if (wait <= 0) serve(); } else {
        sh.vy += 560 * dt; sh.x += sh.vx * dt; sh.y += sh.vy * dt; sh.rot = Math.atan2(sh.vy, sh.vx || 1) - 1.57;
        if (sh.x < 24 || sh.x > 296) { sh.vx *= -1; sh.x = clamp(sh.x, 24, 296); }
        trail.unshift({ x: sh.x, y: sh.y }); if (trail.length > 14) trail.pop();
        if (sh.y >= GY - 6) {
          lives--; combo = 0; Sound.sfx('error'); Sound.vibrate(80); fx.shake(9); fx.burst(sh.x, GY, ['#d8c8a8', '#b8a888'], 12, 160); fx.pop('Rơi rồi!', sh.x, GY - 40, '#ff9a9a', 28); wait = 0.8; sh.y = -200; trail = [];
          if (lives <= 0) { ended = true; Loop.remove(fn); setTimeout(() => c.end(clamp(score / GOAL, 0, 1), score + ' điểm · combo cao nhất ' + best), 600); }
        }
      }
      x.clearRect(0, 0, 320, 420);
      fx.begin(x, dt);
      // sân
      x.fillStyle = 'rgba(40,20,60,.5)'; x.fillRect(0, GY, 320, 50);
      // vùng đá
      const inZone = sh.y > ZY - 34 && sh.y < ZY + 30; const zp = 0.25 + Math.sin(t * 8) * 0.1;
      x.fillStyle = 'rgba(255,230,120,' + (inZone ? 0.35 : zp * 0.5) + ')'; x.fillRect(0, ZY - 34, 320, 64);
      x.fillStyle = 'rgba(255,255,255,' + (inZone ? 0.6 : 0.25) + ')'; x.fillRect(0, ZY - 2, 320, 4);
      trail.forEach((p, i) => mgGlow(x, p.x, p.y, 10 - i * 0.6, combo >= 5 ? '#ff7ad8' : '#fff6b0', 0.5 * (1 - i / 14)));
      // quả cầu
      if (sh.y > -100) {
        x.save(); x.translate(sh.x, sh.y); x.rotate(sh.rot);
        if (combo >= 3) mgGlow(x, 0, 0, 34, '#ffe070', 0.5);
        x.fillStyle = '#f4f4ff'; x.beginPath(); x.moveTo(-3, -4); x.lineTo(-14, -26); x.lineTo(-5, -22); x.lineTo(0, -30); x.lineTo(5, -22); x.lineTo(14, -26); x.lineTo(3, -4); x.closePath(); x.fill();
        x.strokeStyle = '#a8a8c8'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, -4); x.lineTo(0, -28); x.stroke();
        x.fillStyle = '#d8402a'; x.beginPath(); x.arc(0, 4, 8, 0, 6.3); x.fill(); x.fillStyle = '#ffb08a'; x.beginPath(); x.arc(-2, 2, 3, 0, 6.3); x.fill();
        x.restore();
      }
      // người đá
      const jump = kick > 0 ? Math.sin(kick * Math.PI) * 14 : 0;
      x.fillStyle = 'rgba(0,0,0,.3)'; x.beginPath(); x.ellipse(160, GY + 14, 24 - jump * 0.4, 6, 0, 0, 6.3); x.fill();
      x.save(); x.translate(160, GY + 10 - jump);
      x.fillStyle = '#1a1a28'; x.fillRect(-10, -16, 9, 18); x.save(); x.translate(4, -16); x.rotate(-kick * 1.9); x.fillRect(0, 0, 9, 20); x.fillStyle = '#e8e8e0'; x.fillRect(0, 17, 12, 6); x.restore();
      x.fillStyle = '#e8402c'; x.fillRect(-13, -56, 26, 42); x.fillStyle = '#ffd23a'; x.fillRect(-13, -36, 26, 5);
      x.fillStyle = '#d9a070'; x.beginPath(); x.arc(0, -68, 12, 0, 6.3); x.fill(); x.fillStyle = '#2a1a14'; x.fillRect(-12, -81, 24, 8); x.fillRect(-4, -70, 2, 3); x.fillRect(3, -70, 2, 3);
      x.fillStyle = '#d9a070'; x.fillRect(-22, -50 + kick * -12, 9, 9); x.fillRect(13, -50 + kick * -12, 9, 9);
      x.restore();
      mgText(x, 'Đá ' + score + ' · combo ' + combo, 160, 36, combo >= 5 ? '#ffb0f0' : '#fff', 26);
      mgText(x, '❤'.repeat(Math.max(0, lives)), 270, 66, '#ff6a7a', 24);
      fx.end(x, dt);
      c.stat.textContent = '🏸 ' + score + '/' + GOAL + ' · ❤ ' + lives + ' · ⏱ ' + Math.max(0, Math.ceil(time));
      if (time <= 0 && !ended) { ended = true; Loop.remove(fn); setTimeout(() => c.end(clamp(score / GOAL, 0, 1), score + ' điểm · combo cao nhất ' + best), 500); }
    });
    const doKick = () => {
      if (ended || cool > 0 || wait > 0) return; cool = 0.18; kick = 1; btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
      const dy = sh.y - ZY;
      if (dy > -34 && dy < 30) {
        const pf = Math.abs(dy) < 14; combo++; best = Math.max(best, combo); const g = (pf ? 2 : 1) + (combo % 5 === 0 ? 3 : 0); score += g;
        sh.vy = pf ? -640 : -540; sh.vx = (160 - sh.x) * 0.9 + (Math.random() - 0.5) * 70; Sound.sfx(pf ? 'coins' : 'hit'); Sound.vibrate(pf ? 40 : 20);
        fx.burst(sh.x, sh.y, pf ? ['#ffe070', '#ff9ad8', '#7ad8ff', '#fff'] : ['#fff', '#ffe070'], pf ? 22 : 8, 220); if (pf) { fx.ring(sh.x, sh.y, '#ffe070', 64); fx.pop('PERFECT!', sh.x, sh.y - 30, '#ffe070', 32); } else fx.pop('+1', sh.x, sh.y - 30, '#fff', 22);
        if (combo % 5 === 0) { Sound.sfx('star'); fx.pop('COMBO ' + combo + '!', 160, 120, '#ffb0f0', 38); fx.burst(160, 200, ['#ff5a5a', '#ffd23a', '#5ad0ff', '#7aff7a'], 34, 300); fx.flash(0.2, '#ffe070'); }
      } else { Sound.sfx('tap'); }
    };
    btn.onpointerdown = doKick; cv.onpointerdown = doKick;
    c.onStop(() => { ended = true; Loop.remove(fn); });
  },

  /* ----- Bắn pháo hoa: nổ + phát sáng ----- */
  phaohoa(c) {
    c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas>';
    const cv = $('canvas', c.area), x = cv.getContext('2d'), fx = MgFx();
    const GOAL = 26, ROCKETS = 16;
    let t = 0, time = 36, left = ROCKETS, score = 0, ended = false, lan = [], rk = [], stars = Array.from({ length: 36 }, () => ({ x: Math.random() * 320, y: Math.random() * 260, p: Math.random() * 6 })), best = 0, over = 0;
    const mk = (fromLeft) => { const gold = Math.random() < 0.16; lan.push({ x: fromLeft ? -30 : 350, y: 60 + Math.random() * 190, vx: (fromLeft ? 1 : -1) * (30 + Math.random() * 50), gold, ph: Math.random() * 6 }); };
    for (let i = 0; i < 5; i++) { mk(Math.random() < 0.5); lan[i].x = 30 + Math.random() * 260; }
    const fn = Loop.add((dt) => {
      if (ended) return; t += dt; time -= dt;
      if (lan.length < 6 && Math.random() < dt * 1.6) mk(Math.random() < 0.5);
      x.clearRect(0, 0, 320, 420);
      fx.begin(x, dt);
      stars.forEach((s) => { x.globalAlpha = 0.4 + Math.sin(t * 2 + s.p) * 0.4; x.fillStyle = '#fff'; x.fillRect(s.x, s.y, 2, 2); }); x.globalAlpha = 1;
      // thành phố
      x.fillStyle = 'rgba(10,6,30,.7)'; for (let i = 0; i < 9; i++) { const bh = 34 + ((i * 53) % 40); x.fillRect(i * 36, 400 - bh, 32, bh + 20); }
      x.fillStyle = 'rgba(255,220,120,.7)'; for (let i = 0; i < 18; i++) x.fillRect(6 + i * 17, 380 + (i % 3) * 8, 3, 3);
      lan = lan.filter((l) => { l.x += l.vx * dt; l.ph += dt * 3; return l.x > -50 && l.x < 370; });
      lan.forEach((l) => {
        const sw = Math.sin(l.ph) * 3; mgGlow(x, l.x, l.y + sw, l.gold ? 44 : 34, l.gold ? '#ffd23a' : '#ff5a3a', 0.55);
        x.strokeStyle = '#4a2a14'; x.lineWidth = 2; x.beginPath(); x.moveTo(l.x, l.y + sw - 28); x.lineTo(l.x, l.y + sw - 18); x.stroke();
        x.fillStyle = l.gold ? '#f0b020' : '#d82a1c'; x.beginPath(); x.ellipse(l.x, l.y + sw, 17, 21, 0, 0, 6.3); x.fill();
        x.fillStyle = l.gold ? '#ffe070' : '#ff6a4a'; x.beginPath(); x.ellipse(l.x - 5, l.y + sw - 4, 6, 12, 0, 0, 6.3); x.fill();
        x.fillStyle = '#ffd23a'; x.fillRect(l.x - 9, l.y + sw - 21, 18, 3); x.fillRect(l.x - 9, l.y + sw + 18, 18, 3); x.fillRect(l.x - 1, l.y + sw + 21, 2, 9);
      });
      // pháo đang bay
      for (let i = rk.length - 1; i >= 0; i--) {
        const r = rk[i]; r.l += dt / 0.42; const u = Math.min(1, r.l), e = 1 - (1 - u) * (1 - u);
        r.x = r.sx + (r.tx - r.sx) * e; r.y = r.sy + (r.ty - r.sy) * e;
        fx.burst(r.x, r.y, ['#ffe070', '#ff9a3a'], 2, 50, 80, 4); mgGlow(x, r.x, r.y, 16, '#fff6b0', 0.8);
        if (u >= 1) { rk.splice(i, 1); explode(r.tx, r.ty); }
      }
      mgText(x, 'Điểm ' + score + '/' + GOAL, 160, 34, '#fff', 26);
      for (let i = 0; i < left; i++) mgEmoji(x, '🎆', 26 + i * 18, 404, 16);
      fx.end(x, dt);
      c.stat.textContent = '🎆 ' + score + '/' + GOAL + ' · còn ' + left + ' pháo';
      if (!ended && (time <= 0 || (left <= 0 && !rk.length))) { over += dt; if (over > 0.9) { ended = true; Loop.remove(fn); c.end(clamp(score / GOAL, 0, 1), score + ' điểm · nổ nhiều nhất ' + best + ' đèn'); } }
    });
    function explode(px, py) {
      const cols = [['#ff5a5a', '#ffd23a', '#fff'], ['#5ad0ff', '#c8a0ff', '#fff'], ['#7aff7a', '#ffe070', '#fff'], ['#ff7ad8', '#ffd23a', '#fff']][(Math.random() * 4) | 0];
      fx.burst(px, py, cols, 50, 280, 160, 5); fx.ring(px, py, cols[0], 62); fx.ring(px, py, '#fff', 36); fx.flash(0.12, cols[0]); Sound.sfx('smash');
      const hits = lan.filter((l) => Math.hypot(l.x - px, l.y - py) < 64); if (!hits.length) return;
      lan = lan.filter((l) => !hits.includes(l)); let g = 0;
      hits.forEach((l, i) => { g += l.gold ? 3 : 1; setTimeout(() => { if (ended) return; fx.burst(l.x, l.y, l.gold ? ['#ffd23a', '#fff6b0'] : ['#ff5a3a', '#ffd23a', '#ff9ad8'], 26, 300); fx.ring(l.x, l.y, '#ffd23a', 56); Sound.sfx(i ? 'coin' : 'coins'); }, i * 90); });
      const n = hits.length; best = Math.max(best, n); if (n >= 2) g += n; score += g; Sound.vibrate(n >= 2 ? [30, 20, 50] : 25);
      fx.pop('+' + g + (n >= 2 ? ' · ×' + n : ''), px, py - 30, n >= 2 ? '#ffb0f0' : '#ffe070', 26 + n * 4); if (n >= 3) { fx.shake(9); fx.pop('COMBO!', 160, 120, '#ffe070', 40); }
    }
    cv.onpointerdown = (e) => { if (ended || left <= 0) return; const p = mgPt(cv, e); left--; Sound.sfx('whoosh'); rk.push({ sx: 160, sy: 400, tx: p.x, ty: clamp(p.y, 40, 330), l: 0, x: 160, y: 400 }); };
    c.onStop(() => { ended = true; Loop.remove(fn); });
  },
});
