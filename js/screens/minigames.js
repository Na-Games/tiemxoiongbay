/* Hội làng: trò chơi dân gian theo nhiều chủ đề, thưởng nguyên liệu nấu xôi */
const MG_THEMES = {
  hoi: { id: 'hoi', name: 'Hội làng đêm', icon: '🏮' },
  tet: { id: 'tet', name: 'Tết đến xuân về', icon: '🌸' },
  trung: { id: 'trung', name: 'Rằm trung thu', icon: '🌕' },
  gat: { id: 'gat', name: 'Mùa gặt vàng', icon: '🌾' },
  dong: { id: 'dong', name: 'Đồng quê bình yên', icon: '🐃' },
  song: { id: 'song', name: 'Sông nước miền Tây', icon: '🌊' },
};
const MG_PARTICLES = { hoi: '🏮', tet: '🌸', trung: '✨', gat: '🌾', dong: '🦋', song: '💧' };

/* Nền chủ đề pixel-art (80x112) có chuyển động nhẹ */
function themeBG(canvas, id) {
  const W = 80, H = 112; canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;
  const bg = mkCanvas(W, H), x = bg.x, rng = mulberry32(id.length * 13 + id.charCodeAt(0));
  const stops = {
    hoi: [[0, '#140c34'], [0.5, '#5a2a72'], [0.7, '#c0507a'], [1, '#f08a58']],
    tet: [[0, '#6a0c1c'], [0.5, '#c02a28'], [0.75, '#f07848'], [1, '#f8c070']],
    trung: [[0, '#08123a'], [0.6, '#1a3a7a'], [1, '#4a78b8']],
    gat: [[0, '#f8c860'], [0.6, '#f8a040'], [1, '#e87838']],
    dong: [[0, '#58b8f0'], [0.6, '#a8dcf8'], [1, '#e0f4ff']],
    song: [[0, '#2a6ab0'], [0.55, '#7cc4ec'], [1, '#e4f6fc']],
  }[id];
  const hy = 78;
  gradBands(x, W, 0, hy, stops);
  const ground = { hoi: ['#2a1a2c', '#3a2638'], tet: ['#c89a2a', '#e0b040'], trung: ['#173a3a', '#1f4a48'], gat: ['#b87a2a', '#d09a3a'], dong: ['#4a9a3a', '#5ab048'], song: ['#2a78b0', '#3a8cc4'] }[id];
  for (let y = hy; y < H; y++) for (let xx = 0; xx < W; xx++) { P(x, ((xx >> 2) + (y >> 2)) % 2 ? ground[0] : ground[1], xx, y); }
  R(x, shade(ground[0], -30), 0, hy, W, 1);
  const extra = [];
  if (id === 'hoi') {
    for (let i = 0; i < 6; i++) { const lx = 6 + i * 14; disc(x, '#e84a2a', lx, 28 + (i % 2) * 4, 3, 4); R(x, '#4a2a18', lx - 1, 21 + (i % 2) * 4, 2, 2); R(x, '#f0c860', lx - 1, 32 + (i % 2) * 4, 2, 2); }
    for (let i = 0; i < 20; i++) extra.push({ x: 2 + i * 4, y: 8 + Math.sin(i * 0.6 + 1) * 3 + 6, p: i });
    // người xem nhỏ
    for (let i = 0; i < 5; i++) { const px = 8 + i * 16; R(x, '#1a1020', px, hy - 6, 3, 6); disc(x, '#1a1020', px + 1, hy - 8, 2); }
  } else if (id === 'tet') {
    for (let i = 0; i < 10; i++) { const bx = 40 + i * 6, by = 4 + i * 2; R(x, '#5a3018', bx, by, 6, 2); }
    for (let i = 0; i < 16; i++) disc(x, rng() < 0.5 ? '#f8a0c0' : '#fff0f4', 42 + rng() * 38, 4 + rng() * 24, 2);
    for (let i = 0; i < 5; i++) { const lx = 6 + i * 6; R(x, '#e8b030', lx, 6, 1, 14 + i * 2); R(x, '#d82a2a', lx - 2, 20 + i * 2, 5, 7); R(x, '#f8d060', lx, 22 + i * 2, 1, 3); }
  } else if (id === 'trung') {
    disc(x, '#f4ecc8', 54, 26, 14); disc(x, '#e0d8a8', 49, 22, 3); disc(x, '#e0d8a8', 58, 30, 4); disc(x, '#e0d8a8', 60, 21, 2);
    for (let i = 0; i < 40; i++) P(x, '#fff', rng() * W, rng() * 50);
    for (let i = 0; i < 5; i++) extra.push({ x: 8 + i * 15, y: 90 - i * 4, p: i, s: 4 + i });
  } else if (id === 'gat') {
    disc(x, '#fff0a0', 40, hy - 2, 18); disc(x, '#ffe070', 40, hy - 2, 12);
    for (let i = 0; i < W; i += 3) { const h = 5 + Math.round(rng() * 4); R(x, '#a86820', i, hy + 4, 1, h); R(x, '#f0c050', i + 1, hy + 4, 1, h - 2); }
    for (let i = 0; i < 3; i++) { const sx = 10 + i * 28; disc(x, '#d8a840', sx, hy - 3, 6, 7); R(x, '#a87828', sx - 6, hy + 2, 12, 2); R(x, '#f0d070', sx - 1, hy - 11, 2, 3); }
  } else if (id === 'dong') {
    for (let xx = 0; xx < W; xx++) { const h = 62 + Math.sin(xx * 0.1) * 4 + Math.sin(xx * 0.27) * 2; R(x, '#7ac860', xx, h, 1, hy - h); }
    for (let xx = 0; xx < W; xx++) { const h = 70 + Math.sin(xx * 0.15 + 2) * 3; R(x, '#4a9a40', xx, h, 1, hy - h); }
    for (let i = 0; i < 3; i++) extra.push({ x: 10 + i * 30, y: 12 + i * 9, p: i, s: 2 + i });
    R(x, '#3a2a20', 52, hy - 9, 9, 5); R(x, '#3a2a20', 60, hy - 12, 4, 5); R(x, '#d8d0b0', 60, hy - 13, 1, 2); R(x, '#d8d0b0', 63, hy - 13, 1, 2);
    R(x, '#3a2a20', 53, hy - 4, 1, 4); R(x, '#3a2a20', 59, hy - 4, 1, 4);
  } else if (id === 'song') {
    disc(x, '#fff6c0', 58, 24, 11); disc(x, '#ffe888', 58, 24, 7);
    for (let xx = 0; xx < W; xx++) { const h = 66 + Math.sin(xx * 0.12) * 3; R(x, '#3a8a5a', xx, h, 1, hy - h); }
    for (let i = 0; i < 4; i++) { const rx = 6 + i * 20; R(x, '#2a6a3a', rx, hy - 14, 1, 14); R(x, '#8a5a30', rx - 1, hy - 18, 3, 5); }
    for (let i = 0; i < 2; i++) extra.push({ x: 10 + i * 36, y: 14 + i * 9, p: i, s: 2 + i });
  }
  let t = 0;
  return (dt) => {
    t += dt; ctx.drawImage(bg.c, 0, 0);
    if (id === 'song') { for (let k = 0; k < 14; k++) { const sx = (k * 13 + 5) % W, sy = hy + 2 + (k * 7) % (H - hy - 3); if (Math.sin(t * 3 + k) > 0.55) R(ctx, 'rgba(255,255,255,.7)', sx, sy, 2, 1); } extra.forEach((e) => { const cx = ((e.x + t * e.s) % 100) - 12; disc(ctx, 'rgba(255,255,255,.85)', cx, e.y, 6, 2.5); disc(ctx, 'rgba(255,255,255,.85)', cx + 4, e.y - 2, 4, 2.5); }); }
    if (id === 'hoi') extra.forEach((e) => { P(ctx, (Math.floor(t * 2 + e.p) % 3 === 0) ? '#fff0a0' : (e.p % 2 ? '#ff7a5a' : '#7ad8ff'), e.x, e.y); });
    if (id === 'tet') { const k = (t * 0.6) % 2; if (k < 1) { const cx = 20 + ((t | 0) * 17) % 40, cy = 40, r = k * 14; for (let a = 0; a < 12; a++) P(ctx, a % 2 ? '#ffe070' : '#ff8aa0', cx + Math.cos((a / 12) * 6.28) * r, cy + Math.sin((a / 12) * 6.28) * r); } }
    if (id === 'trung') extra.forEach((e) => { const yy = ((e.y - t * e.s) % 100 + 100) % 100 + 6; disc(ctx, 'rgba(255,200,80,.3)', e.x, yy, 4); R(ctx, '#ffb030', e.x - 1, yy - 1, 3, 3); P(ctx, '#fff0a0', e.x, yy); });
    if (id === 'dong') extra.forEach((e) => { const cx = ((e.x + t * e.s) % 100) - 12; disc(ctx, 'rgba(255,255,255,.9)', cx, e.y, 6, 2.5); disc(ctx, 'rgba(255,255,255,.9)', cx + 4, e.y - 2, 4, 2.5); });
  };
}

const Minigames = {
  list: [
    { id: 'dapnieu', name: 'Đập niêu', icon: '🏺', theme: MG_THEMES.hoi, desc: 'Bịt mắt, canh đúng lúc vung gậy đập vỡ niêu đất treo lơ lửng. 5 lượt.', tip: 'Gậy lắc qua lại, niêu cũng đung đưa. Bấm ĐẬP khi gậy nằm ngay dưới niêu. Càng về sau gậy lắc càng nhanh.', rewards: ['lac', 'nep', 'duong'], per: { lac: 3, nep: 3, duong: 2 } },
    { id: 'nemcon', name: 'Ném còn', icon: '🎯', theme: MG_THEMES.tet, desc: 'Chạm 1: chốt góc ném. Chạm 2: chốt lực. Ném quả còn lọt vòng trên cột!', tip: 'Chạm lần 1 khi mũi tên chỉ đúng góc, chạm lần 2 khi thanh lực đầy vừa đủ để quả còn bay vào vòng vàng.', rewards: ['dau', 'gac', 'dua'], per: { dau: 3, gac: 1, dua: 2 } },
    { id: 'batga', name: 'Bắt gà', icon: '🐔', theme: MG_THEMES.dong, desc: 'Chạm gà nhô lên khỏi chuồng trong 25 giây. Coi chừng cáo gian 🦊!', tip: 'Chạm vào gà vừa nhô lên: +1 điểm. Chạm nhầm cáo 🦊 bị trừ 2 điểm. Đạt 18 con là đủ 3 sao.', rewards: ['ga', 'trung', 'hanh'], per: { ga: 1, trung: 3, hanh: 3 } },
    { id: 'latden', name: 'Lật lồng đèn', icon: '🏮', theme: MG_THEMES.trung, desc: 'Lật tìm các cặp hình giống nhau (đèn, thỏ, bánh…) trước khi hết giờ.', tip: 'Lật hai thẻ giống nhau để ghép cặp. Nhớ vị trí các thẻ đã lật. Hoàn thành càng sớm điểm càng cao.', rewards: ['la', 'dua', 'ladua'], per: { la: 16, dua: 2, ladua: 3 } },
    { id: 'keoco', name: 'Kéo co', icon: '🪢', theme: MG_THEMES.gat, desc: 'Chạm liên tục thật nhanh để kéo đội mình thắng sau mùa gặt!', tip: 'Bấm KÉO thật nhanh và đều tay. Đối thủ cũng kéo liên tục, đừng nghỉ tay trong 15 giây.', rewards: ['ngo', 'cam', 'duong'], per: { ngo: 3, cam: 2, duong: 3 } },
  ],

  play(game, onDone) {
    G.mg.tokens--; Save.root.records.minigames++; Save.save();
    const ov = el('div', 'mg-ov');
    ov.innerHTML = `<canvas class="pix mg-bg"></canvas>
      <div class="mg-top"><div class="mg-title">${game.icon} ${game.name}</div><div class="mg-stat"></div><button class="btn mini mg-x">✕</button></div>
      <div class="mg-help">${game.desc}</div><div class="mg-area"></div>`;
    const amb = el('div', 'mg-amb'); for (let i = 0; i < 10; i++) { const p = el('i', '', MG_PARTICLES[game.theme.id]); p.style.left = rnd(0, 100) + '%'; p.style.animationDelay = -rnd(0, 9) + 's'; p.style.animationDuration = rnd(6, 11) + 's'; amb.appendChild(p); }
    ov.insertBefore(amb, $('.mg-top', ov));
    UI.app.appendChild(ov);
    const upd = themeBG($('.mg-bg', ov), game.theme.id); const lp = Loop.add((dt) => upd(dt));
    Sound.setTempo(1.15);
    let ended = false, stopFn = null;
    const end = (score, note) => {
      if (ended) return; ended = true; if (stopFn) stopFn(); Loop.remove(lp); Sound.setTempo(1);
      this.result(game, score, ov, onDone, note);
    };
    $('.mg-x', ov).onclick = async () => { if (await UI.confirm('Thoát trò chơi? Vé sẽ bị mất.', 'Thoát', 'Chơi tiếp')) { ended = true; if (stopFn) stopFn(); Loop.remove(lp); ov.remove(); Sound.setTempo(1); onDone && onDone(); } };
    const ctx = { area: $('.mg-area', ov), stat: $('.mg-stat', ov), end, onStop: (f) => { stopFn = f; } };
    // đếm ngược 3-2-1 rồi mới bắt đầu
    (async () => {
      const cd = el('div', 'mg-count'); ov.appendChild(cd);
      $('.mg-help', ov).innerHTML = game.desc + '<br><b class="mg-tip">💡 ' + game.tip + '</b>';
      for (const w of ['3', '2', '1', 'Bắt đầu!']) {
        if (ended) { cd.remove(); return; }
        cd.textContent = w; cd.classList.remove('pop'); void cd.offsetWidth; cd.classList.add('pop');
        const go = w === 'Bắt đầu!'; Sound.sfx(go ? 'bell' : 'tick'); Sound.vibrate(go ? 45 : 16, true);
        await sleep(go ? 550 : 800);
      }
      cd.remove(); if (!ended) { $('.mg-help', ov).textContent = game.desc; this.games[game.id](ctx); }
    })();
  },

  result(game, score, ov, onDone, note) {
    const stars = score >= 0.85 ? 3 : score >= 0.55 ? 2 : score >= 0.25 ? 1 : 0;
    const got = [];
    if (stars > 0) Object.entries(game.per).forEach(([k, n]) => { const q = Math.max(1, Math.round(n * stars * (k === 'la' ? 1 / 3 : 1) * (k === 'la' ? 1 : 0.7))); const amt = k === 'la' ? 4 * stars : q; G.ingr[k] = (G.ingr[k] || 0) + amt; got.push(DATA.ING_BY[k].icon + ' ' + DATA.ING_BY[k].name + ' ×' + amt); });
    Save.save();
    const body = el('div', 'mg-res');
    body.innerHTML = '<div class="stars">' + [1, 2, 3].map((i) => '<span class="st' + (i <= stars ? ' on' : '') + '" style="animation-delay:' + i * 0.25 + 's">★</span>').join('') + '</div>' + (note ? '<p class="center mg-note">' + note + '</p>' : '') + '<p class="center">' + (stars === 3 ? 'Siêu đỉnh! Cả làng vỗ tay!' : stars === 2 ? 'Khá lắm, nhanh tay đấy!' : stars === 1 ? 'Cũng được, lần sau cố nữa!' : 'Tiếc quá, thử lại ngày mai nhé!') + '</p>' + (got.length ? '<div class="rw-list">' + got.map((g) => '<div class="rw">' + g + '</div>').join('') + '</div>' : '');
    UI.modal({ title: 'Kết quả', icon: '🎎', body, buttons: [{ label: 'Xong', cls: 'red' }], onClose: () => { ov.remove(); UI.updateHud(); onDone && onDone(); } });
    if (stars) { Sound.sfx('success'); UI.burst(240, 260, 'confetti', 26 + stars * 10); if (stars === 3) { [300, 700].forEach((d) => setTimeout(() => UI.burst(120 + Math.random() * 240, 200, 'confetti', 24), d)); Sound.vibrate([40, 30, 40, 30, 90]); } } else Sound.sfx('fail');
    [1, 2, 3].slice(0, stars).forEach((i) => setTimeout(() => Sound.sfx('star'), i * 250));
  },

  games: {
    /* ----- Đập niêu ----- */
    dapnieu(c) {
      c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas><button class="btn big red mg-act">ĐẬP!</button>';
      const cv = $('canvas', c.area), x = cv.getContext('2d'), btn = $('.mg-act', c.area);
      let round = 0, hits = 0, t = 0, swing = 0, state = 'aim', msg = '', mt = 0, potX = 160, shards = [];
      const RN = 5;
      const fn = Loop.add((dt) => {
        t += dt; swing = Math.max(0, swing - dt * 4); mt -= dt;
        const sx = 160 + Math.sin(t * (2.2 + round * 0.45)) * 120; // vị trí gậy
        potX = 160 + Math.sin(t * 1.3 + round) * 60;
        x.clearRect(0, 0, 320, 420);
        // dây + niêu
        if (state !== 'smash') {
          x.strokeStyle = '#6a4a30'; x.lineWidth = 3; x.beginPath(); x.moveTo(potX, 0); x.lineTo(potX, 110); x.stroke();
          x.fillStyle = '#a8602c'; x.beginPath(); x.ellipse(potX, 140, 34, 30, 0, 0, 6.3); x.fill();
          x.fillStyle = '#c87c3c'; x.beginPath(); x.ellipse(potX - 8, 130, 16, 14, 0, 0, 6.3); x.fill();
          x.fillStyle = '#6a3a18'; x.fillRect(potX - 22, 108, 44, 8); x.fillStyle = '#e8c040'; x.fillRect(potX - 20, 140, 40, 4);
        }
        shards = shards.filter((s) => (s.y += s.vy * dt, s.vy += 800 * dt, s.x += s.vx * dt, s.y < 460));
        shards.forEach((s) => { x.fillStyle = s.c; x.fillRect(s.x, s.y, 8, 8); });
        // người bịt mắt + gậy
        x.fillStyle = '#1a1020'; x.fillRect(sx - 14, 330, 28, 50); x.fillStyle = '#d9a070'; x.fillRect(sx - 12, 300, 24, 28); x.fillStyle = '#f0e8d8'; x.fillRect(sx - 12, 310, 24, 8);
        x.save(); x.translate(sx, 340); x.rotate(-1.2 + swing * 2.2); x.fillStyle = '#8a5a30'; x.fillRect(-3, -130, 6, 130); x.restore();
        // thông báo
        x.fillStyle = '#fff'; x.font = 'bold 22px VT323, monospace'; x.textAlign = 'center';
        x.fillText('Lượt ' + Math.min(round + 1, RN) + '/' + RN + ' · Trúng ' + hits, 160, 410);
        if (mt > 0) { x.font = 'bold 34px VT323'; x.fillStyle = msg.startsWith('Trúng') ? '#ffe070' : '#ff8a8a'; x.fillText(msg, 160, 230); }
        c.stat.textContent = '🎯 ' + hits + '/' + RN;
        c._sx = sx; c._px = potX;
      });
      btn.onclick = () => {
        if (state === 'done') return;
        swing = 1; Sound.sfx('hit');
        const d = Math.abs(c._sx - c._px);
        setTimeout(() => {
          if (d < 34 + (round === 0 ? 10 : 0)) { hits++; msg = 'Trúng rồi!'; Sound.sfx('smash'); Sound.vibrate([50, 30, 80]); UI.burst(UI.pos(cv, c._px / 320, 0.35).x, UI.pos(cv, c._px / 320, 0.35).y, 'dust', 14); for (let i = 0; i < 14; i++) shards.push({ x: c._px + (Math.random() - 0.5) * 40, y: 130, vx: (Math.random() - 0.5) * 300, vy: -200 + Math.random() * 120, c: pick(['#a8602c', '#c87c3c', '#6a3a18']) }); }
          else { msg = 'Trượt!'; Sound.sfx('error'); }
          mt = 0.9; round++;
          if (round >= RN) { state = 'done'; setTimeout(() => { Loop.remove(fn); c.end(hits / RN); }, 900); }
        }, 160);
      };
      c.onStop(() => Loop.remove(fn));
    },

    /* ----- Ném còn ----- */
    nemcon(c) {
      c.area.innerHTML = '<canvas class="mg-cv" width="320" height="420"></canvas><button class="btn big red mg-act">CHỐT GÓC</button>';
      const cv = $('canvas', c.area), x = cv.getContext('2d'), btn = $('.mg-act', c.area);
      let phase = 0, t = 0, ang = 0.9, pw = 0, throws = 0, hits = 0, ball = null, msg = '', mt = 0;
      const TN = 5, ring = { x: 245, y: 120, r: 22 }, org = { x: 50, y: 360 };
      const fn = Loop.add((dt) => {
        t += dt; mt -= dt;
        if (phase === 0) ang = 0.35 + (Math.sin(t * 2.4) * 0.5 + 0.5) * 0.9;
        if (phase === 1) pw = Math.sin(t * 3 + 1) * 0.5 + 0.5;
        if (ball) {
          ball.vy += 520 * dt; const ox = ball.x, oy = ball.y; ball.x += ball.vx * dt; ball.y += ball.vy * dt; ball.rot += dt * 10;
          // lọt vòng: đi qua mặt phẳng vòng từ trên xuống
          if (!ball.done && ox < ring.x + 4 && ball.x >= ring.x - 4 && Math.abs(ball.y - ring.y) < ring.r * 0.85) { ball.done = true; hits++; msg = 'Lọt vòng!'; mt = 1; Sound.sfx('coin'); const p = UI.pos(cv, ring.x / 320, ring.y / 420); UI.burst(p.x, p.y, 'confetti', 18); Sound.vibrate(50); }
          if (ball.y > 400 || ball.x > 340) { if (!ball.done) { msg = 'Hụt rồi'; mt = 0.9; Sound.sfx('error'); } ball = null; throws++; phase = 0; btn.textContent = 'CHỐT GÓC'; if (throws >= TN) { Loop.remove(fn); setTimeout(() => c.end(hits / TN), 700); } }
        }
        x.clearRect(0, 0, 320, 420);
        // cột + vòng
        x.fillStyle = '#7a4a28'; x.fillRect(ring.x + 20, ring.y, 8, 300); x.fillStyle = '#a8703c'; x.fillRect(ring.x + 20, ring.y, 3, 300);
        x.strokeStyle = '#e8b030'; x.lineWidth = 6; x.beginPath(); x.ellipse(ring.x, ring.y, 7, ring.r, 0, 0, 6.3); x.stroke(); x.strokeStyle = '#d82a2a'; x.lineWidth = 2; x.stroke();
        x.fillStyle = '#d82a2a'; x.fillRect(ring.x + 14, ring.y - ring.r - 6, 20, 5);
        // người ném
        x.fillStyle = '#2a4a8a'; x.fillRect(28, 330, 28, 46); x.fillStyle = '#d9a070'; x.fillRect(30, 300, 24, 26); x.fillStyle = '#d82a2a'; x.fillRect(30, 296, 24, 8);
        // mũi tên góc
        if (phase <= 1) { x.save(); x.translate(org.x, org.y); x.rotate(-ang); x.strokeStyle = 'rgba(255,255,255,.7)'; x.setLineDash([6, 6]); x.lineWidth = 3; x.beginPath(); x.moveTo(0, 0); x.lineTo(60 + (phase === 1 ? pw * 70 : 0), 0); x.stroke(); x.restore(); }
        // thanh lực
        x.fillStyle = 'rgba(0,0,0,.5)'; x.fillRect(20, 400, 280, 12); x.fillStyle = phase === 1 ? '#ffd23a' : '#6a6a6a'; x.fillRect(20, 400, 280 * (phase === 1 ? pw : 0), 12);
        // quả còn
        if (ball) { x.save(); x.translate(ball.x, ball.y); x.rotate(ball.rot); x.fillStyle = '#e83a3a'; x.fillRect(-9, -9, 18, 18); x.fillStyle = '#ffd23a'; x.fillRect(-9, -3, 18, 6); x.fillStyle = '#3ab0e8'; x.fillRect(-3, -9, 6, 18); x.restore(); x.fillStyle = '#ffd23a'; x.fillRect(ball.x - ball.vx * 0.06, ball.y - ball.vy * 0.06, 4, 4); }
        x.fillStyle = '#fff'; x.font = 'bold 22px VT323'; x.textAlign = 'center'; x.fillText('Lượt ném ' + Math.min(throws + 1, TN) + '/' + TN, 160, 30);
        if (mt > 0) { x.font = 'bold 34px VT323'; x.fillStyle = msg === 'Lọt vòng!' ? '#ffe070' : '#ff9a9a'; x.fillText(msg, 160, 230); }
        c.stat.textContent = '🎯 ' + hits + '/' + TN;
      });
      btn.onclick = () => {
        if (ball) return; Sound.sfx('tap');
        if (phase === 0) { phase = 1; btn.textContent = 'CHỐT LỰC'; }
        else if (phase === 1) {
          phase = 2; const v = 250 + pw * 330; ball = { x: org.x, y: org.y, vx: Math.cos(ang) * v, vy: -Math.sin(ang) * v, rot: 0, done: false }; Sound.sfx('whoosh'); btn.textContent = '…';
        }
      };
      c.onStop(() => Loop.remove(fn));
    },

    /* ----- Bắt gà ----- */
    batga(c) {
      c.area.innerHTML = '<div class="holes"></div>';
      const grid = $('.holes', c.area); const holes = [];
      for (let i = 0; i < 9; i++) { const h = el('button', 'hole', '<span class="mound"></span><span class="pop"></span>'); grid.appendChild(h); holes.push({ el: h, pop: $('.pop', h), kind: null, t: 0 }); h.onpointerdown = () => hit(i); }
      let score = 0, time = 25, spawn = 0.4, ended = false;
      const GOAL = 18;
      function hit(i) {
        const h = holes[i]; if (!h.kind) return;
        if (h.kind === 'fox') { score = Math.max(0, score - 2); Sound.sfx('error'); Sound.vibrate(80); const p = UI.pos(h.el); UI.float('-2', p.x, p.y, 'loss'); }
        else { score++; Sound.sfx('cluck'); const p = UI.pos(h.el); UI.burst(p.x, p.y, 'dust', 6); UI.float('+1', p.x, p.y, 'gain'); }
        h.kind = null; h.pop.textContent = ''; h.el.classList.remove('up');
      }
      const fn = Loop.add((dt) => {
        if (ended) return; time -= dt; spawn -= dt;
        if (spawn <= 0) { spawn = 0.35 + Math.random() * 0.45; const free = holes.filter((h) => !h.kind); if (free.length) { const h = pick(free); h.kind = chance(0.18) ? 'fox' : 'hen'; h.t = 0.9 + Math.random() * 0.5; h.pop.textContent = h.kind === 'fox' ? '🦊' : '🐔'; h.el.classList.add('up'); } }
        holes.forEach((h) => { if (h.kind) { h.t -= dt; if (h.t <= 0) { h.kind = null; h.pop.textContent = ''; h.el.classList.remove('up'); } } });
        c.stat.textContent = '⏱ ' + Math.max(0, Math.ceil(time)) + 's · 🐔 ' + score;
        if (time <= 0) { ended = true; Loop.remove(fn); c.end(clamp(score / GOAL, 0, 1)); }
      });
      c.onStop(() => { ended = true; Loop.remove(fn); });
    },

    /* ----- Lật lồng đèn (ghi nhớ) ----- */
    latden(c) {
      const icons = ['🏮', '🐇', '🥮', '🌕', '⭐', '🐉'];
      const deck = shuffle(icons.concat(icons));
      c.area.innerHTML = '<div class="cards"></div>'; const grid = $('.cards', c.area);
      let first = null, lock = false, found = 0, time = 50, ended = false, flips = 0;
      deck.forEach((ic, i) => {
        const cd = el('button', 'mcard', '<span class="back">🎴</span><span class="face">' + ic + '</span>'); cd.dataset.ic = ic; grid.appendChild(cd);
        cd.onclick = () => {
          if (lock || cd.classList.contains('open') || ended) return; cd.classList.add('open'); Sound.sfx('tap'); flips++;
          if (!first) { first = cd; return; }
          if (first.dataset.ic === cd.dataset.ic) { found++; Sound.sfx('coin'); const p = UI.pos(cd); UI.burst(p.x, p.y, 'spark', 8); first.classList.add('ok'); cd.classList.add('ok'); first = null; if (found === icons.length) { ended = true; Loop.remove(fn); setTimeout(() => c.end(clamp(0.6 + (time / 50) * 0.5, 0, 1)), 700); } }
          else { lock = true; const a = first; first = null; setTimeout(() => { a.classList.remove('open'); cd.classList.remove('open'); lock = false; }, 650); }
        };
      });
      const fn = Loop.add((dt) => { if (ended) return; time -= dt; c.stat.textContent = '⏱ ' + Math.max(0, Math.ceil(time)) + 's · ' + found + '/' + icons.length; if (time <= 0) { ended = true; Loop.remove(fn); c.end(found / icons.length * 0.8); } });
      c.onStop(() => { ended = true; Loop.remove(fn); });
    },

    /* ----- Kéo co ----- */
    keoco(c) {
      c.area.innerHTML = '<div class="tug"><div class="rope-wrap"><div class="rope"></div><div class="flag"></div><div class="team a">🧑‍🌾🧑‍🌾🧑‍🌾</div><div class="team b">👨‍🌾👨‍🌾👨‍🌾</div></div><div class="tug-bar"><i></i></div></div><button class="btn big red mg-act">KÉO!</button>';
      const flag = $('.flag', c.area), ta = $('.team.a', c.area), tb = $('.team.b', c.area), bar = $('.tug-bar i', c.area), btn = $('.mg-act', c.area);
      let p = 0.5, time = 15, ended = false, surge = 0, ai = 0.17;
      const fn = Loop.add((dt) => {
        if (ended) return; time -= dt; surge -= dt;
        if (surge <= 0) { surge = 0.8 + Math.random() * 1.2; ai = 0.14 + Math.random() * 0.2; }
        p -= ai * dt; p = clamp(p, 0, 1);
        flag.style.left = p * 100 + '%'; ta.style.left = (p * 100 - 28) + '%'; tb.style.left = (p * 100 + 6) + '%'; bar.style.width = p * 100 + '%';
        c.stat.textContent = '⏱ ' + Math.max(0, Math.ceil(time)) + 's';
        if (p >= 0.97 || p <= 0.03 || time <= 0) { ended = true; Loop.remove(fn); c.end(p); }
      });
      btn.onpointerdown = () => { if (ended) return; p = clamp(p + 0.034, 0, 1); Sound.sfx('tick'); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); };
      c.onStop(() => { ended = true; Loop.remove(fn); });
    },
  },
};
