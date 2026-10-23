/* Dữ liệu game: nguyên liệu, món xôi, nâng cấp, nhân viên, sự kiện, thoại... */
const DATA = {};
DATA.MAX_DAYS = 7;
DATA.PORTIONS = 8; // 1 mẻ = 8 phần
DATA.SEED = 300000; // vốn ông cấp mỗi ngày

DATA.DIFF = {
  easy: { name: 'Dễ', debt: 1200000, cust: 1.15, desc: 'Nợ 1,2 triệu, khách đông hơn' },
  normal: { name: 'Thường', debt: 1500000, cust: 1.0, desc: 'Nợ 1,5 triệu' },
  hard: { name: 'Khó', debt: 1900000, cust: 0.9, desc: 'Nợ 1,9 triệu, khách ít hơn' },
};

/* ===== Nguyên liệu ===== */
DATA.ING = [
  { id: 'nep', name: 'Gạo nếp', icon: '🌾', price: 15 },
  { id: 'dau', name: 'Đỗ xanh', icon: '🫘', price: 13 },
  { id: 'gac', name: 'Gấc', icon: '🍅', price: 28 },
  { id: 'lac', name: 'Lạc', icon: '🥜', price: 14 },
  { id: 'dua', name: 'Cùi dừa', icon: '🥥', price: 18 },
  { id: 'hanh', name: 'Hành phi', icon: '🧅', price: 8 },
  { id: 'duong', name: 'Đường', icon: '🍬', price: 10 },
  { id: 'ladua', name: 'Lá dứa', icon: '🌿', price: 8 },
  { id: 'thit', name: 'Lạp xưởng', icon: '🌭', price: 32, perish: true },
  { id: 'trung', name: 'Trứng cút', icon: '🥚', price: 20, perish: true },
  { id: 'pate', name: 'Pate chả', icon: '🍖', price: 22, perish: true },
  { id: 'ga', name: 'Thịt gà', icon: '🍗', price: 35, perish: true },
  { id: 'ngo', name: 'Ngô nếp', icon: '🌽', price: 13 },
  { id: 'cam', name: 'Nếp cẩm', icon: '🍇', price: 20 },
  { id: 'mit', name: 'Mít', icon: '🥭', price: 24 },
  { id: 'sau', name: 'Sầu riêng', icon: '🍍', price: 42 },
  { id: 'la', name: 'Lá chuối', icon: '🍃', price: 7, pack: 16 }, // 1 bó = 16 phần gói
];
DATA.ING_BY = Object.fromEntries(DATA.ING.map((i) => [i.id, i]));
DATA.ING_COUNT = 5; // số nguyên liệu hiển thị lưới (tất cả)

/* ===== Món xôi ===== */
DATA.RECIPES = [
  { id: 'doxanh', name: 'Xôi đỗ xanh', icon: '🟡', color: '#e8c84a', price: 18, unlock: 0, need: { nep: 2, dau: 1, hanh: 1 }, pop: 1.2 },
  { id: 'lac', name: 'Xôi lạc', icon: '🟤', color: '#d9b57a', price: 18, unlock: 0, need: { nep: 2, lac: 2, duong: 1 }, pop: 1.1 },
  { id: 'gac', name: 'Xôi gấc', icon: '🔴', color: '#e0452c', price: 22, unlock: 0, need: { nep: 2, gac: 1, duong: 1 }, pop: 1.2 },
  { id: 'ladua', name: 'Xôi lá dứa', icon: '🟢', color: '#6bbf59', price: 19, unlock: 40000, need: { nep: 2, ladua: 2, dua: 1 }, pop: 0.9 },
  { id: 'ngo', name: 'Xôi ngô', icon: '🌽', color: '#f2d04a', price: 17, unlock: 50000, need: { nep: 2, ngo: 2, hanh: 1 }, pop: 0.9 },
  { id: 'xeo', name: 'Xôi xéo', icon: '🧈', color: '#f0c850', price: 20, unlock: 60000, need: { nep: 2, dau: 2, hanh: 2 }, pop: 1.0 },
  { id: 'camm', name: 'Xôi nếp cẩm', icon: '🟣', color: '#7a4a8a', price: 23, unlock: 80000, need: { cam: 2, dua: 1, duong: 1 }, pop: 0.8 },
  { id: 'mit', name: 'Xôi mít', icon: '🟠', color: '#f0a838', price: 26, unlock: 90000, need: { nep: 2, mit: 2, dua: 1 }, pop: 0.8 },
  { id: 'trung', name: 'Xôi trứng cút', icon: '🥚', color: '#f3e3b0', price: 26, unlock: 90000, need: { nep: 2, trung: 2, hanh: 1 }, pop: 1.0 },
  { id: 'pate', name: 'Xôi pate chả', icon: '🍖', color: '#c98a64', price: 29, unlock: 110000, need: { nep: 2, pate: 1, hanh: 1 }, pop: 1.0 },
  { id: 'lap', name: 'Xôi lạp xưởng', icon: '🌭', color: '#d4604a', price: 31, unlock: 130000, need: { nep: 2, thit: 2, hanh: 1 }, pop: 1.0 },
  { id: 'ga', name: 'Xôi gà', icon: '🍗', color: '#e0a060', price: 34, unlock: 150000, need: { nep: 2, ga: 2, hanh: 1 }, pop: 0.9 },
  { id: 'sau', name: 'Xôi sầu riêng', icon: '🍍', color: '#f0d060', price: 38, unlock: 170000, need: { nep: 2, sau: 2, dua: 1 }, pop: 0.6 },
  { id: 'thap', name: 'Xôi thập cẩm', icon: '🍱', color: '#e8a050', price: 43, unlock: 220000, need: { nep: 2, thit: 1, trung: 1, pate: 1, hanh: 1 }, pop: 0.9 },
  { id: 'ngusac', name: 'Xôi ngũ sắc bí truyền', icon: '🌈', color: '#d06ab0', price: 54, unlock: -1, need: { nep: 2, gac: 1, ladua: 1, cam: 1, dau: 1 }, pop: 0.5, secret: true },
];
DATA.REC_BY = Object.fromEntries(DATA.RECIPES.map((r) => [r.id, r]));

/* ===== Các chương: mở rộng đế chế xôi sau khi trả hết nợ =====
   Số ngày trả nợ tăng dần theo từng chương; mỗi độ khó có số chương khác nhau. */
DATA.CHAPTERS = [
  { id: 1, name: 'Gánh xôi đầu ngõ', icon: '🛺', venue: 'cart', days: 7, debt: 1, cust: 1, pal: ['#3a6a4a', '#1c3a2c'], desc: 'Gánh xôi nhỏ ở đầu chợ. Trả hết nợ cho Sáu Cáo trong 7 ngày.' },
  { id: 2, name: 'Xe đẩy góc phố', icon: '🛒', venue: 'cart', days: 8, debt: 1.6, cust: 1.25, pal: ['#4a7a8a', '#1c3a4a'], desc: 'Có xe đẩy riêng ở góc phố đông người. Khách nhiều hơn, nợ mới lớn hơn.' },
  { id: 3, name: 'Cửa hàng mặt phố', icon: '🏪', venue: 'shop', days: 9, debt: 2.3, cust: 1.45, pal: ['#8a6a3a', '#3a2a14'], desc: 'Mở tiệm mặt phố: cần máy phát điện, giấy phép, an toàn thực phẩm và bảo vệ chống trộm.' },
  { id: 4, name: 'Chuỗi tiệm Ông Bảy', icon: '🏬', venue: 'shop', days: 10, debt: 3.1, cust: 1.7, pal: ['#8a4a5a', '#3a1a28'], desc: 'Mở thêm chi nhánh khắp thành phố. Khách đổ về rất đông.' },
  { id: 5, name: 'Xưởng xôi Ông Bảy', icon: '🏭', venue: 'shop', days: 11, debt: 4, cust: 2, pal: ['#6a5a8a', '#2a1a4a'], desc: 'Xây xưởng đồ xôi công nghiệp, cung cấp xôi cho hàng chục điểm bán.' },
  { id: 6, name: 'Xôi giao khắp phố', icon: '🚚', venue: 'shop', days: 12, debt: 5, cust: 2.2, pal: ['#3a7a8a', '#14323a'], desc: 'Đội xe giao xôi nóng tận cửa. Đơn đặt hàng online đổ về liên tục.' },
  { id: 7, name: 'Hội chợ ẩm thực', icon: '🎪', venue: 'shop', days: 13, debt: 6.1, cust: 2.4, pal: ['#b0503a', '#4a1a14'], desc: 'Gian hàng xôi Ông Bảy tại hội chợ ẩm thực lớn nhất miền. Người đông như hội!' },
  { id: 8, name: 'Xôi ven biển', icon: '🏝️', venue: 'shop', days: 14, debt: 7.3, cust: 2.6, pal: ['#2a8aaa', '#0e3a52'], desc: 'Khu du lịch biển: khách Tây, khách ta xếp hàng dài chờ xôi nóng.' },
  { id: 9, name: 'Xôi ga tàu', icon: '🚆', venue: 'shop', days: 15, debt: 8.6, cust: 2.8, pal: ['#6a6a7a', '#24242e'], desc: 'Quầy xôi ở ga tàu: bán nhanh, phục vụ gọn, khách luôn vội vã.' },
  { id: 10, name: 'Phố xôi Sài Thành', icon: '🏙️', venue: 'shop', days: 16, debt: 10, cust: 3, pal: ['#c08a2a', '#4a3008'], desc: 'Mở cả một con phố xôi giữa lòng thành phố không ngủ.' },
  { id: 11, name: 'Xôi sân bay quốc tế', icon: '✈️', venue: 'shop', days: 17, debt: 11.5, cust: 3.2, pal: ['#4a6ac0', '#141e48'], desc: 'Quầy xôi tại sân bay: khách quốc tế thích mê món ăn Việt.' },
  { id: 12, name: 'Xôi Việt xuyên biên giới', icon: '🌏', venue: 'shop', days: 18, debt: 13.1, cust: 3.4, pal: ['#2a9a6a', '#0e3a28'], desc: 'Xuất khẩu xôi nếp sang nhiều nước. Đơn hàng quốc tế liên tục.' },
  { id: 13, name: 'Nhà hàng xôi sao vàng', icon: '🌟', venue: 'shop', days: 19, debt: 14.8, cust: 3.6, pal: ['#d0a020', '#4a3a08'], desc: 'Nhà hàng xôi cao cấp được xếp hạng sao vàng. Khách sành ăn kéo đến.' },
  { id: 14, name: 'Xôi tương lai', icon: '🚀', venue: 'shop', days: 20, debt: 16.6, cust: 3.8, pal: ['#8a3ac0', '#240a48'], desc: 'Nhà máy xôi robot, gian hàng vũ trụ. Ông Bảy vẫn giữ nếp thơm truyền thống.' },
  { id: 15, name: 'Đế chế xôi Việt', icon: '👑', venue: 'shop', days: 21, debt: 18.5, cust: 4, pal: ['#e0a820', '#5a2a08'], desc: 'Thương hiệu xôi Ông Bảy vang danh khắp thế giới. Chương cuối cùng!' },
];
/* 15 chương nâng cao (16-30): nhân đôi hành trình, mỗi chương một bối cảnh riêng */
[
  ['Xôi trên sông', '🛥️', 'Bán xôi trên du thuyền sông Hương, khách thưởng thức giữa cảnh sông nước.', ['#2a7a9a', '#0c3448']],
  ['Phố cổ Hội An', '🏮', 'Đèn lồng rực rỡ khắp phố cổ, khách du lịch chụp ảnh bên gánh xôi.', ['#c88a2a', '#4a2c08']],
  ['Chợ nổi Cái Răng', '🛶', 'Bán xôi từ xuồng ghe giữa chợ nổi miền Tây buổi sớm.', ['#3a9a5a', '#0e3a22']],
  ['Núi rừng Tây Bắc', '⛰️', 'Quầy xôi nếp nương trên phiên chợ vùng cao đầy sương.', ['#5a7a4a', '#1c2e18']],
  ['Đà Lạt sương mù', '🌲', 'Sáng se lạnh ở Đà Lạt, xôi nóng được săn đón.', ['#7a6aa8', '#261c48']],
  ['Festival Huế', '🎭', 'Xôi cung đình trong lễ hội Festival, khách sành ăn khắp nơi.', ['#a83a5a', '#3a0e1c']],
  ['Xôi Tết Nguyên Đán', '🧧', 'Tết đến, xôi gấc đỏ may mắn bán không kịp tay.', ['#d8281c', '#4a0808']],
  ['Đảo ngọc Phú Quốc', '🏖️', 'Mở quầy xôi bên bờ biển Phú Quốc xanh trong.', ['#1ea0c8', '#08384a']],
  ['Hà Nội về đêm', '🌃', 'Phố đêm Hà Nội, xôi nóng cho người đi làm khuya.', ['#4a4a8a', '#12122e']],
  ['Triển lãm quốc tế', '🏛️', 'Gian hàng xôi Việt tại triển lãm ẩm thực quốc tế.', ['#8a8aa0', '#2a2a38']],
  ['Xôi châu Á', '🗺️', 'Chuỗi xôi lan rộng khắp các nước châu Á.', ['#c85a2a', '#4a1c08']],
  ['Xôi Âu Mỹ', '🗽', 'Khách Tây xếp hàng dài mua xôi lạp xưởng kiểu Việt.', ['#4a6ac0', '#141e48']],
  ['Trạm vũ trụ', '🛰️', 'Xôi đóng gói cho các nhà du hành, bán trên trạm vũ trụ.', ['#6a3ac0', '#180a48']],
  ['Học viện xôi', '🎓', 'Mở học viện dạy nghề đồ xôi cho cả nước.', ['#2a8a8a', '#0a3030']],
  ['Huyền thoại xôi Việt', '🐉', 'Chương cuối cùng: Ông Bảy trở thành huyền thoại ẩm thực Việt.', ['#e0b020', '#5a2a08']],
].forEach(([name, icon, desc, pal], i) => {
  const id = 16 + i, k = id - 15;
  DATA.CHAPTERS.push({ id, name, icon, venue: 'shop', days: 6 + id, debt: Math.round((18.5 + k * 2.4) * 10) / 10, cust: Math.round((4 + k * 0.18) * 100) / 100, pal, desc });
});
/* Kịch bản riêng từng chương: thời tiết, giá, khách, nhân viên, hiệu ứng và màu cảnh */
DATA.SCN = {
  plain: { name: 'Ngày thường', icon: '📅', desc: 'Không có điều gì đặc biệt.', fx: '', filter: 'brightness(1)' },
  market_day: { name: 'Phiên chợ đông', icon: '🎪', desc: 'Sự kiện xảy ra gần như mỗi ngày, khách đông hơn 10%.', cust: 1.1, ev: 0.95, fx: 'sparkle', filter: 'saturate(1.1)' },
  festival: { name: 'Mùa lễ hội', icon: '🎆', desc: 'Khách đông hơn 15%, boa hậu hĩnh, sự kiện dồn dập.', cust: 1.15, tip: 0.05, ev: 0.85, fx: 'sparkle', filter: 'saturate(1.3) hue-rotate(-8deg)' },
  union: { name: 'Ưu đãi nhân sự', icon: '🤝', desc: 'Thuê nhân viên rẻ hơn 30%, lương giảm 20%. Thời cơ mở rộng đội ngũ!', hire: 0.7, wage: 0.8, fx: 'petal', filter: 'saturate(1.1) hue-rotate(-14deg)' },
  rain: { name: 'Mùa mưa', icon: '🌧️', desc: 'Mưa nhiều hơn rõ rệt. Dù che nắng giúp giữ khách.', weather: { rain: 3, cloud: 1.6, sun: 0.5, hot: 0.3 }, fx: '', filter: 'brightness(.9) saturate(.9) hue-rotate(12deg)' },
  tourist: { name: 'Mùa du lịch', icon: '🧳', desc: 'Khách đông hơn 20%, boa thêm 8%, nhưng thuê người đắt hơn 10%.', cust: 1.2, tip: 0.08, hire: 1.1, fx: 'sparkle', filter: 'saturate(1.25) brightness(1.05)' },
  heat: { name: 'Nắng nóng', icon: '🔥', desc: 'Nắng gắt kéo dài, khách thưa. Có dù lớn sẽ đỡ hơn.', weather: { hot: 3, sun: 1.6, rain: 0.4, cold: 0.1 }, fx: 'sparkle', filter: 'sepia(.2) saturate(1.2) hue-rotate(-10deg) brightness(1.05)' },
  night: { name: 'Chợ đêm', icon: '🌙', desc: 'Chợ đêm lung linh, khách đông hơn 10%.', cust: 1.1, fx: 'firefly', filter: 'brightness(.82) hue-rotate(22deg) saturate(1.15)' },
  inflation: { name: 'Bão giá', icon: '📈', desc: 'Nguyên liệu đắt hơn 15% nhưng khách vẫn đông hơn 10%.', ingr: 1.15, cust: 1.1, fx: '', filter: 'grayscale(.35)' },
  harvest: { name: 'Mùa gặt', icon: '🌾', desc: 'Nguyên liệu rẻ hơn 15% nhờ trúng mùa.', ingr: 0.85, fx: 'sparkle', filter: 'sepia(.25) saturate(1.3)' },
  cold: { name: 'Rét đậm', icon: '🧣', desc: 'Trời rét kéo dài, khách thích xôi nóng hơn.', weather: { cold: 3, cloud: 1.5, hot: 0.2, sun: 0.6 }, fx: 'sparkle', filter: 'hue-rotate(28deg) saturate(.9) brightness(.95)' },
  boom: { name: 'Kinh tế bùng nổ', icon: '🚀', desc: 'Khách đông hơn 25% nhưng nguyên liệu đắt hơn 10%.', cust: 1.25, ingr: 1.1, fx: 'sparkle', filter: 'saturate(1.35) brightness(1.04)' },
  storm: { name: 'Bão rào', icon: '⛈️', desc: 'Mưa bão liên tục, khách ít hơn 5% nhưng thuê người rẻ hơn 15%.', weather: { rain: 4, cloud: 1.2, sun: 0.3, hot: 0.1 }, cust: 0.95, hire: 0.85, fx: '', filter: 'brightness(.78) hue-rotate(18deg) saturate(.95)' },
};
DATA.SCN_ORDER = ['plain', 'plain', 'market_day', 'festival', 'union', 'rain', 'tourist', 'heat', 'night', 'inflation', 'harvest', 'cold', 'boom', 'festival', 'storm', 'union', 'tourist', 'night', 'rain', 'cold', 'festival', 'boom', 'harvest', 'heat', 'tourist', 'inflation', 'union', 'night', 'boom', 'festival'];
DATA.CHAPTERS.forEach((c) => { c.scnKey = DATA.SCN_ORDER[c.id - 1] || 'plain'; c.scn = DATA.SCN[c.scnKey]; });
DATA.CHAPTERS.forEach((c, i) => { c.seed = Math.round((DATA.SEED * (1 + (c.id - 1) * 0.3)) / 50000) * 50000; const nx = DATA.CHAPTERS[i + 1]; c.reward = nx ? 'Mở khóa ' + nx.name : 'Hoàn thành đế chế'; });
DATA.CH_COUNT = { easy: 20, normal: 24, hard: 30 }; // số chương của từng độ khó
DATA.chCount = (diff) => DATA.CH_COUNT[diff] || DATA.CHAPTERS.length;
DATA.chapters = (diff) => DATA.CHAPTERS.slice(0, DATA.chCount(diff));
DATA.CHAPTER_STORY = {
  2: [
    { who: 'ongbay', text: 'Trả xong nợ cho Sáu Cáo rồi, nhưng ông còn một ước mơ: có cái xe đẩy riêng ở góc phố, khỏi gánh nặng vai nữa.' },
    { who: 'ti', text: 'Vậy mình vay thêm một khoản nhỏ mua xe nha ông. Cháu hứa sẽ bán thật đắt hàng!' },
    { who: 'saucao', text: 'Lần này tôi cho ông vay có lãi. Tám ngày nữa, đủ cả vốn lẫn lãi nhé!' },
  ],
  3: [
    { who: 'ongbay', text: 'Tí ơi, người ta cho thuê mặt bằng ngay mặt phố. Mở cửa hàng thật sự, ông mừng quá!' },
    { who: 'ti', text: 'Nhưng mặt phố có nhiều chuyện lắm ông: mất điện, thanh tra, cả trộm nữa. Mình phải xin giấy phép, mua máy phát điện, thuê bảo vệ.' },
    { who: 'saucao', text: 'Khôn ra rồi đấy. Nhưng chín ngày thôi, khoản vay lớn hơn nhiều đó nghe!' },
  ],
  4: [
    { who: 'ti', text: 'Ông ơi, khách quen khen xôi ngon khắp nơi. Có người xin mở chi nhánh bên quận bên kia!' },
    { who: 'ongbay', text: 'Chuỗi tiệm Ông Bảy... nghe oai quá. Nhưng càng lớn, càng phải giữ chữ tín và giữ hương vị xôi nếp.' },
    { who: 'saucao', text: 'Tôi sẽ góp vốn, nhưng phải trả đủ đúng hạn. Làm ăn lớn không đùa được!' },
  ],
  5: [
    { who: 'ongbay', text: 'Ông chưa bao giờ nghĩ xôi nếp của ông lại cần cả một cái xưởng. Mười một ngày để làm nên chuyện, Tí nhé!' },
    { who: 'ti', text: 'Có xưởng rồi mình đồ được thật nhiều, cung cấp cho cả chục điểm bán, ông ơi!' },
    { who: 'saucao', text: 'Vốn lớn thì lãi lớn, mà nợ cũng lớn. Tôi chờ đấy, ông Bảy.' },
  ],
  6: [
    { who: 'ti', text: 'Khách đặt xôi qua mạng nhiều quá ông ơi! Mình phải có xe giao tận nơi thôi.' },
    { who: 'ongbay', text: 'Xôi phải giao khi còn nóng hổi, lá chuối còn thơm. Mười hai ngày, mình làm cho ra trò!' },
  ],
  7: [
    { who: 'ongbay', text: 'Hội chợ ẩm thực năm nay mời tiệm mình, Tí à. Vinh dự lắm!' },
    { who: 'ti', text: 'Người đông như hội, mình chuẩn bị thật nhiều xôi nhé ông. Mười ba ngày liền đó!' },
    { who: 'saucao', text: 'Nghe nói ông lên báo rồi. Đừng để mất uy tín đấy.' },
  ],
  8: [
    { who: 'ti', text: 'Ông ơi, có người mời mình ra bán ở khu du lịch biển. Khách Tây thích xôi lắm!' },
    { who: 'ongbay', text: 'Biển xanh, nắng vàng, xôi nếp thơm. Ông đi cùng cháu, mười bốn ngày thôi!' },
  ],
  9: [
    { who: 'ongbay', text: 'Quầy ở ga tàu à? Khách vội lắm đấy Tí, mình phải nhanh tay hơn nữa.' },
    { who: 'ti', text: 'Cháu luyện gói lá cả tuần rồi, ông yên tâm. Mười lăm ngày, cố lên!' },
  ],
  10: [
    { who: 'saucao', text: 'Cả một con phố xôi giữa Sài Thành? Tôi phải nể ông Bảy thật rồi.' },
    { who: 'ongbay', text: 'Nhờ bà con ủng hộ cả. Mười sáu ngày nữa, mình lại làm nên chuyện!' },
    { who: 'ti', text: 'Phố xôi Sài Thành, nghe oai ghê ông ơi!' },
  ],
  11: [
    { who: 'ti', text: 'Ông ơi, sân bay quốc tế mời mình mở quầy. Khách nước ngoài mê xôi lạp xưởng lắm!' },
    { who: 'ongbay', text: 'Ông chưa đi máy bay bao giờ, giờ xôi của ông lại ở sân bay. Mười bảy ngày, cố gắng nào!' },
  ],
  12: [
    { who: 'ongbay', text: 'Xôi nếp của ông sắp sang tận nước bạn. Tí nhớ giữ đúng hương vị nhé.' },
    { who: 'ti', text: 'Cháu sẽ gói thật kỹ từng phần. Mười tám ngày, mình xuất khẩu xôi Việt!' },
    { who: 'saucao', text: 'Ông đi xa quá rồi. Nhưng nợ vẫn phải trả đủ nhé!' },
  ],
  13: [
    { who: 'ti', text: 'Nhà hàng xôi được xếp sao vàng, ông ơi! Khách sành ăn đặt bàn kín cả tuần.' },
    { who: 'ongbay', text: 'Sao vàng hay sao đỏ, quan trọng là xôi dẻo thơm. Mười chín ngày, mình giữ vững nhé!' },
  ],
  14: [
    { who: 'ti', text: 'Ông ơi, mình có cả robot đồ xôi rồi! Nhưng cháu vẫn thích ông tự tay nêm nếp.' },
    { who: 'ongbay', text: 'Máy móc giúp nhanh, nhưng cái tình trong miếng xôi thì ông vẫn giữ. Hai mươi ngày, mình đi tiếp!' },
    { who: 'saucao', text: 'Xôi vũ trụ ư? Ông Bảy, tôi cạn lời rồi.' },
  ],
  15: [
    { who: 'ongbay', text: 'Chương cuối rồi Tí ơi. Từ gánh xôi đầu ngõ đến đây, ông chưa bao giờ dám mơ.' },
    { who: 'ti', text: 'Hai mươi mốt ngày để đưa xôi Việt ra thế giới, mình làm được ông ơi!' },
    { who: 'saucao', text: 'Nếu ông làm được, tôi xin làm đối tác lâu dài. Cố lên, ông Bảy!' },
  ],
};

DATA.CHAPTERS.forEach((c) => {
  if (c.id < 16) return;
  DATA.CHAPTER_STORY[c.id] = [
    { who: 'ti', text: 'Ông ơi, mình đến ' + c.name + ' rồi! ' + c.desc },
    { who: 'ongbay', text: 'Còn ' + c.days + ' ngày để làm nên chuyện, Tí nhé. Xôi nếp phải giữ cho đúng vị!' },
    ...(c.id % 3 === 0 ? [{ who: 'saucao', text: 'Nợ ' + c.name + ' không nhỏ đâu ông Bảy. Tôi chờ xem!' }] : []),
  ];
});

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
  { id: 'gen', name: 'Máy phát điện', icon: '🔌', venue: 'shop', desc: (l) => ['Chưa có: thỉnh thoảng mất điện, phải đứng chờ không bán được', 'Có máy phát: mất điện vẫn sáng đèn, bán bình thường'][l], costs: [320000] },
  { id: 'lic', name: 'Giấy phép kinh doanh', icon: '📜', venue: 'shop', desc: (l) => ['Chưa có: bị phạt khi đoàn kiểm tra đến', 'Đã có giấy phép: không bị phạt kinh doanh'][l], costs: [200000] },
  { id: 'atp', name: 'An toàn thực phẩm', icon: '🧼', venue: 'shop', desc: (l) => ['Chưa có: bị phạt khi thanh tra vệ sinh', 'Có chứng nhận: thanh tra vệ sinh không phạt, khách tin tưởng hơn'][l], costs: [180000] },
  { id: 'ti', name: 'Nhờ Tí gói hộ', icon: '👦', desc: (l) => ['Tự tay gói từng phần', 'Tí tự lấy xôi và phục vụ khách mỗi 6 giây'][l], costs: [650000] },
];
DATA.UPG_BY = Object.fromEntries(DATA.UPGRADES.map((u) => [u.id, u]));

/* ===== Nhân viên ===== */
DATA.STAFF = [
  { id: 'hoa', name: 'Chị Hoa', role: 'Thợ đồ xôi phụ', hire: 150000, wage: 60000, look: { skin: '#e8b890', hair: '#2a1a14', style: 'bun', shirt: '#c8506a', pants: '#3a3040' }, desc: 'Phụ ông đồ xôi: nồi chứa thêm 2 mẻ, xôi chín nhanh hơn 10%, ra thêm 5% phần.', fx: { potCap: 2, cook: 0.1, yield: 0.05 } },
  { id: 'minh', name: 'Anh Minh', role: 'Người đi chợ', hire: 180000, wage: 50000, look: { skin: '#d9a070', hair: '#1c1c1c', style: 'short', shirt: '#4a7ab0', pants: '#33404f' }, desc: 'Mặc cả giỏi: nguyên liệu rẻ hơn 10%. Đi chợ hộ nên đỡ mất công.', fx: { buy: 0.1 } },
  { id: 'linh', name: 'Bạn Linh', role: 'Chạy đơn online', hire: 200000, wage: 70000, look: { skin: '#f0c8a0', hair: '#3a2418', style: 'pigtails', shirt: '#38a878', pants: '#2a3a3a' }, desc: 'Nhận đơn qua mạng: thỉnh thoảng bán thêm 2-4 phần giao tận nơi, không cần ghế.', fx: { online: 1 } },
  { id: 'ba', name: 'Chú Ba', role: 'Bảo vệ chợ', hire: 120000, wage: 45000, look: { skin: '#c89868', hair: '#555', style: 'cap', shirt: '#2f4a38', pants: '#222', hat: '#2f4a38' }, desc: 'Phí chợ giảm một nửa, đuổi kẻ gây rối, khách chịu chờ thêm 10%.', fx: { fee: 0.5, guard: 1, patience: 0.1, theft: 0.3 } },
  { id: 'bv', name: 'Bác Tư bảo vệ', role: 'Bảo vệ ca ngày', hire: 100000, wage: 40000, look: { skin: '#c89060', hair: '#8a8a8a', style: 'cap', shirt: '#2a3f6a', pants: '#1c2434', hat: '#2a3f6a', mustache: true, elder: true }, desc: 'Ngồi canh cửa tiệm: chặn 60% vụ trộm tiền và xôi (trộm chỉ xuất hiện ở cửa hàng mặt phố).', fx: { theft: 0.6 } },
  { id: 'mai', name: 'Cô Mai tuần tra', role: 'Bảo vệ nữ', hire: 80000, wage: 30000, look: { skin: '#e8b890', hair: '#1c1c1c', style: 'bun', shirt: '#2a3f6a', pants: '#1c2434' }, desc: 'Đi vòng quanh chợ: chặn 45% vụ trộm, rẻ lương.', fx: { theft: 0.45 } },
  { id: 'vesi', name: 'Vệ sĩ Hổ', role: 'Vệ sĩ chuyên nghiệp', hire: 260000, wage: 90000, look: { skin: '#b88058', hair: '#111', style: 'short', shirt: '#14141c', pants: '#14141c', shades: true, wide: true }, desc: 'Cao to dữ dằn: chặn 90% vụ trộm, đuổi côn đồ, giảm phí chợ 25%.', fx: { theft: 0.9, guard: 1, fee: 0.25 } },
  { id: 'genz', name: 'Em Gen Z', role: 'Chạy TikTok', hire: 300000, wage: 80000, look: { skin: '#f0c8a0', hair: '#c03a7a', style: 'long', shirt: '#7a5ad0', pants: '#202030' }, desc: 'Quay clip bán xôi: khách đông hơn 20%, thỉnh thoảng có khách "check-in" boa lớn.', fx: { cust: 0.2, viral: 1 } },
  { id: 'tu', name: 'Kế toán Tư', role: 'Quản lý sổ sách', hire: 260000, wage: 60000, look: { skin: '#e0b088', hair: '#7a7a7a', style: 'short', shirt: '#e8e8e0', pants: '#3a3a48', glasses: true }, desc: 'Ghi sổ chặt chẽ: không hao hụt nguyên liệu, giữ vốn sinh lãi 3% mỗi ngày.', fx: { noWaste: 1, interest: 0.03 } },
  { id: 'sv', name: 'Sinh viên cuối tháng', role: 'Phục vụ bán thời gian', hire: 100000, wage: 40000, look: { skin: '#f0c8a0', hair: '#1c1c1c', style: 'short', shirt: '#e8c040', pants: '#3a5a8a', bag: true }, desc: 'Rẻ nhưng nhanh nhẹn: tự phục vụ khách mua 1 phần mỗi 8 giây.', fx: { auto: 8 } },
];
DATA.STAFF.push(
  { id: 'bep', name: 'Bếp phó Hùng', role: 'Đầu bếp đồ xôi', hire: 320000, wage: 90000, ch: 4, look: { skin: '#d8a070', hair: '#1c1c1c', style: 'chef', shirt: '#f4f4f0', pants: '#2a2a34', apron: true, mustache: true }, desc: 'Tay nghề cao: nồi chứa thêm 3 mẻ, xôi chín nhanh hơn 12%, ra thêm 5% phần.', fx: { potCap: 3, cook: 0.12, yield: 0.05 } },
  { id: 'ql', name: 'Quản lý Thu', role: 'Quản lý cửa hàng', hire: 420000, wage: 110000, ch: 6, look: { skin: '#f0c8a0', hair: '#2a1a14', style: 'bob', shirt: '#2a3a5a', pants: '#1c2434', glasses: true, tie: true }, desc: 'Điều hành trơn tru: khách đông hơn 10%, nguyên liệu rẻ hơn 5%, khách chịu chờ thêm 10%.', fx: { cust: 0.1, buy: 0.05, patience: 0.1 } },
  { id: 'ship', name: 'Shipper Tài', role: 'Giao xôi tận nơi', hire: 500000, wage: 120000, ch: 8, look: { skin: '#c89060', hair: '#1c1c1c', style: 'helmet', shirt: '#38a838', pants: '#2a2a2a', hat: '#38a838' }, desc: 'Phóng xe đi giao: tự phục vụ khách mua 1 phần mỗi 7 giây.', fx: { auto: 7 } },
  { id: 'mkt', name: 'Marketing Vy', role: 'Quảng bá thương hiệu', hire: 650000, wage: 150000, ch: 10, look: { skin: '#f0c8a0', hair: '#d85aa8', style: 'long', shirt: '#ffffff', pants: '#3a3a5a', shades: true, bow: '#ff5a8a' }, desc: 'Quảng cáo khắp mạng: khách đông hơn 25%, thỉnh thoảng có khách check-in boa lớn.', fx: { cust: 0.25, viral: 1 } },
  { id: 'robot', name: 'Robot Xôi 01', role: 'Máy đồ xôi tự động', hire: 900000, wage: 180000, ch: 14, look: { skin: '#a8b0b8', hair: '#5a6068', style: 'helmet', shirt: '#5a6068', pants: '#3a4048', hat: '#c8ced4', shades: true, wide: true }, desc: 'Không biết mệt: nồi chứa thêm 4 mẻ, xôi chín nhanh hơn 25%, ra thêm 8% phần.', fx: { potCap: 4, cook: 0.25, yield: 0.08 } },
  { id: 'cfo', name: 'Giám đốc Tài chính Lan', role: 'Quản lý vốn', hire: 1100000, wage: 200000, ch: 18, look: { skin: '#e8c098', hair: '#3a3a3a', style: 'bun', shirt: '#2a2f3a', pants: '#1c1c28', glasses: true, bow: '#c8a040' }, desc: 'Đàm phán giá tốt: nguyên liệu rẻ hơn 12%, phí chợ giảm 20%.', fx: { buy: 0.12, fee: 0.2 } },
  { id: 'global', name: 'Đại sứ thương hiệu Kim', role: 'Gương mặt quốc tế', hire: 1400000, wage: 260000, ch: 22, look: { skin: '#f4d2b0', hair: '#c03a7a', style: 'ponytail', shirt: '#7a5ad0', pants: '#202030', phones: '#ffd23a', band: '#ffd23a' }, desc: 'Nổi tiếng toàn cầu: khách đông hơn 35%, boa lớn thường xuyên.', fx: { cust: 0.35, viral: 1 } },
  { id: 'master', name: 'Bếp trưởng Michelin', role: 'Bậc thầy ẩm thực', hire: 1900000, wage: 340000, ch: 26, look: { skin: '#e0b088', hair: '#cfcfcf', style: 'chef', shirt: '#f4f4f0', pants: '#22222c', apron: true, beard: true, elder: true }, desc: 'Món ăn đẳng cấp: ra thêm 12% phần, chín nhanh hơn 20%, nồi chứa thêm 3 mẻ, khách đông hơn 10%.', fx: { yield: 0.12, cook: 0.2, potCap: 3, cust: 0.1 } },
);
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
  { id: 'thanhtra', title: 'Đội thanh tra vệ sinh', icon: '🧾', text: 'Thanh tra ghé kiểm tra. Tiệm xe đẩy nộp 30.000đ (Chú Ba lo được); cửa hàng mặt phố bị phạt thêm nếu thiếu giấy phép hoặc an toàn thực phẩm.', fee: 30000 },
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
  { name: 'Cậu shipper Khoa', look: { skin: '#e0b088', hair: '#2a1a14', style: 'cap', shirt: '#38a838', pants: '#2a2a2a', hat: '#38a838' }, quips: ['Đơn giao gấp, cho em phần mang đi!', 'Anh Bảy ơi nhanh giúp em chút.',     'Xôi ông là đơn đắt nhất đó nha.'] },
  { name: 'Anh Hùng văn phòng', look: { skin: '#e8c098', hair: '#1c1c1c', style: 'short', shirt: '#e8eef4', pants: '#2a2f3a', glasses: true, tie: true }, quips: ['Họp lúc tám giờ, cho anh phần mang đi!', 'Xôi nóng thì anh mới tỉnh táo làm việc.', 'Anh trả tiền mặt nhé, gói gọn giúp anh.'] },
  { name: 'Chị Thảo sinh viên mỹ thuật', look: { skin: '#f0c8a0', hair: '#7a3a20', style: 'ponytail', shirt: '#e87a9a', pants: '#3a4a6a', phones: '#38a8d8', band: '#ffd23a' }, quips: ['Em vẽ xong đêm qua, đói rã rời luôn!', 'Xôi đẹp quá, em muốn vẽ lại quá đi.', 'Cho em thêm hành phi nha ông.'] },
  { name: 'Cô Hương bán hoa', look: { skin: '#e8b890', hair: '#2a1a14', style: 'curly', shirt: '#f0a0c0', pants: '#4a3a4a', flower: '#ff5a8a' }, quips: ['Hoa tươi, xôi nóng, buổi sáng đẹp ghê!', 'Cô mua hai phần cho hai chị em.', 'Xôi này thơm mùi lá chuối quá.'] },
  { name: 'Bác Tư thợ may', look: { skin: '#d8a878', hair: '#9a9a9a', style: 'fedora', shirt: '#7a6a5a', pants: '#2a2a30', hat: '#5a4a3a', mustache: true, elder: true, glasses: true }, quips: ['Bác ăn xôi ông Bảy từ hồi trẻ rồi.', 'Cho bác phần ít đường thôi nhé.', 'Nhanh tay lên, bác còn mở tiệm.'] },
  { name: 'Cu Tin', look: { skin: '#f4d2b0', hair: '#1c1c1c', style: 'spiky', shirt: '#58b0e0', pants: '#4a5a9a', small: true }, quips: ['Mẹ ơi con muốn ăn xôi gấc đỏ!', 'Cho con nhiều lạc nha ông.', 'Xôi nóng quá, thổi thổi!'] },
  { name: 'Em Mai học sinh', look: { skin: '#f4d2b0', hair: '#2a1a14', style: 'bob', shirt: '#f4f4f0', pants: '#2a3a7a', small: true, bag: true }, quips: ['Sắp vào lớp rồi, bán cho em liền nha!', 'Em ăn xôi đỗ xanh mỗi sáng.', 'Cô giáo khen xôi ông ngon lắm.'] },
  { name: 'Chú Nam tài xế', look: { skin: '#c89060', hair: '#1c1c1c', style: 'helmet', shirt: '#3a6a4a', pants: '#2a2a2a', hat: '#e8a020' }, quips: ['Chạy xe sớm, đói quá ông Bảy ơi!', 'Cho chú hai phần, một ăn một mang.', 'Gói chắc tay nhé, chú vừa chạy vừa ăn.'] },
  { name: 'Dì Ba đi chợ', look: { skin: '#dcaa80', hair: '#bcbcbc', style: 'scarf', shirt: '#7a9a5a', pants: '#3a2a2a', elder: true, apron: true }, quips: ['Dì mua xôi về cho cháu nội nè.', 'Sáng nay rau rẻ, xôi cũng phải ngon!', 'Cho dì phần thật đầy nghe.'] },
  { name: 'Anh Long tập gym', look: { skin: '#d8a070', hair: '#1c1c1c', style: 'short', shirt: '#202028', pants: '#2a2a34', wide: true, phones: '#e84a3a' }, quips: ['Xôi là tinh bột tốt, anh lấy hai phần!', 'Tập xong phải nạp năng lượng liền.', 'Thêm trứng cút nha ông, bổ sung đạm.'] },
  { name: 'Cô y tá Linh', look: { skin: '#f0c8a0', hair: '#2a1a14', style: 'bun', shirt: '#d8f0f0', pants: '#4a8a9a', mask: true }, quips: ['Trực đêm xong, cho cô phần xôi nóng.', 'Ăn sáng đủ chất cho khỏe nha mọi người.', 'Cô lấy mang về bệnh viện ạ.'] },
  { name: 'Ông Tám hưu trí', look: { skin: '#d8a878', hair: '#e8e8e8', style: 'bald', shirt: '#6a8a6a', pants: '#3a3a3a', beard: true, elder: true, glasses: true }, quips: ['Ông đi dạo sáng, ghé ăn xôi bạn cũ.', 'Xôi này ngon như hồi chiến tranh nhớ lại.', 'Cho ông phần như thường lệ nhé.'] },
  { name: 'Cậu Kiên họa sĩ', look: { skin: '#e8c098', hair: '#2a1a14', style: 'beret', shirt: '#4a4a58', pants: '#2a2a30', hat: '#c83a3a', beard: true }, quips: ['Màu xôi gấc đỏ đẹp thật, cho tôi một phần.', 'Tôi đang vẽ phố cổ, cần ăn gì đó nhanh.', 'Cảm hứng đến khi ăn xôi ông Bảy đó.'] },
  { name: 'Chị Vy blogger', look: { skin: '#f0c8a0', hair: '#d85aa8', style: 'long', shirt: '#ffffff', pants: '#3a3a5a', shades: true, bow: '#ff5a8a' }, quips: ['Cho chị chụp ảnh xôi một tí nha!', 'Review xôi ông Bảy, chắc chắn năm sao.', 'Gói đẹp đẹp để chị quay clip nhé.'] },
  { name: 'Bé Na', look: { skin: '#f4d2b0', hair: '#3a2418', style: 'pigtails', shirt: '#f8d84a', pants: '#e87a9a', small: true }, quips: ['Con thích xôi ngô vàng vàng!', 'Ông ơi cho con xin thêm một tí.', 'Ngon quá, con ăn hết luôn!'] },
  { name: 'Bác Hải bảo vệ', look: { skin: '#c89060', hair: '#555', style: 'cap', shirt: '#2a4a6a', pants: '#1c2434', hat: '#2a4a6a', mustache: true, elder: true }, quips: ['Hết ca đêm, cho bác phần xôi ấm bụng.', 'Chợ yên ắng nhờ có bác đấy nhé.', 'Xôi nóng nóng, bác cảm ơn nhé.'] },
  { name: 'Cô Lụa thợ may', look: { skin: '#e0b088', hair: '#3a2418', style: 'curly', shirt: '#9a5ab0', pants: '#3a3040', glasses: true }, quips: ['Cô may đồ cả đêm, đói quá chừng.', 'Cho cô xôi lạc, hơi nhiều đường nha.', 'Ông Bảy bán đắt hàng quá nhỉ.'] },
  { name: 'Chú Cường đầu bếp', look: { skin: '#d8a070', hair: '#1c1c1c', style: 'chef', shirt: '#f4f4f0', pants: '#2a2a34', apron: true, mustache: true }, quips: ['Đầu bếp mà mê xôi ông Bảy đó nha!', 'Ông cho chú học bí quyết đồ xôi với.', 'Gói cho chú thật chắc để mang vào bếp.'] },
  { name: 'Thầy Quang giáo viên', look: { skin: '#e8c098', hair: '#3a3a3a', style: 'short', shirt: '#6a8ab0', pants: '#2a2f3a', glasses: true, tie: true, bag: true }, quips: ['Thầy ăn nhanh còn kịp tiết đầu.', 'Cho thầy hai phần, một phần cho đồng nghiệp.', 'Xôi ngon, thầy khen học trò cũng khen.'] },
  { name: 'Anh Phát DJ', look: { skin: '#d8a070', hair: '#c03a7a', style: 'spiky', shirt: '#1a1a2a', pants: '#3a3a5a', phones: '#38d8a8', shades: true }, quips: ['Thức xuyên đêm, nạp xôi cho lại sức!', 'Xôi này quá đỉnh, anh mê luôn.', 'Cho anh thêm hành phi nha, nhạc to nhưng xôi phải thơm.'] },
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
    { who: 'saucao', text: 'Hết hạn rồi, ông Bảy. Tiền đâu? Không đủ thì như đã hẹn, cái bếp này giờ là của tôi.' },
    { who: 'ongbay', text: 'Tôi... xin thêm một cơ hội nữa được không? Chỉ cần thêm ít ngày thôi...' },
    { who: 'ti', text: 'Đừng buồn ông ơi, mình làm lại từ đầu. Lần này nhất định sẽ giữ được tiệm!' },
  ],
};
