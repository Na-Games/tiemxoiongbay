/* Thiết bị: luôn chơi toàn màn hình (ẩn thanh địa chỉ), giữ màn hình sáng */
const Device = {
  userExited: false, lock: null,

  canFull() { const d = document.documentElement; return !!(d.requestFullscreen || d.webkitRequestFullscreen); },
  standalone() {
    return window.matchMedia('(display-mode: fullscreen)').matches || window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  },
  isFull() { return !!(document.fullscreenElement || document.webkitFullscreenElement) || this.standalone(); },

  async enter() {
    const d = document.documentElement;
    try {
      this.userExited = false;
      if (d.requestFullscreen) await d.requestFullscreen({ navigationUI: 'hide' });
      else if (d.webkitRequestFullscreen) d.webkitRequestFullscreen();
      try { if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('portrait'); } catch (e) { /* không khóa được hướng màn hình */ }
    } catch (e) { /* trình duyệt từ chối */ }
  },
  async syncWake() {
    try {
      if (navigator.wakeLock && !document.hidden) { if (!this.lock) { this.lock = await navigator.wakeLock.request('screen'); this.lock.addEventListener('release', () => { this.lock = null; }); } }
      else if (this.lock) { await this.lock.release(); this.lock = null; }
    } catch (e) { this.lock = null; }
  },

  /* Màn "Chạm để bắt đầu": cú chạm đầu tiên vừa vào toàn màn hình vừa mở khóa âm thanh */
  gate() {
    if (this.isFull() || this.gated) return;
    this.gated = true;
    const ios = !this.canFull();
    const g = el('div', 'fs-gate', '<div class="fg-logo">🍚</div><b>TIỆM XÔI ÔNG BẢY</b><div class="fg-btn">' + (ios ? 'Chạm để bắt đầu' : 'Chạm để chơi toàn màn hình') + '</div>' + (ios ? '<small>iPhone/iPad: bấm Chia sẻ ➜ "Thêm vào MH chính" để ẩn thanh địa chỉ</small>' : '<small>Game chạy toàn màn hình, không có thanh địa chỉ</small>'));
    UI.app.appendChild(g);
    g.addEventListener('pointerup', async () => { Sound.init(); if (!ios) await this.enter(); Sound.playMusic(); g.classList.add('out'); setTimeout(() => g.remove(), 350); }, { once: true });
  },
  init() {
    // chạm lần đầu (cử chỉ người dùng) mới được phép vào toàn màn hình
    document.addEventListener('pointerup', () => {
      if (this.canFull() && !this.isFull() && !this.userExited) this.enter();
    }, true);
    const onChange = () => {
      const full = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (!full && !this._leaving) this.userExited = true; // người dùng tự thoát bằng nút hệ thống
      document.documentElement.classList.toggle('is-full', full);
      UI.resizeFx();
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    document.addEventListener('visibilitychange', () => this.syncWake());
    this.syncWake();
  },
};
