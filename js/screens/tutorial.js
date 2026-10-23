/* Hướng dẫn từng bước cho người chơi lần đầu: làm tối màn hình, sáng đúng phần cần chạm */
const Tutor = {
  STEPS: {
    kitchen: [
      { sel: '.k-scene', pos: 'bottom', t: 'Chào mừng đến tiệm xôi Ông Bảy! 👋', d: 'Bạn có <b>số ngày của chương</b> để kiếm đủ tiền trả nợ. Mỗi ngày làm theo 3 việc: <b>nấu xôi ➜ đặt giá ➜ ra chợ bán</b>. Mình hướng dẫn nhanh nhé!' },
      { sel: '.ing-grid', pos: 'bottom', t: '1. Mua nguyên liệu 🛒', d: '<b>Chạm</b> vào ô nguyên liệu để mua 1 phần, <b>giữ</b> để mua 5. Mũi tên <b>▼ xanh</b> là giá rẻ, nên mua nhiều.' },
      { sel: '.rec-list', pos: 'top', t: '2. Chọn món để đồ 🍚', d: 'Bấm <b>+</b> để chọn số mẻ cho mỗi món (1 mẻ = 8 phần). Ô nguyên liệu <b>màu đỏ</b> là còn thiếu, game sẽ tự đi chợ mua bù.' },
      { sel: '.cook-btn', pos: 'top', t: '3. Đồ xôi 🔥', d: 'Bấm <b>Đi chợ &amp; Đồ xôi</b>, rồi <b>quạt lửa liên tục</b> để xôi chín nhanh hơn. Xôi chín xong sẽ vào kho.' },
      { sel: '.tabs', pos: 'top', t: '4. Các tab khác ⬆️', d: '<b>Nâng cấp</b> và <b>Nhân viên</b> giúp bán nhanh hơn, <b>Hội làng</b> chơi trò dân gian lấy nguyên liệu miễn phí, <b>Điểm danh</b> nhận quà mỗi ngày.' },
      { sel: '.go-btn', pos: 'top', t: '5. Gánh ra chợ ➜', d: 'Có xôi rồi thì bấm <b>Gánh ra chợ</b> để sang bước đặt giá bán.' },
    ],
    price: [
      { sel: '.board-list', pos: 'bottom', t: 'Đặt giá bán 🏷️', d: 'Bấm <b>+ / −</b> để chỉnh giá từng món. <b>Giá bạn đặt sẽ là số tiền thu được</b> khi bán. Rẻ hơn giá chợ thì khách đông, đắt quá khách sẽ bỏ đi.' },
      { sel: '.go-btn', pos: 'top', t: 'Bày hàng!', d: 'Đặt xong bấm <b>Bày hàng</b> để mở quầy.' },
    ],
    market: [
      { sel: '.m-scene', pos: 'bottom', t: 'Chợ đã mở cửa! 🧺', d: 'Khách ngồi ghế nhựa, bong bóng trên đầu ghi <b>tên món và số phần</b> họ muốn mua. Thanh xanh là độ kiên nhẫn: hết thanh khách sẽ bỏ đi.' },
      { sel: '.m-strip', pos: 'top', t: 'Xem khách cần gì 👀', d: '<b>Chạm vào khách</b> để xem họ muốn mua gì và tổng tiền.' },
      { sel: '.m-tray', pos: 'top', t: 'Bỏ xôi vào túi 🍚', d: '<b>Chạm đúng món</b> khách gọi ở khay này. Chạm mấy lần được mấy phần.' },
      { sel: '.wrap-btn', pos: 'top', t: 'Gói lá 🍃', d: 'Túi đủ món thì bấm <b>Gói lá</b>: xem hoạt cảnh trải lá, xúc xôi, gấp lá, buộc dây. Gói xong sẽ nằm trên quầy.' },
      { sel: '.m-scene', pos: 'bottom', t: 'Chạm khách để giao 🤝', d: 'Muốn giao hàng phải <b>chạm vào đúng khách đang cần món đó</b>. Khách sáng viền là gói của bạn khớp đơn. Giao sai món sẽ mất kiên nhẫn!' },
      { sel: '.reject-btn', pos: 'top', t: 'Từ chối khách 🙏', d: 'Hết món khách gọi thì chọn khách rồi bấm <b>Từ chối</b> để họ khỏi chờ lâu (uy tín chỉ giảm rất ít).' },
    ],
  },

  /* chạy hướng dẫn của một màn hình, chỉ lần đầu */
  run(name, o = {}) {
    const steps = this.STEPS[name];
    if (!steps || Save.root.tut[name] || !S().hints) return Promise.resolve();
    if (o.onStart) o.onStart();
    return new Promise((resolve) => {
      let i = 0;
      const ov = el('div', 'tut'); UI.app.appendChild(ov);
      const hole = el('div', 'tut-hole'); const card = el('div', 'tut-card'); ov.appendChild(hole); ov.appendChild(card);
      const finish = (skipAll) => {
        ov.remove(); Save.root.tut[name] = true; Save.save(); if (o.onEnd) o.onEnd(); resolve();
      };
      const show = () => {
        const st = steps[i], target = st.sel ? $(st.sel, UI.app) : null, a = UI.app.getBoundingClientRect();
        if (target) {
          const r = target.getBoundingClientRect(), pad = 6;
          hole.style.cssText = `left:${r.left - a.left - pad}px;top:${r.top - a.top - pad}px;width:${r.width + pad * 2}px;height:${r.height + pad * 2}px`;
          hole.style.display = '';
        } else hole.style.display = 'none';
        card.innerHTML = `<div class="tut-step">Bước ${i + 1}/${steps.length}</div><b>${st.t}</b><p>${st.d}</p>
          <div class="tut-btns"><button class="btn mini gray tut-skip">Bỏ qua</button><button class="btn gold tut-next">${i === steps.length - 1 ? 'Đã hiểu ✔' : 'Tiếp ▶'}</button></div>`;
        // đặt thẻ phía đối diện vùng sáng để không che
        const mid = target ? target.getBoundingClientRect().top - a.top + target.getBoundingClientRect().height / 2 : a.height / 2;
        card.classList.toggle('up', mid > a.height * 0.5); card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
        $('.tut-next', card).onclick = () => { Sound.sfx('pop'); if (++i >= steps.length) finish(); else show(); };
        $('.tut-skip', card).onclick = () => finish(true);
      };
      setTimeout(show, 450);
    });
  },
  reset() { Save.root.tut = {}; Save.save(); },
};
