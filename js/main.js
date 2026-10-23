/* Khởi động game */
(function boot() {
  Save.load();
  G = Save.root.game;
  if (G) {
    // dữ liệu cũ thiếu trường
    const base = newGame(G.diff || 'normal');
    Object.keys(base).forEach((k) => { if (G[k] === undefined) G[k] = base[k]; });
    // đang ở màn tổng kết khi thoát: sang ngày mới
    if (G.phase === 'summary' && !G.over) { G.day = Math.min(Calc.maxDays(), G.day + 1); G.phase = 'dayintro'; G.today = null; G.mg.tokens = 3; }
    if (G.over) { Save.root.game = null; G = null; }
  }
  UI.init();
  Device.init();
  document.addEventListener('visibilitychange', () => { if (document.hidden) { Sound.stopMusic(); } else if (Sound.ctx) { Sound.playMusic(); } });
  UI.go('title', {}, { instant: true });
  Device.gate();
  // ngăn kéo/zoom ngoài ý muốn trên di động
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('contextmenu', (e) => { if (e.target.closest('#app')) e.preventDefault(); });
  window.addEventListener('beforeunload', () => { try { if (G && Save.root) Save.save(); } catch (e) { /* */ } });
})();
