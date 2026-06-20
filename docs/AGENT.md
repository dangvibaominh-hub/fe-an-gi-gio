# AGENT.md — Hướng dẫn cho AI Coding Agent

> Đặt file này ở **gốc repo**. Đây là điểm vào đầu tiên cho bất kỳ AI agent nào (Claude Code, Cursor, v.v.) làm việc trên codebase "Ăn Gì Giờ?". Agent phải đọc file này trước, rồi mới đọc các tài liệu chi tiết được trỏ tới bên dưới — không bắt đầu code khi chưa nắm các quy tắc ở đây.
>
> **Ghi chú tương thích:** một số công cụ có quy ước tên file riêng — Claude Code đọc `CLAUDE.md` ở gốc repo, một số agent khác theo quy ước chung `AGENTS.md`. Nếu cần, có thể tạo `CLAUDE.md`/`AGENTS.md` chỉ chứa 1 dòng trỏ về file này (vd `Xem AGENT.md ở gốc repo.`) để đảm bảo agent nào cũng nạp được.

---

## 1. Dự án này là gì

**Ăn Gì Giờ?** — website dùng AI gợi ý công thức nấu ăn dựa trên nguyên liệu người dùng có sẵn, hướng dẫn chi tiết từng bước, và cá nhân hóa gợi ý dựa trên phản hồi sau mỗi lần nấu. Toàn bộ UI bằng tiếng Việt.

**Tech stack:** Next.js (App Router) + TypeScript + Tailwind CSS.

---

## 2. Tài liệu bắt buộc — đọc theo đúng thứ tự trước khi nhận bất kỳ task nào

| # | File | Trả lời câu hỏi |
|---|---|---|
| 1 | `docs/design-reference.md` | Màu sắc, navbar, danh sách trang, luồng người dùng, logic cá nhân hóa — **luật chung không được vi phạm** |
| 2 | `docs/UI_Component.md` | Mỗi component cấu tạo từ gì, có những trạng thái nào, nội dung mẫu ra sao |
| 3 | `docs/page_structure.md` | Route map, cấu trúc thư mục, từng trang ráp từ những section nào theo thứ tự nào |
| 4 | `docs/FRONTEND_RULES.md` | Quy tắc viết code: Server/Client Component, styling Tailwind, a11y, performance, naming |

> Nếu thư mục `docs/` chưa tồn tại trong repo, tạo và copy 4 file trên vào đó trước khi bắt đầu.

**Quy tắc đọc tài liệu:**
- Trước khi tạo/sửa 1 trang → đọc lại mục tương ứng trong `page_structure.md` + `design-reference.md`.
- Trước khi tạo/sửa 1 component → đọc lại mục tương ứng trong `UI_Component.md`.
- Không tự suy diễn cấu trúc nếu tài liệu không nói rõ — hỏi lại người dùng thay vì bịa.

---

## 3. Lệnh thường dùng

```bash
npm install        # cài dependency
npm run dev         # chạy dev server
npm run build        # build production
npm run lint         # ESLint
npm run typecheck      # tsc --noEmit (nếu chưa có script này trong package.json, agent nên thêm)
npm run format        # Prettier
```

> Nếu repo dùng `pnpm`/`yarn` thay vì `npm`, hoặc tên script khác, kiểm tra `package.json` thực tế trước khi chạy lệnh — không giả định.

---

## 4. Quy trình xử lý 1 task

1. **Xác định phạm vi:** task động tới trang nào, component nào, có route mới không.
2. **Đối chiếu tài liệu** ở mục 2 — nếu task mâu thuẫn với tài liệu (vd yêu cầu thêm màu mới, đổi tên "Phụ Bếp"), dừng lại và hỏi lại người dùng thay vì tự quyết.
3. **Implement** theo đúng `FRONTEND_RULES.md` (Server Component mặc định, class Tailwind dùng token đã khai báo, v.v.).
4. **Tái sử dụng trước khi tạo mới:** kiểm tra `src/components/ui/` và các thư mục component liên quan xem đã có sẵn component cần dùng chưa, tránh tạo trùng (vd thêm 1 kiểu button mới ngoài `ButtonPrimary`/`ButtonSecondary`).
5. **Tự kiểm tra trước khi báo hoàn thành:**
   - `npm run lint` và `npm run typecheck` không lỗi
   - `npm run build` chạy thành công
   - Đối chiếu lại UI vừa tạo với mô tả trong `UI_Component.md`/`page_structure.md` — đủ section, đủ trạng thái, đúng tên gọi tiếng Việt
6. **Nếu thay đổi thiết kế/cấu trúc thực sự cần thiết:** cập nhật tài liệu tương ứng trong `docs/` TRƯỚC, rồi mới sửa code, để tài liệu và code không bị lệch nhau.

---

## 5. Quy tắc cứng (không được vi phạm dù task không nhắc tới)

- Toàn bộ text hiển thị trên UI là **tiếng Việt**, đúng tên gọi đã chốt (`Ăn Gì Giờ?`, `Phụ Bếp`, tên trang ở mục 5 `page_structure.md`).
- Chỉ dùng **class Tailwind** với token màu đã khai báo trong `tailwind.config.ts` (`terracotta`, `mustard`, `sage`, `cream`, `charcoal`) — không hardcode mã hex.
- **Server Component là mặc định**; chỉ thêm `"use client"` khi component thực sự cần state/effect/sự kiện trình duyệt.
- Dùng `next/image` cho ảnh, `next/link` cho điều hướng nội bộ — không dùng `<img>`/`<a>` thuần.
- Không tự thêm trang, route, hay component ngoài những gì đã liệt kê trong `docs/` nếu không được yêu cầu rõ.
- TypeScript `strict`, không dùng `any`.
- Icon-only button luôn có `aria-label`; modal luôn bắt focus + đóng được bằng `Escape`.

---

## 6. Khi không chắc chắn

Nếu yêu cầu của người dùng:
- mâu thuẫn với `docs/`,
- thiếu thông tin để quyết định (vd "thêm 1 trang mới" nhưng không rõ route/nội dung),
- hoặc đụng tới quyết định thiết kế chưa có trong tài liệu,

→ Agent nên **hỏi lại** thay vì tự suy đoán rồi code, để tránh phải làm lại.

---

## 7. Bản đồ tài liệu đầy đủ

```
docs/
├─ design-reference.md          # luật thiết kế chung
├─ UI_Component.md              # anatomy & trạng thái component
├─ page_structure.md            # route map + cấu trúc thư mục + bố cục trang
├─ FRONTEND_RULES.md            # quy tắc viết code
└─ stitch-design                # UI tham khảo cho agent thực hiện
AGENT.md                        # file này — điểm vào cho AI agent
```
