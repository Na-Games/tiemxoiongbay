/* Màn hình trang chủ, cốt truyện, giới thiệu ngày, kết thúc */
UI.register('title', {
  enter(root) {
    root.innerHTML = `
      <canvas class="pix scene-full"></canvas>
      <div class="title-shade"></div>
      <button class="btn mini title-sound" title="Âm thanh">🔊</button>
      <div class="logo">
        <div class="logo-sub">Ai mua xôi nào?</div>
        <div class="logo-main"><span>XÔI</span> <span>NÓNG</span> <span>ĐÂY!</span></div>
        <div class="logo-ribbon"><i></i><b>TIỆM XÔI ÔNG BẢY</b><i></i></div>
      </div>
      <div class="title-menu"></div>
      <div class="title-foot">Bản quyền Tiệm xôi Ông Bảy · Ver 2026.10.22</div>`;
    const cv = $('canvas', root);
    const sc = Scenes.title(cv);
    const tick = Loop.add((dt) => sc.update(dt));
    const menu = $('.title-menu', root);
    const sound = $('.title-sound', root);
    const refreshSnd = () => { sound.textContent = (S().music + S().sfx) <= 0 ? '🔇' : '🔊'; };
    refreshSnd();
    sound.onclick = () => { Settings.toggleMute(); refreshSnd(); Sound.playMusic(); };
    root.appendChild(UI.fsButton('title-full'));
    const build = () => {
      menu.innerHTML = '';
      const has = !!Save.root.game && !Save.root.game.over;
      if (has) {
        const b = el('button', 'btn red big', 'Tiếp tục · Ngày ' + Save.root.game.day); b.onclick = () => resume(); menu.appendChild(b);
        const n = el('button', 'btn gray', 'Chơi ván mới'); n.onclick = async () => { if (await UI.confirm('Bắt đầu ván mới sẽ xóa tiến trình hiện tại. Chắc chưa?', 'Chơi mới', 'Giữ lại')) pickDiff(); }; menu.appendChild(n);
      } else {
        const b = el('button', 'btn red big', 'Bắt đầu chơi'); b.onclick = () => pickDiff(); menu.appendChild(b);
      }
      const row = el('div', 'btn-row');
      [['⚙️ Cài đặt', () => Settings.open()], ['❓ Hướng dẫn', () => howTo()], ['🏆 Thành tích', () => records()]].forEach(([t, f]) => { const b = el('button', 'btn gray small', t); b.onclick = f; row.appendChild(b); });
      menu.appendChild(row);
    };
    const resume = () => {
      Sound.init(); G = Save.root.game;
      if (G.phase === 'dayintro' || !G.today) UI.go('dayintro'); else UI.go('kitchen');
    };
    const pickDiff = () => {
      const box = el('div', 'diff-list');
      Object.entries(DATA.DIFF).forEach(([k, d]) => {
        const b = el('button', 'diff btn ' + (k === 'normal' ? 'gold' : 'gray'), '<b>' + d.name + '</b><small>' + d.desc + '</small>');
        b.onclick = () => { m.close(); startNew(k); };
        box.appendChild(b);
      });
      const m = UI.modal({ title: 'Chọn độ khó', icon: '⚔️', body: box, dismiss: true, buttons: [{ label: 'Quay lại', cls: 'gray' }] });
    };
    const startNew = (k) => {
      Sound.init(); G = newGame(k); Save.root.game = G; Save.root.records.plays++; Save.save();
      UI.go(Save.root.introSeen ? 'dayintro' : 'story');
    };
    const howTo = () => Guide.open();
    const records = () => {
      const r = Save.root.records;
      UI.modal({ title: 'Thành tích', icon: '🏆', dismiss: true, body: `<div class="howto"><p>🏅 Số ván thắng: <b>${r.wins}</b></p><p>🎮 Số ván đã chơi: <b>${r.plays}</b></p><p>💰 Quỹ cao nhất: <b>${fmt(r.best)}</b></p><p>🎎 Lượt chơi trò dân gian: <b>${r.minigames}</b></p></div>` });
    };
    build();
    Sound.ambient('night');
    const first = () => { Sound.init(); Sound.playMusic(); root.removeEventListener('pointerdown', first); };
    root.addEventListener('pointerdown', first);
    if (Sound.ctx) Sound.playMusic();
    return () => { Loop.remove(tick); };
  },
});

/* ===== Cốt truyện mở đầu ===== */
UI.register('story', {
  async enter(root) {
    Sound.ambient('night'); if (Sound.ctx) Sound.playMusic();
    await runDialogue(root, DATA.STORY);
    Save.root.introSeen = true; Save.save();
    UI.go('dayintro');
  },
});

/* ===== Mở đầu mỗi ngày ===== */
UI.register('dayintro', {
  enter(root) {
    if (!G.today || G.phase !== 'dayintro') {
      G.phase = 'dayintro'; rollDay();
      G.topup = Math.max(0, DATA.SEED - G.cash);
      G.cash = Math.max(G.cash, DATA.SEED) + (G.bonus || 0); G.bonus = 0;
      G.today = { start: G.cash, rev: 0, cost: 0, fee: 0, served: 0, lost: 0, sold: {}, learn: 0, upg: 0 };
      G.rep = clamp(G.rep, 5, 100);
      Save.save();
    }
    const wt = Calc.weather(), ev = Calc.event();
    const left = DATA.MAX_DAYS - G.day + 1;
    root.innerHTML = `
      <canvas class="pix scene-full dim"></canvas>
      <div class="dayintro">
        <div class="di-day"><span>Ngày</span> <b>${G.day}</b></div>
        <div class="di-sub">Còn ${left} ngày trả nợ</div>
        <div class="di-debt">Nợ còn: ${fmt(Calc.remaining())}</div>
        <div class="di-cards">
          <div class="di-card"><span>${wt.icon}</span><b>${wt.name}</b></div>
          <div class="di-card"><span>💰</span><b>Vốn hôm nay ${fmt(G.cash)}</b><small>${G.topup ? 'Ông Bảy bù thêm ' + fmt(G.topup) + ' cho đủ vốn.' : 'Số tiền trên ' + fmt(DATA.SEED) + ' là lãi tích lũy trả nợ.'}</small></div>
          ${ev ? `<div class="di-card ev"><span>${ev.icon}</span><b>${ev.title}</b><small>${ev.text}</small></div>` : ''}
        </div>
        <div class="di-tip">💡 ${DATA.TIPS[(G.day - 1 + (G.diff.length)) % DATA.TIPS.length]}</div>
        <button class="btn red big di-go">Vào bếp ➜</button>
      </div>`;
    const cv = $('canvas', root); const sc = Scenes.title(cv); const tick = Loop.add((dt) => sc.update(dt));
    Sound.ambient(wt.id === 'rain' ? 'rain' : 'night'); if (Sound.ctx) Sound.playMusic();
    Sound.sfx('bell');
    $('.di-go', root).onclick = () => { G.phase = 'kitchen'; Save.save(); UI.go('kitchen'); };
    // hiệu ứng xuất hiện lần lượt
    $$('.di-card', root).forEach((c, i) => { c.style.animationDelay = 0.5 + i * 0.35 + 's'; });
    return () => Loop.remove(tick);
  },
});

/* ===== Kết thúc ===== */
UI.register('ending', {
  async enter(root, p) {
    const win = p.win;
    await runDialogue(root, win ? DATA.ENDINGS.win : DATA.ENDINGS.lose);
    root.innerHTML = `
      <canvas class="pix scene-full ${win ? '' : 'dim'}"></canvas>
      <div class="dayintro end">
        <div class="end-title ${win ? 'win' : 'lose'}">${win ? '🎉 GIỮ ĐƯỢC TIỆM!' : '💔 THẤT BẠI'}</div>
        <div class="di-sub">${win ? 'Ông Bảy đã trả hết nợ cho Sáu Cáo' : 'Chưa đủ tiền trả nợ trong 7 ngày'}</div>
        <div class="di-cards">
          <div class="di-card"><span>💰</span><b>Quỹ trả nợ ${fmt(G.savings)}</b><small>Nợ ${fmt(G.debt)}</small></div>
          <div class="di-card"><span>🧺</span><b>${G.stats.served} khách đã phục vụ</b></div>
          <div class="di-card"><span>⭐</span><b>Uy tín ${Calc.stars()}/5 sao</b></div>
        </div>
        <button class="btn red big end-again">Chơi lại</button>
        <button class="btn gray end-home">Về trang chủ</button>
      </div>`;
    const cv = $('canvas', root); const sc = Scenes.title(cv); Loop.add((dt) => sc.update(dt));
    if (win) { Sound.sfx('level'); [0, 400, 900].forEach((d) => setTimeout(() => UI.burst(240 + (Math.random() - 0.5) * 200, 280, 'confetti', 30), d)); } else Sound.sfx('fail');
    $('.end-again', root).onclick = () => { Save.root.game = null; G = null; Save.save(); UI.go('title'); };
    $('.end-home', root).onclick = () => { Save.root.game = null; G = null; Save.save(); UI.go('title'); };
  },
});
