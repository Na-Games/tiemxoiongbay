/* Âm thanh tổng hợp bằng WebAudio: nhạc nền nhiều chủ đề, hiệu ứng nhiều phong cách, rung */
const Sound = {
  ctx: null, master: null, musicG: null, sfxG: null, ambG: null,
  theme: null, timer: null, step: 0, nextT: 0, tempoMul: 1, ambNodes: null, ambKind: null,

  THEMES: {
    village: { name: 'Làng quê', icon: '🌾', bpm: 76, wave: 'triangle', vol: 0.5, scale: [0, 2, 4, 7, 9], root: 57,
      melody: [0, 2, 4, 2, 3, 2, 1, -1, 0, 1, 2, 4, 3, 2, 1, 0, 2, 3, 4, 2, 3, 1, 2, -1, 4, 3, 2, 1, 0, -1, 0, -1], bass: [0, -3, 2, -2] },
    market: { name: 'Chợ phiên', icon: '🏮', bpm: 118, wave: 'square', vol: 0.22, scale: [0, 2, 4, 7, 9], root: 60,
      melody: [4, -1, 4, 3, 2, -1, 3, 2, 1, 2, 3, -1, 4, 3, 2, 1, 4, 4, 3, 2, 3, -1, 2, 1, 0, 1, 2, 3, 4, -1, 2, -1], bass: [0, 0, 2, 2] },
    chip: { name: '8-bit', icon: '👾', bpm: 138, wave: 'square', vol: 0.2, scale: [0, 2, 3, 5, 7, 8, 10], root: 64,
      melody: [0, 2, 4, 6, 4, 2, 0, -1, 3, 5, 7, 5, 3, 1, 3, -1, 4, 6, 8, 6, 4, 2, 0, 2, 4, 2, 0, -1, 0, -1, -2, -1], bass: [0, 3, 4, 3] },
    lofi: { name: 'Đêm lo-fi', icon: '🌙', bpm: 66, wave: 'sine', vol: 0.55, scale: [0, 3, 5, 7, 10], root: 55, soft: true,
      melody: [4, -1, -1, 2, 3, -1, 1, -1, 2, -1, 0, -1, 1, -1, -1, 3, 4, -1, 3, -1, 2, -1, 1, 0, -1, -1, 2, -1, 0, -1, -1, -1], bass: [0, -2, -4, -3] },
    tet: { name: 'Xuân về', icon: '🌸', bpm: 104, wave: 'triangle', vol: 0.5, scale: [0, 2, 4, 7, 9], root: 62,
      melody: [4, 4, 3, 4, 2, -1, 2, 3, 4, 5, 4, 3, 2, -1, 0, -1, 2, 3, 4, 3, 2, 0, 1, 2, 4, 3, 2, 1, 0, -1, 0, -1], bass: [0, 2, -1, 0] },
  },
  SFX_THEMES: { classic: 'Cổ điển (tre, gỗ)', chip: '8-bit điện tử', soft: 'Êm dịu hiện đại' },

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain(); this.master.gain.value = 0.9; this.master.connect(this.ctx.destination);
    this.musicG = this.ctx.createGain(); this.musicG.connect(this.master);
    this.sfxG = this.ctx.createGain(); this.sfxG.connect(this.master);
    this.ambG = this.ctx.createGain(); this.ambG.connect(this.master);
    this.applyVolumes();
  },
  applyVolumes() {
    if (!this.ctx) return;
    this.musicG.gain.value = S().music * 0.5;
    this.sfxG.gain.value = S().sfx;
    this.ambG.gain.value = S().ambient ? S().sfx * 0.4 : 0;
  },
  midi(n) { return 440 * Math.pow(2, (n - 69) / 12); },

  tone(freq, dur, type = 'sine', vol = 0.3, o = {}) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + (o.delay || 0);
    const osc = this.ctx.createOscillator(), g = this.ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, t0);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + (o.attack || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(o.dest || this.sfxG);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  },
  noise(dur, freq = 2000, vol = 0.2, o = {}) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + (o.delay || 0);
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.value = freq; f.Q.value = o.q || 1;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(o.dest || this.sfxG); src.start(t0);
  },

  /* Hiệu ứng theo chủ đề */
  HAPTIC: { buy: 12, coin: 18, coins: [18, 30, 18], error: [45, 35, 45], hit: 55, smash: [40, 20, 70], level: [20, 40, 30], success: [20, 40, 30], fail: [90, 50, 90], star: 20, bell: 30, door: 35, pop: 8 },
  sfx(name) {
    if (this.HAPTIC[name]) this.vibrate(this.HAPTIC[name], true); // rung theo hiệu ứng, kể cả khi tắt tiếng
    if (!this.ctx || S().sfx <= 0) return;
    const th = S().sfxTheme;
    const wave = th === 'chip' ? 'square' : th === 'soft' ? 'sine' : 'triangle';
    const k = th === 'classic' ? 1 : th === 'chip' ? 1.5 : 0.8; // độ sáng
    const T = (f, d, v = 0.25, o) => this.tone(f, d, wave, v, o);
    switch (name) {
      case 'click': th === 'classic' ? (this.tone(520, 0.05, 'triangle', 0.25), this.noise(0.03, 3000, 0.1)) : T(660, 0.05, 0.18); break;
      case 'tap': T(420 * k, 0.04, 0.15); break;
      case 'buy': T(520, 0.07, 0.22); T(780, 0.09, 0.22, { delay: 0.06 }); break;
      case 'coin': T(988, 0.07, 0.25); T(1319, 0.18, 0.25, { delay: 0.07 }); break;
      case 'coins': [0, 0.07, 0.14, 0.21].forEach((d, i) => T(900 + i * 160, 0.1, 0.2, { delay: d })); break;
      case 'error': this.tone(140, 0.2, th === 'soft' ? 'sine' : 'sawtooth', 0.2, { slide: 90 }); break;
      case 'pop': T(300, 0.08, 0.22, { slide: 700 }); break;
      case 'whoosh': this.noise(0.35, 900, 0.18, { type: 'bandpass', q: 0.6 }); break;
      case 'bell': this.tone(880, 0.7, 'sine', 0.22); this.tone(1320, 0.5, 'sine', 0.12); this.tone(1760, 0.3, 'sine', 0.06); break;
      case 'steam': this.noise(0.9, 4500, 0.1, { type: 'highpass' }); break;
      case 'fire': this.noise(0.12, 600 + Math.random() * 500, 0.14, { type: 'lowpass' }); break;
      case 'leaf': this.noise(0.1, 5000, 0.12, { type: 'highpass' }); T(700, 0.05, 0.1); break;
      case 'success': [523, 659, 784, 1047].forEach((f, i) => T(f, 0.16, 0.22, { delay: i * 0.1 })); break;
      case 'fail': [392, 330, 262, 196].forEach((f, i) => T(f, 0.22, 0.2, { delay: i * 0.14 })); break;
      case 'hit': this.noise(0.12, 300, 0.4, { type: 'lowpass' }); T(160, 0.15, 0.3, { slide: 70 }); break;
      case 'smash': this.noise(0.4, 2500, 0.35, { type: 'highpass' }); T(260, 0.2, 0.3, { slide: 90 }); break;
      case 'tick': T(1000, 0.03, 0.12); break;
      case 'star': T(1047, 0.12, 0.2); T(1568, 0.22, 0.2, { delay: 0.09 }); break;
      case 'door': this.noise(0.18, 400, 0.3, { type: 'lowpass' }); T(110, 0.15, 0.25, { slide: 80 }); break;
      case 'meow': this.tone(520, 0.25, 'sine', 0.18, { slide: 760 }); this.tone(760, 0.2, 'sine', 0.15, { slide: 480, delay: 0.2 }); break;
      case 'cluck': [0, 0.07, 0.14].forEach((d) => this.tone(560 + Math.random() * 100, 0.05, 'square', 0.1, { delay: d })); break;
      case 'talk': this.tone(180 + Math.random() * 120, 0.04, 'square', 0.06); break;
      case 'level': [392, 523, 659, 784, 1047].forEach((f, i) => T(f, 0.18, 0.22, { delay: i * 0.08 })); break;
      default: T(500, 0.05, 0.15);
    }
  },
  /* soft = rung phụ (bấm nút, hiệu ứng nhỏ): thiết bị không rung được thì bỏ qua thay vì lắc màn hình */
  vibrate(ms, soft) {
    const lv = S().vibrate; if (!lv) return;
    const m = [0, 0.6, 1, 1.8][lv];
    const pat = Array.isArray(ms) ? ms.map((x) => Math.round(x * m)) : Math.round(ms * m);
    let ok = false;
    if (navigator.vibrate) { try { ok = navigator.vibrate(pat); } catch (e) { ok = false; } }
    if (!ok && !soft) UI.buzz(lv);
  },

  /* Nhạc nền: bộ lập lịch đơn giản */
  playMusic(theme) {
    theme = theme || S().musicTheme;
    if (theme === 'off' || !this.ctx) { this.stopMusic(); this.theme = theme; return; }
    if (this.theme === theme && this.timer) return;
    this.stopMusic(); this.theme = theme; this.step = 0; this.nextT = this.ctx.currentTime + 0.1;
    this.timer = setInterval(() => this.schedule(), 40);
  },
  stopMusic() { if (this.timer) clearInterval(this.timer); this.timer = null; },
  schedule() {
    const th = this.THEMES[this.theme]; if (!th || !this.ctx) return;
    const beat = 60 / (th.bpm * this.tempoMul) / 2; // nốt móc đơn
    while (this.nextT < this.ctx.currentTime + 0.25) {
      const i = this.step % th.melody.length, deg = th.melody[i];
      const note = (d) => { const sc = th.scale, oct = Math.floor(d / sc.length); return th.root + sc[((d % sc.length) + sc.length) % sc.length] + 12 * oct; };
      if (deg !== -1 && deg !== -2) {
        const f = this.midi(note(deg) + 12);
        const dur = th.soft ? beat * 3 : beat * 1.6;
        this.tone(f, dur, th.wave, th.vol * 0.5, { delay: this.nextT - this.ctx.currentTime, dest: this.musicG, attack: th.soft ? 0.05 : 0.01 });
      }
      if (this.step % 4 === 0) {
        const b = th.bass[(this.step / 4 | 0) % th.bass.length];
        this.tone(this.midi(note(b) - 12), beat * 3.6, th.soft ? 'sine' : 'triangle', th.vol * 0.7, { delay: this.nextT - this.ctx.currentTime, dest: this.musicG, attack: 0.02 });
        if (th.soft) this.tone(this.midi(note(b + 2)), beat * 3.8, 'sine', th.vol * 0.3, { delay: this.nextT - this.ctx.currentTime, dest: this.musicG, attack: 0.1 });
      }
      if (!th.soft && this.step % 2 === 1 && this.theme !== 'village') this.noise(0.03, 7000, 0.04, { delay: this.nextT - this.ctx.currentTime, dest: this.musicG, type: 'highpass' });
      this.nextT += beat; this.step++;
    }
  },
  setTempo(m) { this.tempoMul = m; },

  /* Âm thanh môi trường: dế đêm, mưa, chợ */
  ambient(kind) {
    if (!this.ctx) return;
    if (this.ambKind === kind) return;
    this.ambKind = kind;
    if (this.ambTimer) clearInterval(this.ambTimer);
    if (!kind) return;
    this.ambTimer = setInterval(() => {
      if (!S().ambient || !this.ctx) return;
      if (kind === 'night') { if (chance(0.7)) [0, 0.09, 0.18].forEach((d) => this.tone(4200 + Math.random() * 200, 0.05, 'sine', 0.025, { delay: d, dest: this.ambG })); }
      else if (kind === 'rain') this.noise(0.5, 6000, 0.06, { type: 'highpass', dest: this.ambG });
      else if (kind === 'market') { if (chance(0.5)) this.noise(0.4, 500 + Math.random() * 600, 0.05, { type: 'bandpass', dest: this.ambG, q: 3 }); }
    }, 400);
  },
};
