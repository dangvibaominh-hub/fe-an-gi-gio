# Ăn Gì Giờ? — UI Component Specification

> **Cách dùng:** Dán file này cùng với `design-reference.md` vào đầu phiên làm việc với AI. File `design-reference.md` quy định luật chung (màu, navbar, danh sách trang). File này mô tả chi tiết cấu tạo, trạng thái và nội dung mẫu của TỪNG component — dùng khi yêu cầu AI build/code component cụ thể, để tránh AI tự bịa thêm field hoặc bỏ sót trạng thái.
>
> Mọi giá trị màu, bo góc, font tham chiếu lại `design-reference.md` mục 1 — không lặp lại định nghĩa ở đây để tránh lệch giữa 2 file.

---

## A. Component nền tảng (Foundational)

### A1. Button — Primary
- **Cấu tạo:** nền gradient terracotta → mustard, chữ trắng, bo góc tròn đầy đủ (pill), padding rộng rãi 2 trục
- **Trạng thái:** default / hover (sáng nhẹ + scale 1.02) / active (tối nhẹ) / disabled (giảm opacity 40%, không hover)
- **Dùng cho:** "Tìm món ngay", "Bắt đầu nấu", "Gửi đánh giá", "Tiếp tục", "Hoàn thành món ăn"
- **Quy tắc:** mỗi màn hình chỉ có **1** primary button nổi bật nhất tại một thời điểm

### A2. Button — Secondary / Outline
- **Cấu tạo:** viền terracotta 1.5px, nền trong suốt/cream, chữ terracotta, cùng bo góc với Primary
- **Trạng thái:** default / hover (nền terracotta nhạt 10%) / active / disabled
- **Dùng cho:** "Đăng nhập", "Tiếp tục với Google"

### A3. Icon Button
- **Cấu tạo:** hình tròn hoặc vuông bo góc, icon ở giữa, không viền ở trạng thái default
- **Trạng thái:** default / hover (nền cream đậm hơn nhẹ) / active (đổi màu icon sang terracotta nếu là toggle như "Lưu công thức")
- **Dùng cho:** bookmark, share, print, mic, send, close (X)

### A4. Text Link
- **Cấu tạo:** chữ thường, gạch chân khi hover hoặc khi active (với nav link)
- **Dùng cho:** nav link trong navbar, "Dùng thử không cần đăng nhập"

---

## B. Navbar
*(Cấu trúc tổng thể đã chốt ở `design-reference.md` mục 3 — phần dưới đây bổ sung chi tiết hành vi)*

- **Trạng thái scroll:** giữ nguyên vị trí fixed khi cuộn trang; có thể thêm shadow nhẹ khi `scrollY > 0` để tách khỏi nội dung
- **Trạng thái đăng nhập:** 
  - Chưa đăng nhập → hiện Button Secondary "Đăng nhập"
  - Đã đăng nhập → hiện avatar tròn 32-36px, click mở dropdown menu (Hồ sơ / Cài đặt / Đăng xuất)
- **Active link:** chỉ 1 link được bold + underline tại một thời điểm, tương ứng route hiện tại
- **Không hiện ở:** Cooking Mode (full-screen, không navbar)

---

## C. Ingredient Pill Input
- **Cấu tạo:** input text full-width, bo góc lớn (24px+), placeholder "Nhập nguyên liệu bạn đang có..."
- **Hành vi:** gõ xong nhấn Enter/dấu phẩy → text biến thành pill chip nằm trong cùng 1 ô input (giống tag input), mỗi pill có nút "x" nhỏ để xóa
- **Trạng thái pill:** default (nền sage nhạt, chữ charcoal) / hover trên nút x (đổi màu nút x sang terracotta)
- **Giới hạn:** không cứng nhắc số lượng, nhưng nên wrap nhiều dòng nếu pill nhiều

---

## D. Category Card
- **Cấu tạo:** ảnh món ăn full-bleed phía trên, tên danh mục đè lên góc dưới ảnh (overlay gradient tối nhẹ để chữ trắng dễ đọc), bo góc 12-16px
- **Trạng thái:** default / hover (scale ảnh nhẹ 1.03 + shadow tăng)
- **Nội dung mẫu:** "Món xào", "Món canh", "Món chiên", "Món hấp", "Món chay", "Tráng miệng"

---

## E. Recipe Card
- **Cấu tạo (top → bottom):**
  1. Ảnh món ăn (tỷ lệ 4:3 hoặc 1:1)
  2. Icon bookmark góc trên-phải ảnh (toggle lưu nhanh, không cần vào trang chi tiết)
  3. Tên món (1 dòng, truncate nếu dài)
  4. Hàng meta: Difficulty Badge + icon đồng hồ + thời gian + icon người + khẩu phần
- **Trạng thái:** default / hover (lift nhẹ + shadow tăng, toàn card có thể click) / đã lưu (icon bookmark fill terracotta)
- **Kích thước:** đồng nhất trong cùng 1 grid, không co giãn lệch hàng

## E1. Difficulty Badge
| Nhãn | Màu nền | Màu chữ |
|---|---|---|
| Dễ | sage `#8FAE7E` (nhạt 15-20%) | sage đậm hoặc charcoal |
| Trung bình | mustard `#E8A33D` (nhạt) | charcoal |
| Khó | terracotta `#E2725B` (nhạt) | terracotta đậm hoặc charcoal |

- **Hình dạng:** pill nhỏ, chữ in hoa hoặc thường đều được nhưng phải nhất quán toàn site
- **Không** dùng badge này cho mục đích nào khác ngoài thể hiện độ khó

---

## F. Filter Sidebar
- **Cấu tạo:** cột trái cố định (sticky khi cuộn), gồm các nhóm filter:
  - "Thời gian nấu" (vd: <30 phút, 30-60 phút, >60 phút)
  - "Số người ăn" (stepper hoặc chip số)
  - "Độ khó" (3 checkbox: Dễ / Trung bình / Khó)
- **Trạng thái:** mỗi filter có thể chọn nhiều (multi-select) trừ khi ghi chú khác
- **Nút phụ:** "Xóa bộ lọc" ở cuối sidebar khi có ít nhất 1 filter đang active

---

## G. Serving Stepper
- **Cấu tạo:** [nút trừ] — [số, vd "2 người"] — [nút cộng], nằm ngang, bo góc pill bao quanh cả cụm
- **Giới hạn:** min 1 người, không giới hạn cứng max nhưng nên có giới hạn hợp lý (vd 12)
- **Hành vi:** thay đổi số → các số lượng nguyên liệu trong Ingredient Checklist cập nhật theo tỷ lệ

---

## H. Ingredient Checklist
- **Cấu tạo:** 2 nhóm cố định theo đúng thứ tự:
  1. "Bạn đã có" — checkbox đã tick sẵn (giả định người dùng có những gì họ đã nhập)
  2. "Cần mua thêm" — checkbox chưa tick
- **Mỗi dòng nguyên liệu gồm:** checkbox + tên nguyên liệu + số lượng (vd "200g") + dòng phụ nhỏ hơn, màu nhạt hơn: hướng dẫn sơ chế (vd "Hành tím: bóc vỏ, thái mỏng")
- **Trạng thái checkbox:** unchecked / checked (có thể gạch ngang chữ khi checked, dùng cho cả 2 nhóm khi người dùng tự tick trong lúc chuẩn bị)

---

## I. Step List (khu vực hướng dẫn nấu)
- **Cấu tạo mỗi bước:**
  1. Số thứ tự bước (hình tròn, nền terracotta nhạt)
  2. Icon kỹ thuật nhỏ (vd icon chảo cho "áp chảo", icon dao cho thao tác cắt)
  3. Nội dung bước — văn phong chi tiết, dễ hiểu
  4. Thời gian ước tính (góc phải hoặc dưới nội dung)
  5. (Tùy bước) Caution Badge: "Bước này hơi khó" — nền terracotta nhạt, icon cảnh báo nhỏ
- **Cooking Term Tooltip:** các thuật ngữ như "phi thơm", "áp chảo" được gạch chân/in nghiêng nhẹ trong câu; hover (desktop) hoặc tap (mobile/touch) hiện popover nhỏ với 1 câu giải nghĩa đơn giản
- **Quy tắc:** áp dụng đồng nhất cho TẤT CẢ công thức, không có phiên bản rút gọn khác

---

## J. Cooking Mode (full-screen)
- **Không có navbar** — thay bằng:
  - Góc trên: icon "X" đóng, quay lại trang chi tiết công thức
  - Progress bar ngang, hiển thị bước hiện tại / tổng số bước
- **Khu vực chính:** 1 bước duy nhất, chữ lớn, căn giữa hoặc căn trái dễ đọc
- **Timer Panel (khi bước cần chờ):** panel nhỏ cố định 1 góc (vd phải), đếm ngược dạng số lớn, có thể có nút tạm dừng/tiếp tục
- **Điều hướng:** 2 nút lớn "Bước trước" (outline) / "Bước sau" (primary) cố định dưới cùng
- **Bước cuối:** nút "Bước sau" đổi thành "Hoàn thành món ăn" (vẫn primary style)

---

## K. Modal — khung chung
- **Áp dụng cho:** Modal đánh giá, Modal đăng nhập/đăng ký, và mọi modal khác trong tương lai
- **Cấu tạo:** overlay nền tối mờ phía sau (~40-50% opacity), modal box bo góc 16px, đổ bóng rõ, có nút đóng (X) góc trên-phải
- **Vị trí:** căn giữa màn hình theo cả chiều ngang và dọc

### K1. Modal đánh giá sau khi nấu
1. Headline "Món ăn thế nào rồi?"
2. Rating row (5 sao hoặc 5 emoji theo thang cảm xúc)
3. Feedback Chip Grid — chip dạng pill, multi-select, nội dung mẫu cố định:
   "Cắt thịt khó quá", "Chiên bị bắn dầu", "Mất nhiều thời gian hơn dự kiến", "Thiếu nguyên liệu"
4. Ô text tùy chọn, placeholder "Ghi chú thêm (không bắt buộc)"
5. Button Primary "Gửi đánh giá" — full-width trong modal

### K2. Modal đăng nhập / đăng ký
1. Tab switch "Đăng nhập" / "Đăng ký" trên cùng
2. Field email, field password (+ field tên nếu là tab Đăng ký)
3. Button Primary "Tiếp tục"
4. Divider "hoặc"
5. Button Secondary "Tiếp tục với Google"
6. Text Link "Dùng thử không cần đăng nhập" — luôn hiện, đóng modal khi click

---

## L. Phụ Bếp Widget

### L1. Nút nổi (Trigger Button)
- Hình tròn, fixed bottom-right, gradient terracotta-mustard, icon chef-hat
- Tooltip "Phụ Bếp" hiện khi hover
- Z-index cao nhất, luôn nổi trên mọi nội dung trang, mọi trang trừ khi đang trong Cooking Mode (tùy chọn ẩn để giữ tập trung — mặc định vẫn hiện trừ khi có chỉ định khác)

### L2. Chat Panel
- **Header:** avatar đầu bếp + tên "Phụ Bếp" + status line "Luôn sẵn sàng gợi ý món ngon" + nút đóng (X)
- **Message bubble:**
  - Phụ Bếp: căn trái, nền cream/sage nhạt, có avatar nhỏ kèm theo
  - Người dùng: căn phải, nền gradient terracotta-mustard, chữ trắng
- **Recipe Card thu nhỏ (nhúng trong tin nhắn):** ảnh nhỏ + tên món + Difficulty Badge + thời gian + button nhỏ "Xem chi tiết"
- **Quick-reply chips:** hàng ngang dưới thread, vd "Món chay", "Dưới 30 phút", "Món cho người mới" — click tự gửi như tin nhắn người dùng
- **Input bar:** text field bo tròn + icon mic + nút send tròn (gradient primary)
- **Typing indicator:** 3 chấm nhấp nháy trong bubble cream khi Phụ Bếp đang "suy nghĩ"

---

## M. Loading State
- **Minh họa:** hình nồi bốc hơi nhẹ, animation lặp đơn giản (không quá phức tạp)
- **Text trạng thái:** xoay vòng giữa các câu ngắn, vd: "Đang tìm món hợp với nguyên liệu của bạn...", "Đang sắp xếp từ dễ đến khó..."
- **Dùng khi:** chờ kết quả từ "Tìm món ngay" hoặc chờ Phụ Bếp trả lời
- **Ràng buộc:** nhẹ, không che hết màn hình trừ khi đang trong vùng kết quả/chat tương ứng; kết quả cần xuất hiện trong vài giây nên animation không nên dài dòng

---

## N. Toast / Notification
- **Cấu tạo:** thanh nhỏ góc dưới hoặc trên màn hình, nền cream/sage, icon check nhỏ, tự biến mất sau vài giây
- **Nội dung mẫu:** "Cảm ơn bạn! Lần sau mình sẽ gợi ý phù hợp hơn" (sau khi gửi đánh giá)
- **Quy tắc:** không chặn thao tác người dùng, không cần nút đóng thủ công (nhưng có thể có)

---

## O. Empty State
- **Cấu tạo:** minh họa nhỏ (đường nét đơn giản, tông màu thương hiệu) + dòng chữ giải thích + (tùy chọn) nút hành động
- **Dùng cho:**
  - Trang công thức đã lưu khi chưa có gì: "Bạn chưa lưu công thức nào"
  - Trang lịch sử nấu khi chưa nấu món nào (nếu cần)

---

## P. Insight Card (Trang hồ sơ)
- **Cấu tạo:** icon nhỏ bên trái + nội dung văn bản ngắn mô tả 1 điều chỉnh cụ thể AI đã học
- **Nội dung mẫu:** "Lần sau mình sẽ gợi ý mẹo cắt thịt dễ hơn", "AI đã hiểu bạn hơn"
- **Số lượng hiển thị:** 2-3 card mỗi lần, không liệt kê dài dòng toàn bộ lịch sử

---

## Q. Progress Bar (dùng chung)
- **Dùng ở:** Cooking Mode (tiến độ bước nấu), Trang hồ sơ ("Mức độ tự tin nấu ăn của bạn")
- **Cấu tạo:** thanh ngang bo tròn 2 đầu, phần đã hoàn thành tô màu terracotta/mustard gradient, phần còn lại nền cream đậm hơn nhẹ
- **Label:** luôn có text mô tả đi kèm (vd "Bước 3/8" hoặc phần trăm mức độ tự tin), không để thanh progress đứng một mình không có nhãn

---

## Ghi chú liên kết tài liệu
- File này bổ sung chi tiết cho component đã liệt kê tóm tắt ở `design-reference.md` mục 4 — không tạo thêm component mới ngoài 2 file.
- File `an-gi-gio-stitch-prompts.md` dùng các component này khi mô tả từng trang; nếu sửa cấu trúc 1 component ở đây, cần rà soát lại các prompt liên quan trong file đó.
