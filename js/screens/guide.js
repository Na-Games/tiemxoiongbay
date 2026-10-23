/* Hướng dẫn chơi chi tiết, chia theo từng phần */
const Guide = {
  pages() {
    const li = (arr) => '<ul>' + arr.map((t) => '<li>' + t + '</li>').join('') + '</ul>';
    const step = (arr) => '<ol>' + arr.map((t) => '<li>' + t + '</li>').join('') + '</ol>';
    const games = Minigames.list.map((g) => '<div class="gd-game"><b>' + g.icon + ' ' + g.name + '</b> <span class="role">' + g.theme.icon + ' ' + g.theme.name + '</span><p>' + g.desc + '</p><p class="gd-tip">👉 ' + g.tip + '</p><p class="gd-rw">Thưởng: ' + g.rewards.map((i) => DATA.ING_BY[i].icon + ' ' + DATA.ING_BY[i].name).join(', ') + '</p></div>').join('');
    return [
      ['goal', '🎯', 'Mục tiêu', `
        <h4>Câu chuyện</h4>
        <p>Ông Bảy nợ Sáu Cáo <b>${fmtK(DATA.DIFF.easy.debt)} – ${fmtK(DATA.DIFF.hard.debt)}</b> (tùy độ khó) và chỉ có một số ngày nhất định để trả: chương 1 là <b>${DATA.MAX_DAYS} ngày</b>, các chương sau nhiều ngày hơn (tối đa ${DATA.CHAPTERS[DATA.CHAPTERS.length - 1].days} ngày). Bạn là Tí, cháu ông, giúp ông bán xôi thật nhiều.</p>
        <h4>Thắng – thua</h4>
        ${li([
          'Mỗi sáng ông cấp vốn: chương 1 là <b>' + fmt(DATA.SEED) + '</b>, <b>càng lên chương cao vốn càng nhiều</b> (xem ở Các chương). Nếu hôm trước lỗ, ông <b>bù lại cho đủ vốn</b>.',
          '<b>Quỹ trả nợ</b> = số tiền mặt vượt trên vốn của chương. Quỹ đạt đủ số nợ là <b>thắng</b>.',
          'Hết số ngày của chương mà quỹ chưa đủ thì <b>thua</b>.',
          'Tiền dùng để nâng cấp, thuê người, học món cũng lấy từ tiền mặt, nên quỹ trả nợ giảm theo. Hãy cân nhắc!'])}
        <h4>Độ khó</h4>
        ${li(Object.values(DATA.DIFF).map((d) => '<b>' + d.name + ':</b> ' + d.desc))}
        <h4>Thanh trên cùng</h4>
        ${li(['<b>Ngày x/y:</b> bạn đang ở ngày thứ mấy trong số ngày của chương.', '<b>★ Sao:</b> uy tín tiệm (1–5 sao). Uy tín cao thì khách đông.', '<b>Đồng xu:</b> tiền mặt hiện có.', '<b>Nợ Sáu Cáo:</b> số tiền còn phải dành dụm.', '<b>☰:</b> menu tạm nghỉ. <b>🔊:</b> bật/tắt âm.'])}`],
      ['day', '🌅', 'Một ngày chơi', `
        <p>Mỗi ngày gồm 5 bước, lặp lại cho đến khi trả được nợ:</p>
        ${step([
          '<b>Mở đầu ngày:</b> xem thời tiết, sự kiện đặc biệt và vốn trong tay. Bấm <b>Vào bếp</b>.',
          '<b>Bếp:</b> mua nguyên liệu, chọn món, bấm <b>Đi chợ &amp; Đồ xôi</b>.',
          '<b>Bảng giá:</b> bấm <b>Gánh ra chợ</b>, đặt giá bán từng món, rồi <b>Bày hàng</b>.',
          '<b>Bán hàng:</b> phục vụ khách trong khoảng 105 giây (5:00 đến 10:00 sáng).',
          '<b>Tổng kết:</b> xem lãi lỗ, xôi thừa, lương nhân viên và tiến độ trả nợ.'])}
        <h4>Thời tiết &amp; sự kiện</h4>
        ${li(DATA.WEATHER.map((w) => w.icon + ' <b>' + w.name + ':</b> khách ×' + w.cust)) }
        <p>Từ ngày 2, mỗi sáng có thể xuất hiện sự kiện: chợ phiên đông, đám cưới đặt xôi gấc, ngày rằm ăn chay, giá thịt tăng, thanh tra... Đọc kỹ để chuẩn bị món phù hợp.</p>
        <h4>Lưu game</h4>
        <p>Game <b>tự lưu</b> mỗi khi qua màn. Có thể thoát bất cứ lúc nào và bấm <b>Tiếp tục</b> ở trang chủ. Muốn chuyển sang máy khác: Cài đặt ➜ Dữ liệu ➜ Xuất/nhập mã lưu.</p>`],
      ['chapter', '🗺️', 'Các chương', `
        <p>Độ khó Dễ có <b>${DATA.chCount('easy')} chương</b>, Thường <b>${DATA.chCount('normal')} chương</b>, Khó <b>${DATA.chCount('hard')} chương</b>; số ngày trả nợ tăng dần qua từng chương. Trả hết nợ chương trước mới mở chương sau, và <b>nâng cấp, nhân viên, công thức được giữ lại</b> để mở rộng đế chế xôi.</p>
        ${li(DATA.chapters('hard').map((c) => c.icon + ' <b>Chương ' + c.id + ' – ' + c.name + ':</b> ' + c.days + ' ngày, vốn ' + fmtK(c.seed) + '/sáng, nợ ×' + c.debt + ', khách ×' + c.cust + ' · ' + c.scn.icon + ' ' + c.scn.name))}
        <h4>Kịch bản riêng từng chương</h4>
        <p>Mỗi chương có một <b>kịch bản</b> khác nhau: màu cảnh và hiệu ứng nền riêng, thời tiết, giá nguyên liệu, độ đông khách, giá thuê và lương nhân viên thay đổi theo kịch bản (mùa mưa, mùa lễ hội, bão giá, ưu đãi nhân sự...). Càng lên chương cao càng có <b>nhân viên mới</b> được mở khóa (bếp phó, quản lý, shipper, marketing, robot...).</p>
        <h4>Cửa hàng mặt phố (từ Chương 3)</h4>
        ${li(['⚡ <b>Mất điện</b> thỉnh thoảng làm bạn đứng chờ vài giây: mua <b>🔌 Máy phát điện</b>.', '📜 <b>Đoàn kiểm tra</b> phạt nếu thiếu <b>Giấy phép kinh doanh</b>.', '🧼 <b>Thanh tra vệ sinh</b> phạt nếu thiếu <b>An toàn thực phẩm</b>.', '🦹 <b>Kẻ trộm</b> lấy tiền và xôi: thuê <b>🛡️ bảo vệ</b> (Bác Tư, Cô Mai, Vệ sĩ Hổ).', 'Mọi nâng cấp và nhân viên bạn có đều hiện biểu tượng ở góc cảnh bếp và chợ.'])}`],
      ['kitchen', '🍲', 'Bếp & nguyên liệu', `
        <h4>Mua nguyên liệu</h4>
        ${li(['<b>Chạm</b> ô nguyên liệu để mua 1, <b>giữ</b> để mua 5.', 'Giá chợ đổi mỗi ngày. Mũi tên <b>▼ xanh</b> là rẻ (nên mua nhiều), <b>▲ đỏ</b> là đắt.', 'Lá chuối bán theo bó: 1 bó = 16 phần gói.', 'Thịt, trứng, pate, gà là <b>nguyên liệu tươi</b>: qua đêm hỏng một nửa, trừ khi có tủ lạnh hoặc Kế toán Tư.', 'Không cần mua đủ trước: khi đồ xôi, thiếu gì game <b>tự đi chợ mua bù</b> theo giá hôm nay.'])}
        <h4>Chọn món &amp; số mẻ</h4>
        ${li(['Bấm <b>+ / −</b> để chọn số mẻ. <b>1 mẻ = ' + DATA.PORTIONS + ' phần xôi</b>.', 'Số mẻ tối đa mỗi lần đồ phụ thuộc <b>nồi chõ</b> (6 mẻ, nâng cấp được 14 mẻ).', 'Ô nguyên liệu <b>đỏ</b> trong món nghĩa là còn thiếu, sẽ phải mua thêm.', 'Dòng <b>Vốn/phần</b> cho biết giá thành, so với <b>giá chợ</b> để biết lãi bao nhiêu.', 'Món chưa biết thì bấm <b>Học</b> và trả tiền một lần (xem công thức ở các món mở khóa dần).'])}
        <h4>Đồ xôi</h4>
        ${li(['Bấm <b>Quạt lửa</b> liên tục để xôi chín nhanh hơn.', 'Nồi to, bếp tốt và chị Hoa phụ bếp đều làm xôi chín nhanh.', 'Xôi chín xong cộng vào <b>kho xôi</b> để mang ra chợ.', 'Xôi thừa cuối ngày sẽ <b>chua và bị bỏ</b> (giữ lại 40–70% nếu có thùng ủ nóng).'])}
        <h4>Chạm vào cảnh bếp</h4>
        <p>Thử chạm vào ông Bảy, con mèo, hũ tương và bếp lửa để xem phản ứng vui nhộn.</p>`],
      ['price', '🏷️', 'Bảng giá', `
        <p>Trước khi ra chợ bạn đặt <b>giá bán từng món</b> (bước 500đ). Chỉ các món đang có xôi mới hiện ra.</p>
        <h4>Biểu tượng cảm xúc</h4>
        ${li(['😍 <b>Rẻ, khách đông:</b> giá dưới 97% giá chợ.', '🙂 <b>Giá hợp lý:</b> ngang giá chợ đến mức khách chấp nhận.', '😟 <b>Hơi đắt:</b> một số khách bỏ đi.', '😡 <b>Quá đắt:</b> hầu hết khách quay lưng.'])}
        <h4>Mẹo đặt giá</h4>
        ${li(['Giá chợ mỗi món mỗi ngày dao động nhẹ. Đặt <b>thấp hơn một chút</b> thì khách đến dồn dập.', 'Khách chấp nhận tối đa khoảng <b>106%</b> giá chợ (cân &amp; sổ ghi chép nâng lên 116%).', 'Món có vốn cao (xôi thập cẩm, sầu riêng) đừng bán rẻ quá kẻo lỗ.', 'Đừng quên <b>phí chợ</b> (' + fmtK(10000) + ' mỗi ngày, có thể tăng khi thanh tra ghé).'])}`],
      ['sell', '🧺', 'Bán hàng', `
        <p>Khách ngồi ghế nhựa, trên đầu có <b>bong bóng ghi tên món và số phần</b> họ muốn mua. Thanh xanh dưới chân là <b>độ kiên nhẫn</b>.</p>
        <h4>Từng bước phục vụ</h4>
        ${step([
          '<b>Chạm vào khách</b> để chọn (mũi tên ▼ vàng). Dòng dưới cảnh ghi <b>"Muốn mua: ..."</b>.',
          '<b>Chạm đúng món xôi</b> ở khay bên dưới để bỏ vào túi. Chạm mấy lần thì được mấy phần.',
          'Khi túi khớp với đơn, bấm <b>Gói lá</b> (nút sáng vàng lên).',
          'Xem hoạt cảnh gói: <b>trải lá chuối ➜ xúc xôi ➜ gấp lá ➜ buộc dây lạt</b>. Gói xong nằm trên quầy.',
          '<b>Chạm vào đúng khách đang cần món đó</b> để giao: gói bay sang tay khách, khách trả đúng số tiền theo bảng giá bạn đã đặt (boa hiện riêng).'])}
        <h4>Các nút</h4>
        ${li(['<b>🍃 Lá chuối:</b> số lá còn lại, bấm để mua thêm 1 bó (7.000đ = 16 lá). Hết lá thì bị trừ 20% tiền!', '<b>Gói lá / Giao ngay:</b> gói xôi trong túi thành gói lá đặt lên quầy (tối đa 3 gói). Có nâng cấp lá chuối gói sẵn thì <b>tự giao</b> ngay khi túi đủ món.', '<b>Từ chối:</b> chọn khách rồi bấm để khách đi khỏi nhẹ nhàng khi bạn hết món họ gọi (uy tín giảm rất ít).', '<b>Lấy lại:</b> đổ túi đang chọn để làm lại.', '<b>Dọn hàng:</b> kết thúc sớm. Chợ cũng tự đóng khi hết giờ hoặc hết xôi.'])}
        <h4>Khách bỏ đi khi nào?</h4>
        ${li(['😠 Hết kiên nhẫn: uy tín giảm 1 điểm.', '💢 Giao sai món: mất thêm 2,5 giây kiên nhẫn.', '😢 Hết xôi họ cần: khách buồn bỏ đi.', '💸 Giá quá đắt: khách quay đi ngay từ đầu.'])}
        <h4>Sự cố &amp; người giúp việc</h4>
        <p>Có thể gặp <b>côn đồ đòi bảo kê</b> (mất 30.000đ) trừ khi thuê Chú Ba. Đơn online, clip TikTok, sinh viên tự phục vụ... sẽ tự động bán thêm giúp bạn.</p>`],
      ['up', '⬆️', 'Nâng cấp & nhân viên', `
        <h4>Nâng cấp (tab ⬆️)</h4>
        ${li(DATA.UPGRADES.map((u) => u.icon + ' <b>' + u.name + ':</b> ' + u.desc(1)))}
        <h4>Nhân viên (tab 👥)</h4>
        ${li(DATA.STAFF.map((s) => '<b>' + s.name + ' – ' + s.role + ':</b> ' + s.desc + ' (lương ' + fmtK(s.wage) + '/ngày)'))}
        <p>Lương trừ vào <b>cuối ngày</b>. Chỉ thuê khi đã có lãi ổn định.</p>
        <h4>Điểm danh (tab 📅)</h4>
        <p>Mở game mỗi ngày thật để nhận quà theo lịch 7 ngày. Ngày thứ 7 mở công thức <b>Xôi ngũ sắc bí truyền</b>.</p>`],
      ['fun', '🎎', 'Hội làng', `
        <p>Tab <b>🎎 Hội làng</b> trong bếp có <b>${Minigames.list.length} trò chơi dân gian</b>. Mỗi ngày có <b>3 vé 🎫</b>, mỗi lần chơi tốn 1 vé. Chơi giỏi nhận nhiều <b>nguyên liệu miễn phí</b>.</p>
        <h4>Cách tính sao thưởng</h4>
        ${li(['<b>3 sao:</b> thành tích từ 85% trở lên.', '<b>2 sao:</b> từ 55%.', '<b>1 sao:</b> từ 25%.', 'Thoát giữa chừng thì <b>mất vé</b> và không có thưởng.'])}
        <h4>Hướng dẫn từng trò</h4>
        ${games}`],
      ['tips', '💡', 'Mẹo hay', `
        ${li([
          'Ngày đầu chỉ có 3 món cơ bản. Nên <b>học thêm một món đắt khách</b> như xôi trứng cút, xôi lạp xưởng khi có tiền.',
          'Đọc mục <b>Mai:</b> (cần sổ tay thương lái) để mua nguyên liệu sẽ rẻ vào ngày mai.',
          'Xôi bán không hết thì đừng đồ quá tay. <b>Thùng ủ nóng</b> giúp giữ lại một phần cho sáng hôm sau.',
          'Mưa và nắng gắt làm khách ít đi: ngày đó hãy đồ ít lại, hoặc mua <b>dù che nắng</b>.',
          'Khách nhỏ tuổi và người già thường gọi ít phần, hãy canh theo bong bóng.',
          'Uy tín (★) tăng khi phục vụ nhanh, <b>không để khách nào bỏ đi</b> được thưởng thêm +2.',
          'Đừng bỏ hội làng: 3 vé mỗi ngày tiết kiệm được hàng chục nghìn tiền nguyên liệu.',
          'Game luôn chạy <b>toàn màn hình</b>: chạm một lần ở màn hình đầu là ẩn thanh địa chỉ.',
          'Cài đặt có <b>rung, nhạc nền, hiệu ứng, giao diện màu</b>. Thử chỉnh cho hợp ý bạn.'])}`],
    ];
  },

  open(start) {
    const pages = this.pages();
    const body = el('div', 'guide');
    const bar = el('div', 'set-tabs gd-tabs'); const pane = el('div', 'set-pane gd-pane howto');
    body.appendChild(bar); body.appendChild(pane);
    let cur = start || pages[0][0];
    const render = () => {
      const pg = pages.find((p) => p[0] === cur) || pages[0];
      $$('.set-tab', bar).forEach((b) => b.classList.toggle('on', b.dataset.k === cur));
      pane.innerHTML = '<h3 class="gd-title">' + pg[1] + ' ' + pg[2] + '</h3>' + pg[3]; const sc = body.closest('.modal-body'); if (sc) sc.scrollTop = 0;
      const i = pages.indexOf(pg);
      $('.gd-prev', nav).disabled = i === 0; $('.gd-next', nav).disabled = i === pages.length - 1;
      $('.gd-page', nav).textContent = (i + 1) + '/' + pages.length;
    };
    pages.forEach(([k, ic, name]) => { const b = el('button', 'set-tab', ic + '<small>' + name + '</small>'); b.dataset.k = k; b.onclick = () => { cur = k; render(); }; bar.appendChild(b); });
    const nav = el('div', 'gd-nav', '<button class="btn mini gray gd-prev">◀</button><button class="btn mini gold gd-again">↺ Xem lại hướng dẫn lần đầu</button><span class="gd-page"></span><button class="btn mini gray gd-next">▶</button>');
    $('.gd-again', nav).onclick = () => { Tutor.reset(); UI.toast('Hướng dẫn sẽ hiện lại ở bếp, bảng giá và chợ', 'ok'); };
    const go = (d) => { const i = pages.findIndex((p) => p[0] === cur) + d; if (pages[i]) { cur = pages[i][0]; render(); } };
    $('.gd-prev', nav).onclick = () => go(-1); $('.gd-next', nav).onclick = () => go(1);
    body.appendChild(nav);
    render();
    UI.modal({ title: 'Hướng dẫn', icon: '❓', body, cls: 'big', buttons: [{ label: 'Đã hiểu', cls: 'red' }] });
  },
};
