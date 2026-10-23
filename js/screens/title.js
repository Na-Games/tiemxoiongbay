/* Màn hình trang chủ, cốt truyện, giới thiệu ngày, kết thúc */
UI.register('title', {
  enter(root) {
    root.innerHTML = `
      <canvas class="pix scene-full"></canvas>
      <div class="title-shade"></div>
      <button class="btn mini title-sound" title="Âm thanh">🔊</button>
      <button class="btn mini title-settings" title="Cài đặt">⚙️</button>
      <div class="logo">
        <div class="logo-sub">Ai mua xôi nào?</div>
        <div class="logo-main"><span>XÔI</span> <span>NÓNG</span> <span>ĐÂY!</span></div>
        <div class="logo-ribbon"><i></i><b>TIỆM XÔI ÔNG BẢY</b><i></i></div>
      </div>
      <div class="title-menu"></div>
      <div class="title-bottom"></div>
      <div class="title-foot">Bản quyền Tiệm xôi Ông Bảy · Ver 2026.10.22</div>`;
    const cv = $('canvas', root);
    const sc = Scenes.title(cv);
    const tick = Loop.add((dt) => sc.update(dt));
    const menu = $('.title-menu', root);
    const sound = $('.title-sound', root);
    const refreshSnd = () => { sound.textContent = (S().music + S().sfx) <= 0 ? '🔇' : '🔊'; };
    refreshSnd();
    sound.onclick = () => { Settings.toggleMute(); refreshSnd(); Sound.playMusic(); };
    const build = () => {
      menu.innerHTML = '';
      const has = !!Save.root.game && !Save.root.game.over;
      if (has) {
        const b = el('button', 'btn red big', 'Tiếp tục · Chương ' + (Save.root.game.chapter || 1) + ' · Ngày ' + Save.root.game.day); b.onclick = () => resume(); menu.appendChild(b);
        const n = el('button', 'btn gray', 'Chơi ván mới'); n.onclick = async () => { if (await UI.confirm('Bắt đầu ván mới sẽ xóa tiến trình hiện tại. Chắc chưa?', 'Chơi mới', 'Giữ lại')) pickDiff(); }; menu.appendChild(n);
      } else {
        const b = el('button', 'btn red big', 'Bắt đầu chơi'); b.onclick = () => pickDiff(); menu.appendChild(b);
      }
    };
    $('.title-settings', root).onclick = () => Settings.open();
    const bottom = $('.title-bottom', root);
    [['❓ Hướng dẫn', () => howTo()], ['🏆 Thành tích', () => records()], ['🔄 Chơi lại từ đầu', () => hardReset()]].forEach(([t, f]) => { const b = el('button', 'btn gray tiny', t); b.onclick = f; bottom.appendChild(b); });
    /* Chơi lại từ đầu: xóa toàn bộ dữ liệu (có cảnh báo hai bước) */
    const hardReset = async () => {
      if (!(await UI.confirm('<b>Chơi lại từ đầu</b> sẽ <b>XÓA TOÀN BỘ</b> dữ liệu: ván đang chơi, chương đã mở, nâng cấp, nhân viên, điểm danh, thành tích và cài đặt.<br><br>Hành động này <b>không thể hoàn tác</b>!', 'Tiếp tục', 'Hủy bỏ', '⚠️ Cảnh báo'))) return;
      if (!(await UI.confirm('Bạn thật sự chắc chắn? Mọi thứ sẽ quay về mặc định như lần đầu chơi.', 'Xóa hết & chơi lại', 'Không xóa', '❗ Xác nhận lần cuối'))) return;
      G = null; Save.wipe(); Save.root = null; location.reload();
    };
    const resume = () => {
      Sound.init(); G = Save.root.game;
      if (G.phase === 'dayintro' || !G.today) UI.go('dayintro'); else UI.go('kitchen');
    };
    const pickDiff = () => {
      const box = el('div', 'diff-list');
      Object.entries(DATA.DIFF).forEach(([k, d]) => {
        const b = el('button', 'diff btn ' + (k === 'normal' ? 'gold' : 'gray'), '<b>' + d.name + '</b><small>' + d.desc + ' · Đã mở chương ' + Save.root.chap[k] + '/' + DATA.chCount(k) + '</small>');
        b.onclick = () => { m.close(); Sound.init(); UI.go('chapters', { diff: k }); };
        box.appendChild(b);
      });
      const m = UI.modal({ title: 'Chọn độ khó', icon: '⚔️', body: box, dismiss: true, buttons: [{ label: 'Quay lại', cls: 'gray' }] });
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
  async enter(root, p) {
    Sound.ambient('night'); if (Sound.ctx) Sound.playMusic();
    await runDialogue(root, (p && p.lines) || DATA.STORY);
    if (!(p && p.lines)) Save.root.introSeen = true;
    Save.save();
    UI.go('dayintro');
  },
});

/* ===== Mở đầu mỗi ngày ===== */
UI.register('dayintro', {
  enter(root) {
    if (!G.today || G.phase !== 'dayintro') {
      G.phase = 'dayintro'; rollDay();
      G.topup = Math.max(0, Calc.seed() - G.cash);
      G.cash = Math.max(G.cash, Calc.seed()) + (G.bonus || 0); G.bonus = 0;
      G.today = { start: G.cash, rev: 0, cost: 0, fee: 0, served: 0, lost: 0, sold: {}, learn: 0, upg: 0 };
      G.rep = clamp(G.rep, 5, 100);
      Save.save();
    }
    const wt = Calc.weather(), ev = Calc.event();
    const left = Calc.maxDays() - G.day + 1;
    root.innerHTML = `
      <canvas class="pix scene-full dim"></canvas>
      <div class="dayintro">
        <div class="di-day"><span>Ngày</span> <b>${G.day}</b></div>
        <div class="di-sub">${Calc.chapter().icon} Chương ${G.chapter || 1}: ${Calc.chapter().name} · còn ${left} ngày trả nợ</div>
        <div class="di-debt">Nợ còn: ${fmt(Calc.remaining())}</div>
        <div class="di-cards">
          <div class="di-card"><span>${wt.icon}</span><b>${wt.name}</b></div>
          <div class="di-card"><span>💰</span><b>Vốn hôm nay ${fmt(G.cash)}</b><small>${G.topup ? 'Ông Bảy bù thêm ' + fmt(G.topup) + ' cho đủ vốn.' : 'Số tiền trên ' + fmt(Calc.seed()) + ' là lãi tích lũy trả nợ.'}</small></div>
          ${Calc.scn().name !== 'Ngày thường' ? `<div class="di-card scn"><span>${Calc.scn().icon}</span><b>Kịch bản chương: ${Calc.scn().name}</b><small>${Calc.scn().desc}</small></div>` : ''}
          ${Calc.isShop() ? `<div class="di-card shop"><span>🏪</span><b>Cửa hàng mặt phố</b><small>Có thể mất điện, bị kiểm tra, bị trộm. Đã có: ${[['gen', '🔌 Máy phát điện'], ['lic', '📜 Giấy phép'], ['atp', '🧼 An toàn TP']].map(([k, n]) => (Calc.lvl(k) ? '✅ ' : '❌ ') + n).join(' · ')} · ${Calc.theftBlock() > 0 ? '🛡️ Bảo vệ chặn ' + Math.round(Calc.theftBlock() * 100) + '% trộm' : '⚠️ Chưa có bảo vệ'}</small></div>` : ''}
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
    const win = p.win, ch = G.chapter || 1, more = ch < DATA.chCount(G.diff);
    if (win) { // mở chương kế và giữ lại nâng cấp, nhân viên, công thức
      Save.root.chap[G.diff] = Math.max(Save.root.chap[G.diff], Math.min(DATA.chCount(G.diff), ch + 1));
      Save.root.carry[G.diff] = { upg: Object.assign({}, G.upg), staff: Object.assign({}, G.staff), recipes: Object.assign({}, G.recipes) };
      if (more) Save.root.newChap = { diff: G.diff, n: ch + 1 };
      Save.save();
    }
    const lines = !win ? DATA.ENDINGS.lose : ch === 1 ? DATA.ENDINGS.win : [
      { who: 'saucao', text: 'Đủ cả vốn lẫn lãi, không thiếu một đồng. Ông Bảy làm ăn càng ngày càng khá đấy.' },
      { who: 'ongbay', text: more ? 'Cảm ơn Tí và bà con. Cơ hội mới đã mở ra, mình tiếp tục mở rộng tiệm nhé!' : 'Từ gánh xôi nhỏ thành đế chế xôi Việt, ông không dám mơ tới. Cảm ơn tất cả!' },
      { who: 'ti', text: more ? 'Chương mới đang chờ mình rồi ông ơi!' : 'Đế chế xôi Ông Bảy muôn năm!' },
    ];
    await runDialogue(root, lines);
    const nextCh = DATA.CHAPTERS[ch];
    root.innerHTML = `
      <canvas class="pix scene-full ${win ? '' : 'dim'}"></canvas>
      <div class="dayintro end">
        <div class="end-title ${win ? 'win' : 'lose'}">${win ? (more ? '🎉 HOÀN THÀNH CHƯƠNG ' + ch : '👑 ĐẾ CHẾ XÔI VIỆT!') : '💔 THẤT BẠI'}</div>
        <div class="di-sub">${win ? (more ? 'Mở khóa: ' + nextCh.icon + ' ' + nextCh.name : 'Bạn đã hoàn thành mọi chương') : 'Chưa đủ tiền trả nợ trong ' + Calc.maxDays() + ' ngày'}</div>
        <div class="di-cards">
          <div class="di-card"><span>💰</span><b>Quỹ trả nợ ${fmt(G.savings)}</b><small>Nợ ${fmt(G.debt)}</small></div>
          <div class="di-card"><span>🧺</span><b>${G.stats.served} khách đã phục vụ</b></div>
          <div class="di-card"><span>⭐</span><b>Uy tín ${Calc.stars()}/5 sao</b></div>
        </div>
        ${win && more ? '<button class="btn gold big end-next">Chương tiếp theo ➜</button>' : ''}
        <button class="btn red big end-again">${win ? 'Bản đồ chương' : 'Thử lại chương'}</button>
        <button class="btn gray end-home">Về trang chủ</button>
      </div>`;
    const cv = $('canvas', root); const sc = Scenes.title(cv); Loop.add((dt) => sc.update(dt));
    if (win) { Sound.sfx('level'); [0, 400, 900].forEach((d) => setTimeout(() => UI.burst(240 + (Math.random() - 0.5) * 200, 280, 'confetti', 30), d)); } else Sound.sfx('fail');
    const diff = G.diff;
    const done = () => { Save.root.game = null; G = null; Save.save(); };
    const nx = $('.end-next', root); if (nx) nx.onclick = () => { done(); Campaign.start(diff, ch + 1); };
    $('.end-again', root).onclick = () => { done(); UI.go('chapters', { diff }); };
    $('.end-home', root).onclick = () => { done(); UI.go('title'); };
  },
});
