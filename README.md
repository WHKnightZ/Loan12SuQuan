# Loạn 12 Sứ Quân

### Demo:

https://12lords.khanhnn.xyz

### Chức năng bổ sung:

- [x] Hiệu ứng khi select 1 tile
- [x] Ăn kiếm đỏ nổ khu vực xung quanh
- [x] Đổi sprite cũ sang mới
- [x] Thêm avatar 2 nhân vật
- [x] Animation chạy quanh để báo người chơi active
- [x] Hệ thống hint: Hint tốt nhất và hint random theo chỉ số thông minh + hiệu ứng mũi tên hint
- [x] Hiệu ứng tan biến + tile rơi xuống dần dần từ trái qua phải (fade out + fade in)
- [x] Hiệu ứng combo x2, x3, x4, Hiệu ứng nổ sao khi combo
- [x] Action khi ăn các tile (kiếm, máu, mana, năng lượng)
- [x] Đổi lượt người chơi
- [x] Đếm số lượng 4 như thế nào?
- [x] Làm chức năng test combo 4 được cộng bao nhiêu turn
- [x] Sau khi ăn 4 mà số lượt >= 2 sẽ show text còn bao nhiêu lượt
- [x] Tile giọt nước là gì? Ở phần 2 có 8 tile thay vì 6, check lại => cũng là kinh nghiệm nhưng mà ít hơn
- [x] Hiệu ứng kiếm (sau khi kiếm đến nơi sẽ tan dần + xuất hiện hiệu ứng gây sát thương)
- [x] Hiệu ứng máu, mana, năng lượng bay từ chỗ ăn tile vào
- [ ] ~~Hiệu ứng máu hồi + mana ... (bay lên từ avatar)~~
- [ ] Thiếu chức năng check xem hết nước đi chưa => Hiệu ứng xoá map cũ, generate map mới
- [ ] Hiệu ứng rơi xuống núng nính của loạn 12 sq android (https://youtu.be/4Tr4awGTUck?t=18)
- [ ] Server + nâng cấp
- [ ] Ải, chương như DVKN
- [ ] Vật phẩm, skill theo hero
- [ ] Ban đầu sẽ xử lý ở FE, về sau sẽ implement socket để xử lý BE
- [ ] Admin sẽ dùng Nextjs (Reactjs) làm FE, Giao diện chơi dùng thuần js canvas
- [ ] Hiệu ứng chain lightning làm như nào?
- [x] Thay đào => power (khi đầy power sẽ được crit dam trong 1 lượt sau đó reset) + đổi texture của power => gradient
- [ ] Hiệu ứng full power (giống khi dùng item kiếm), cần tính lại xem mỗi đào sẽ được bao nhiêu năng lượng là hợp lý
- [ ] Thêm mỗi lượt có 30s, không đi sẽ mất lượt
- [ ] Hiệu ứng nhấp nháy ngoài biên khi đổi lượt
- [x] Hiệu ứng rung avatar khi bị tấn công
- [x] Loading
- [x] Thay màu các bar cho giống vật phẩm + giảm bar height nhỏ đi, tăng padding bar lên 2px
- [x] Giảm máu sau khi kiếm đến nơi? => Cần phải đợi effect xong thì mới đổi lượt, đã chuyển thành delay 40 frame
- [ ] Duration animation gain (lose) máu sẽ phụ thuộc theo chênh lệch, chênh lệch càng lớn thì duration càng lâu
- [ ] Thêm comment đầy đủ
- [x] Chức năng tạm: Chọn máy đánh cùng: Bao gồm các chỉ số: Thông minh, Sức mạnh, May mắn (Hiện chưa có các chỉ số)
- [x] Điều kiện Thắng/Thua
- [ ] Không split texture nữa, dùng spritesheet
- [x] Thêm nhiều loại font chữ mới
- [ ] Hàm draw font có thêm textAlign, wrapText (defaultTrue), xuống dòng keep textAlign + gap giữa các dòng dựa theo height cao nhất của ký tự
- [x] Quản lý state
- [ ] Slide transition
- [x] Map tương tự Candy Crush, vẽ sẵn 40-50 points, lặp lại từ đầu, mỗi point là 1 rounded image có border, hệ toạ độ 0-1, hỗ trợ vuốt để scroll
- [x] Vẽ bao nhiêu điểm trên map thì bị tụt FPS? 1000? Sau đó thử tối ưu virtual scroll, và test với 10000 điểm
- [x] Chia toạ độ cho chu kỳ để ước lượng được khoảng hiện tại, sau đó check trong 3 khoảng hiện tại (-1 => 1) các điểm nằm trong màn hình để tối ưu render
- [x] Hiệu ứng scroll giật ngược khi kéo đến biên (của MAC)
- [ ] Tutorial kèm Dialog message có hình ảnh

### Bug:

- [x] Click ngoài canvas không select tile nữa
- [ ] Khi select mà Esc sẽ bị lỗi fadeOut, fadeIn
- [x] Đôi khi cuồng nộ không hoạt động
- [x] Màu của bar khi value = 0 hơi tối
- [x] Move mouse outside thì dragging phải bằng false

### Improves:

- [ ]

### References:

- https://easings.net/
