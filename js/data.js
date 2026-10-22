/* Dữ liệu game: nguyên liệu, món xôi, nâng cấp, nhân viên, sự kiện, thoại... */
const DATA = {};
DATA.MAX_DAYS = 7;
DATA.PORTIONS = 8; // 1 mẻ = 8 phần
DATA.SEED = 500000; // vốn bà... ông cấp mỗi ngày

DATA.DIFF = {
  easy: { name: 'Dễ', debt: 1200000, cust: 1.15, desc: 'Nợ 1,2 triệu, khách đông hơn' },
  normal: { name: 'Thường', debt: 1500000, cust: 1.0, desc: 'Nợ 1,5 triệu' },
  hard: { name: 'Khó', debt: 1900000, cust: 0.9, desc: 'Nợ 1,9 triệu, khách ít hơn' },
};

/* ===== Nguyên liệu ===== */
DATA.ING = [
  { id: 'nep', name: 'Gạo nếp', icon: '🌾', price: 22 },
  { id: 'dau', name: 'Đỗ xanh', icon: '🫘', price: 18 },
  { id: 'gac', name: 'Gấc', icon: '🍅', price: 40 },
  { id: 'lac', name: 'Lạc', icon: '🥜', price: 20 },
  { id: 'dua', name: 'Cùi dừa', icon: '🥥', price: 25 },
  { id: 'hanh', name: 'Hành phi', icon: '🧅', price: 12 },
  { id: 'duong', name: 'Đường', icon: '🍬', price: 14 },
  { id: 'ladua', name: 'Lá dứa', icon: '🌿', price: 12 },
  { id: 'thit', name: 'Lạp xưởng', icon: '🌭', price: 45, perish: true },
  { id: 'trung', name: 'Trứng cút', icon: '🥚', price: 28, perish: true },
  { id: 'pate', name: 'Pate chả', icon: '🍖', price: 32, perish: true },
  { id: 'ga', name: 'Thịt gà', icon: '🍗', price: 50, perish: true },
  { id: 'ngo', name: 'Ngô nếp', icon: '🌽', price: 18 },
  { id: 'cam', name: 'Nếp cẩm', icon: '🍇', price: 28 },
  { id: 'mit', name: 'Mít', icon: '🥭', price: 34 },
  { id: 'sau', name: 'Sầu riêng', icon: '🍍', price: 60 },
  { id: 'la', name: 'Lá chuối', icon: '🍃', price: 10, pack: 16 }, // 1 bó = 16 phần gói
];
DATA.ING_BY = Object.fromEntries(DATA.ING.map((i) => [i.id, i]));
DATA.ING_COUNT = 5; // số nguyên liệu hiển thị lưới (tất cả)

/* ===== Món xôi ===== */
DATA.RECIPES = [
  { id: 'doxanh', name: 'Xôi đỗ xanh', icon: '🟡', color: '#e8c84a', price: 15, unlock: 0, need: { nep: 2, dau: 1, hanh: 1 }, pop: 1.2 },
  { id: 'lac', name: 'Xôi lạc', icon: '🟤', color: '#d9b57a', price: 15, unlock: 0, need: { nep: 2, lac: 2, duong: 1 }, pop: 1.1 },
  { id: 'gac', name: 'Xôi gấc', icon: '🔴', color: '#e0452c', price: 18, unlock: 0, need: { nep: 2, gac: 1, duong: 1 }, pop: 1.2 },
  { id: 'ladua', name: 'Xôi lá dứa', icon: '🟢', color: '#6bbf59', price: 16, unlock: 40000, need: { nep: 2, ladua: 2, dua: 1 }, pop: 0.9 },
  { id: 'ngo', name: 'Xôi ngô', icon: '🌽', color: '#f2d04a', price: 14, unlock: 50000, need: { nep: 2, ngo: 2, hanh: 1 }, pop: 0.9 },
  { id: 'xeo', name: 'Xôi xéo', icon: '🧈', color: '#f0c850', price: 17, unlock: 60000, need: { nep: 2, dau: 2, hanh: 2 }, pop: 1.0 },
  { id: 'camm', name: 'Xôi nếp cẩm', icon: '🟣', color: '#7a4a8a', price: 19, unlock: 80000, need: { cam: 2, dua: 1, duong: 1 }, pop: 0.8 },
  { id: 'mit', name: 'Xôi mít', icon: '🟠', color: '#f0a838', price: 22, unlock: 90000, need: { nep: 2, mit: 2, dua: 1 }, pop: 0.8 },
  { id: 'trung', name: 'Xôi trứng cút', icon: '🥚', color: '#f3e3b0', price: 22, unlock: 90000, need: { nep: 2, trung: 2, hanh: 1 }, pop: 1.0 },
  { id: 'pate', name: 'Xôi pate chả', icon: '🍖', color: '#c98a64', price: 24, unlock: 110000, need: { nep: 2, pate: 1, hanh: 1 }, pop: 1.0 },
  { id: 'lap', name: 'Xôi lạp xưởng', icon: '🌭', color: '#d4604a', price: 26, unlock: 130000, need: { nep: 2, thit: 2, hanh: 1 }, pop: 1.0 },
  { id: 'ga', name: 'Xôi gà', icon: '🍗', color: '#e0a060', price: 28, unlock: 150000, need: { nep: 2, ga: 2, hanh: 1 }, pop: 0.9 },
  { id: 'sau', name: 'Xôi sầu riêng', icon: '🍍', color: '#f0d060', price: 32, unlock: 170000, need: { nep: 2, sau: 2, dua: 1 }, pop: 0.6 },
  { id: 'thap', name: 'Xôi thập cẩm', icon: '🍱', color: '#e8a050', price: 36, unlock: 220000, need: { nep: 2, thit: 1, trung: 1, pate: 1, hanh: 1 }, pop: 0.9 },
  { id: 'ngusac', name: 'Xôi ngũ sắc bí truyền', icon: '🌈', color: '#d06ab0', price: 45, unlock: -1, need: { nep: 2, gac: 1, ladua: 1, cam: 1, dau: 1 }, pop: 0.5, secret: true },
];
DATA.REC_BY = Object.fromEntries(DATA.RECIPES.map((r) => [r.id, r]));

/* ===== Nâng cấp (nhiều cấp, có logic ảnh hưởng game) ===== */
DATA.UPGRADES = [
  { id: 'pot', name: 'Nồi chõ to', icon: '🍲', desc: (l) => ['Đồ tối đa 6 mẻ/lượt', 'Đồ tối đa 8 mẻ, chín nhanh hơn 15%', 'Đồ tối đa 11 mẻ, chín nhanh hơn 30%', 'Đồ tối đa 14 mẻ, chín nhanh hơn 45%'][l], costs: [180000, 300000, 480000] },
  { id: 'stove', name: 'Bếp cải tiến', icon: '🔥', desc: (l) => ['Bếp củi thường', 'Bếp than tổ ong: chín nhanh hơn 20%', 'Bếp ga mini: chín nhanh hơn 40%'][l], costs: [200000, 380000] },
  { id: 'leaf', name: 'Lá chuối gói sẵn', icon: '🍃', desc: (l) => ['Gói xôi thủ công, tốn thời gian', 'Gói sẵn: gói xong ngay, tự giao khi đủ món', 'Lá chuối thơm: khách boa thêm 10%'][l], costs: [100000, 260000] },
  { id: 'chair', name: 'Thêm ghế nhựa', icon: '🪑', desc: (l) => ['Phục vụ tối đa 3 khách cùng lúc', 'Thêm 1 ghế: 4 khách cùng lúc', 'Thêm 1 ghế: 5 khách cùng lúc', 'Thêm 1 ghế: 6 khách cùng lúc'][l], costs: [150000, 260000, 400000] },
  { id: 'loud', name: 'Loa rao hàng', icon: '📢', desc: (l) => ['Chưa có loa', 'Khách kéo đến đông hơn 15%', 'Đông hơn 30%', 'Đông hơn 45%'][l], costs: [220000, 360000, 520000] },
  { id: 'tea', name: 'Ấm trà đá mời khách', icon: '🫖', desc: (l) => ['Khách chờ bình thường', 'Khách chịu chờ lâu hơn 20%', 'Khách chịu chờ lâu hơn 40%'][l], costs: [120000, 240000] },
  { id: 'sign', name: 'Biển hiệu đèn lồng', icon: '🏮', desc: (l) => ['Chưa có biển', 'Hút thêm 8% khách, uy tín tăng nhanh hơn', 'Hút thêm 16% khách', 'Hút thêm 24%, uy tín tăng gấp đôi'][l], costs: [100000, 200000, 350000] },
  { id: 'cooler', name: 'Thùng ủ nóng', icon: '📦', desc: (l) => ['Xôi thừa bị chua, bỏ hết', 'Giữ lại 40% xôi thừa cho sáng mai', 'Giữ lại 70% xôi thừa cho sáng mai'][l], costs: [140000, 280000] },
  { id: 'fridge', name: 'Tủ lạnh cũ', icon: '🧊', desc: (l) => ['Thịt, trứng, pate qua đêm hỏng 50%', 'Thịt, trứng, pate qua đêm không hỏng'][l], costs: [240000] },
  { id: 'umbrella', name: 'Dù che nắng lớn', icon: '⛱️', desc: (l) => ['Mưa nắng làm giảm khách', 'Giảm một nửa ảnh hưởng của mưa nắng'][l], costs: [130000] },
  { id: 'scale', name: 'Cân & sổ ghi chép', icon: '⚖️', desc: (l) => ['Khách nhạy cảm với giá', 'Khách chấp nhận giá cao hơn 10%'][l], costs: [160000] },
  { id: 'note', name: 'Sổ tay thương lái', icon: '📒', desc: (l) => ['Không biết giá chợ ngày mai', 'Xem trước dự báo giá chợ ngày mai'][l], costs: [90000] },
  { id: 'ti', name: 'Nhờ Tí gói hộ', icon: '👦', desc: (l) => ['Tự tay gói từng phần', 'Tí tự lấy xôi và phục vụ khách mỗi 6 giây'][l], costs: [650000] },
];
DATA.UPG_BY = Object.fromEntries(DATA.UPGRADES.map((u) => [u.id, u]));

/* ===== Nhân viên ===== */
DATA.STAFF = [
  { id: 'hoa', name: 'Chị Hoa', role: 'Thợ đồ xôi phụ', hire: 150000, wage: 60000, look: { skin: '#e8b890', hair: '#2a1a14', style: 'bun', shirt: '#c8506a', pants: '#3a3040' }, desc: 'Phụ ông đồ xôi: nồi chứa thêm 2 mẻ, xôi chín nhanh hơn 10%, ra thêm 5% phần.', fx: { potCap: 2, cook: 0.1, yield: 0.05 } },
  { id: 'minh', name: 'Anh Minh', role: 'Người đi chợ', hire: 180000, wage: 50000, look: { skin: '#d9a070', hair: '#1c1c1c', style: 'short', shirt: '#4a7ab0', pants: '#33404f' }, desc: 'Mặc cả giỏi: nguyên liệu rẻ hơn 10%. Đi chợ hộ nên đỡ mất công.', fx: { buy: 0.1 } },
  { id: 'linh', name: 'Bạn Linh', role: 'Chạy đơn online', hire: 200000, wage: 70000, look: { skin: '#f0c8a0', hair: '#3a2418', style: 'pigtails', shirt: '#38a878', pants: '#2a3a3a' }, desc: 'Nhận đơn qua mạng: thỉnh thoảng bán thêm 2-4 phần giao tận nơi, không cần ghế.', fx: { online: 1 } },
  { id: 'ba', name: 'Chú Ba', role: 'Bảo vệ chợ', hire: 120000, wage: 45000, look: { skin: '#c89868', hair: '#555', style: 'cap', shirt: '#2f4a38', pants: '#222', hat: '#2f4a38' }, desc: 'Phí chợ giảm một nửa, đuổi kẻ gây rối, khách chịu chờ thêm 10%.', fx: { fee: 0.5, guard: 1, patience: 0.1 } },
  { id: 'genz', name: 'Em Gen Z', role: 'Chạy TikTok', hire: 300000, wage: 80000, look: { skin: '#f0c8a0', hair: '#c03a7a', style: 'long', shirt: '#7a5ad0', pants: '#202030' }, desc: 'Quay clip bán xôi: khách đông hơn 20%, thỉnh thoảng có khách "check-in" boa lớn.', fx: { cust: 0.2, viral: 1 } },
  { id: 'tu', name: 'Kế toán Tư', role: 'Quản lý sổ sách', hire: 260000, wage: 60000, look: { skin: '#e0b088', hair: '#7a7a7a', style: 'short', shirt: '#e8e8e0', pants: '#3a3a48', glasses: true }, desc: 'Ghi sổ chặt chẽ: không hao hụt nguyên liệu, giữ vốn sinh lãi 3% mỗi ngày.', fx: { noWaste: 1, interest: 0.03 } },
  { id: 'sv', name: 'Sinh viên cuối tháng', role: 'Phục vụ bán thời gian', hire: 100000, wage: 40000, look: { skin: '#f0c8a0', hair: '#1c1c1c', style: 'short', shirt: '#e8c040', pants: '#3a5a8a', bag: true }, desc: 'Rẻ nhưng nhanh nhẹn: tự phục vụ khách mua 1 phần mỗi 8 giây.', fx: { auto: 8 } },
];
DATA.STAFF_BY = Object.fromEntries(DATA.STAFF.map((s) => [s.id, s]));

/* ===== Thời tiết & sự kiện ===== */
DATA.WEATHER = [
  { id: 'sun', name: 'Trời nắng đẹp', icon: '☀️', cust: 1.0, w: 4 },
  { id: 'cloud', name: 'Trời âm u mát mẻ', icon: '⛅', cust: 1.05, w: 3 },
  { id: 'rain', name: 'Mưa rả rích', icon: '🌧️', cust: 0.78, w: 2, env: true },
  { id: 'hot', name: 'Nắng gắt', icon: '🔥', cust: 0.88, w: 2, env: true },
  { id: 'cold', name: 'Sáng sớm se lạnh', icon: '🧣', cust: 1.2, w: 2 },
];
DATA.EVENTS = [
  { id: 'phien', title: 'Chợ phiên đông vui', icon: '🎪', text: 'Hôm nay phiên chợ lớn, người đổ về rất đông!', cust: 1.25 },
  { id: 'hoc', title: 'Học sinh đi học sớm', icon: '🎒', text: 'Trường gần chợ tổ chức ngày hội, tụi nhỏ đói bụng lắm.', cust: 1.15 },
  { id: 'cuoi', title: 'Đám cưới đặt xôi gấc', icon: '💒', text: 'Nhà bên có đám cưới, ai cũng đòi xôi gấc đỏ may mắn.', demand: { gac: 2.2 } },
  { id: 'ram', title: 'Ngày rằm ăn chay', icon: '🪷', text: 'Rằm ăn chay: xôi đỗ, lạc, ngô được ưa chuộng.', demand: { doxanh: 1.8, lac: 1.8, ngo: 1.8, ladua: 1.5 } },
  { id: 'thanhtra', title: 'Đội thanh tra vệ sinh', icon: '🧾', text: 'Thanh tra ghé kiểm tra, phải nộp phí vệ sinh 30.000đ (Chú Ba lo được).', fee: 30000 },
  { id: 'khaitruong', title: 'Quán đối diện khai trương', icon: '🎈', text: 'Quán bánh mì mới khai trương, khuyến mãi mạnh... khách ít đi.', cust: 0.88 },
  { id: 'giathit', title: 'Giá thịt tăng', icon: '📈', text: 'Giá thịt, trứng, pate tăng 30% do thiếu hàng.', ingr: { thit: 1.3, trung: 1.3, pate: 1.3, ga: 1.3 } },
  { id: 'mua', title: 'Mùa gặt nếp', icon: '🌾', text: 'Nếp mới về chợ, giá nếp giảm 20%.', ingr: { nep: 0.8, cam: 0.85 } },
  { id: 'nhacsang', title: 'Sáng thứ Bảy thong thả', icon: '☕', text: 'Mọi người dậy muộn, khách đến chậm nhưng boa hậu hĩnh.', tip: 0.1 },
];

/* ===== Điểm danh 7 ngày ===== */
DATA.CHECKIN = [
  { cash: 30000, label: '30.000đ', icon: '💰' },
  { items: { nep: 6 }, label: '6 gạo nếp', icon: '🌾' },
  { cash: 50000, label: '50.000đ', icon: '💰' },
  { items: { la: 16, dua: 3 }, label: 'Bó lá + 3 dừa', icon: '🍃' },
  { cash: 70000, label: '70.000đ', icon: '💰' },
  { items: { gac: 3, cam: 3 }, label: 'Gấc + nếp cẩm', icon: '🎁' },
  { cash: 100000, items: { ga: 2 }, recipe: 'ngusac', label: 'Công thức Ngũ sắc!', icon: '🌈' },
];

/* ===== Nhân vật: kiểu dáng ===== */
DATA.CHARS = {
  ongbay: { name: 'Ông Bảy', look: { skin: '#d9a070', hair: '#cfcfcf', style: 'bald', shirt: '#8a5a38', pants: '#2c2a30', hat: null, mustache: true, elder: true } },
  ti: { name: 'Cái Tí', look: { skin: '#f0c8a0', hair: '#2a1a14', style: 'pigtails', shirt: '#4a7ae0', pants: '#202028' } },
  saucao: { name: 'Sáu Cáo', look: { skin: '#c89060', hair: '#111', style: 'cap', shirt: '#1d1d24', pants: '#3a3a48', hat: '#4a4a58', shades: true, scar: true, wide: true } },
  banga: { name: 'Bà Hai bán gà', look: { skin: '#e0a878', hair: '#9a9a9a', style: 'scarf', shirt: '#a85a78', pants: '#3a2a2a', elder: true } },
};
DATA.CUSTOMERS = [
  { name: 'Cô giáo Lan', look: { skin: '#f0c8a0', hair: '#2a1a14', style: 'long', shirt: '#7a4ab0', pants: '#33334a' }, quips: ['Sáng nay ăn xôi cho chắc bụng, bà con ơi!', 'Muộn làm mất rồi, bục cả mình!', 'Cho cô phần xôi nóng nhé.'] },
  { name: 'Anh xe ôm Tùng', look: { skin: '#c89060', hair: '#1c1c1c', style: 'cap', shirt: '#d05a30', pants: '#2a3a4a', hat: '#d05a30' }, quips: ['Chạy xe cả đêm đói quá ông Bảy ơi!', 'Cho tôi phần thật đầy nhé!', 'Nhanh nhanh còn đón khách.'] },
  { name: 'Chị Mận bán rau', look: { skin: '#e0b088', hair: '#3a2418', style: 'scarf', shirt: '#58a858', pants: '#4a3a2a' }, quips: ['Nay rau ế, xôi ông ngon thì tôi mua!', 'Gói cho chị ít hành phi nữa nghe.', 'Xôi nóng hổi mới đã.'] },
  { name: 'Bé Bông', look: { skin: '#f4d2b0', hair: '#2a1a14', style: 'pigtails', shirt: '#f08aa8', pants: '#4a5a9a', small: true }, quips: ['Mẹ cho con mua xôi nè!', 'Con muốn nhiều đậu phộng!', 'Ông ơi cho con xin thêm hành ạ.'] },
  { name: 'Bác sĩ Hòa', look: { skin: '#e8c098', hair: '#6a6a6a', style: 'short', shirt: '#e8eef0', pants: '#2a3a4a', glasses: true }, quips: ['Ăn sáng đủ chất mới làm việc tốt.', 'Cho tôi phần ít đường thôi nhé.', 'Xôi ông Bảy nổi tiếng cả xóm rồi.'] },
  { name: 'Chú thợ hồ Sơn', look: { skin: '#b88058', hair: '#1c1c1c', style: 'cap', shirt: '#e0b030', pants: '#3a4a5a', hat: '#e8e8e8' }, quips: ['Làm nặng phải ăn cho đầy bụng!', 'Cho chú hai phần luôn nhé.', 'Công trình đang đợi, lẹ lên cháu!'] },
  { name: 'Sinh viên Hạnh', look: { skin: '#f0c8a0', hair: '#1c1c1c', style: 'long', shirt: '#3a9a9a', pants: '#2a2a3a', bag: true }, quips: ['Sắp trễ tiết rồi, cho em phần nhanh với!', 'Xôi này rẻ mà ngon, sinh viên mê lắm.', 'Em lấy mang đi ạ.'] },
  { name: 'Bà Sáu hàng xóm', look: { skin: '#dcaa80', hair: '#bcbcbc', style: 'scarf', shirt: '#9a6a40', pants: '#3a2a2a', elder: true }, quips: ['Ông Bảy ơi, nay nấu mềm không đó?', 'Tôi ăn xôi của ông hơn ba chục năm rồi.', 'Cho bà phần như mọi khi.'] },
  { name: 'Chú bộ đội Dũng', look: { skin: '#c89868', hair: '#1c1c1c', style: 'cap', shirt: '#5a7a48', pants: '#4a5a38', hat: '#5a7a48' }, quips: ['Xôi ngon kiểu này nhớ quê quá!', 'Đơn vị chú đông lắm, cho chú nhiều nhé.', 'Nhanh gọn như quân đội nghe cháu.'] },
  { name: 'Cậu shipper Khoa', look: { skin: '#e0b088', hair: '#2a1a14', style: 'cap', shirt: '#38a838', pants: '#2a2a2a', hat: '#38a838' }, quips: ['Đơn giao gấp, cho em phần mang đi!', 'Anh Bảy ơi nhanh giúp em chút.', 'Xôi ông là đơn đắt nhất đó nha.'] },
];

/* ===== Hội thoại cốt truyện ===== */
DATA.STORY = [
  { who: 'ti', text: 'Ông ơi! Cháu là Tí đây! Nghỉ hè cháu về phụ ông bán xôi. Nhất định mình giữ được tiệm nhà mình nha!' },
  { who: 'ongbay', text: 'Tí đó hả cháu? Ông cảm ơn nhe. Tiệm xôi này ba đời nhà họ Bảy, bán từ hồi chợ còn họp dưới gốc đa kia kìa.' },
  { who: 'saucao', text: 'Ông Bảy! Hạn trả nợ chỉ còn đúng BẢY ngày. Không đủ một triệu rưỡi thì cái bếp này, cái nhà này... là của tôi!' },
  { who: 'ongbay', text: 'Sáu Cáo cứ yên tâm. Bảy ngày nữa tôi trả đủ, không thiếu một đồng. Xôi nếp thơm của ông Bảy chưa bao giờ phụ lòng ai!' },
  { who: 'ti', text: 'Mỗi sáng ông cho vốn 500 nghìn đi chợ mua nếp. Mình đồ xôi, gánh ra chợ bán, dư được bao nhiêu để dành trả nợ hết!' },
  { who: 'ongbay', text: 'Phải rồi. Mua nguyên liệu tươi, đồ xôi dẻo thơm, bán đúng giá, lo gói lá cho khéo. Còn khi rảnh thì ra hội làng chơi vài trò kiếm thêm nguyên liệu. Bắt tay vào việc thôi, Tí!' },
];
DATA.TIPS = [
  'Giá chợ mỗi ngày mỗi khác, thấy mũi tên ▼ là mua nhiều!',
  'Xôi thừa buổi sáng sẽ chua, hãy mua vừa đủ hoặc nâng cấp thùng ủ nóng.',
  'Đặt giá thấp hơn giá chợ sẽ hút thêm khách, quá cao khách sẽ bỏ đi.',
  'Nhớ gói lá chuối cho khách: không gói bị giảm tiền đó!',
  'Chơi trò dân gian ở hội làng để kiếm nguyên liệu miễn phí.',
  'Điểm danh mỗi ngày nhận quà, ngày thứ 7 có công thức bí truyền!',
  'Nhân viên tốn lương mỗi ngày, hãy thuê khi đã có lãi ổn định.',
  'Quạt lửa khi đồ xôi sẽ làm xôi chín nhanh hơn.',
];
DATA.ENDINGS = {
  win: [
    { who: 'saucao', text: 'Một triệu rưỡi... đủ cả. Hừm! Xôi ông Bảy quả thật đáng đồng tiền. Tôi... xin lỗi vì đã làm khó ông.' },
    { who: 'ongbay', text: 'Không sao đâu Sáu Cáo. Lần sau ghé mua xôi nhé, ông gói lá chuối thơm cho. Cảm ơn Tí và bà con xóm chợ nhiều lắm!' },
    { who: 'ti', text: 'Tiệm xôi Ông Bảy muôn năm! Mai mình tiếp tục bán nha ông!' },
  ],
  lose: [
    { who: 'saucao', text: 'Hết bảy ngày rồi, ông Bảy. Tiền đâu? Không đủ thì như đã hẹn, cái bếp này giờ là của tôi.' },
    { who: 'ongbay', text: 'Tôi... xin thêm một cơ hội nữa được không? Chỉ cần thêm bảy ngày thôi...' },
    { who: 'ti', text: 'Đừng buồn ông ơi, mình làm lại từ đầu. Lần này nhất định sẽ giữ được tiệm!' },
  ],
};
