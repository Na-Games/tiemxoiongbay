/* Thiết bị: toàn màn hình (ẩn thanh địa chỉ), giữ màn hình sáng */
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
  exit() {
    this.userExited = true;
    try { if (document.exitFullscreen) document.exitFullscreen(); else if (document.webkitExitFullscreen) document.webkitExitFullscreen(); } catch (e) { /* */ }
  },
  toggle() {
    if (!this.canFull()) {
      UI.toast(this.standalone() ? 'Game đang chạy toàn màn hình' : 'Trình duyệt này không hỗ trợ. iPhone: bấm Chia sẻ ➜ "Thêm vào MH chính"', 'info');
      return;
    }
    if (this.isFull()) this.exit(); else this.enter();
  },
  /* Mô tả cho phần cài đặt */
  hint() {
    if (this.standalone()) return 'Đang chạy như ứng dụng (không có thanh địa chỉ)';
    if (this.canFull()) return 'Ẩn thanh địa chỉ và thanh công cụ của trình duyệt';
    return 'iPhone/iPad: bấm Chia sẻ ➜ "Thêm vào MH chính" để chơi toàn màn hình';
  },

  async syncWake() {
    try {
      if (S().keepAwake && navigator.wakeLock && !document.hidden) { if (!this.lock) { this.lock = await navigator.wakeLock.request('screen'); this.lock.addEventListener('release', () => { this.lock = null; }); } }
      else if (this.lock) { await this.lock.release(); this.lock = null; }
    } catch (e) { this.lock = null; }
  },

  init() {
    // chạm lần đầu (cử chỉ người dùng) mới được phép vào toàn màn hình
    document.addEventListener('pointerup', () => {
      if (S().autoFull && this.canFull() && !this.isFull() && !this.userExited) this.enter();
    }, true);
    const onChange = () => {
      const full = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (!full && !this._leaving) this.userExited = true; // người dùng tự thoát bằng nút hệ thống
      document.documentElement.classList.toggle('is-full', full);
      if (UI.fsBtns) UI.fsBtns.forEach((b) => { b.textContent = full ? '🗗' : '⛶'; });
      UI.resizeFx();
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    document.addEventListener('visibilitychange', () => this.syncWake());
    this.syncWake();
  },
};
