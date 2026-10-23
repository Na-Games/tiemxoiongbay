/* Bản đồ chương: mỗi độ khó có 5 chương, hoàn thành chương trước mới mở chương sau */
const Campaign = {
  start(diff, n) {
    Sound.init(); G = newGame(diff, n); Save.root.game = G; Save.root.records.plays++; Save.save();
    const lines = n === 1 ? (Save.root.introSeen ? null : DATA.STORY) : DATA.CHAPTER_STORY[n];
    UI.go(lines ? 'story' : 'dayintro', lines ? { lines: n === 1 ? null : lines } : {});
  },
  venueNote(ch) {
    return ch.venue === 'shop'
      ? '⚠️ Cửa hàng mặt phố: thỉnh thoảng <b>mất điện</b> (cần 🔌 máy phát điện), <b>đoàn kiểm tra</b> phạt nếu thiếu 📜 giấy phép hoặc 🧼 an toàn thực phẩm, và có <b>kẻ trộm</b> (thuê 🛡️ bảo vệ).'
      : '🛺 Bán ngoài chợ bằng gánh hoặc xe đẩy: ít rủi ro, thỉnh thoảng gặp côn đồ đòi bảo kê.';
  },
};

