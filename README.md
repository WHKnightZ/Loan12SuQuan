# Loạn 12 Sứ Quân

### Chức năng bố sung:

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
- [x] Sau khi ăn 4 mà số lượt >=2 sẽ show text còn bao nhiêu lượt
- [x] Tile giọt nước là gì? Ở phần 2 có 8 tile thay vì 6, check lại => cũng là kinh nghiệm nhưng mà ít hơn
- [x] Hiệu ứng kiếm (sau khi kiếm đến nơi sẽ tan dần + xuất hiện hiệu ứng gây sát thương)
- [x] Hiệu ứng máu, mana, năng lượng bay từ chỗ ăn tile vào
- [ ] ~~Hiệu ứng máu hồi + mana ... (bay lên từ avatar)~~
- [ ] Thiếu chức năng check xem hết nước đi chưa => Hiệu ứng xoá map cũ, generate map mới
- [ ] Hiệu ứng rơi xuống núng nính của loạn 12 android (https://youtu.be/4Tr4awGTUck?t=18)
- [ ] Server + nâng cấp
- [ ] Ải, chương như DVKN
- [ ] Vật phẩm, skill theo hero
- [ ] Ban đầu sẽ xử lý ở FE, về sau sẽ implement socket để xử lý BE
- [ ] Admin sẽ dùng Nextjs (Reactjs) làm FE, Giao diện chơi dùng thuần js canvas
- [ ] Hiệu ứng chain lightning làm như nào?
- [ ] Thay đào => power (khi đầy power sẽ được crit dam trong 1 lượt sau đó reset) + đổi texture của power => gradient
- [ ] Thêm mỗi lượt có 30s, không đi sẽ mất lượt
- [ ] Hiệu ứng nhấp nháy ngoài biên khi đổi lượt
- [ ] Hiệu ứng rung avatar khi bị tấn công
- [ ] Loading
- [ ] Thay màu các bar cho giống vật phẩm + giảm bar height nhỏ đi, tăng padding bar lên 2px
- [ ] Giảm máu sau khi kiếm đến nơi? => Cần phải đợi effect xong thì mới đổi lượt

### Bug:

- [x] Click ngoài canvas không select tile nữa

### Improve

- [ ]

### Referrences:

- https://easings.net/
