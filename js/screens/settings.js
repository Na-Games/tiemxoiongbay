/* Màu xem trước của từng chủ đề giao diện: [thanh trên, nút chính, khung giấy, nền] */
const THEME_SW = {
  night: ['#2a1820', '#c8452e', '#f1e2b8', '#0e0a1c'], dusk: ['#4a1c3a', '#e0506a', '#f8e0c8', '#2a0e26'], tet: ['#6a1018', '#e0281c', '#fff0c8', '#2a0608'],
  jade: ['#0e4a40', '#2a9a74', '#e8f4d8', '#061c18'], sakura: ['#5a1a46', '#ec5a92', '#ffeaf1', '#2a0c20'], ocean: ['#0e3a66', '#2a82c8', '#e2f2fa', '#06182c'],
  coffee: ['#3a2014', '#a85a2c', '#f2e2c8', '#1c0e08'], sun: ['#6a4210', '#f0782a', '#fff6d0', '#2a1a06'], violet: ['#301c5a', '#7e56d0', '#efe8fc', '#120a2e'],
};
/* Cài đặt: âm thanh (nhiều chủ đề), rung, hiệu ứng, giao diện, dữ liệu */
const Settings = {
  toggleMute() {
    const s = S();
    if (s.music + s.sfx > 0) { s._m = { music: s.music, sfx: s.sfx }; s.music = 0; s.sfx = 0; }
    else { const m = s._m || { music: 0.55, sfx: 0.8 }; s.music = m.music; s.sfx = m.sfx; }
    Sound.applyVolumes(); Save.save();
  },
  open(onClose) {
    const body = el('div', 'settings');
    const tabs = [['sound', '🔊 Âm thanh'], ['fx', '✨ Hiệu ứng'], ['ui', '🎨 Giao diện'], ['game', '🎮 Trò chơi'], ['data', '💾 Dữ liệu']];
    const bar = el('div', 'set-tabs'); const pane = el('div', 'set-pane');
    body.appendChild(bar); body.appendChild(pane);
    let cur = 'sound';
    const save = () => { Save.save(); Sound.applyVolumes(); UI.applySettings(); };

    const row = (label, ctl, hint) => { const r = el('div', 'set-row'); r.appendChild(el('div', 'set-label', label + (hint ? '<small>' + hint + '</small>' : ''))); r.appendChild(ctl); pane.appendChild(r); return r; };
    const slider = (label, key, cb) => {
      const w = el('div', 'slider'); const inp = el('input'); inp.type = 'range'; inp.min = 0; inp.max = 100; inp.value = Math.round(S()[key] * 100);
      const v = el('span', 'sv', inp.value + '%'); w.appendChild(inp); w.appendChild(v);
      inp.oninput = () => { S()[key] = inp.value / 100; v.textContent = inp.value + '%'; save(); if (cb) cb(); };
      row(label, w);
    };
    const toggle = (label, key, hint, cb) => {
      const b = el('button', 'switch' + (S()[key] ? ' on' : ''), '<i></i>');
      b.onclick = () => { S()[key] = !S()[key]; b.classList.toggle('on', S()[key]); save(); Sound.sfx('click'); if (cb) cb(); };
      row(label, b, hint);
    };
    const choice = (label, key, opts, cb, hint) => {
      const w = el('div', 'seg');
      opts.forEach(([v, t]) => {
        const b = el('button', 'segb' + (S()[key] === v ? ' on' : ''), t);
        b.onclick = () => { S()[key] = v; $$('.segb', w).forEach((x) => x.classList.remove('on')); b.classList.add('on'); save(); if (cb) cb(v); };
        w.appendChild(b);
      });
      row(label, w, hint);
    };
    const head = (t) => pane.appendChild(el('h3', 'set-head', t));
    const grid = (items, key, cb) => {
      const g = el('div', 'theme-grid');
      items.forEach(([k, n, i]) => {
        const b = el('button', 'tg' + (S()[key] === k ? ' on' : ''), '<span class="ti">' + i + '</span><b>' + n + '</b>');
        b.onclick = () => { S()[key] = k; $$('.tg', g).forEach((x) => x.classList.remove('on')); b.classList.add('on'); save(); if (cb) cb(k); };
        g.appendChild(b);
      });
      pane.appendChild(g);
    };
    const range = (label, key, min, max) => {
      const w = el('div', 'slider'); const inp = el('input'); inp.type = 'range'; inp.min = min; inp.max = max; inp.value = Math.round(S()[key] * 100);
      const v = el('span', 'sv', inp.value + '%'); w.appendChild(inp); w.appendChild(v);
      inp.oninput = () => { S()[key] = inp.value / 100; v.textContent = inp.value + '%'; save(); };
      row(label, w);
    };

    const render = () => {
      pane.innerHTML = '';
      $$('.set-tab', bar).forEach((b) => b.classList.toggle('on', b.dataset.k === cur));
      if (cur === 'sound') {
        head('Âm lượng');
        slider('Nhạc nền', 'music', () => { if (!Sound.timer && S().music > 0) Sound.playMusic(); });
        slider('Hiệu ứng âm thanh', 'sfx', () => Sound.sfx('coin'));
        toggle('Âm thanh môi trường', 'ambient', 'Dế đêm, mưa, tiếng chợ', () => Sound.ambient(Sound.ambKind));
        head('Chủ đề nhạc nền');
        const grid = el('div', 'theme-grid');
        const mk = (k, name, icon) => {
          const b = el('button', 'tg' + (S().musicTheme === k ? ' on' : ''), '<span class="ti">' + icon + '</span><b>' + name + '</b>');
          b.onclick = () => { S().musicTheme = k; $$('.tg', grid).forEach((x) => x.classList.remove('on')); b.classList.add('on'); save(); Sound.init(); Sound.playMusic(k); };
          grid.appendChild(b);
        };
        Object.entries(Sound.THEMES).forEach(([k, t]) => mk(k, t.name, t.icon)); mk('off', 'Tắt nhạc', '🔇');
        pane.appendChild(grid);
        head('Chủ đề hiệu ứng âm thanh');
        const g2 = el('div', 'theme-grid');
        Object.entries(Sound.SFX_THEMES).forEach(([k, n]) => {
          const b = el('button', 'tg' + (S().sfxTheme === k ? ' on' : ''), '<span class="ti">' + ({ classic: '🎋', chip: '👾', soft: '🫧' })[k] + '</span><b>' + n + '</b>');
          b.onclick = () => { S().sfxTheme = k; $$('.tg', g2).forEach((x) => x.classList.remove('on')); b.classList.add('on'); save(); Sound.init(); Sound.sfx('coins'); };
          g2.appendChild(b);
        });
        pane.appendChild(g2);
      } else if (cur === 'fx') {
        head('Rung');
        choice('Mức rung', 'vibrate', [[0, 'Tắt'], [1, 'Nhẹ'], [2, 'Vừa'], [3, 'Mạnh']], () => Sound.vibrate([60, 40, 60]), navigator.vibrate ? 'Rung khi bán hàng, đồ xôi, chơi trò chơi, bấm sai...' : 'Thiết bị không có động cơ rung: game sẽ lắc khung hình thay thế');
        toggle('Rung khi bấm nút', 'hapticTap', 'Rung rất nhẹ mỗi lần chạm');
        const tryBtn = el('button', 'btn gold small', '📳 Thử rung'); tryBtn.onclick = () => { Sound.vibrate([80, 40, 80, 40, 140]); UI.shake(tryBtn); };
        const tw = el('div', 'btn-col'); tw.appendChild(tryBtn); pane.appendChild(tw);
        toggle('Rung lắc màn hình', 'shake', 'Lắc cảnh khi có sự cố');
        head('Hiệu ứng hình ảnh');
        choice('Hạt tia, xu bay', 'particles', [[0, 'Tắt'], [1, 'Ít'], [2, 'Đủ']], () => UI.burst(240, 300, 'confetti', 20));
        toggle('Chữ tiền bay lên', 'floatText');
        toggle('Gợn sóng khi chạm', 'ripple', 'Vòng sáng lan ra tại điểm chạm');
        toggle('Thời tiết (mưa, nắng)', 'weatherFx');
        toggle('Hiệu ứng chuyển cảnh', 'transitions');
        toggle('Viền tối điện ảnh', 'vignette');
        toggle('Kẻ ô CRT cổ điển', 'scanlines');
        head('Hiệu ứng nền');
        grid([['off', 'Tắt', '🚫'], ['firefly', 'Đom đóm', '✨'], ['petal', 'Cánh hoa', '🌸'], ['sparkle', 'Bụi vàng', '🌟'], ['lantern', 'Đèn lồng', '🏮']], 'ambientFx', () => { if (S().ambientFx !== 'off') UI.toast('Đã bật hiệu ứng nền', 'ok'); });
      } else if (cur === 'ui') {
        head('Giao diện màu');
        grid([['night', 'Đêm làng', '🌌'], ['dusk', 'Hoàng hôn', '🌇'], ['tet', 'Tết đỏ', '🧧'], ['jade', 'Ngọc bích', '🍃'], ['sakura', 'Hoa đào', '🌸'], ['ocean', 'Biển xanh', '🌊'], ['coffee', 'Cà phê sữa', '☕'], ['sun', 'Nắng sớm', '🌅'], ['violet', 'Tím mộng', '🔮']], 'uiTheme', () => UI.toast('Đã đổi giao diện màu', 'ok'));
        $$('.theme-grid .tg', pane).forEach((b, i) => { const k = ['night', 'dusk', 'tet', 'jade', 'sakura', 'ocean', 'coffee', 'sun', 'violet'][i]; b.appendChild(el('span', 'sw', THEME_SW[k].map((c) => '<i style="background:' + c + '"></i>').join(''))); });
        head('Kiểu hiển thị');
        choice('Kiểu nút & khung', 'btnStyle', [['pixel', 'Vuông pixel'], ['round', 'Bo tròn']]);
        choice('Cỡ chữ', 'fontScale', [[0.9, 'Nhỏ'], [1, 'Vừa'], [1.12, 'Lớn']]);
        range('Độ sáng', 'brightness', 70, 125);
        toggle('Nút bấm lớn', 'bigButtons', 'Dễ bấm hơn trên điện thoại');
        toggle('Tiền rút gọn (k, tr)', 'moneyShort', null, () => UI.updateHud());
        toggle('Giữ màn hình luôn sáng', 'keepAwake', navigator.wakeLock ? 'Không tự tắt màn hình khi đang chơi' : 'Trình duyệt này chưa hỗ trợ');
      } else if (cur === 'game') {
        head('Lối chơi');
        choice('Tốc độ thoại', 'textSpeed', [[0, 'Chậm'], [1, 'Vừa'], [2, 'Nhanh'], [3, 'Tức thì']]);
        toggle('Hỏi trước khi dọn hàng', 'confirmEnd');
        toggle('Hiện gợi ý trong game', 'hints');
        if (G) {
          head('Ván đang chơi');
          const info = el('div', 'set-info', 'Độ khó: <b>' + DATA.DIFF[G.diff].name + '</b> · Chương ' + (G.chapter || 1) + ' · Ngày ' + G.day + '/' + Calc.maxDays() + ' · Đã dành: ' + fmt(G.savings) + '/' + fmt(G.debt));
          pane.appendChild(info);
        }
      } else if (cur === 'data') {
        head('Dữ liệu');
        const info = el('div', 'set-info', 'Game tự lưu mỗi khi qua màn. Dữ liệu nằm trong trình duyệt của bạn.');
        pane.appendChild(info);
        const b1 = el('button', 'btn gold', '📤 Xuất mã lưu');
        b1.onclick = () => { const code = btoa(unescape(encodeURIComponent(JSON.stringify(Save.root)))); const ta = el('textarea', 'code'); ta.value = code; ta.readOnly = true; UI.modal({ title: 'Mã lưu', body: ta, buttons: [{ label: 'Đóng', cls: 'gray' }] }); ta.select(); try { navigator.clipboard && navigator.clipboard.writeText(code); UI.toast('Đã sao chép mã lưu', 'ok'); } catch (e) { /* */ } };
        const b2 = el('button', 'btn green', '📥 Nhập mã lưu');
        b2.onclick = () => {
          const ta = el('textarea', 'code'); ta.placeholder = 'Dán mã lưu vào đây';
          UI.modal({ title: 'Nhập mã lưu', body: ta, buttons: [{ label: 'Hủy', cls: 'gray' }, { label: 'Nhập', cls: 'red', onClick: () => { try { const o = JSON.parse(decodeURIComponent(escape(atob(ta.value.trim())))); Save.root = o; Save.save(); location.reload(); } catch (e) { UI.toast('Mã lưu không hợp lệ', 'err'); return false; } } }] });
        };
        const b3 = el('button', 'btn red', '🗑️ Xóa toàn bộ dữ liệu');
        b3.onclick = async () => { if (await UI.confirm('⚠️ Xóa toàn bộ tiến trình, chương, nhân viên và cài đặt? Không thể hoàn tác!', 'Xóa hết', 'Giữ lại')) { G = null; Save.wipe(); Save.root = null; location.reload(); } };
        const w = el('div', 'btn-col'); [b1, b2, b3].forEach((b) => w.appendChild(b)); pane.appendChild(w);
        const rec = Save.root.records;
        pane.appendChild(el('div', 'set-info', 'Thành tích: thắng <b>' + rec.wins + '</b> ván · chơi <b>' + rec.plays + '</b> ván · trò dân gian <b>' + rec.minigames + '</b> lượt'));
      }
    };
    tabs.forEach(([k, t]) => { const b = el('button', 'set-tab', t); b.dataset.k = k; b.onclick = () => { cur = k; render(); }; bar.appendChild(b); });
    render();
    UI.modal({ title: 'Cài đặt', icon: '⚙️', body, cls: 'big', buttons: [{ label: 'Xong', cls: 'red', onClick: () => { Save.save(); } }], onClose: () => onClose && onClose() });
  },
};
