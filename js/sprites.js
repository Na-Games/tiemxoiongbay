/* Vẽ pixel-art bằng code: nhân vật, vật dụng */
const SS = 3, SC = 4; // SS: siêu mẫu nhân vật, SC: độ nét cảnh nền (chiều ngang pixel thật / pixel cảnh) // hệ số siêu mẫu cho nhân vật độ phân giải cao
function mkCanvas(w, h, s = 1) {
  const c = document.createElement('canvas'); c.width = w * s; c.height = h * s;
  const x = c.getContext('2d');
  if (s > 1) { x.scale(s, s); x._ss = true; x.imageSmoothingEnabled = true; c._lw = w; c._lh = h; } else x.imageSmoothingEnabled = false;
  return { c, x };
}
function R(x, col, X, Y, W, H) { x.fillStyle = col; if (x._ss) x.fillRect(X, Y, W, H); else x.fillRect(Math.round(X), Math.round(Y), Math.round(W), Math.round(H)); }
function P(x, col, X, Y) { x.fillStyle = col; if (x._ss) x.fillRect(X, Y, 1, 1); else x.fillRect(Math.round(X), Math.round(Y), 1, 1); }
function disc(x, col, cx, cy, rx, ry) {
  ry = ry == null ? rx : ry; x.fillStyle = col;
  if (x._ss) { x.beginPath(); x.ellipse(cx + 0.5, cy + 0.5, rx + 0.5, ry + 0.5, 0, 0, 6.2832); x.fill(); return; }
  for (let yy = -Math.ceil(ry); yy <= Math.ceil(ry); yy++) {
    for (let xx = -Math.ceil(rx); xx <= Math.ceil(rx); xx++) {
      if ((xx * xx) / (rx * rx + 0.01) + (yy * yy) / (ry * ry + 0.01) <= 1) x.fillRect(Math.round(cx + xx), Math.round(cy + yy), 1, 1);
    }
  }
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = clamp(Math.round(r + amt), 0, 255); g = clamp(Math.round(g + amt), 0, 255); b = clamp(Math.round(b + amt), 0, 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const f = (s) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return '#' + ((1 << 24) | (f(16) << 16) | (f(8) << 8) | f(0)).toString(16).slice(1);
}
/* Viền tối quanh hình */
function outline(cv, col = '#2a1a1c') {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height;
  const id = x.getImageData(0, 0, w, h), d = id.data, out = x.createImageData(w, h);
  out.data.set(d);
  const a = (px, py) => (px < 0 || py < 0 || px >= w || py >= h ? 0 : d[(py * w + px) * 4 + 3]);
  const n = parseInt(col.slice(1), 16);
  for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
    if (a(px, py) > 0) continue;
    if (a(px - 1, py) || a(px + 1, py) || a(px, py - 1) || a(px, py + 1)) {
      const i = (py * w + px) * 4; out.data[i] = (n >> 16) & 255; out.data[i + 1] = (n >> 8) & 255; out.data[i + 2] = n & 255; out.data[i + 3] = 255;
    }
  }
  x.putImageData(out, 0, 0);
}

/* Viền tối quanh hình cho canvas siêu mẫu: dán bóng đổ của hình theo nhiều hướng */
function outlineSS(cv, col, S) {
  const w = cv.width, h = cv.height, t = document.createElement('canvas'); t.width = w; t.height = h;
  const tx = t.getContext('2d'), off = S * 0.95;
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.2832; tx.drawImage(cv, Math.cos(a) * off, Math.sin(a) * off); }
  tx.globalCompositeOperation = 'source-in'; tx.fillStyle = col; tx.fillRect(0, 0, w, h);
  const x = cv.getContext('2d'); x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-over'; x.drawImage(t, 0, 0); x.restore();
}

const Sprite = {
  cache: {},
  /* Nhân vật nhỏ 18x27 cho cảnh pixel: thu nhỏ từ bản độ phân giải cao nên giữ tỉ lệ cơ thể thật */
  char(look, o = {}) {
    const key = JSON.stringify([look, o]);
    if (this.cache[key]) return this.cache[key];
    const { c, x } = mkCanvas(18, 27);
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    const w = 48 * (27 / 78);
    const src = this.charHi(look, o);
    x.drawImage(src, 0, 0, src.width, src.height, (18 - w) / 2, 0, w, 27);
    const id = x.getImageData(0, 0, 18, 27); // bỏ viền mờ để giữ nét pixel
    for (let i = 3; i < id.data.length; i += 4) id.data[i] = id.data[i] > 110 ? 255 : 0;
    x.putImageData(id, 0, 0);
    outline(c, '#2a1a1c');
    this.cache[key] = c;
    return c;
  },
  /* Nhân vật độ phân giải cao 48x78: tỉ lệ cơ thể thật hơn, đổ bóng da, vải, tóc */
  charHi(look, o = {}) {
    const key = 'h' + JSON.stringify([look, o]);
    if (this.cache[key]) return this.cache[key];
    const { c, x } = mkCanvas(48, 78, SS);
    const L = Object.assign({ skin: '#e8b890', hair: '#2a1a14', style: 'short', shirt: '#4a7ab0', pants: '#33404f' }, look);
    const cx = 24, small = !!L.small;
    const dy = small ? 16 : 0, hip = small ? 62 : 54, torsoTop = 28 + dy, headY = 15 + dy;
    const skin = L.skin, skinD = shade(skin, -34), skinM = shade(skin, -14), skinL = shade(skin, 18);
    const hair = L.hair, hairD = shade(hair, -26), hairL = shade(hair, 34);
    const sh = L.shirt, shD = shade(sh, -34), shL = shade(sh, 26);
    const pn = L.pants, pnD = shade(pn, -30), pnL = shade(pn, 20);
    const bodyW = L.wide ? 25 : 22;
    const half = (yy, cy, rx, ry) => { const t = (yy - cy) / ry; return t * t >= 1 ? 0 : rx * Math.sqrt(1 - t * t); };
    const hairCap = (col, cut, ex = 1.2) => { // mái tóc phủ đỉnh đầu
      for (let yy = headY - 12; yy <= headY - cut; yy++) { const w = half(yy + 0.5, headY - 0.5, 9.6 + ex, 11.6 + ex * 0.6); if (w > 0) R(x, col, cx - w, yy, w * 2, 1); }
    };
    // --- chân & giày ---
    const legTop = hip - 2, legBot = 72;
    [[cx - 8, -1], [cx + 1, 1]].forEach(([lx, sd]) => {
      R(x, pn, lx, legTop, 7, legBot - legTop); R(x, sd < 0 ? pnL : pnD, sd < 0 ? lx : lx + 5, legTop, 2, legBot - legTop);
      R(x, pnD, lx, legBot - 6, 7, 1);
      R(x, '#2a1a14', lx - 1, legBot, 9, 4); R(x, '#4a2c1c', lx - 1, legBot, 9, 2); R(x, '#7a5030', lx, legBot, 4, 1); R(x, '#171210', lx - 1, legBot + 3, 9, 2);
    });
    R(x, pnD, cx - 1, legTop + 3, 2, legBot - legTop - 3);
    // --- thân áo ---
    for (let yy = torsoTop; yy < hip; yy++) {
      const f = (yy - torsoTop) / (hip - torsoTop), w = bodyW - (L.wide ? 0 : 3) * f;
      R(x, sh, cx - w / 2, yy, w, 1); R(x, shD, cx + w / 2 - 4, yy, 4, 1); R(x, shL, cx - w / 2, yy, 2, 1);
    }
    R(x, shD, cx - bodyW / 2, hip - 2, bodyW - 3, 2); // gấu áo
    for (let k = 0; k < 4; k++) R(x, shD, cx - 5 + k * 3, torsoTop + 9 + k, 4, 1); // nếp vải
    R(x, shL, cx - 6, torsoTop + 2, 5, 1);
    // --- tay ---
    [[cx - bodyW / 2 - 4, -1], [cx + bodyW / 2 - 1, 1]].forEach(([ax, sd]) => {
      const aTop = torsoTop + 1, aBot = hip - 5;
      R(x, sh, ax, aTop, 5, aBot - aTop); R(x, sd < 0 ? shL : shD, sd < 0 ? ax : ax + 3, aTop, 2, aBot - aTop); R(x, shD, ax, aBot - 1, 5, 1);
      R(x, skin, ax + 0.5, aBot, 4, 4); R(x, skinD, sd < 0 ? ax : ax + 3.5, aBot, 1, 4); R(x, skinL, ax + 1, aBot, 1, 2); R(x, skinM, ax + 0.5, aBot + 3, 4, 1);
    });
    if (L.bag) { R(x, '#a84030', cx + 8, torsoTop + 6, 9, 11); R(x, '#e8b840', cx + 8, torsoTop + 6, 9, 2); R(x, '#7a2a20', cx - 7, torsoTop, 2, 16); R(x, '#d86050', cx + 9, torsoTop + 9, 2, 5); }
    // --- cổ & cổ áo ---
    R(x, skinD, cx - 3, headY + 8, 6, torsoTop - headY - 6); R(x, skin, cx - 3, headY + 8, 4, torsoTop - headY - 7);
    const cl = torsoTop;
    R(x, skin, cx - 4, cl, 8, 2); R(x, skinD, cx - 3, cl + 2, 6, 1); R(x, skinD, cx - 2, cl + 3, 4, 1);
    R(x, shL, cx - 5, cl - 1, 3, 2); R(x, shL, cx + 2, cl - 1, 3, 2);
    if (L.elder || L.shirtType === 'baba') for (let i = 0; i < 4; i++) { R(x, '#e8d8b0', cx, torsoTop + 5 + i * 5, 2, 2); R(x, shD, cx, torsoTop + 5 + i * 5 + 2, 2, 1); }
    if (L.hat === '#e8e8e8') R(x, '#f0c030', cx - 11, torsoTop + 8, 22, 2); // áo phản quang
    // --- tóc phía sau ---
    if (L.style === 'long') { R(x, hairD, cx - 11, headY - 2, 22, 30); R(x, hair, cx - 11, headY - 2, 19, 30); disc(x, hairD, cx, headY + 28, 11, 2); }
    if (L.style === 'pigtails') [-1, 1].forEach((sd) => { disc(x, hairD, cx + sd * 13, headY + 10, 3.4, 8); disc(x, hair, cx + sd * 13 - sd * 0.8, headY + 9, 2.6, 7.5); disc(x, hairL, cx + sd * 12, headY + 5, 1, 3); });
    if (L.style === 'bun') { disc(x, hairD, cx, headY - 14, 5.5, 4.5); disc(x, hair, cx - 0.5, headY - 14.5, 5, 4); disc(x, hairL, cx - 2, headY - 16, 2, 1.2); }
    if (L.style === 'ponytail') { disc(x, hairD, cx + 11, headY + 6, 3.6, 10); disc(x, hair, cx + 10, headY + 5, 2.8, 9); disc(x, hairL, cx + 9, headY, 1, 3); R(x, L.band || '#e84a6a', cx + 8, headY - 3, 4, 2); }
    if (L.style === 'bob') { R(x, hairD, cx - 12, headY - 4, 24, 20); R(x, hair, cx - 12, headY - 4, 21, 20); }
    // --- đầu ---
    disc(x, skinD, cx, headY, 9.6, 11.2);
    disc(x, skin, cx - 0.6, headY - 0.4, 9, 10.8);
    disc(x, skinL, cx - 3, headY - 3, 4.5, 4); disc(x, skinL, cx - 5, headY + 3, 2, 3);
    for (let yy = headY + 6; yy < headY + 11; yy++) { const w = half(yy + 0.5, headY, 9.6, 11.2); R(x, skinM, cx - w * 0.5, yy, w, 1); } // cằm
    R(x, skinD, cx - 4, headY + 10, 8, 1);
    [-1, 1].forEach((sd) => { disc(x, skinM, cx + sd * 10, headY + 1, 1.6, 2.4); P(x, skinD, cx + sd * 10, headY + 2); }); // tai
    // má hồng cho trẻ, nữ
    if (small || ['pigtails', 'long', 'bun'].includes(L.style)) { [-1, 1].forEach((sd) => { disc(x, 'rgba(240,120,120,.35)', cx + sd * 5.5, headY + 4.5, 2.4, 1.5); }); }
    // mắt
    const eyeY = headY + (small ? 1 : 0);
    [-1, 1].forEach((sd) => {
      const ex = cx + sd * 4.6;
      if (L.shades) return;
      const bw = 3.5 + (small ? 0.8 : 0);
      if (o.blink) { R(x, '#3a2418', ex - bw / 2, eyeY + 1, bw, 1); }
      else {
        R(x, '#fffaf0', ex - bw / 2 - 0.5, eyeY, bw + 1, 3); R(x, '#cfc2ae', ex - bw / 2 - 0.5, eyeY + 2, bw + 1, 1);
        R(x, '#3a2418', ex - 1, eyeY, 2.4, 3); R(x, '#16100c', ex - 0.5, eyeY + 0.5, 1.4, 2); P(x, '#fff', ex - 0.6, eyeY);
        R(x, shade(hair, -10), ex - bw / 2 - 1, eyeY - 1, bw + 2, 1);
      }
      R(x, L.elder ? '#cfcfcf' : hairD, ex - 2.5, eyeY - 4, 5, L.elder ? 2 : 1); // lông mày
    });
    if (L.shades) { R(x, '#10101a', cx - 9, eyeY - 1, 18, 4); R(x, '#2a2e44', cx - 8, eyeY - 1, 7, 2); R(x, '#2a2e44', cx + 2, eyeY - 1, 7, 2); R(x, '#10101a', cx - 1, eyeY, 2, 1); }
    if (L.glasses) { [-1, 1].forEach((sd) => { const gx = cx + sd * 4.6; R(x, '#2a2a38', gx - 4, eyeY - 2, 8, 1); R(x, '#2a2a38', gx - 4, eyeY + 4, 8, 1); R(x, '#2a2a38', gx - 4, eyeY - 2, 1, 7); R(x, '#2a2a38', gx + 3, eyeY - 2, 1, 7); R(x, 'rgba(180,220,255,.28)', gx - 3, eyeY - 1, 6, 5); }); R(x, '#2a2a38', cx - 1, eyeY, 2, 1); }
    // mũi
    R(x, skinD, cx - 1, eyeY + 4, 2, 3); R(x, skinL, cx - 1, eyeY + 4, 1, 2); R(x, skinD, cx - 2, eyeY + 6, 4, 1); P(x, shade(skin, -55), cx - 2, eyeY + 7); P(x, shade(skin, -55), cx + 1, eyeY + 7);
    if (L.beard) { for (let yy = headY + 3; yy < headY + 15; yy++) { const w = half(yy + 0.5, headY, 9.8, 11.6) * (yy > headY + 12 ? 0.8 : 1); if (w > 0) { R(x, hairD, cx - w, yy, w * 2, 1); R(x, hair, cx - w + 1, yy, w * 2 - 4, 1); } } R(x, skin, cx - 3.5, headY + 8, 7, 2); }
    // miệng
    const mY = headY + 7.5;
    if (o.talk) { R(x, '#6a1a1a', cx - 3, mY, 6, 3); R(x, '#d86a6a', cx - 2, mY + 2, 4, 1); R(x, '#fffaf0', cx - 2, mY, 4, 1); }
    else { R(x, '#a8503f', cx - 3, mY + 1, 6, 1); R(x, '#c8685a', cx - 2, mY + 2, 4, 1); P(x, '#8a3a2e', cx - 4, mY); P(x, '#8a3a2e', cx + 3, mY); }
    if (L.mustache) { R(x, hair, cx - 5, mY - 2, 10, 2); R(x, hairD, cx - 5, mY - 1, 10, 1); P(x, hair, cx - 6, mY); P(x, hair, cx + 5, mY); R(x, hairL, cx - 4, mY - 2, 3, 1); }
    if (L.elder) { R(x, skinD, cx - 8, headY + 3, 2, 1); R(x, skinD, cx + 6, headY + 3, 2, 1); R(x, skinD, cx - 6, mY + 1, 1, 3); R(x, skinD, cx + 5, mY + 1, 1, 3); R(x, skinD, cx - 4, headY - 6, 8, 1); }
    if (L.scar) { for (let i = 0; i < 6; i++) P(x, '#8a2e2e', cx + 4 + i * 0.7, headY - 4 + i); P(x, '#e8c8c0', cx + 5, headY - 3); }
    // --- tóc & mũ trước mặt ---
    switch (L.style) {
      case 'short': hairCap(hairD, 2.5, 1.6); hairCap(hair, 3.5, 1.1); R(x, hairL, cx - 6, headY - 11, 6, 1); R(x, hairL, cx - 7, headY - 10, 3, 1); R(x, hair, cx - 10, headY - 3, 3, 6); R(x, hair, cx + 7, headY - 3, 3, 6); R(x, hairD, cx + 7, headY - 3, 1, 6); break;
      case 'bun': hairCap(hairD, 2, 1.6); hairCap(hair, 3.5, 1.1); R(x, hairL, cx - 6, headY - 11, 6, 1); R(x, hair, cx - 10, headY - 3, 3, 8); R(x, hair, cx + 7, headY - 3, 3, 8); R(x, '#d84a6a', cx - 3, headY - 11, 6, 1); break;
      case 'pigtails': hairCap(hairD, 2.5, 1.6); hairCap(hair, 3.5, 1.1); R(x, hairL, cx - 6, headY - 11, 5, 1); R(x, hair, cx - 10, headY - 3, 3, 5); R(x, hair, cx + 7, headY - 3, 3, 5); [-1, 1].forEach((sd) => { R(x, '#e84a4a', cx + sd * 11.5 - 1.5, headY + 2, 3, 2); disc(x, '#e84a4a', cx + sd * 11, headY + 1, 1.5, 1.5); }); for (let i = 0; i < 8; i++) R(x, hair, cx - 8 + i * 2, headY - 4 + (i % 2), 2, 2); break;
      case 'long': hairCap(hairD, 2.5, 1.6); hairCap(hair, 3.5, 1.1); R(x, hairL, cx - 6, headY - 11, 6, 1); R(x, hair, cx - 11, headY - 3, 3, 26); R(x, hair, cx + 8, headY - 3, 3, 26); R(x, hairD, cx + 9, headY - 3, 2, 26); R(x, hairL, cx - 10, headY + 2, 1, 10); for (let i = 0; i < 9; i++) R(x, hair, cx - 8 + i * 2, headY - 4 + (i % 3 === 0 ? 1 : 0), 2, 2); break;
      case 'bald': R(x, skinL, cx - 5, headY - 10, 6, 2); R(x, skinL, cx - 6, headY - 8, 3, 1); R(x, hair, cx - 10, headY - 4, 2, 7); R(x, hair, cx + 8, headY - 4, 2, 7); R(x, hairD, cx + 9, headY - 3, 1, 5); R(x, hairL, cx - 10, headY - 4, 1, 4); break;
      case 'cap': {
        const hc = L.hat || '#4a4a58';
        for (let yy = headY - 14; yy <= headY - 5; yy++) { const w = half(yy + 0.5, headY - 4, 10.8, 10); if (w > 0) R(x, hc, cx - w, yy, w * 2, 1); }
        R(x, shade(hc, 28), cx - 6, headY - 13, 7, 2); R(x, shade(hc, -30), cx + 4, headY - 11, 6, 6); R(x, shade(hc, -18), cx - 14, headY - 5, 28, 2); R(x, shade(hc, -42), cx - 14, headY - 3, 28, 1); R(x, shade(hc, 14), cx - 14, headY - 5, 28, 1);
        R(x, '#e8e0c8', cx - 2, headY - 11, 4, 3); // huy hiệu
        R(x, hair, cx - 10, headY - 3, 2, 5); R(x, hair, cx + 8, headY - 3, 2, 5); break;
      }
      case 'scarf': {
        const sc = L.shirt === '#9a6a40' ? '#6a4a30' : '#c86a4a';
        for (let yy = headY - 13; yy <= headY - 4; yy++) { const w = half(yy + 0.5, headY - 3, 10.8, 10.5); if (w > 0) R(x, sc, cx - w, yy, w * 2, 1); }
        R(x, shade(sc, 30), cx - 7, headY - 12, 8, 2); R(x, shade(sc, -34), cx + 3, headY - 9, 7, 6); R(x, shade(sc, -22), cx - 11, headY - 5, 22, 2);
        for (let i = 0; i < 6; i++) R(x, shade(sc, i % 2 ? 22 : -10), cx - 9 + i * 3, headY - 8, 1, 4); // vân vải
        disc(x, sc, cx - 11, headY - 2, 3.2, 3.5); disc(x, shade(sc, -34), cx - 11, headY - 1, 2, 2.4); // nút buộc
        R(x, hair, cx - 10, headY - 3, 2, 6); R(x, hair, cx + 8, headY - 3, 2, 6); break;
      }
      case 'conical': {
        for (let yy = headY - 15; yy <= headY - 3; yy++) { const w = (yy - (headY - 15)) * 1.6 + 1; R(x, yy % 3 === 0 ? '#c8a060' : '#e6c888', cx - w, yy, w * 2, 1); }
        R(x, '#a07a40', cx - 24, headY - 3, 48, 1); R(x, '#8a6430', cx - 24, headY - 2, 48, 1);
        R(x, '#c8402c', cx - 10, headY + 2, 1, 9); R(x, '#c8402c', cx + 9, headY + 2, 1, 9); // quai nón
        break;
      }
      case 'ponytail': hairCap(hairD, 2.5, 1.6); hairCap(hair, 3.5, 1.1); R(x, hairL, cx - 6, headY - 11, 6, 1); R(x, hair, cx - 10, headY - 3, 3, 7); R(x, hair, cx + 7, headY - 3, 3, 5); for (let i = 0; i < 7; i++) R(x, hair, cx - 8 + i * 2.4, headY - 4 + (i % 2), 2.4, 2); break;
      case 'bob': hairCap(hairD, 2.5, 1.6); hairCap(hair, 3.5, 1.1); R(x, hairL, cx - 6, headY - 11, 6, 1); R(x, hair, cx - 11, headY - 3, 3, 15); R(x, hair, cx + 8, headY - 3, 3, 15); R(x, hairD, cx + 9, headY - 3, 2, 15); for (let i = 0; i < 9; i++) R(x, hair, cx - 8 + i * 2, headY - 4 + (i % 3 === 0 ? 1 : 0), 2, 2); break;
      case 'curly': for (let i = -5; i <= 5; i++) { disc(x, hairD, cx + i * 2.2, headY - 8 + Math.abs(i) * 0.9, 3.8, 3.8); } for (let i = -5; i <= 5; i++) { disc(x, hair, cx + i * 2.2 - 0.6, headY - 9 + Math.abs(i) * 0.9, 3.2, 3.2); } disc(x, hairL, cx - 4, headY - 12, 1.6, 1.2); [-1, 1].forEach((sd) => { for (let k = 0; k < 4; k++) disc(x, hair, cx + sd * 10, headY - 3 + k * 2.6, 2.6, 2.6); }); break;
      case 'spiky': for (let i = -5; i <= 5; i++) { const hh = 6 + ((i * 7) & 3) * 1.5; R(x, hair, cx + i * 2 - 1, headY - 9 - hh * 0.6, 2.4, hh); R(x, hairL, cx + i * 2 - 1, headY - 9 - hh * 0.6, 1, hh * 0.6); } hairCap(hair, 4.5, 0.6); R(x, hair, cx - 10, headY - 3, 2, 4); R(x, hair, cx + 8, headY - 3, 2, 4); break;
      case 'beanie': { const hc = L.hat || '#3a6ab0'; for (let yy = headY - 16; yy <= headY - 5; yy++) { const w = half(yy + 0.5, headY - 4, 10.6, 12); if (w > 0) R(x, hc, cx - w, yy, w * 2, 1); } R(x, shade(hc, 26), cx - 6, headY - 15, 6, 2); R(x, shade(hc, -34), cx + 4, headY - 12, 6, 7); R(x, shade(hc, -18), cx - 11.5, headY - 7, 23, 3); for (let i = 0; i < 8; i++) R(x, shade(hc, -44), cx - 10 + i * 3, headY - 7, 1, 3); disc(x, shade(hc, 40), cx, headY - 17, 3, 3); R(x, hair, cx - 10, headY - 3, 2, 5); R(x, hair, cx + 8, headY - 3, 2, 5); break; }
      case 'helmet': { const hc = L.hat || '#e8a020'; for (let yy = headY - 14; yy <= headY - 4; yy++) { const w = half(yy + 0.5, headY - 3, 11.4, 11); if (w > 0) R(x, hc, cx - w, yy, w * 2, 1); } R(x, shade(hc, 40), cx - 7, headY - 13, 8, 2); R(x, shade(hc, -34), cx + 5, headY - 10, 6, 6); R(x, shade(hc, -22), cx - 12, headY - 5, 24, 2); R(x, '#1a1a24', cx - 9, headY - 3, 18, 2); R(x, '#f4f4f4', cx - 1, headY - 14, 2, 8); R(x, hair, cx - 10, headY - 2, 2, 4); R(x, hair, cx + 8, headY - 2, 2, 4); break; }
      case 'beret': { const hc = L.hat || '#c83a3a'; disc(x, shade(hc, -30), cx + 2, headY - 9, 12.5, 4.6); disc(x, hc, cx + 1, headY - 10, 12, 4.3); R(x, shade(hc, 34), cx - 7, headY - 13, 7, 1); R(x, shade(hc, -50), cx + 0, headY - 16, 2, 3); R(x, hair, cx - 10, headY - 5, 3, 8); R(x, hair, cx + 7, headY - 5, 3, 8); for (let i = 0; i < 7; i++) R(x, hair, cx - 8 + i * 2.4, headY - 5 + (i % 2), 2.4, 2); break; }
      case 'fedora': { const hc = L.hat || '#6a5a4a'; hairCap(hair, 4, 0.8); R(x, hc, cx - 7, headY - 18, 14, 8); R(x, shade(hc, 24), cx - 7, headY - 18, 14, 2); R(x, shade(hc, -34), cx - 7, headY - 12, 14, 2); R(x, '#2a1a14', cx - 7, headY - 13, 14, 1); disc(x, shade(hc, -14), cx, headY - 9, 15.5, 2.6); disc(x, hc, cx, headY - 10, 15, 2.2); R(x, hair, cx - 10, headY - 3, 2, 5); R(x, hair, cx + 8, headY - 3, 2, 5); break; }
      case 'chef': { R(x, '#f6f6f2', cx - 10, headY - 12, 20, 8); [-6, 0, 6].forEach((dx) => disc(x, '#f6f6f2', cx + dx, headY - 16, 5.4, 5.4)); disc(x, '#fff', cx - 3, headY - 18, 2.4, 2); R(x, '#d8d8d0', cx - 10, headY - 6, 20, 2); R(x, '#d8d8d0', cx + 5, headY - 17, 3, 9); R(x, hair, cx - 10, headY - 3, 2, 5); R(x, hair, cx + 8, headY - 3, 2, 5); break; }
      default: hairCap(hair, 3, 1.2);
    }
    if (L.hat && !['cap', 'conical'].includes(L.style)) { R(x, L.hat, cx - 11, headY - 12, 22, 4); R(x, shade(L.hat, -26), cx - 13, headY - 8, 26, 2); }
    // phụ kiện
    if (L.tie) { R(x, '#c8302a', cx - 1.6, torsoTop + 2, 3.2, 12); R(x, '#8a1a18', cx - 2.2, torsoTop + 2, 4.4, 3); P(x, '#fff', cx - 1, torsoTop + 7); }
    if (L.apron) { R(x, '#f4f0e0', cx - 8.5, torsoTop + 9, 17, hip - torsoTop - 9); R(x, '#d8d0b8', cx - 8.5, torsoTop + 9, 17, 1); R(x, '#d8d0b8', cx - 5, torsoTop + 14, 10, 6); R(x, '#fff', cx - 5, torsoTop + 14, 10, 1); R(x, '#d8d0b8', cx - 6, torsoTop + 1, 1, 9); R(x, '#d8d0b8', cx + 5, torsoTop + 1, 1, 9); }
    if (L.mask) { R(x, '#eaf4f8', cx - 7.5, eyeY + 4, 15, 8); R(x, '#c4d8e0', cx - 7.5, eyeY + 6, 15, 1); R(x, '#c4d8e0', cx - 7.5, eyeY + 9, 15, 1); R(x, '#a4c0cc', cx - 9, eyeY + 4, 2, 1); R(x, '#a4c0cc', cx + 7, eyeY + 4, 2, 1); }
    if (L.phones) { R(x, '#2a2a38', cx - 10, headY - 13, 20, 2); R(x, '#2a2a38', cx - 11, headY - 12, 2, 10); R(x, '#2a2a38', cx + 9, headY - 12, 2, 10); R(x, L.phones, cx - 13, headY - 3, 4, 9); R(x, L.phones, cx + 9, headY - 3, 4, 9); R(x, shade(L.phones, 40), cx - 13, headY - 3, 1, 9); R(x, shade(L.phones, 40), cx + 9, headY - 3, 1, 9); }
    if (L.flower) { disc(x, '#ffd23a', cx - 8, headY - 8, 1.4, 1.4); [[0, -2], [2, 0], [0, 2], [-2, 0]].forEach(([dx, dy]) => disc(x, L.flower, cx - 8 + dx, headY - 8 + dy, 1.4, 1.4)); }
    if (L.bow) { R(x, L.bow, cx - 5, cl + 1, 4, 3); R(x, L.bow, cx + 1, cl + 1, 4, 3); R(x, shade(L.bow, -40), cx - 1, cl + 1, 2, 3); }
    outlineSS(c, shade(skin, -120), SS);
    this.cache[key] = c;
    return c;
  },
  /* Chân dung đầu cho hộp thoại (nền sáng), cắt từ nhân vật độ phân giải cao */
  portrait(look, o = {}) {
    const key = 'p' + JSON.stringify([look, o]);
    if (this.cache[key]) return this.cache[key];
    const src = this.charHi(look, o);
    const { c, x } = mkCanvas(34, 32, SS);
    const g = x.createLinearGradient(0, 0, 0, 32); g.addColorStop(0, '#fff6df'); g.addColorStop(1, '#f0dcae');
    x.fillStyle = g; x.fillRect(0, 0, 34, 32);
    const hy = look && look.small ? 13 : 0; // trẻ nhỏ đầu nằm thấp hơn
    x.drawImage(src, 7 * SS, hy * SS, 34 * SS, 32 * SS, 0, 0, 34, 32);
    this.cache[key] = c;
    return c;
  },
  /* Gánh xôi (hai thúng và đòn gánh), người gánh vẽ nét cao */
  vendor(look) {
    const key = 'vd' + JSON.stringify(look); if (this.cache[key]) return this.cache[key];
    const { c, x } = mkCanvas(36, 30, SS);
    x.drawImage(this.charHi(Object.assign({}, look, { style: 'conical' })), 9.7, 2, 16.6, 27);
    R(x, '#8a5a30', 1, 14, 34, 1.2); R(x, '#b07a40', 1, 14, 34, 0.6);
    [3, 25].forEach((bx) => {
      R(x, '#7a5030', bx + 2, 15, 0.6, 5); R(x, '#7a5030', bx + 5, 15, 0.6, 5);
      disc(x, '#c89c58', bx + 3.5, 20.5, 4.4, 2.2); R(x, '#d8b070', bx, 20, 8, 5); disc(x, '#b88a48', bx + 3.5, 25, 4, 1.2); R(x, '#8a5a28', bx, 24.4, 8, 0.7);
      disc(x, '#fbf6e4', bx + 3.5, 19.6, 3.8, 1.5); disc(x, '#fffdf2', bx + 2.5, 19.2, 2, 0.7);
    });
    outlineSS(c, '#2a1a1c', SS);
    this.cache[key] = c;
    return c;
  },
  /* Con mèo (vẽ độ phân giải cao: lông sọc, tai, mắt, đuôi cong) */
  cat(col = '#d8a050') {
    const key = 'cat' + col; if (this.cache[key]) return this.cache[key];
    const { c, x } = mkCanvas(16, 12, SS);
    const d1 = shade(col, -36), d2 = shade(col, 26);
    x.lineCap = 'round'; x.lineJoin = 'round';
    x.strokeStyle = col; x.lineWidth = 1.7; x.beginPath(); x.moveTo(2.8, 8.4); x.bezierCurveTo(-0.4, 7.6, -0.6, 4.2, 1.6, 3.2); x.stroke();
    x.strokeStyle = d1; x.lineWidth = 0.5; x.beginPath(); x.moveTo(1.1, 4.8); x.lineTo(2.1, 4.9); x.moveTo(0.9, 6.2); x.lineTo(2, 6.4); x.stroke();
    const g = x.createLinearGradient(0, 4, 0, 11); g.addColorStop(0, d2); g.addColorStop(1, col);
    x.fillStyle = g; x.beginPath(); x.ellipse(7.3, 8, 5.2, 3.2, 0, 0, 6.2832); x.fill();
    x.fillStyle = d1; [[5, 5.2], [7.2, 4.9], [9.2, 5.4]].forEach(([px, py]) => { x.beginPath(); x.ellipse(px, py, 0.45, 1.1, 0.2, 0, 6.2832); x.fill(); });
    x.fillStyle = col; x.beginPath(); x.ellipse(5.4, 11, 1.3, 0.9, 0, 0, 6.2832); x.ellipse(9.3, 11, 1.3, 0.9, 0, 0, 6.2832); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.ellipse(5.9, 11.1, 0.7, 0.6, 0, 0, 6.2832); x.ellipse(9.8, 11.1, 0.7, 0.6, 0, 0, 6.2832); x.fill();
    x.fillStyle = g; x.beginPath(); x.arc(12.2, 5.4, 3.2, 0, 6.2832); x.fill();
    x.fillStyle = col; x.beginPath(); x.moveTo(9.6, 3.8); x.lineTo(10.2, 0.9); x.lineTo(11.9, 2.6); x.fill(); x.beginPath(); x.moveTo(12.6, 2.6); x.lineTo(14.3, 0.9); x.lineTo(14.8, 3.8); x.fill();
    x.fillStyle = '#f0a8a0'; x.beginPath(); x.moveTo(10.5, 3.2); x.lineTo(10.6, 1.9); x.lineTo(11.4, 2.8); x.fill(); x.beginPath(); x.moveTo(13.3, 2.8); x.lineTo(14, 1.9); x.lineTo(14.2, 3.2); x.fill();
    x.fillStyle = '#3a2a10'; x.beginPath(); x.ellipse(13.4, 5, 0.45, 0.8, 0, 0, 6.2832); x.ellipse(11.3, 5, 0.45, 0.8, 0, 0, 6.2832); x.fill();
    x.fillStyle = '#9aff7a'; x.fillRect(13.3, 4.5, 0.25, 0.4); x.fillRect(11.2, 4.5, 0.25, 0.4);
    x.fillStyle = '#e88a8a'; x.beginPath(); x.moveTo(12.3, 6.2); x.lineTo(12.9, 6.2); x.lineTo(12.6, 6.7); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 0.2; [[14.6, 6], [14.7, 6.6]].forEach(([px, py]) => { x.beginPath(); x.moveTo(px - 1.3, py - 0.3); x.lineTo(px + 0.6, py + 0.1); x.stroke(); });
    outlineSS(c, '#2a1a1c', SS);
    this.cache[key] = c;
    return c;
  },
  /* Ghế nhựa */
  stool(col) {
    const { c, x } = mkCanvas(12, 11);
    R(x, col, 0, 0, 12, 3); R(x, shade(col, 40), 1, 0, 10, 1); R(x, shade(col, -40), 0, 2, 12, 1);
    R(x, shade(col, -20), 1, 3, 2, 7); R(x, shade(col, -20), 9, 3, 2, 7); R(x, shade(col, -50), 3, 5, 6, 1);
    outline(c, '#3a1a1a');
    return c;
  },
  /* Đĩa xôi trên lá chuối, có topping theo món */
  bowl(col, id) {
    const key = 'b' + col + (id || '');
    if (this.cache[key]) return this.cache[key];
    const { c, x } = mkCanvas(38, 28, SS);
    const rng = mulberry32(parseInt(col.slice(1), 16));
    const colored = ['gac', 'ladua', 'camm', 'mit', 'sau', 'ngusac'].includes(id);
    const rice = colored ? col : '#f6efd6';
    // lá chuối lót
    disc(x, '#2f6a2c', 19, 20, 18, 6); disc(x, '#4a9a3e', 19, 19, 17, 5.2); disc(x, '#68b856', 16, 18, 10, 2.5);
    for (let i = -14; i <= 14; i += 4) P(x, '#2f6a2c', 19 + i, 19 + Math.round(Math.abs(i) * 0.12));
    // đĩa
    disc(x, '#b8a98e', 19, 21, 14, 4.4); disc(x, '#f4ecd8', 19, 20, 13.5, 4); disc(x, '#fffaf0', 17, 19, 8, 2);
    // ụ xôi
    disc(x, shade(rice, -34), 19, 16, 11, 7); disc(x, rice, 18, 15, 10, 6.2); disc(x, shade(rice, 22), 15, 12, 5.5, 3);
    for (let i = 0; i < 46; i++) {
      const a = rng() * 6.28, d = rng() * 0.9, gx = 18 + Math.cos(a) * 9.5 * d, gy = 14 + Math.sin(a) * 5.5 * d;
      P(x, rng() < 0.5 ? shade(rice, 30) : shade(rice, -14), gx, gy);
    }
    const dots = (n, colr, rx, ry, cx = 18, cy = 12) => { for (let i = 0; i < n; i++) { const a = rng() * 6.28, d = Math.sqrt(rng()); R(x, colr, cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, 2, 1.5); } };
    switch (id) {
      case 'doxanh': disc(x, '#e8c43a', 18, 11.5, 7.5, 3.6); disc(x, '#f6dc6a', 16, 10.5, 4, 1.6); dots(7, '#9a5a20', 8, 3.5); break;
      case 'lac': dots(12, '#c98f50', 8, 4); dots(6, '#e8be82', 7, 3.5); dots(8, '#fff', 8, 3.5); break;
      case 'gac': dots(8, '#fff0c0', 8, 4); disc(x, '#ff7a54', 15, 11, 3.5, 1.6); break;
      case 'ladua': dots(10, '#fffdf0', 8, 4); dots(5, '#2f8a3a', 8, 4); break;
      case 'ngo': dots(18, '#f4cf36', 8, 4); dots(8, '#d8a818', 8, 4); break;
      case 'xeo': disc(x, '#f2c43c', 18, 11, 7, 3.2); dots(8, '#c8892a', 8, 3.5); dots(5, '#6a3a12', 8, 3.5); break;
      case 'camm': dots(10, '#fffdf0', 8, 4); dots(4, '#e8d8f0', 7, 3.5); break;
      case 'mit': for (let i = 0; i < 4; i++) { disc(x, '#f6b030', 12 + i * 3, 11 + (i % 2), 2.2, 1.6); disc(x, '#ffd870', 11.5 + i * 3, 10.5 + (i % 2), 1, 0.7); } break;
      case 'trung': for (let i = 0; i < 3; i++) { const ex = 12 + i * 6; disc(x, '#fffaf0', ex, 11 + (i % 2), 2.6, 2); disc(x, '#e8b030', ex, 11 + (i % 2), 1.1, 0.9); disc(x, '#7a5a3a', ex + 2, 12.5 + (i % 2), 0.7, 0.5); } dots(5, '#8a4a18', 8, 3.5); break;
      case 'pate': for (let i = 0; i < 3; i++) { R(x, '#9a5a3a', 11 + i * 5, 9 + (i % 2) * 2, 6, 3); R(x, '#c88a62', 11 + i * 5, 9 + (i % 2) * 2, 6, 1); } dots(5, '#8a4a18', 8, 3.5); break;
      case 'lap': for (let i = 0; i < 4; i++) { disc(x, '#b02a24', 11 + i * 3.4, 10.5 + (i % 2) * 2, 2.1, 1.7); disc(x, '#f0a49c', 11.4 + i * 3.4, 10.2 + (i % 2) * 2, 0.8, 0.6); } dots(5, '#8a4a18', 8, 3.5); break;
      case 'ga': for (let i = 0; i < 14; i++) R(x, rng() < 0.5 ? '#e6b878' : '#c88a48', 11 + rng() * 14, 9 + rng() * 5, 3, 1); dots(5, '#8a4a18', 8, 3.5); break;
      case 'sau': for (let i = 0; i < 4; i++) { disc(x, '#fbd44a', 12 + i * 3.4, 11 + (i % 2), 2.2, 1.7); disc(x, '#fff0a0', 11.5 + i * 3.4, 10.5 + (i % 2), 1, 0.7); } break;
      case 'thap': disc(x, '#b02a24', 12, 11, 2, 1.6); disc(x, '#fffaf0', 18, 10.5, 2.4, 1.9); disc(x, '#e8b030', 18, 10.5, 1, 0.8); R(x, '#9a5a3a', 22, 10, 5, 3); dots(6, '#8a4a18', 8, 3.5); break;
      case 'ngusac': R(x, '#e0452c', 10, 11, 4, 4); R(x, '#f2c43c', 14, 11, 4, 4); R(x, '#6bbf59', 18, 11, 4, 4); R(x, '#7a4a8a', 22, 11, 4, 4); dots(5, '#fffdf0', 8, 3.5); break;
      default: dots(6, shade(col, 40), 8, 3.5);
    }
    // hơi nóng
    P(x, 'rgba(255,255,255,.55)', 14, 4); P(x, 'rgba(255,255,255,.4)', 15, 3); P(x, 'rgba(255,255,255,.55)', 22, 3); P(x, 'rgba(255,255,255,.4)', 21, 2);
    outlineSS(c, '#4a3220', SS);
    this.cache[key] = c;
    return c;
  },
  bowlURL(col, id) { const k = 'u' + col + (id || ''); return this.cache[k] || (this.cache[k] = this.bowl(col, id).toDataURL()); },
};

/* Tạo <canvas>/<img> hiển thị sắc nét từ canvas pixel */
function pixImg(cv, scale = 4, cls = '') {
  const i = new Image();
  i.src = cv.toDataURL();
  i.className = 'pix ' + cls;
  i.style.width = (cv._lw || cv.width) * scale + 'px';
  i.draggable = false;
  return i;
}
/* Tạo ảnh chân dung bằng data url */
function portraitURL(look, o) { const c = Sprite.portrait(look, o); return c._url || (c._url = c.toDataURL()); }
function charURL(look, o) { const c = Sprite.charHi(look, o); return c._url || (c._url = c.toDataURL()); }

/* Nhân viên đang làm việc: trả về danh sách sprite để cảnh vẽ cạnh nhân vật chính */
/* Vẽ nhân vật độ phân giải cao vào cảnh pixel đúng khung 18x27 */
function drawChar(c2, cv, px, py) { c2.drawImage(cv, px + 0.7, py, 16.6, 27); }
function staffSprites(xs) {
  const out = [];
  DATA.STAFF.forEach((st) => { if (G && G.staff[st.id] && out.length < xs.length) out.push({ id: st.id, cv: Sprite.charHi(st.look), x: xs[out.length], p: Math.random() * 6 }); });
  return out;
}

/* Canvas cảnh nền: vẽ theo toạ độ pixel-art nhưng xuất ảnh ở độ phân giải cao hơn SC lần */
function sceneCtx(canvas, W, H) {
  canvas.width = W * SC; canvas.height = H * SC;
  const c2 = canvas.getContext('2d'); c2.setTransform(SC, 0, 0, SC, 0, 0); c2._ss = true; c2.imageSmoothingEnabled = true; c2.imageSmoothingQuality = 'high';
  return c2;
}
