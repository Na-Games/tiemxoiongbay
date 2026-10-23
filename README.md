# Tiệm Xôi Ông Bảy

Game mô phỏng kinh doanh xôi sáng phong cách pixel-art, viết bằng HTML5 + CSS + JavaScript thuần (không cần cài thư viện, không cần build).

## Chạy game

Mở file `index.html` bằng trình duyệt (Chrome/Edge/Safari). Nên mở bằng máy chủ tĩnh để trình duyệt lưu dữ liệu ổn định:

```
cd "Tiệm xôi ông Bảy"
python -m http.server 8000
# rồi mở http://localhost:8000
```

Game thiết kế cho màn hình dọc (điện thoại) và tự thu nhỏ vừa khung trên máy tính.

## Mục tiêu

Ông Bảy nợ Sáu Cáo **1.500.000đ** (tuỳ độ khó), còn **7 ngày** để trả. Mỗi ngày:

1. **Mở đầu ngày** – xem thời tiết, sự kiện (chợ phiên, mưa, thanh tra, giá thịt tăng...). Ông cấp vốn 500.000đ (nếu lỗ ông bù cho đủ vốn). Tiền vượt trên vốn là quỹ trả nợ.
2. **Bếp** – mua nguyên liệu theo giá chợ hôm nay (chạm để mua 1, giữ để mua 5), chọn món + số mẻ rồi **Đi chợ & Đồ xôi** (quạt lửa để chín nhanh). 1 mẻ = 8 phần.
3. **Bảng giá** – đặt giá bán từng món. Rẻ thì đông khách, đắt quá khách bỏ đi.
4. **Gánh ra chợ & bán hàng** – bong bóng trên đầu khách ghi tên xôi và số phần. Chạm đúng món để bỏ vào túi, bấm **Gói lá** để xem hoạt cảnh trải lá, xúc xôi, gấp lá, buộc dây rồi giao cho khách. Khách sốt ruột sẽ bỏ đi, hết xôi thì khách buồn.
5. **Tổng kết** – doanh thu, chi phí, lương, xôi thừa bị chua, tiến độ trả nợ.

## Các tính năng

| Mục | Mô tả |
|---|---|
| Nâng cấp | 13 hạng mục nhiều cấp: nồi chõ, bếp, lá chuối gói sẵn, ghế nhựa, loa rao hàng, trà đá, biển hiệu, thùng ủ nóng, tủ lạnh, dù, cân, sổ tay thương lái, Tí gói hộ. Mỗi cái ảnh hưởng thật đến công thức game. |
| Nhân viên | 6 nhân viên với tác dụng khác nhau (thợ đồ xôi phụ, người đi chợ, chạy đơn online, bảo vệ, chạy TikTok, kế toán, sinh viên làm thêm), tốn lương mỗi ngày. |
| Món xôi | 15 món, học thêm bằng tiền, có món bí truyền mở khóa qua điểm danh ngày 7. |
| Hội làng | 11 trò dân gian (đập niêu, ném còn, bắt gà, lật lồng đèn, kéo co, nhảy bao bố, câu cá, bầu cua, rước đèn ông sao, đua thuyền rồng, đi cà kheo) theo 6 chủ đề, có đếm ngược 3-2-1, hiệu ứng nền và gợi ý riêng từng trò. Thưởng nguyên liệu, 3 vé mỗi ngày. |
| Điểm danh | Lịch 7 ngày theo ngày thật, nhận tiền/nguyên liệu/công thức. |
| Cài đặt | Âm lượng nhạc và hiệu ứng, 5 chủ đề nhạc nền, 3 chủ đề hiệu ứng âm thanh, rung 4 mức (kèm rung nhẹ khi bấm nút, lắc khung hình trên thiết bị không có động cơ rung), hiệu ứng hạt/chữ bay/gợn sóng chạm/viền tối/thời tiết/chuyển cảnh/CRT, hiệu ứng nền (đom đóm, cánh hoa, bụi vàng, đèn lồng), 9 giao diện màu, kiểu nút vuông hoặc bo tròn, độ sáng, cỡ chữ, toàn màn hình, giữ màn hình sáng, xuất/nhập mã lưu. |
| Hướng dẫn | 8 trang hướng dẫn chi tiết (mục tiêu, một ngày chơi, bếp, bảng giá, bán hàng, nâng cấp, hội làng từng trò, mẹo), mở từ trang chủ hoặc menu trong game. |

Toàn bộ hình ảnh nhân vật, đĩa xôi, cảnh vật được vẽ bằng code (canvas), âm thanh và nhạc tổng hợp bằng WebAudio nên không cần file ảnh/âm thanh (chỉ có icon ứng dụng trong `assets/`).

## Chương, kịch bản và nhân viên

- Dễ 20 chương, Thường 24 chương, Khó 30 chương (số ngày 7 → 36). Vốn mỗi sáng tăng dần theo chương.
- Mỗi chương có kịch bản riêng (mùa mưa, lễ hội, bão giá, ưu đãi nhân sự...) đổi màu cảnh, hiệu ứng nền, thời tiết, giá nguyên liệu, độ đông khách, giá thuê và lương.
- Nhân viên mới (bếp phó, quản lý, shipper, marketing, robot, giám đốc tài chính, đại sứ, bếp trưởng Michelin) mở khóa theo chương.
- Icon nguyên liệu vẽ riêng trong `js/icons.js`; cảnh nền, nhân vật, mèo, gánh xôi vẽ ở độ phân giải cao.
- Nút "Chơi lại từ đầu" ở trang chủ xóa toàn bộ dữ liệu sau hai bước cảnh báo.

## Toàn màn hình trên điện thoại

Trình duyệt chỉ cho ẩn thanh địa chỉ sau một cú chạm của người chơi. Game luôn tự vào toàn màn hình ở lần chạm đầu (không còn nút hay cài đặt bật/tắt). Dòng thông báo "Để thoát khỏi chế độ toàn màn hình, hãy kéo từ trên xuống" do chính Chrome hiển thị mỗi lần vào toàn màn hình nên web không tắt được; muốn không còn dòng này hãy cài game vào màn hình chính (Chrome ➜ Thêm vào màn hình chính) rồi mở bằng biểu tượng mới. iPhone/iPad không hỗ trợ Fullscreen API: bấm Chia sẻ ➜ "Thêm vào MH chính" rồi mở bằng biểu tượng mới (file `manifest.webmanifest` đã khai báo `display: fullscreen`). Cần mở qua máy chủ tĩnh (http hoặc https) để cài như ứng dụng.

## Cấu trúc

```
index.html
manifest.webmanifest
css/style.css
assets/fonts/VT323.ttf
assets/icon-192.png, icon-512.png
js/
  util.js        tiện ích, vòng lặp animation
  data.js        nguyên liệu, món, nâng cấp, nhân viên, sự kiện, thoại
  state.js       lưu trữ, công thức tính (Calc), sinh giá chợ/thời tiết
  device.js      toàn màn hình, giữ màn hình sáng
  audio.js       nhạc nền, hiệu ứng, rung
  sprites.js     vẽ nhân vật (bản chi tiết + bản nhỏ cho cảnh), đĩa xôi, vật dụng
  scenes.js      cảnh nền có hoạt họa (làng, bếp, chợ)
  ui.js          màn hình, chuyển cảnh, hộp thoại, hạt hiệu ứng
  screens/       title, bếp, tab nâng cấp/nhân viên/hội làng/điểm danh, chợ, cài đặt, hướng dẫn, mini game (minigames.js + minigames2.js)
  main.js
```

## Cập nhật mới

- **Cân bằng**: giá nhập rẻ hơn khoảng 30%, giá bán cao hơn khoảng 20%, vốn mỗi ngày 300.000đ. Tiền thu đúng bằng giá bạn đặt ở bảng giá (boa và phạt hiện riêng).
- **Bán hàng**: gói lá nhỏ đặt trên quầy (tối đa 3 gói), chạm đúng khách để giao, có nút **Từ chối** khi hết món.
- **Chương**: Dễ 10 chương, Thường 12 chương, Khó 15 chương; số ngày trả nợ tăng dần từ 7 đến 21 ngày (gánh xôi, xe đẩy, cửa hàng phố, chuỗi tiệm, xưởng xôi, hội chợ, ven biển, ga tàu, sân bay, đế chế...). Cửa hàng phố có mất điện, kiểm tra giấy phép, thanh tra vệ sinh và trộm; có nâng cấp máy phát điện, giấy phép, an toàn thực phẩm và 3 loại bảo vệ.
- **Hướng dẫn lần đầu** từng bước ở bếp, bảng giá, chợ (xem lại trong Hướng dẫn).
- **Toàn màn hình**: màn "Chạm để chơi toàn màn hình" ở lần mở đầu để ẩn thanh địa chỉ.
