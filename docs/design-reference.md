# Ăn Gì Giờ? — Design Reference (Quy tắc bắt buộc tuân thủ)

> **Cách dùng:** Dán toàn bộ file này vào đầu phiên làm việc với AI (Stitch, Claude Code, Cursor, v0, v.v.) trước khi yêu cầu tạo/sửa bất kỳ trang nào. Đây là nguồn sự thật duy nhất (single source of truth) về thiết kế của sản phẩm "Ăn Gì Giờ?". AI phải tuân thủ các giá trị, cấu trúc và quy tắc dưới đây cho MỌI trang, MỌI component được tạo ra trong suốt dự án — không tự ý đổi màu, đổi tên, đổi cấu trúc nếu không được yêu cầu rõ.

---

## 0. Quy tắc bắt buộc (đọc trước)

1. **Không tự sáng tạo thêm trang, component, hay route ngoài danh sách ở mục 4 và 5**, trừ khi người dùng yêu cầu rõ ràng.
2. **Mọi trang (trừ Cooking Mode) phải dùng đúng Navbar chuẩn ở mục 3** — không vẽ lại navbar khác đi giữa các trang.
3. **Chỉ dùng đúng bảng màu ở mục 1** — không tự thêm màu mới, không đổi sắc độ.
4. **Toàn bộ text hiển thị trên UI phải là tiếng Việt**, đúng tên gọi đã chốt trong tài liệu này (vd: luôn là "Phụ Bếp", không đổi thành "AI Chat" hay "Trợ lý ảo").
5. **Khi tạo 1 trang mới, mô tả trọn vẹn trang đó** (không viết kiểu "giống trang trước nhưng thêm X") để tránh AI hiểu nhầm thành sửa/nhân bản trang cũ.
6. Nếu yêu cầu của người dùng mâu thuẫn với tài liệu này, AI nên hỏi lại thay vì tự suy diễn.

---

## 1. Design Tokens (giá trị cố định, dùng xuyên suốt)

### Màu sắc — chỉ dùng đúng các mã này
| Token | Hex | Vai trò bắt buộc |
|---|---|---|
| `--color-primary` (Terracotta) | `#E2725B` | Nút chính, accent, badge "Khó", link đang active |
| `--color-primary-alt` (Mustard) | `#E8A33D` | Gradient cùng terracotta, badge "Trung bình" |
| `--color-secondary` (Sage) | `#8FAE7E` | Hành động phụ, trạng thái thành công, badge "Dễ" |
| `--color-bg` (Cream) | `#FAF3E7` | Nền chính toàn site, nền navbar |
| `--color-text` (Charcoal) | `#2B2420` | Màu chữ chính |

### Typography
- Font: rounded, friendly sans-serif
- Heading: lớn, rõ ràng, trọng lượng đậm cho tiêu đề trang
- Body: ngắn gọn, giọng văn thân thiện, không dùng từ ngữ kỹ thuật khô khan

### Bo góc & đổ bóng
- Card / modal: `border-radius: 12–16px`
- Nút chính (primary button): bo góc tròn đầy đủ (pill / fully rounded)
- Shadow: nhẹ, tông ấm — không dùng bóng xám/lạnh mặc định

### Layout
- Desktop-first, responsive
- Container max-width, nội dung căn giữa
- Khoảng trắng rộng rãi giữa các section

---

## 2. Quy ước đặt tên (Naming Conventions)

- Tên sản phẩm: **"Ăn Gì Giờ?"** (luôn có dấu chấm hỏi)
- Tên trợ lý chat: **"Phụ Bếp"** (luôn viết hoa cả 2 chữ)
- Tên các trang dùng đúng nguyên văn sau, không dịch khác đi:
  - Trang chủ
  - Khám phá công thức
  - Kết quả công thức
  - Chi tiết công thức
  - Lịch sử nấu
  - Công thức đã lưu
  - Hồ sơ
- Badge độ khó dùng đúng 3 nhãn: **Dễ / Trung bình / Khó**

---

## 3. Navbar chuẩn (BẮT BUỘC giống hệt nhau ở mọi trang, trừ Cooking Mode)

```
Fixed top, full-width, nền cream (#FAF3E7), viền mỏng dưới đáy.

Trái: logo text "Ăn Gì Giờ?" màu terracotta, đậm, link về Trang chủ.

Giữa: 4 nav link ngang —
  "Trang chủ" / "Khám phá công thức" / "Lịch sử nấu" / "Công thức đã lưu"
  Link của trang đang xem: in đậm + gạch chân màu terracotta.

Phải: nếu chưa đăng nhập — nút viền terracotta "Đăng nhập".
      nếu đã đăng nhập — avatar tròn nhỏ, có dropdown (Hồ sơ, Cài đặt, Đăng xuất).
```

> Mỗi khi tạo 1 trang mới, copy nguyên văn block navbar trên vào đầu prompt/instruction, chỉ đổi phần "link đang active".

---

## 4. Component Library (cấu trúc cố định, không tự đổi)

| Component | Cấu trúc bắt buộc |
|---|---|
| **Ingredient Pill Input** | Ô nhập text, mỗi nguyên liệu nhập vào hiển thị thành pill chip có nút "x" để xóa |
| **Recipe Card** | Ảnh món ăn, tên món, badge độ khó (Dễ/Trung bình/Khó), thời gian nấu (icon đồng hồ), khẩu phần (icon người), hover lift nhẹ |
| **Difficulty Badge** | Dễ = sage green, Trung bình = mustard, Khó = terracotta. Không dùng màu khác |
| **Filter Sidebar** | Lọc theo: thời gian nấu, số người ăn, độ khó. Sticky khi cuộn |
| **Serving Stepper** | Nút trừ — số — nút cộng. Mặc định bắt đầu ở "2 người" |
| **Ingredient Checklist** | Luôn chia 2 nhóm cố định: "Bạn đã có" và "Cần mua thêm" |
| **Step List** | Mỗi bước LUÔN có: icon kỹ thuật, thời gian ước tính, có thể có badge "Bước này hơi khó"; thuật ngữ nấu ăn được gạch chân/highlight, hover/click ra tooltip giải nghĩa 1 câu — áp dụng cho mọi người dùng, không phân biệt mức kinh nghiệm |
| **Cooking Mode** | Full-screen, KHÔNG có navbar, 1 bước/màn hình, progress bar, timer đếm ngược (cho bước cần chờ), nút "Bước trước"/"Bước sau", nút X đóng ở góc |
| **Feedback Modal** | Rating sao/emoji + lưới feedback chip nhanh + ô ghi chú tùy chọn + nút "Gửi đánh giá" |
| **Login/Signup Modal** | Tab Đăng nhập/Đăng ký, field email + password, nút "Tiếp tục với Google", LUÔN có link "Dùng thử không cần đăng nhập" |
| **Phụ Bếp Widget** | Nút tròn nổi cố định góc dưới-phải MỌI trang, độc lập hoàn toàn với navbar; click mở chat panel ~380px từ góc dưới-phải |
| **Loading State** | Minh họa nồi bốc hơi + dòng trạng thái text xoay vòng, phải nhẹ vì kết quả cần xuất hiện trong vài giây |
| **Insight Card** | Hiển thị 1 điều chỉnh cụ thể AI đã học từ feedback, có icon đi kèm |

---

## 5. Danh sách trang bắt buộc (Page Inventory — không thêm/bớt nếu không yêu cầu)

| # | Tên trang | Mục đích | Có navbar? |
|---|---|---|---|
| 1 | Trang chủ | Nhập nguyên liệu / điểm vào chính | Có |
| 2 | Khám phá công thức | Duyệt công thức theo danh mục | Có |
| 3 | Kết quả công thức | Danh sách công thức theo nguyên liệu, dễ→khó | Có |
| 4 | Chi tiết công thức | Hướng dẫn đầy đủ, chi tiết, giải nghĩa thuật ngữ — luôn hiển thị cho mọi người dùng | Có |
| 5 | Cooking Mode | Nấu từng bước, tập trung | Không |
| 6 | Modal đánh giá sau khi nấu | Thu thập feedback | (modal, không tính) |
| 7 | Lịch sử nấu | Xem lại món đã nấu + feedback đã cho | Có |
| 8 | Công thức đã lưu | Danh sách đã bookmark | Có |
| 9 | Hồ sơ & Cá nhân hóa | Mức độ tự tin + insight AI đã học | Có |
| 10 | Modal đăng nhập/đăng ký | Xác thực tùy chọn | (modal, không tính) |
| 11 | Phụ Bếp | Chat widget nổi xuyên suốt | (widget, không tính) |
| 12 | Loading state | Trạng thái chờ AI xử lý | (state, không tính) |

---

## 6. Luồng người dùng bắt buộc giữ nguyên (User Flows)

```
Flow A — Nấu lần đầu:
Trang chủ → nhập nguyên liệu → [Tìm món ngay]
→ Kết quả công thức → chọn món → Chi tiết công thức (luôn bản đầy đủ, chi tiết)
→ [Bắt đầu nấu] → Cooking Mode → [Hoàn thành món ăn]
→ Modal đánh giá → [Gửi đánh giá] → về Trang chủ + toast cảm ơn

Flow B — Cá nhân hóa quay vòng:
Feedback đã gửi (Flow A) → lưu vào hồ sơ
→ lần nấu sau: Chi tiết công thức được điều chỉnh theo feedback cũ
→ Hồ sơ hiển thị Insight Card phản ánh điều chỉnh đã học

Flow C — Hỏi nhanh qua Phụ Bếp:
Bất kỳ trang nào → click Phụ Bếp → hỏi → nhận trả lời + Recipe Card nhúng
→ [Xem chi tiết] → Chi tiết công thức

Flow D — Không cần tài khoản:
Mọi thao tác chính (nhập nguyên liệu, xem, nấu, đánh giá) khả dụng ở chế độ khách
→ Modal đăng nhập luôn có lựa chọn "Dùng thử không cần đăng nhập"
```

---

## 7. Logic cá nhân hóa (AI phải phản ánh đúng các quy tắc này khi sinh nội dung mẫu)

| Feedback người dùng chọn | Điều chỉnh bắt buộc lần sau |
|---|---|
| "Cắt thịt khó quá" | Ưu tiên công thức không cần cắt nhỏ, hoặc thêm mẹo/video vào đúng bước đó |
| "Chiên bị bắn dầu" | Thêm cảnh báo/kỹ thuật an toàn trước bước chiên |
| "Mất nhiều thời gian hơn dự kiến" | Điều chỉnh ước tính thời gian hiển thị, ưu tiên món nhanh hơn |
| "Thiếu nguyên liệu" | Gợi ý công thức khớp sát hơn với nguyên liệu đã có |

---

## 8. Ghi chú liên kết tài liệu
- File `an-gi-gio-stitch-prompts.md` chứa prompt sinh UI từng trang cho Stitch — phải khớp 100% với token, navbar, component và page list trong tài liệu này.
- Nếu cần đổi 1 giá trị (màu, tên, cấu trúc), sửa ở file này trước, sau đó mới cập nhật lại các prompt liên quan.
