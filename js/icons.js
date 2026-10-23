/* Biểu tượng nguyên liệu vẽ riêng (độ phân giải cao, nét sắc) để hiển thị đúng với mô tả,
   thay cho emoji hệ thống vốn hay sai hình (gấc thành cà chua, mít thành xoài, sầu riêng thành dứa...) */
const Icons = {
  cache: {},
  OUT: '#3a2410',

  ing(id) {
    if (this.cache[id]) return this.cache[id];
    const { c, x } = mkCanvas(32, 32, 4);
    const rng = mulberry32(id.charCodeAt(0) * 131 + id.length * 7);
    x.lineJoin = 'round'; x.lineCap = 'round';
    (this.draw[id] || this.draw._)(x, rng);
    this.cache[id] = c;
    return c;
  },
  url(id) { const c = this.ing(id); return c._url || (c._url = c.toDataURL()); },
  html(id, cls = '') { return '<img class="ing-ic ' + cls + '" src="' + this.url(id) + '" alt="' + (DATA.ING_BY[id] ? DATA.ING_BY[id].name : '') + '" draggable="false">'; },

  /* ----- công cụ vẽ ----- */
  ell(x, cx, cy, rx, ry, fill, stroke, rot = 0, lw = 0.7) {
    x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, 6.2832);
    if (fill) { x.fillStyle = fill; x.fill(); }
    if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.stroke(); }
  },
  rg(x, cx, cy, r, c0, c1) { const g = x.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.08, cx, cy, r); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; },
  lg(x, x0, y0, x1, y1, c0, c1) { const g = x.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; },
  shadow(x, cx = 16, cy = 28, rx = 11) { this.ell(x, cx, cy, rx, 2.2, 'rgba(40,20,0,.22)'); },
  /* lá dài (dùng cho lá dứa, lá chuối): từ gốc đến ngọn */
  blade(x, bx, by, tx, ty, w, c0, c1, rib) {
    const mx = (bx + tx) / 2, my = (by + ty) / 2, nx = -(ty - by), ny = tx - bx, ln = Math.hypot(nx, ny) || 1, ox = (nx / ln) * w, oy = (ny / ln) * w;
    x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(mx + ox * 1.5, my + oy * 1.5, tx, ty); x.quadraticCurveTo(mx - ox * 1.5, my - oy * 1.5, bx, by); x.closePath();
    x.fillStyle = this.lg(x, bx, by, tx, ty, c0, c1); x.fill(); x.strokeStyle = this.OUT; x.lineWidth = 0.7; x.stroke();
    x.strokeStyle = rib; x.lineWidth = 0.6; x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(mx, my, tx, ty); x.stroke();
  },
  peanut(x, cx, cy, rot) {
    x.save(); x.translate(cx, cy); x.rotate(rot);
    x.beginPath(); x.ellipse(-3.2, 0, 4.6, 3.8, 0, 0, 6.2832); x.ellipse(3.4, 0, 4.2, 3.4, 0, 0, 6.2832);
    x.fillStyle = this.lg(x, 0, -4, 0, 4, '#ecc684', '#c08a48'); x.fill(); x.strokeStyle = this.OUT; x.lineWidth = 0.7; x.stroke();
    x.fillStyle = 'rgba(120,70,20,.45)'; for (let i = -2; i <= 2; i++) for (let j = -1; j <= 1; j++) x.fillRect(i * 2.6 - 0.3, j * 2.3 - 0.3, 0.6, 0.6);
    x.restore();
  },
  egg(x, cx, cy, rot, base, spot, rng) {
    x.save(); x.translate(cx, cy); x.rotate(rot);
    x.beginPath(); x.ellipse(0, 0, 4.8, 6.2, 0, 0, 6.2832); x.fillStyle = this.rg(x, 0, 0, 7, '#fffaf0', base); x.fill(); x.strokeStyle = this.OUT; x.lineWidth = 0.7; x.stroke();
    for (let i = 0; i < 9; i++) { const a = rng() * 6.28, d = Math.sqrt(rng()) * 4; x.fillStyle = spot; x.beginPath(); x.ellipse(Math.cos(a) * d * 0.8, Math.sin(a) * d * 1.1, 0.55 + rng() * 0.5, 0.4 + rng() * 0.4, rng() * 3, 0, 6.2832); x.fill(); }
    x.restore();
  },
  sausage(x, cx, cy, rot) {
    x.save(); x.translate(cx, cy); x.rotate(rot);
    x.beginPath(); x.moveTo(-9, -3); x.lineTo(9, -3); x.arc(9, 0, 3, -1.5708, 1.5708); x.lineTo(-9, 3); x.arc(-9, 0, 3, 1.5708, 4.7124); x.closePath();
    x.fillStyle = this.lg(x, 0, -3, 0, 3, '#d04a40', '#7a1816'); x.fill(); x.strokeStyle = this.OUT; x.lineWidth = 0.7; x.stroke();
    x.fillStyle = '#f6d8cc'; [[-6, -1], [-2, 1.2], [2, -1.2], [6, 0.6], [-4, 1.5], [4, 1.6]].forEach(([a, b]) => { x.beginPath(); x.ellipse(a, b, 0.8, 0.55, 0.4, 0, 6.2832); x.fill(); });
    x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(-8, -2.2, 14, 0.7);
    x.strokeStyle = '#e8d8a8'; x.lineWidth = 1; [-11, 11].forEach((e) => { x.beginPath(); x.moveTo(e, -2.2); x.lineTo(e, 2.2); x.stroke(); });
    x.restore();
  },

  draw: {
    /* gạo nếp: bông lúa vàng sau đống hạt trắng */
    nep(x, rng) {
      const I = Icons; I.shadow(x);
      x.strokeStyle = '#a8842c'; x.lineWidth = 0.9; x.beginPath(); x.moveTo(8, 27); x.quadraticCurveTo(7, 15, 12, 5); x.stroke();
      for (let i = 0; i < 7; i++) { const t = i / 7; I.ell(x, 8 + t * 4 - (i % 2 ? 1.6 : -0.6), 8 + t * 14, 1.1, 2.4, '#e8c048', '#8a6418', i % 2 ? -0.5 : 0.5, 0.4); }
      I.ell(x, 17, 22, 12, 6.6, I.rg(x, 17, 22, 12, '#fffefa', '#d6cca4'), I.OUT);
      for (let i = 0; i < 34; i++) { const a = rng() * 6.28, d = Math.sqrt(rng()); I.ell(x, 17 + Math.cos(a) * 10.5 * d, 21.5 + Math.sin(a) * 5.4 * d, 1.5, 0.8, '#fffef6', 'rgba(150,140,100,.6)', rng() * 3, 0.3); }
    },
    /* đỗ xanh: hạt đỗ tách vàng, vài hạt xanh còn nguyên */
    dau(x, rng) {
      const I = Icons; I.shadow(x);
      I.ell(x, 16, 21, 12, 7, I.rg(x, 16, 21, 12, '#f8e47a', '#c0a424'), I.OUT);
      for (let i = 0; i < 26; i++) { const a = rng() * 6.28, d = Math.sqrt(rng()); const px = 16 + Math.cos(a) * 10 * d, py = 20.5 + Math.sin(a) * 5.6 * d, r = rng() * 3; I.ell(x, px, py, 2, 1.3, '#f0d048', '#8a7410', r, 0.35); x.strokeStyle = 'rgba(138,116,16,.7)'; x.lineWidth = 0.3; x.beginPath(); x.moveTo(px - Math.cos(r) * 1.4, py - Math.sin(r) * 1.4); x.lineTo(px + Math.cos(r) * 1.4, py + Math.sin(r) * 1.4); x.stroke(); }
      [[10, 14], [20, 12], [15, 9]].forEach(([a, b]) => I.ell(x, a, b, 2.3, 1.7, I.rg(x, a, b, 2.5, '#a0cc60', '#4a7a22'), I.OUT, 0.5, 0.5));
    },
    /* gấc: quả tròn gai đỏ cam và nửa quả lộ hạt */
    gac(x, rng) {
      const I = Icons; I.shadow(x);
      I.ell(x, 13, 16, 10, 9.4, I.rg(x, 13, 16, 10, '#ffb04a', '#c42a10'), I.OUT, 0, 0.8);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { const px = 7 + c * 3.1 + (r % 2) * 1.5, py = 9.5 + r * 3.4; if (Math.hypot(px - 13, py - 16) < 8.6) { x.fillStyle = '#ffd890'; x.beginPath(); x.moveTo(px, py - 1); x.lineTo(px + 0.9, py + 0.6); x.lineTo(px - 0.9, py + 0.6); x.fill(); } }
      I.ell(x, 12, 6.8, 2.6, 1.3, '#4a9a38', I.OUT, 0, 0.5);
      I.ell(x, 24, 23, 6.8, 5.8, I.rg(x, 24, 23, 7, '#e86a2a', '#a82010'), I.OUT, 0, 0.7);
      I.ell(x, 24, 23, 4.8, 3.8, '#6a1008');
      [[22, 22], [25, 21.5], [24, 24.5], [27, 23.5], [21.5, 24.5]].forEach(([a, b]) => I.ell(x, a, b, 1.3, 0.9, '#c8421c', '#2a0804', 0.6, 0.3));
    },
    /* lạc: củ lạc có vỏ và hạt lạc đỏ */
    lac(x) {
      const I = Icons; I.shadow(x);
      I.peanut(x, 12, 12, -0.5); I.peanut(x, 21, 15, 0.45); I.peanut(x, 14, 22, 0.1);
      I.ell(x, 24, 24, 2.4, 3.1, I.rg(x, 24, 24, 3, '#d88a68', '#9a4a30'), I.OUT, 0.3, 0.5); I.ell(x, 20.4, 25, 2.2, 3, I.rg(x, 20, 25, 3, '#d88a68', '#9a4a30'), I.OUT, -0.3, 0.5);
    },
    /* cùi dừa: nửa trái dừa */
    dua(x) {
      const I = Icons; I.shadow(x, 16, 28, 11);
      I.ell(x, 16, 16, 12, 11.4, I.rg(x, 16, 16, 12, '#8a5a2c', '#4a2c14'), I.OUT, 0, 0.8);
      x.strokeStyle = 'rgba(40,20,6,.55)'; x.lineWidth = 0.4; for (let i = 0; i < 26; i++) { const a = (i / 26) * 6.2832; x.beginPath(); x.moveTo(16 + Math.cos(a) * 11.4, 16 + Math.sin(a) * 10.8); x.lineTo(16 + Math.cos(a) * 12.9, 16 + Math.sin(a) * 12.2); x.stroke(); }
      I.ell(x, 16, 16, 9.6, 9, I.rg(x, 16, 16, 9.6, '#ffffff', '#ddd4bc'), '#c8bc98', 0, 0.5);
      I.ell(x, 16, 17, 5.6, 5, I.rg(x, 16, 16, 6, '#f3ecd8', '#cfc6aa'));
      I.ell(x, 13.5, 14.5, 2.2, 1.2, 'rgba(255,255,255,.8)', null, -0.5);
    },
    /* hành phi: các lát hành vàng giòn */
    hanh(x, rng) {
      const I = Icons; I.shadow(x);
      for (let i = 0; i < 20; i++) { const a = rng() * 6.28, d = Math.sqrt(rng()) * 10, px = 16 + Math.cos(a) * d, py = 20 + Math.sin(a) * d * 0.55, r = rng() * 6.28; x.strokeStyle = i % 3 ? '#c4822a' : '#e8b048'; x.lineWidth = 1.9; x.beginPath(); x.arc(px, py, 2.4 + rng() * 1.6, r, r + 2.6); x.stroke(); }
      for (let i = 0; i < 12; i++) { const a = rng() * 6.28, d = Math.sqrt(rng()) * 8, px = 16 + Math.cos(a) * d, py = 17.5 + Math.sin(a) * d * 0.55, r = rng() * 6.28; x.strokeStyle = '#f6d070'; x.lineWidth = 1.1; x.beginPath(); x.arc(px, py, 2 + rng() * 1.4, r, r + 2.2); x.stroke(); }
      x.fillStyle = '#fff6c0'; [[10, 14], [20, 12], [14, 19]].forEach(([a, b]) => { x.fillRect(a, b, 0.7, 0.7); });
    },
    /* đường: miếng đường vuông và đường cát lấp lánh */
    duong(x, rng) {
      const I = Icons; I.shadow(x);
      I.ell(x, 17, 24, 12, 4.8, I.rg(x, 17, 24, 12, '#fffdf6', '#d8d0c0'), I.OUT);
      for (let i = 0; i < 30; i++) { const a = rng() * 6.28, d = Math.sqrt(rng()); x.fillStyle = i % 3 ? '#fff' : '#cfc6b4'; x.fillRect(17 + Math.cos(a) * 11 * d, 24 + Math.sin(a) * 4.2 * d, 0.7, 0.7); }
      const cube = (cx, cy, s) => { x.beginPath(); x.moveTo(cx, cy - s); x.lineTo(cx + s, cy - s / 2); x.lineTo(cx, cy); x.lineTo(cx - s, cy - s / 2); x.closePath(); x.fillStyle = '#ffffff'; x.fill(); x.strokeStyle = I.OUT; x.lineWidth = 0.6; x.stroke(); x.beginPath(); x.moveTo(cx - s, cy - s / 2); x.lineTo(cx, cy); x.lineTo(cx, cy + s); x.lineTo(cx - s, cy + s / 2); x.closePath(); x.fillStyle = '#dcdce8'; x.fill(); x.stroke(); x.beginPath(); x.moveTo(cx + s, cy - s / 2); x.lineTo(cx, cy); x.lineTo(cx, cy + s); x.lineTo(cx + s, cy + s / 2); x.closePath(); x.fillStyle = '#b4b4cc'; x.fill(); x.stroke(); };
      cube(11, 17, 6); cube(21, 18, 5.4); cube(16, 11, 5.4);
      x.fillStyle = '#fff'; [[26, 8], [6, 9]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b - 2.4); x.lineTo(a + 0.7, b - 0.7); x.lineTo(a + 2.4, b); x.lineTo(a + 0.7, b + 0.7); x.lineTo(a, b + 2.4); x.lineTo(a - 0.7, b + 0.7); x.lineTo(a - 2.4, b); x.lineTo(a - 0.7, b - 0.7); x.fill(); });
    },
    /* lá dứa: ba lá dài xanh */
    ladua(x) {
      const I = Icons; I.shadow(x, 16, 29, 9);
      I.blade(x, 15, 29, 6, 5, 1.7, '#58b84a', '#1f7a2c', 'rgba(190,240,150,.7)');
      I.blade(x, 17, 29, 26, 6, 1.7, '#58b84a', '#1f7a2c', 'rgba(190,240,150,.7)');
      I.blade(x, 16, 29, 16, 2.5, 1.9, '#6ac856', '#25862f', 'rgba(200,245,160,.8)');
      x.strokeStyle = '#d8c070'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(13.6, 25); x.lineTo(18.6, 25); x.stroke();
    },
    /* lạp xưởng: hai dây lạp xưởng đỏ buộc dây */
    thit(x) {
      const I = Icons; I.shadow(x);
      x.strokeStyle = '#8a6a3a'; x.lineWidth = 0.7; x.beginPath(); x.moveTo(16, 3); x.lineTo(16, 8); x.stroke(); I.ell(x, 16, 3, 1.6, 1.6, null, '#8a6a3a', 0, 0.7);
      I.sausage(x, 15, 12, 0.28); I.sausage(x, 16.5, 21, -0.22);
    },
    /* trứng cút: ba quả trứng đốm nâu */
    trung(x, rng) {
      const I = Icons; I.shadow(x);
      I.egg(x, 10.5, 21, -0.3, '#e6d6a4', '#7a5430', rng); I.egg(x, 21.5, 21.5, 0.3, '#e6d6a4', '#7a5430', rng); I.egg(x, 16, 13, 0.05, '#ecdcae', '#7a5430', rng);
    },
    /* pate chả: khúc chả lụa gói lá chuối buộc lạt */
    pate(x) {
      const I = Icons; I.shadow(x);
      x.beginPath(); x.moveTo(5, 11); x.lineTo(23, 11); x.arc(23, 17, 6, -1.5708, 1.5708); x.lineTo(5, 23); x.closePath();
      x.fillStyle = I.lg(x, 0, 11, 0, 23, '#fbe0cc', '#d8a888'); x.fill(); x.strokeStyle = I.OUT; x.lineWidth = 0.8; x.stroke();
      I.ell(x, 23, 17, 3.4, 6, I.rg(x, 23, 17, 6, '#fff0e2', '#e8bc9c'), I.OUT, 0, 0.6);
      x.fillStyle = 'rgba(200,120,90,.5)'; [[22, 14], [24, 19], [22.5, 17.5], [24.2, 15]].forEach(([a, b]) => { x.fillRect(a, b, 0.8, 0.8); });
      x.beginPath(); x.moveTo(5, 11); x.lineTo(13, 11); x.lineTo(13, 23); x.lineTo(5, 23); x.closePath(); x.fillStyle = I.lg(x, 5, 11, 13, 23, '#5ab04a', '#2a7430'); x.fill(); x.strokeStyle = I.OUT; x.lineWidth = 0.8; x.stroke();
      x.strokeStyle = 'rgba(190,240,150,.6)'; x.lineWidth = 0.4; [8, 10.5].forEach((v) => { x.beginPath(); x.moveTo(v, 11.5); x.lineTo(v, 22.5); x.stroke(); });
      x.strokeStyle = '#d8b868'; x.lineWidth = 1.2; [14.5, 19].forEach((v) => { x.beginPath(); x.moveTo(v, 10.6); x.lineTo(v, 23.4); x.stroke(); });
    },
    /* thịt gà: đùi gà rán vàng */
    ga(x) {
      const I = Icons; I.shadow(x);
      x.strokeStyle = I.OUT; x.lineWidth = 4.2; x.beginPath(); x.moveTo(17, 17); x.lineTo(25.5, 25.5); x.stroke();
      x.strokeStyle = '#f8f0dc'; x.lineWidth = 3; x.beginPath(); x.moveTo(17, 17); x.lineTo(25.5, 25.5); x.stroke();
      I.ell(x, 26.5, 24, 2.1, 2.1, '#f8f0dc', I.OUT, 0, 0.6); I.ell(x, 24.5, 27, 2.1, 2.1, '#f8f0dc', I.OUT, 0, 0.6);
      I.ell(x, 12.5, 12.5, 10, 7.6, I.rg(x, 12, 12, 10, '#f0b45a', '#9a4e14'), I.OUT, 0.75, 0.8);
      x.fillStyle = 'rgba(255,230,160,.6)'; x.beginPath(); x.ellipse(9.5, 9.5, 4, 1.3, 0.75, 0, 6.2832); x.fill();
      x.fillStyle = 'rgba(110,50,10,.45)'; [[14, 14], [17, 11.5], [11, 16], [15.5, 16.5]].forEach(([a, b]) => { x.beginPath(); x.ellipse(a, b, 1, 0.6, 0.7, 0, 6.2832); x.fill(); });
    },
    /* ngô nếp: bắp ngô trong vỏ xanh */
    ngo(x) {
      const I = Icons; I.shadow(x);
      x.beginPath(); x.ellipse(16, 14, 5.8, 11.6, 0.12, 0, 6.2832); x.fillStyle = I.lg(x, 10, 0, 22, 0, '#ffe46a', '#e0a818'); x.fill(); x.strokeStyle = I.OUT; x.lineWidth = 0.8; x.stroke();
      x.save(); x.beginPath(); x.ellipse(16, 14, 5.8, 11.6, 0.12, 0, 6.2832); x.clip();
      for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) { const px = 12.4 + c * 2.4 + (r % 2) * 1.2, py = 4.4 + r * 2.3; I.ell(x, px, py, 1.05, 1.05, '#f8d838', 'rgba(150,100,0,.55)', 0, 0.3); x.fillStyle = 'rgba(255,255,255,.55)'; x.fillRect(px - 0.5, py - 0.6, 0.5, 0.5); }
      x.restore();
      [[-1, '#58a848'], [1, '#6ab858']].forEach(([s, col]) => { x.beginPath(); x.moveTo(16, 29); x.quadraticCurveTo(16 + s * 9, 24, 16 + s * 7, 13); x.quadraticCurveTo(16 + s * 2, 21, 16, 29); x.fillStyle = col; x.fill(); x.strokeStyle = I.OUT; x.lineWidth = 0.7; x.stroke(); });
      x.strokeStyle = '#a8c870'; x.lineWidth = 0.9; x.beginPath(); x.moveTo(14, 3); x.quadraticCurveTo(11, 0, 9, 1.5); x.stroke(); x.beginPath(); x.moveTo(18, 3); x.quadraticCurveTo(21, 0, 23, 1.5); x.stroke();
    },
    /* nếp cẩm: đống nếp tím đen */
    cam(x, rng) {
      const I = Icons; I.shadow(x);
      I.ell(x, 16, 20, 12.5, 8, I.rg(x, 16, 20, 12.5, '#7a4a8a', '#1e0a28'), I.OUT);
      for (let i = 0; i < 40; i++) { const a = rng() * 6.28, d = Math.sqrt(rng()); const px = 16 + Math.cos(a) * 11 * d, py = 19.5 + Math.sin(a) * 6.4 * d, r = rng() * 3; I.ell(x, px, py, 1.6, 0.9, '#3a1a4a', '#12041a', r, 0.3); x.fillStyle = 'rgba(190,140,220,.65)'; x.fillRect(px - 0.6, py - 0.5, 0.7, 0.4); }
      I.ell(x, 12, 14, 2.2, 1.2, 'rgba(210,170,240,.5)', null, -0.4);
    },
    /* mít: múi mít vàng, vỏ gai xanh */
    mit(x, rng) {
      const I = Icons; I.shadow(x);
      I.ell(x, 17, 10, 10, 6.8, I.rg(x, 17, 10, 10, '#a8c452', '#546e22'), I.OUT, 0, 0.8);
      for (let i = 0; i < 16; i++) { const a = rng() * 6.28, d = Math.sqrt(rng()); const px = 17 + Math.cos(a) * 8.5 * d, py = 10 + Math.sin(a) * 5.2 * d; x.fillStyle = '#3e5a1a'; x.beginPath(); x.moveTo(px, py - 1.3); x.lineTo(px + 1, py + 0.8); x.lineTo(px - 1, py + 0.8); x.fill(); }
      [[10.5, 21, 0.4], [21.5, 21, -0.4], [16, 17, 0]].forEach(([a, b, r]) => { I.ell(x, a, b, 5.6, 7, I.rg(x, a, b, 7, '#ffd66a', '#d88c10'), I.OUT, r, 0.8); I.ell(x, a, b + 0.5, 2.2, 3.2, '#fff0b8', '#b8860c', r, 0.4); x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.ellipse(a - 2, b - 3, 1.2, 2, 0.4, 0, 6.2832); x.fill(); });
    },
    /* sầu riêng: quả gai xanh lục và múi vàng kem */
    sau(x) {
      const I = Icons; I.shadow(x);
      I.ell(x, 14, 15, 11, 10.5, I.rg(x, 14, 15, 11, '#c4cc58', '#6a7a24'), I.OUT, 0, 0.8);
      for (let i = 0; i < 26; i++) { const a = (i / 26) * 6.2832, rr = 10.6; const bx = 14 + Math.cos(a) * rr, by = 15 + Math.sin(a) * rr * 0.96; x.fillStyle = '#4a5a1a'; x.beginPath(); x.moveTo(bx + Math.cos(a - 1.57) * 1.5, by + Math.sin(a - 1.57) * 1.5); x.lineTo(bx + Math.cos(a) * 2.8, by + Math.sin(a) * 2.8); x.lineTo(bx + Math.cos(a + 1.57) * 1.5, by + Math.sin(a + 1.57) * 1.5); x.fill(); }
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const px = 8 + c * 3.4 + (r % 2) * 1.6, py = 8 + r * 3.8; if (Math.hypot(px - 14, py - 15) < 8.4) { x.fillStyle = '#e8ec9a'; x.beginPath(); x.moveTo(px, py - 1.6); x.lineTo(px + 1.3, py + 1); x.lineTo(px - 1.3, py + 1); x.fill(); } }
      I.ell(x, 24, 22.5, 6.6, 5.4, I.rg(x, 24, 22, 7, '#fff4b8', '#e0b030'), I.OUT, 0, 0.7);
      I.ell(x, 22, 22.5, 2.6, 3.4, '#ffe880', '#b88810', 0.2, 0.4); I.ell(x, 26, 22.5, 2.6, 3.4, '#ffe880', '#b88810', -0.2, 0.4);
    },
    /* lá chuối: tàu lá xanh to có gân */
    la(x) {
      const I = Icons; I.shadow(x, 16, 29, 11);
      x.beginPath(); x.moveTo(3, 27); x.bezierCurveTo(4, 12, 16, 3, 29, 5); x.bezierCurveTo(26, 16, 16, 26, 3, 27); x.closePath();
      x.fillStyle = I.lg(x, 3, 27, 29, 5, '#3e9a3c', '#8ad26a'); x.fill(); x.strokeStyle = I.OUT; x.lineWidth = 0.8; x.stroke();
      x.strokeStyle = 'rgba(20,80,24,.4)'; x.lineWidth = 0.45; for (let i = 0; i < 12; i++) { const t = (i + 1) / 13, px = 3 + t * 25, py = 27 - t * 22; x.beginPath(); x.moveTo(px, py); x.lineTo(px - 3.2 - t * 2, py - 4.8 + t * 3.6); x.moveTo(px, py); x.lineTo(px + 3.4, py + 4.2 - t * 2); x.stroke(); }
      x.strokeStyle = '#d4ee9c'; x.lineWidth = 0.9; x.beginPath(); x.moveTo(3, 27); x.quadraticCurveTo(16, 18, 29, 5); x.stroke();
      x.fillStyle = 'rgba(255,255,255,.22)'; x.beginPath(); x.ellipse(12, 12.5, 6.5, 1.8, -0.55, 0, 6.2832); x.fill();
    },
    _(x) { Icons.ell(x, 16, 16, 10, 10, '#ccc', Icons.OUT); },
  },
};
/* Gọi nhanh: ảnh icon nguyên liệu dạng HTML */
function ingIcon(id, cls) { return Icons.html(id, cls || ''); }
