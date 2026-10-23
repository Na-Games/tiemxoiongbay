/* Cảnh nền pixel-art có hoạt họa: trang chủ, bếp, chợ */
const Scenes = {};

function brickFill(x, x0, y0, w, h, rng, base, bw = 8, bh = 4) {
  const mortar = shade(base, -62);
  R(x, mortar, x0, y0, w, h);
  for (let r = 0, yy = y0; yy < y0 + h; r++, yy += bh) {
    const off = (r % 2) * (bw / 2);
    for (let xx = x0 - off; xx < x0 + w; xx += bw) {
      const j = Math.round((rng() - 0.5) * 22);
      const col = shade(base, j);
      const cx = Math.max(xx, x0), cw = Math.min(xx + bw - 1, x0 + w) - cx;
      const ch = Math.min(bh - 1, y0 + h - yy);
      if (cw > 0 && ch > 0) {
        R(x, col, cx, yy, cw, ch);
        R(x, shade(col, 16), cx, yy, cw, 1);
      }
    }
  }
}
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
function gradBands(x, W, y0, y1, stops) {
  for (let y = y0; y < y1; y++) {
    const t = (y - y0) / Math.max(1, y1 - y0 - 1);
    let i = 0; while (i < stops.length - 2 && t > stops[i + 1][0]) i++;
    const a = stops[i], b = stops[i + 1];
    const f = clamp((t - a[0]) / (b[0] - a[0]), 0, 1);
    for (let xx = 0; xx < W; xx++) {
      const th = (BAYER[y & 3][xx & 3] + 0.5) / 16;
      P(x, f > th ? b[1] : a[1], xx, y);
    }
  }
}

/* ---------- BẾP NHÀ ÔNG BẢY ---------- */
Scenes.kitchen = function (canvas, opt = {}) {
  const W = opt.W || 120, H = opt.H || 90;
  const fy = opt.floorY != null ? opt.floorY : 68;
  canvas.width = W; canvas.height = H;
  const ctx = sceneCtx(canvas, W, H);
  const bg = mkCanvas(W, H, SC), bx = bg.x;
  const rng = mulberry32(42);
  // trần + xà
  R(bx, '#1c1424', 0, 0, W, 9);
  for (let i = 0; i < W; i += 6) { R(bx, '#2a1c2a', i, 0, 3, 5); }
  R(bx, '#4a3030', 0, 5, W, 3); R(bx, '#6a4a3a', 0, 5, W, 1); R(bx, '#2a1a1a', 0, 8, W, 1);
  // tường gạch
  brickFill(bx, 0, 9, W, fy - 9, rng, '#8c4a3a');
  // bóng tối ở trên
  for (let y = 9; y < Math.min(fy, 30); y++) { bx.fillStyle = 'rgba(20,8,16,' + (0.45 * (1 - (y - 9) / 21)).toFixed(2) + ')'; bx.fillRect(0, y, W, 1); }
  // vầng khói ám trên tường
  bx.fillStyle = 'rgba(30,14,18,.22)'; for (let i = 0; i < 4; i++) disc(bx, 'rgba(30,14,18,.18)', 56 + i, 20, 22 - i * 4, 11 - i * 2);
  // chân tường
  R(bx, '#3a2020', 0, fy - 3, W, 3); R(bx, '#5a3030', 0, fy - 3, W, 1);
  // sàn gạch
  for (let y = fy; y < H; y += 8) {
    for (let xx = 0; xx < W; xx += 10) {
      const j = Math.round((rng() - 0.5) * 16);
      R(bx, shade('#8a4a38', j), xx, y, 9, 7); R(bx, shade('#a45a44', j), xx, y, 9, 1); R(bx, '#4a2420', xx + 9, y, 1, 8); R(bx, '#4a2420', xx, y + 7, 10, 1);
    }
  }
  // cửa sổ có song
  const wx = 7, wy = fy - 52;
  R(bx, '#4a3224', wx - 2, wy - 2, 26, 32); R(bx, '#6a4a30', wx - 2, wy - 2, 26, 1);
  R(bx, '#10143a', wx, wy, 22, 28);
  gradBands(bx, 0, 0, 0, [[0, '#000'], [1, '#000']]);
  for (let yy = 0; yy < 28; yy++) { R(bx, mix('#0c1030', '#1e2a5a', yy / 28), wx, wy + yy, 22, 1); }
  for (let i = 0; i < 4; i++) R(bx, '#5a3e2a', wx + 3 + i * 5, wy, 2, 28);
  R(bx, '#6a4a30', wx, wy + 26, 22, 2);
  const stars = [[3, 3], [9, 7], [16, 4], [6, 14], [18, 12], [12, 18], [4, 22]].map((s) => ({ x: wx + s[0], y: wy + s[1], p: rng() * 6 }));
  disc(bx, '#f0e6b0', wx + 16, wy + 7, 3.2); disc(bx, '#1a2048', wx + 17.6, wy + 6, 2.8);
  for (let i = 0; i < 4; i++) R(bx, '#5a3e2a', wx + 3 + i * 5, wy, 2, 28);
  // cây xà ngang song
  // quạt/nia tre tròn
  const fxx = 15, fyy = fy - 17;
  disc(bx, '#c89c50', fxx, fyy, 8, 8); disc(bx, '#e0b868', fxx, fyy, 6.5, 6.5);
  for (let i = -7; i <= 7; i += 2) { R(bx, 'rgba(120,80,30,.5)', fxx + i, fyy - 6, 1, 12); R(bx, 'rgba(120,80,30,.5)', fxx - 6, fyy + i, 12, 1); }
  disc(bx, '#8a5a28', fxx, fyy, 1.5, 1.5);
  // chồng củi
  const logs = [[6, fy - 1], [12, fy - 1], [18, fy - 1], [24, fy - 1], [9, fy - 5], [15, fy - 5], [21, fy - 5], [12, fy - 9], [18, fy - 9]];
  logs.forEach(([lx, ly]) => { disc(bx, '#6a4028', lx, ly, 3.2); disc(bx, '#d8a868', lx, ly, 2.2); disc(bx, '#b98848', lx, ly, 1); R(bx, '#4a2c1c', lx - 3, ly + 2, 7, 1); });
  // kệ + lọ + treo
  const sx = 82, sy = fy - 26;
  R(bx, '#7a4a28', sx, sy, 36, 3); R(bx, '#a06a3a', sx, sy, 36, 1); R(bx, '#3a2010', sx, sy + 3, 36, 1);
  [[86, '#6a3a28'], [95, '#2a5a8a'], [104, '#8a5a28'], [112, '#4a8aa8']].forEach(([jx, jc], i) => {
    const hh = [8, 7, 9, 6][i];
    R(bx, jc, jx - 3, sy - hh, 7, hh); R(bx, shade(jc, 30), jx - 2, sy - hh + 1, 1, hh - 2); R(bx, shade(jc, -30), jx - 3, sy - 1, 7, 1); R(bx, shade(jc, -20), jx - 2, sy - hh - 1, 5, 1);
  });
  // bắp ngô, tỏi treo
  [[90, 12, '#e8c030'], [97, 14, '#e8c030'], [104, 11, '#d8b020'], [111, 13, '#e8c030']].forEach(([cx, cy, cc]) => {
    R(bx, '#5a3a20', cx, cy - 6, 1, 6); R(bx, cc, cx - 1, cy, 4, 9); R(bx, shade(cc, 40), cx, cy + 1, 1, 7); R(bx, '#6a8a3a', cx - 1, cy, 1, 3);
    for (let k = 0; k < 4; k++) P(bx, shade(cc, -40), cx + 1, cy + 1 + k * 2);
  });
  [[82, 12], [85, 14]].forEach(([cx, cy]) => { R(bx, '#5a3a20', cx, cy - 6, 1, 6); for (let k = 0; k < 4; k++) disc(bx, '#f0ece0', cx, cy + k * 4, 2); });
  // chum lớn
  const jx = 100, jy = fy + 2;
  disc(bx, '#6a3a22', jx + 4, jy, 11, 14); disc(bx, '#8a5232', jx + 1, jy - 3, 7, 9); disc(bx, '#a06a40', jx - 1, jy - 6, 3, 4);
  R(bx, '#4a2814', jx - 5, jy - 16, 18, 3); R(bx, '#8a5232', jx - 5, jy - 16, 18, 1);
  // bếp lò
  const sk = opt.bare ? mkCanvas(1, 1).x : bx;
  const bxs = 44, byb = fy - 18;
  R(sk, '#4a2820', bxs, byb, 34, 22); brickFill(sk, bxs, byb, 34, 22, rng, '#a8503a', 6, 4);
  R(sk, '#2a1410', bxs - 1, byb + 21, 36, 2); R(sk, '#7a3a2a', bxs - 1, byb, 36, 2);
  // miệng lò
  R(sk, '#1a0c0a', bxs + 10, byb + 6, 14, 15); disc(sk, '#1a0c0a', bxs + 17, byb + 6, 7, 5); R(sk, '#5a2a20', bxs + 9, byb + 6, 1, 15); R(sk, '#5a2a20', bxs + 24, byb + 6, 1, 15);
  // nồi chõ
  const potX = bxs + 1, potY = byb - 30;
  R(sk, '#8a9098', potX, potY + 12, 32, 20); R(sk, '#c8ced4', potX + 2, potY + 12, 5, 20); R(sk, '#a8aeb6', potX + 8, potY + 12, 3, 20);
  R(sk, '#5a6068', potX + 26, potY + 12, 6, 20); R(sk, '#3a4048', potX, potY + 30, 32, 2);
  for (let i = 0; i < 32; i += 2) P(sk, '#3a4048', potX + i, potY + 27);
  R(sk, '#d0d6dc', potX - 1, potY + 12, 34, 2); R(sk, '#4a5058', potX - 2, potY + 20, 3, 3); R(sk, '#4a5058', potX + 31, potY + 20, 3, 3);
  const pot = { x: potX, y: potY, w: 32 };

  // thành phần động
  const puffs = []; let emit = 0; let cooking = false; let t = 0; let fan = 0;
  const catHi = Sprite.cat('#d8a050');
  const ongCv = [Sprite.charHi(DATA.CHARS.ongbay.look), Sprite.charHi(DATA.CHARS.ongbay.look, { blink: true })];
  const ctl = {
    hot: { stove: [bxs, byb - 30, 34, 52], ong: [80, fy - 6, 18, 27], cat: [28, fy + 2, 14, 10], jar: [90, fy - 16, 24, 28] },
    char: opt.char === false ? null : { x: opt.charX != null ? opt.charX : 80, y: fy - 6 },
    W, H, fy,
    setCooking(v) { cooking = v; },
    poke() { fan = 1; },
    update(dt, tt) {
      t += dt; fan = Math.max(0, fan - dt * 2);
      ctx.drawImage(bg.c, 0, 0, W, H);
      stars.forEach((s) => { if (Math.sin(t * 2 + s.p) > -0.2) P(ctx, '#e8f0ff', s.x, s.y); });
      if (opt.bare) { ctx.drawImage(catHi, 28, fy, 16, 12); return; }
      const heat = (cooking ? 1.5 : 1) + fan;
      // ánh lửa
      ctx.fillStyle = 'rgba(255,150,60,' + (0.07 + 0.03 * Math.sin(t * 9)) * heat + ')';
      disc(ctx, 'rgba(255,150,60,' + (0.07 * heat).toFixed(3) + ')', bxs + 17, byb + 14, 30, 22);
      // lửa
      R(ctx, '#2a1008', bxs + 11, byb + 13, 12, 8);
      for (let i = 0; i < 4; i++) {
        const fh = (4 + 3 * Math.sin(t * (9 + i * 2) + i) + 2 * heat) | 0;
        const fx = bxs + 12 + i * 3;
        R(ctx, '#e8481c', fx, byb + 20 - fh, 3, fh); R(ctx, '#ffa030', fx, byb + 20 - fh + 1, 2, Math.max(1, fh - 2)); R(ctx, '#ffe070', fx, byb + 20 - Math.max(1, fh - 3), 1, Math.max(1, fh - 3));
      }
      for (let i = 0; i < 6; i++) if ((Math.sin(t * 5 + i * 2.3) + 1) * 0.5 > 0.97 - 0.05 * fan) P(ctx, '#ffd070', bxs + 12 + ((t * 7 + i * 5) % 11), byb + 12 - ((t * 9 + i * 3) % 8));
      // sao
      // nắp nồi
      const jit = cooking ? Math.round(Math.sin(t * 40)) : 0;
      R(ctx, '#8a9098', pot.x + 3, pot.y + 5 + jit, 26, 7); R(ctx, '#d0d6dc', pot.x + 5, pot.y + 5 + jit, 12, 1); R(ctx, '#5a6068', pot.x + 3, pot.y + 11 + jit, 26, 1);
      R(ctx, '#a8aeb6', pot.x + 6, pot.y + 2 + jit, 20, 3); R(ctx, '#d0d6dc', pot.x + 8, pot.y + 2 + jit, 8, 1); R(ctx, '#3a2a20', pot.x + 13, pot.y + jit, 6, 2);
      // hơi nước
      emit += dt * (cooking ? 18 : 3.2) * (1 + fan);
      while (emit > 1) { emit--; puffs.push({ x: pot.x + 8 + Math.random() * 16, y: pot.y + 1, vx: (Math.random() - 0.5) * 5, vy: -(6 + Math.random() * 6) * (cooking ? 1.5 : 1), l: 0, r: 1.5 + Math.random() * 1.5 }); }
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i]; p.l += dt; p.x += p.vx * dt + Math.sin(p.l * 4 + p.x) * 0.2; p.y += p.vy * dt;
        if (p.l > 2.2) { puffs.splice(i, 1); continue; }
        const a = (1 - p.l / 2.2) * 0.55;
        disc(ctx, 'rgba(240,244,250,' + a.toFixed(2) + ')', p.x, p.y, p.r + p.l * 1.4);
      }
      // mèo
      ctx.drawImage(catHi, 28, fy + Math.round(Math.sin(t * 1.6) * 0.4), 16, 12);
      (ctl.staff || []).forEach((st) => { drawChar(ctx, st.cv, st.x, fy - 6 + Math.sin(t * 3 + st.p) * 0.7); });
      // nhân vật
      if (ctl.char) {
        const bob = Math.round(Math.sin(t * (cooking ? 8 : 2.5)) * (cooking ? 1 : 0.6));
        const blink = (t % 3.4) > 3.25;
        drawChar(ctx, ongCv[blink ? 1 : 0], ctl.char.x, ctl.char.y + bob);
        // cái muôi
        if (cooking) R(ctx, '#a07040', ctl.char.x - 4, ctl.char.y + 12 + bob + Math.round(Math.sin(t * 10)), 5, 1);
        else R(ctx, '#f0e0a0', ctl.char.x - 3, ctl.char.y + 16 + bob, 3, 2);
      }
    },
  };
  return ctl;
};

/* ---------- TRANG CHỦ: cảnh làng hoàng hôn ---------- */
Scenes.title = function (canvas) {
  const W = 96;
  const H = Math.max(160, Math.min(260, Math.round(W * (canvas.clientHeight || 640) / (canvas.clientWidth || 360))));
  canvas.width = W; canvas.height = H;
  const ctx = sceneCtx(canvas, W, H);
  const bg = mkCanvas(W, H, SC), x = bg.x, rng = mulberry32(7);
  const yH = Math.round(H * 0.46);
  gradBands(x, W, 0, yH, [[0, '#0b0826'], [0.3, '#1a1250'], [0.55, '#4a2672'], [0.75, '#b0407a'], [0.9, '#f07a48'], [1, '#f8b862']]);
  // mặt trời
  const sunX = Math.round(W * 0.66), sunY = yH - 3;
  for (let r = 22; r > 8; r -= 3) disc(x, 'rgba(255,160,90,' + (0.05 + (22 - r) * 0.012).toFixed(3) + ')', sunX, sunY, r);
  disc(x, '#ffd07a', sunX, sunY, 8); disc(x, '#fff0b0', sunX, sunY - 1, 5);
  // núi xa
  for (let xx = 0; xx < W; xx++) {
    const m1 = yH - 12 - 6 * Math.sin(xx * 0.08 + 1) - 4 * Math.sin(xx * 0.21 + 2);
    R(x, '#5a3282', xx, m1, 1, yH - m1);
    const m2 = yH - 5 - 4 * Math.sin(xx * 0.12 + 3) - 2 * Math.sin(xx * 0.3);
    R(x, '#3a2262', xx, m2, 1, yH - m2);
  }
  // ruộng
  for (let y = yH; y < yH + Math.round(H * 0.13); y++) {
    const k = y - yH;
    for (let xx = 0; xx < W; xx++) {
      const stripe = ((xx + k * 3) >> 2) & 1;
      const base = k < 3 ? '#a05a50' : stripe ? '#3a4a48' : '#2c4a42';
      P(x, k % 3 === 0 && stripe ? '#d88a58' : base, xx, y);
    }
  }
  const gy = yH + Math.round(H * 0.07); // chân cổng
  // cánh đồng xanh phía trước
  for (let y = yH + Math.round(H * 0.13); y < H; y++) {
    const k = (y - yH) / (H - yH);
    for (let xx = 0; xx < W; xx++) { const n = (BAYER[y & 3][xx & 3] + 0.5) / 16; P(x, k + n * 0.15 > 0.55 ? '#1f4a2e' : '#2a5a3a', xx, y); }
  }
  // lối đi
  const pathTop = gy + 6;
  for (let y = pathTop; y < H; y++) {
    const k = (y - pathTop) / (H - pathTop), half = 4 + k * 26;
    for (let xx = Math.round(W / 2 - half); xx < W / 2 + half; xx++) {
      const n = BAYER[y & 3][xx & 3] / 16;
      const edge = Math.abs(xx - W / 2) > half - 2;
      P(x, edge ? '#3a2e34' : (n > 0.55 ? '#6a4c52' : '#5a4048'), xx, y);
      if (!edge && rng() < 0.03) P(x, '#8a6a68', xx, y);
    }
  }
  // cổng làng
  const cx = Math.round(W / 2), gw = 28, gt = gy - 30;
  brickFill(x, cx - 12, gt + 8, 24, 22, rng, '#8a7a76', 6, 3);
  R(x, '#6a5a58', cx - 14, gt + 6, 28, 3); R(x, '#a89a94', cx - 14, gt + 6, 28, 1);
  // mái ngói
  R(x, '#a8483a', cx - 15, gt + 2, 30, 4); R(x, '#c85a48', cx - 15, gt + 2, 30, 1); for (let i = 0; i < 30; i += 3) R(x, '#7a2a28', cx - 15 + i, gt + 3, 1, 3);
  R(x, '#a8483a', cx - 11, gt, 22, 3);
  // biển
  R(x, '#2a1a14', cx - 6, gt + 10, 12, 4); for (let i = 0; i < 3; i++) R(x, '#f0c860', cx - 4 + i * 3, gt + 12, 2, 1);
  // cửa gỗ
  R(x, '#3a1810', cx - 6, gt + 17, 12, 13); disc(x, '#3a1810', cx, gt + 17, 6, 4);
  R(x, '#6a3018', cx - 5, gt + 18, 4, 12); R(x, '#6a3018', cx + 1, gt + 18, 4, 12); R(x, '#8a4a28', cx - 5, gt + 18, 1, 12);
  P(x, '#f0c860', cx - 2, gt + 24); P(x, '#f0c860', cx + 1, gt + 24);
  // đèn lồng
  [[cx - 11, gt + 15], [cx + 10, gt + 15]].forEach(([lx, ly]) => { disc(x, '#e84a2a', lx, ly, 2, 3); P(x, '#ffb070', lx - 1, ly - 1); R(x, '#4a2a18', lx - 1, ly - 4, 2, 1); });
  // cờ
  R(x, '#6a5a58', cx + 14, gt - 10, 1, 14); R(x, '#d8281c', cx + 15, gt - 10, 8, 5); P(x, '#ffe040', cx + 18, gt - 8); P(x, '#ffe040', cx + 19, gt - 8); P(x, '#ffe040', cx + 18, gt - 7);
  // cây đa bên trái
  R(x, '#2a1e24', 4, yH - 24, 9, H - yH + 24); R(x, '#3a2a30', 4, yH - 24, 2, H - yH + 24);
  for (let i = 0; i < 6; i++) R(x, '#2a1e24', 14 + i * 3, yH - 22, 1, 20 + (i * 7) % 18);
  [[10, yH - 36, 16], [24, yH - 34, 11], [0, yH - 30, 12], [14, yH - 46, 12], [30, yH - 30, 7]].forEach(([tx, ty, tr]) => {
    disc(x, '#1d3a38', tx, ty, tr, tr * 0.8); disc(x, '#2a5a50', tx - 2, ty - 2, tr * 0.7, tr * 0.55);
    for (let k = 0; k < tr; k++) P(x, '#4a8a6a', tx - tr + rng() * tr * 2, ty - tr * 0.6 + rng() * tr);
  });
  // tre bên phải
  for (let i = 0; i < 5; i++) {
    const bxx = 78 + i * 3 + (i % 2), top = yH - 22 - (i * 5) % 12;
    R(x, '#1a3a28', bxx, top, 1, H - top); R(x, '#2a5a3a', bxx + 1, top, 1, H - top);
    for (let k = 0; k < 5; k++) { const ly = top + k * 4; R(x, '#2a6a3a', bxx - 3, ly, 3, 1); R(x, '#2a6a3a', bxx + 2, ly + 2, 3, 1); }
  }
  // cỏ phía trước
  for (let xx = 0; xx < W; xx++) {
    if (Math.abs(xx - W / 2) < 10 + ((H - 8 - pathTop) * 26) / (H - pathTop)) continue;
    const gh = 2 + Math.floor(rng() * 4);
    R(x, '#173a24', xx, H - gh, 1, gh); if (rng() < 0.4) P(x, '#3a8a4a', xx, H - gh - 1);
  }
  const starsA = Array.from({ length: 55 }, () => ({ x: rng() * W, y: rng() * yH * 0.6, p: rng() * 7 }));
  const flies = Array.from({ length: 16 }, () => ({ x: rng() * W, y: yH + rng() * (H - yH), p: rng() * 7, s: 3 + rng() * 5 }));
  const birds = [{ x: 50, y: 40, s: 5 }, { x: 40, y: 46, s: 5 }, { x: 58, y: 50, s: 5 }];
  const lanterns = [{ x: 30, y: yH, s: 0 }, { x: 62, y: yH + 10, s: 0.5 }];
  const vend = Sprite.vendor({ skin: '#d9a070', hair: '#222', shirt: '#9a6a40', pants: '#2c2a30' });
  let t = 0;
  return {
    W, H,
    update(dt) {
      t += dt;
      ctx.drawImage(bg.c, 0, 0, W, H);
      starsA.forEach((s) => { const a = Math.sin(t * 2 + s.p); if (a > -0.3) P(ctx, a > 0.7 ? '#ffffff' : '#a8a8d8', s.x, s.y); });
      birds.forEach((b, i) => {
        b.x += dt * b.s; b.y += Math.sin(t + i) * dt * 2; if (b.x > W + 6) b.x = -8;
        const f = Math.sin(t * 8 + i) > 0;
        P(ctx, '#2a1a3a', b.x, b.y); P(ctx, '#2a1a3a', b.x - 1, b.y + (f ? -1 : 1)); P(ctx, '#2a1a3a', b.x + 1, b.y + (f ? -1 : 1)); P(ctx, '#2a1a3a', b.x - 2, b.y + (f ? -2 : 0)); P(ctx, '#2a1a3a', b.x + 2, b.y + (f ? -2 : 0));
      });
      lanterns.forEach((l) => {
        l.y -= dt * 3; l.x += Math.sin(t + l.s * 5) * dt * 3; if (l.y < -4) { l.y = H * 0.7; l.x = 10 + Math.random() * 76; }
        disc(ctx, 'rgba(255,170,60,.25)', l.x, l.y, 4); R(ctx, '#ff8a2a', l.x - 1, l.y - 1, 3, 3); P(ctx, '#ffe090', l.x, l.y);
      });
      flies.forEach((f) => {
        f.x += Math.sin(t * 0.7 + f.p) * dt * f.s; f.y += Math.cos(t * 0.9 + f.p) * dt * f.s * 0.6;
        if (Math.sin(t * 3 + f.p) > 0) { P(ctx, '#f0f070', f.x, f.y); P(ctx, 'rgba(240,240,100,.3)', f.x + 1, f.y); }
      });
      // người gánh xôi bước đi
      const step = Math.sin(t * 5); const vy = Math.round(H * 0.6 + Math.abs(step) * 0.8);
      ctx.drawImage(vend, Math.round(W / 2 - 18), vy - 30, 36, 30);
      R(ctx, 'rgba(0,0,0,.25)', W / 2 - 6, vy, 12, 1);
    },
  };
};

/* ---------- CHỢ SÁNG: tạp hóa, cà phê, rau quả sinh động có hoạt họa ---------- */
Scenes.market = function (canvas, opt = {}) {
  const W = 120, H = opt.H || 100, OY = 8;
  canvas.width = W; canvas.height = H;
  const ctx = sceneCtx(canvas, W, H);
  const bg = mkCanvas(W, H, SC), x = bg.x, rng = mulberry32(21);
  x.translate(0, OY);
  const gy = 40; // mặt đường
  // trời, mây
  for (let y = -OY; y < 8; y++) R(x, mix('#78b2d8', '#d4eaf2', (y + OY) / 16), 0, y, W, 1);
  [[10, -3, 8], [66, -5, 9], [102, -1, 7]].forEach(([cx, cy, r]) => { disc(x, 'rgba(255,255,255,.8)', cx, cy, r, 2.6); disc(x, 'rgba(255,255,255,.8)', cx + 5, cy - 1.5, r * 0.6, 2.6); });
  // nhà cao tầng phía xa
  [[2, 10, 4], [30, 14, 3], [70, 12, 5], [96, 16, 3], [112, 9, 4]].forEach(([bx2, bh, bw]) => { R(x, '#8aa0b8', bx2, 6 - bh * 0.3, bw * 3, bh); R(x, '#a8bccc', bx2, 6 - bh * 0.3, bw * 3, 1); });

  const shops = [
    { x: 0, w: 38, wall: '#d9a55e', trim: '#8a5a2a', aw1: '#d84a3a', aw2: '#f4e4c8', kind: 'gro' },
    { x: 38, w: 44, wall: '#4f9c8c', trim: '#2a5a50', aw1: '#3a6aa8', aw2: '#f4e4c8', kind: 'cafe' },
    { x: 82, w: 38, wall: '#92c474', trim: '#3a6a2a', aw1: '#3a9a48', aw2: '#f6f2d4', kind: 'veg' },
  ];
  shops.forEach((s) => {
    // tường có vân gạch + cột hai bên
    R(x, s.wall, s.x, 5, s.w, gy - 5);
    for (let yy = 7; yy < gy; yy += 3) R(x, shade(s.wall, -9), s.x, yy, s.w, 1);
    R(x, shade(s.wall, -34), s.x, 5, 1, gy - 5); R(x, shade(s.wall, -34), s.x + s.w - 1, 5, 1, gy - 5); R(x, shade(s.wall, 22), s.x + 1, 5, 1, gy - 5);
    R(x, s.trim, s.x, 3, s.w, 3); R(x, shade(s.trim, 46), s.x, 3, s.w, 1); R(x, shade(s.trim, -40), s.x, 5, s.w, 1);
    // tầng trên
    if (s.kind === 'gro') {
      [6, 24].forEach((wx) => { R(x, s.trim, s.x + wx - 1, 7, 10, 10); R(x, '#324a66', s.x + wx, 8, 8, 8); R(x, '#5a82a8', s.x + wx, 8, 8, 3); R(x, '#8ab2d0', s.x + wx + 1, 9, 2, 5); R(x, s.trim, s.x + wx + 3, 8, 1, 8); R(x, '#4a7a3a', s.x + wx - 3, 7, 2, 10); R(x, '#4a7a3a', s.x + wx + 9, 7, 2, 10); });
      R(x, '#7a4a28', s.x + 5, 17, 5, 2); disc(x, '#4aa04a', s.x + 7, 16, 2, 1.6); disc(x, '#ff6a8a', s.x + 7, 15, 0.8, 0.8);
    } else if (s.kind === 'cafe') {
      R(x, s.trim, s.x + 5, 7, s.w - 10, 10); R(x, '#ffd890', s.x + 6, 8, s.w - 12, 8); R(x, '#ffe8b4', s.x + 6, 8, s.w - 12, 3);
      for (let k = 1; k < 4; k++) R(x, s.trim, s.x + 6 + k * ((s.w - 12) / 4), 8, 1, 8);
      R(x, '#7a4a28', s.x + 5, 16, s.w - 10, 2); for (let k = 0; k < 14; k++) { P(x, pick(['#ff6a8a', '#ffd23a', '#fff', '#ff9a4a']), s.x + 6 + k * 2.6, 15); P(x, '#3a8a3a', s.x + 6 + k * 2.6, 16); }
    } else {
      [5, 25].forEach((wx) => { R(x, s.trim, s.x + wx - 1, 7, 10, 10); R(x, '#5a8a58', s.x + wx, 8, 8, 8); R(x, '#a8d4a0', s.x + wx, 8, 8, 3); R(x, s.trim, s.x + wx + 3, 8, 1, 8); });
      for (let k = 0; k < 8; k++) { R(x, '#2f7a30', s.x + 4 + k * 4, 17, 1, 2 + (k % 3)); P(x, '#ff6a4a', s.x + 4 + k * 4, 19 + (k % 3)); }
      R(x, '#7a4a28', s.x + 3, 17, s.w - 6, 1);
    }
    // biển hiệu có viền sáng và đèn rọi
    R(x, shade(s.trim, -30), s.x + 3, 17, s.w - 6, 8); R(x, shade(s.trim, 30), s.x + 3, 17, s.w - 6, 1); R(x, '#16100c', s.x + 4, 18, s.w - 8, 6);
    for (let k = 0; k < 4; k++) P(x, '#ffe070', s.x + 6 + k * ((s.w - 12) / 3), 17);
    // mái hiên sọc vải bố có diềm tròn
    for (let i = 0, k = 0; i < s.w - 4; i += 4, k++) {
      const col = k % 2 ? s.aw2 : s.aw1;
      R(x, col, s.x + 2 + i, 25, 4, 4); R(x, shade(col, 24), s.x + 2 + i, 25, 4, 1); R(x, shade(col, -28), s.x + 2 + i, 28, 4, 1); P(x, col, s.x + 3 + i, 29); P(x, col, s.x + 4 + i, 29);
    }
    R(x, '#2a1a14', s.x + 2, 24, s.w - 4, 1);
    // bên trong cửa hàng
    if (s.kind === 'gro') {
      R(x, '#3a2a1a', s.x + 3, 30, s.w - 6, gy - 30); R(x, '#4a3622', s.x + 3, 30, s.w - 6, 2);
      [32, 36].forEach((sy2) => { R(x, '#8a5a30', s.x + 3, sy2 + 2, s.w - 6, 1); for (let k = 0; k < 8; k++) { const cl = ['#d84a3a', '#f0c030', '#3a8ad8', '#5ac84a', '#e8e8e0', '#c85ad8'][(k + sy2) % 6]; R(x, cl, s.x + 4 + k * 4, sy2 - 1 + (k % 2), 3, 3 - (k % 2)); P(x, 'rgba(255,255,255,.6)', s.x + 4 + k * 4, sy2 - 1 + (k % 2)); } });
      R(x, '#5a3a20', s.x + 3, 38, s.w - 6, 2);
    } else if (s.kind === 'cafe') {
      R(x, '#4a2c1c', s.x + 3, 30, s.w - 6, gy - 30); R(x, '#6a4228', s.x + 3, 30, s.w - 6, 2);
      R(x, '#0e2a20', s.x + 26, 31, 14, 7); R(x, '#d8e8e0', s.x + 28, 32, 9, 1); R(x, '#d8e8e0', s.x + 28, 34, 6, 1); R(x, '#f0c860', s.x + 28, 36, 7, 1); R(x, '#8a5a30', s.x + 26, 31, 14, 1); R(x, '#8a5a30', s.x + 26, 37, 14, 1);
      R(x, '#9aa0a8', s.x + 6, 31, 10, 6); R(x, '#c8ced4', s.x + 6, 31, 10, 1); R(x, '#5a6068', s.x + 6, 36, 10, 1); R(x, '#222', s.x + 8, 33, 2, 3); R(x, '#222', s.x + 12, 33, 2, 3);
      R(x, '#8a5a30', s.x + 3, 37, s.w - 6, 3); R(x, '#b88a50', s.x + 3, 37, s.w - 6, 1);
      [[19, '#fff'], [24, '#e84a3a'], [31, '#fff']].forEach(([cx2, cl]) => { R(x, cl, s.x + cx2, 35, 3, 2); P(x, '#3a2418', s.x + cx2 + 1, 35); });
    } else {
      R(x, '#2e4a2a', s.x + 3, 30, s.w - 6, gy - 30); R(x, '#3e5e38', s.x + 3, 30, s.w - 6, 2);
      R(x, '#7a4a28', s.x + 3, 34, s.w - 6, 1); R(x, '#7a4a28', s.x + 3, 38, s.w - 6, 2);
      const veg = ['#e8402c', '#5ac84a', '#f08a28', '#9a4ac0', '#f2d040', '#8ad858'];
      for (let k = 0; k < 8; k++) { disc(x, veg[k % 6], s.x + 6 + k * 3.7, 32.5, 1.6, 1.4); disc(x, veg[(k + 2) % 6], s.x + 5 + k * 3.7, 36.5, 1.7, 1.5); }
    }
  });
  R(x, '#2a2e3a', 0, 4, W, 0); // (dây điện được vẽ động ở update)

  // quầy hàng phía trước: nước ngọt, thùng, giỏ trái cây
  const stand = (sx, sy, w) => { R(x, '#6a4a30', sx, sy + 4, w, 2); R(x, '#8a6a48', sx, sy + 4, w, 1); R(x, '#4a2c1c', sx + 1, sy + 6, 2, 6); R(x, '#4a2c1c', sx + w - 3, sy + 6, 2, 6); };
  stand(1, 33, 32);
  [['#e84a3a', 3], ['#3a8ad8', 6], ['#5ac84a', 9], ['#f0c030', 12], ['#e84a3a', 15], ['#3a8ad8', 18]].forEach(([cl, bx2]) => { R(x, cl, bx2, 29, 2, 5); R(x, shade(cl, 40), bx2, 29, 1, 4); R(x, '#d8d8d8', bx2, 28, 2, 1); });
  R(x, '#f0f0f0', 23, 28, 8, 9); R(x, '#d82a2a', 23, 28, 8, 2); R(x, '#a8c8e0', 24, 31, 6, 4); R(x, '#2a1a14', 27, 29, 2, 1);
  stand(86, 33, 32);
  [[89, '#2f8a3a'], [96, '#f08a28'], [103, '#d83a3a'], [110, '#f2d040']].forEach(([fx2, cl]) => { disc(x, shade(cl, -30), fx2 + 1, 33, 3.8, 3); disc(x, cl, fx2, 32, 3.4, 2.8); disc(x, shade(cl, 40), fx2 - 1, 31, 1.2, 0.8); });
  R(x, '#e8e0c8', 89, 26, 14, 7); R(x, '#2a1a14', 89, 26, 14, 1); R(x, '#d8281c', 91, 28, 10, 1); R(x, '#2a7a2a', 91, 30, 7, 1);

  // mặt đường lát đá
  R(x, '#a0988a', 0, gy, W, H);
  for (let y = gy, row = 0; y < H; y += 6, row++) {
    for (let xx = (row % 2) * 5 - 5; xx < W; xx += 10) {
      const j = Math.round((rng() - 0.5) * 14);
      R(x, shade('#a0988a', j), xx, y, 9, 5); R(x, shade('#b8b0a0', j), xx, y, 9, 1); R(x, '#7a7468', xx + 9, y, 1, 6); R(x, '#7a7468', xx, y + 5, 10, 1);
    }
  }
  R(x, '#6a6460', 0, gy, W, 2); R(x, '#807a70', 0, gy + 2, W, 1);
  // vỉa hè sơn đỏ trắng
  for (let xx = 0; xx < W; xx += 4) R(x, (xx / 4) % 2 ? '#e8e0d0' : '#c85a4a', xx, gy, 4, 1);

  // cái thúng (rổ) lớn đặt trước
  const bxl = 38, byl = 50;
  disc(x, '#a8783c', bxl + 22, byl + 3, 22, 5);
  R(x, '#b8884a', bxl, byl + 1, 44, 7); disc(x, '#b8884a', bxl + 22, byl + 8, 21, 4);
  for (let i = 0; i < 44; i += 3) R(x, '#8a5a28', bxl + i, byl + 2, 1, 8);
  R(x, '#6a4018', bxl, byl, 44, 1);

  const vendorLook = DATA.CHARS.ongbay.look;
  // lớp phủ độ phân giải cao: ông Bảy nét hơn, phần thúng phía trước đè lên người bán
  let host = null, vimg = null, front = null, fctx = null, blinkOn = false;
  if (opt.overlay && canvas.parentNode) {
    host = el('div', 'mkt-lay'); canvas.parentNode.appendChild(host);
    vimg = new Image(); vimg.className = 'pix hi mkt-vendor'; vimg.src = charURL(vendorLook); vimg.draggable = false; host.appendChild(vimg);
    front = el('canvas', 'pix mkt-front'); host.appendChild(front); fctx = sceneCtx(front, W, H);
  }
  const vend = Sprite.char(vendorLook), vendB = Sprite.char(vendorLook, { blink: true });
  let t = 0, tint = 0;
  const pigeons = [{ x: 20, y: gy + 22, d: 1 }, { x: 98, y: gy + 26, d: -1 }];
  const steam = []; let steamT = 0;
  const walkers = [{ x: 10, v: 6, c: '#c84a3a', h: '#2a1a14' }, { x: 80, v: -8, c: '#3a7ac8', h: '#6a6a6a' }, { x: 50, v: 4.5, c: '#4aa05a', h: '#1a1a1a' }];
  const SN = ['#d84a3a', '#f0c030', '#3a8ad8', '#5ac84a'];
  const ctl = {
    W, H, gy,
    mounds: [], // [{color,count}]
    setTime(f) { tint = clamp(1 - f * 1.6, 0, 0.35); },
    update(dt) {
      t += dt;
      ctx.drawImage(bg.c, 0, 0, W, H);
      ctx.save(); ctx.translate(0, OY);
      // dây đèn lồng nhấp nháy giăng ngang phố
      for (let xx = 0; xx < W; xx++) { const yy = 7 + Math.sin((xx / W) * Math.PI) * 3.4; P(ctx, '#2a2e3a', xx, yy); }
      for (let i = 0; i < 15; i++) { const xx = 4 + i * 8, yy = 7 + Math.sin((xx / W) * Math.PI) * 3.4 + 1, on = Math.sin(t * 3 + i * 1.7) > -0.2, cl = ['#ff5a4a', '#ffd23a', '#5ad0ff', '#7aff7a'][i % 4]; R(ctx, on ? cl : shade(cl, -80), xx, yy, 2, 2); if (on) { disc(ctx, 'rgba(255,230,150,.22)', xx + 0.5, yy + 0.5, 3, 3); P(ctx, '#fff', xx, yy); } }
      // đèn neon quán cà phê nhấp nháy
      const fl = 0.16 + 0.07 * Math.sin(t * 6) + (Math.sin(t * 31) > 0.96 ? -0.1 : 0); ctx.fillStyle = 'rgba(255,200,120,' + clamp(fl, 0, 1).toFixed(3) + ')'; ctx.fillRect(40, 15, 40, 12);
      // gói snack tạp hóa đung đưa
      for (let i = 0; i < 6; i++) { const sw = Math.sin(t * 2.2 + i * 0.9) * 1.1; R(ctx, '#3a2418', 6 + i * 5 + sw * 0.4, 29, 1, 2); R(ctx, SN[i % 4], 5 + i * 5 + sw, 31, 3, 5); P(ctx, 'rgba(255,255,255,.7)', 5 + i * 5 + sw, 31); }
      // chuối treo ở tiệm rau quả
      for (let i = 0; i < 4; i++) { const sw = Math.sin(t * 1.8 + i) * 0.9; R(ctx, '#f2d040', 109 + i * 2 + sw, 30, 1, 6 + (i % 2)); R(ctx, '#c8a020', 110 + i * 2 + sw, 31, 1, 5); } R(ctx, '#5a3a20', 108, 29, 9, 1);
      // hơi nóng từ ly cà phê
      steamT += dt * 5; while (steamT > 1) { steamT--; steam.push({ x: 56 + (Math.random() < 0.5 ? 0 : 5) + Math.random() * 2, y: 34, l: 0, vx: (Math.random() - 0.5) * 3 }); }
      for (let i = steam.length - 1; i >= 0; i--) { const s = steam[i]; s.l += dt; if (s.l > 1.6) { steam.splice(i, 1); continue; } s.y -= dt * 5; s.x += s.vx * dt + Math.sin(s.l * 6) * 0.1; disc(ctx, 'rgba(255,255,255,' + (0.55 * (1 - s.l / 1.6)).toFixed(2) + ')', s.x, s.y, 0.9 + s.l, 0.9 + s.l); }
      // người đi bộ phía xa
      walkers.forEach((w, i) => {
        w.x += w.v * dt; if (w.x > W + 6) w.x = -6; if (w.x < -6) w.x = W + 6;
        const st = Math.floor(t * 6 + i) % 2, wy = gy - 3;
        R(ctx, '#1a1a28', w.x, wy + 6 + st, 1, 3 - st); R(ctx, '#1a1a28', w.x + 2, wy + 7 - st, 1, 2 + st);
        R(ctx, w.c, w.x - 0.5, wy + 2, 4, 5); R(ctx, '#e8b890', w.x, wy - 1, 3, 3); R(ctx, w.h, w.x, wy - 1, 3, 1);
      });
      (ctl.staff || []).forEach((st) => { drawChar(ctx, st.cv, st.x, 31 + Math.sin(t * 3 + st.p) * 0.7); });
      const bob = Math.round(Math.sin(t * 2) * 0.6), blink = (t % 3.6) > 3.45;
      if (front) {
        if (blink !== blinkOn) { blinkOn = blink; vimg.src = charURL(vendorLook, blink ? { blink: true } : undefined); }
        ctx.restore();
        fctx.clearRect(0, 0, W, H); fctx.save(); fctx.translate(0, OY);
        drawFront(fctx);
        fctx.restore();
        if (tint > 0.01) { fctx.fillStyle = 'rgba(255,150,70,' + tint.toFixed(3) + ')'; fctx.fillRect(0, 0, W, H); }
        return;
      }
      ctx.drawImage(blink ? vendB : vend, 51, 31 + bob);
      drawFront(ctx);
      ctx.restore();
      if (tint > 0.01) { ctx.fillStyle = 'rgba(255,150,70,' + tint.toFixed(3) + ')'; ctx.fillRect(0, 0, W, H); }
    },
  };
  function drawFront(c2) {
    // xôi trong thúng
    const m = ctl.mounds.filter((q) => q.count > 0), cap = Math.max(1, m.length);
    m.forEach((q, i) => {
      const cxm = bxl + 8 + (i + 0.5) * (30 / cap) + 3, f = 0.55 + 0.45 * Math.min(1, q.count / 8), w = 17 - cap * 1.2, bw = Sprite.bowl(q.color, q.id);
      c2.drawImage(bw, 7 * SS, 2 * SS, 24 * SS, 15 * SS, cxm - w / 2, byl + 3.5 - (w * 0.62) * f, w, w * 0.62 * f);
    });
    // phần thúng phía trước (che gốc xôi và chân người bán)
    R(c2, '#b8884a', bxl, byl + 3, 44, 5); disc(c2, '#b8884a', bxl + 22, byl + 8, 21, 3);
    for (let i = 0; i < 44; i += 3) R(c2, '#8a5a28', bxl + i, byl + 4, 1, 6);
    R(c2, '#6a4018', bxl, byl + 3, 44, 1);
    // chim bồ câu
    pigeons.forEach((p, i) => {
      p.x += p.d * 0.016 * 3; if (p.x < 6 || p.x > W - 6) p.d *= -1;
      const hop = Math.sin(t * 6 + i) > 0.8 ? -1 : 0;
      R(c2, '#8a8a98', p.x, p.y + hop, 4, 2); P(c2, '#6a6a78', p.x + (p.d > 0 ? 4 : -1), p.y + hop - 1); P(c2, '#e8a030', p.x + (p.d > 0 ? 5 : -2), p.y + hop);
    });
  }
  return ctl;
};
