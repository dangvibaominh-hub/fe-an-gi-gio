# Ăn Gì Giờ? — Frontend Rules

> **Cách dùng:** Dán file này cùng `design-reference.md`, `UI_Component.md`, `page_structure.md` khi giao việc code thực tế cho AI (Claude Code, Cursor, v.v.). 3 file kia trả lời "giao diện trông như thế nào / gồm gì" — file này trả lời "code phải viết như thế nào". Áp dụng cho TOÀN BỘ codebase frontend, không riêng 1 trang nào.

> **Tech stack:** Next.js (App Router) + TypeScript + Tailwind CSS.

---

## 1. Quy tắc Component

1. **Functional component + TypeScript** cho mọi component, không dùng class component.
2. **1 component = 1 file.** Tên file PascalCase trùng tên component (vd `RecipeCard.tsx`).
3. **Props luôn có type rõ ràng** qua `interface` hoặc `type`, đặt tên `[TenComponent]Props`:
   ```tsx
   interface RecipeCardProps {
     title: string;
     difficulty: "de" | "trung-binh" | "kho";
     cookTimeMinutes: number;
     servings: number;
     imageUrl: string;
     isSaved?: boolean;
     onToggleSave?: () => void;
   }
   ```
4. **Không hardcode nội dung lặp lại** (tên trang, label cố định) rải rác nhiều nơi — đưa vào hằng số dùng chung, vd `src/lib/constants.ts`, để sửa 1 chỗ áp dụng toàn site.
5. **Tái sử dụng component nền tảng** đã định nghĩa ở `UI_Component.md` mục A (ButtonPrimary, ButtonSecondary, IconButton...) — không tự tạo thêm button/badge ad-hoc trong từng trang.
6. Component chỉ nên làm 1 việc; nếu 1 component vượt quá ~150-200 dòng, cân nhắc tách nhỏ.

---

## 2. Server Component vs Client Component

- **Mặc định mọi component là Server Component** (không khai báo `"use client"`).
- **Chỉ thêm `"use client"`** khi component thực sự cần:
  - State (`useState`, `useReducer`)
  - Effect (`useEffect`)
  - Sự kiện trình duyệt (`onClick`, `onChange`...)
  - Browser-only API
- **Các component BẮT BUỘC là Client Component:**
  `IngredientPillInput`, `ServingStepper`, `FilterSidebar` (nếu có state filter), `StepList` (vì tooltip cần hover/click), `CookingTimerPanel`, `StepNavigationButtons`, `FeedbackModal`, `AuthModal`, toàn bộ `phu-bep/*`, `Toast`.
- **Giữ Server Component cho:** layout tĩnh, `RecipeCard` hiển thị thuần (trừ phần nút bookmark — tách riêng thành Client Component con nếu cần), `Navbar` phần khung (tách phần avatar dropdown ra Client Component con).
- Đẩy `"use client"` xuống component con nhỏ nhất có thể, không đặt ở cả 1 trang lớn chỉ vì 1 nút bấm bên trong cần tương tác.

---

## 3. Styling (Tailwind)

1. **Chỉ dùng class Tailwind**, không viết CSS module/styled-components/inline style trừ khi Tailwind không đáp ứng được (ví dụ animation phức tạp → định nghĩa trong `globals.css` ở mức tối thiểu).
2. **Dùng tên màu đã khai báo** trong `tailwind.config.ts` (`terracotta`, `mustard`, `sage`, `cream`, `charcoal`) — không dùng `bg-[#E2725B]` hardcode.
3. **Responsive:** viết base class cho mobile trước, override ở `md:` / `lg:` cho desktop theo đúng cách Tailwind hoạt động (mobile-first ở mức utility), dù bố cục THIẾT KẾ là desktop-first — nghĩa là desktop là layout chính cần khớp pixel-perfect với thiết kế, nhưng khi viết class vẫn theo thứ tự mobile → `md:` → `lg:`.
4. **Class dài/lặp lại nhiều nơi** (vd style Recipe Card): cân nhắc dùng `cn()`/`clsx` để gộp điều kiện, không nối chuỗi string thủ công.
5. **Không dùng `!important`** hay arbitrary value tùy tiện (`w-[123px]`) trừ khi không có token chuẩn nào khớp.
6. Bo góc, shadow, gradient: dùng đúng class đã quy định ở `page_structure.md` mục 2b (`rounded-2xl`, `rounded-full`, `bg-gradient-to-r from-terracotta to-mustard`).

---

## 4. Icon & Hình ảnh

- **Icon:** dùng 1 bộ icon nhất quán toàn site (khuyến nghị `lucide-react`) — không trộn nhiều bộ icon khác nhau giữa các component.
- **Icon Button luôn có `aria-label`** mô tả hành động (vd `aria-label="Lưu công thức"`), vì không có text đi kèm.
- **Ảnh:** luôn dùng `next/image`, không dùng thẻ `<img>` thuần — tận dụng tối ưu hóa ảnh tự động của Next.js.
- Mọi `<Image>` phải có `alt` mô tả nội dung thực (vd tên món ăn), không để alt rỗng trừ ảnh thuần trang trí.

---

## 5. Routing & Navigation

- Dùng `next/link` (`<Link>`) cho mọi điều hướng nội bộ, không dùng thẻ `<a>` trừ liên kết ra ngoài site.
- Dùng `useRouter` từ `next/navigation` (không phải `next/router` — đã deprecated trong App Router).
- Route động `[slug]` cho công thức: slug tạo từ tên món, không dùng ID số thô trên URL.
- Tab con trong trang Hồ sơ (`/ho-so?tab=ca-nhan-hoa`) đọc qua `useSearchParams`, không tự quản state tab rời rạc không đồng bộ với URL.

---

## 6. Data Fetching & Trạng thái tải

- Fetch dữ liệu ban đầu (danh sách công thức, chi tiết công thức) ở Server Component khi có thể, tránh fetch lại ở client gây loading nhấp nháy.
- Dùng quy ước file Next.js: `loading.tsx` cho trạng thái tải cấp route (tận dụng cho Loading State ở `UI_Component.md` mục M), `error.tsx` cho lỗi cấp route.
- Hành động tương tác AI (gợi ý công thức, Phụ Bếp trả lời) là Client-side, có state `isLoading` riêng để hiện Loading State cục bộ, không chặn toàn trang nếu không cần thiết.
- Bọc mọi lời gọi API trong `try/catch`, luôn có fallback UI khi lỗi (không để trắng trang hoặc crash toàn bộ).

---

## 7. Form & Input

- Input có kiểm soát (controlled component) với `useState`, không dùng uncontrolled trừ lý do cụ thể.
- Với form nhiều field (đăng nhập/đăng ký, đánh giá): khuyến nghị dùng `react-hook-form` + `zod` để validate, tránh tự viết validate thủ công rải rác.
- Thông báo lỗi field hiển thị ngay dưới field đó, dùng màu terracotta cho text lỗi (không dùng đỏ mặc định lệch tông màu thương hiệu).

---

## 8. Accessibility (a11y)

1. Dùng đúng thẻ semantic HTML (`<nav>`, `<main>`, `<button>`, `<header>`) thay vì `<div>` cho mọi thứ.
2. Mọi Modal (Feedback, Auth):
   - Bắt focus vào modal khi mở (focus trap)
   - Đóng được bằng phím `Escape`
   - `aria-modal="true"` + `role="dialog"`
3. Contrast chữ/nền phải đạt tối thiểu AA — đặc biệt chú ý chữ trên nền mustard nhạt (badge "Trung bình") vì mustard sáng dễ thiếu tương phản.
4. Toàn bộ icon-only button phải có `aria-label`, không chỉ dựa vào tooltip hover (không khả dụng trên touch).
5. Cooking Mode: nút "Bước trước"/"Bước sau" phải bấm được bằng bàn phím (Tab + Enter), vì người dùng có thể đang cầm điện thoại bằng tay bẩn/ướt và dùng giọng nói hoặc thiết bị hỗ trợ.

---

## 9. Performance

- `PhuBepChatPanel` chỉ render khi người dùng click mở lần đầu (lazy mount), không render sẵn ẩn (`display: none`) ngay từ đầu mỗi trang.
- Dùng `next/dynamic` cho component nặng, ít dùng ngay khi tải trang (vd nội dung modal).
- Tránh re-render thừa: với danh sách Recipe Card dài, đảm bảo mỗi card có `key` ổn định (dùng slug/id, không dùng index mảng).
- Ảnh món ăn: khai báo `sizes` hợp lý cho `next/image` trong grid responsive để tránh tải ảnh full-size không cần thiết trên mobile.

---

## 10. Quy ước đặt tên & tổ chức code

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Component file | PascalCase | `RecipeCard.tsx` |
| Hook tự viết | camelCase, tiền tố `use` | `useIngredientList.ts` |
| Folder/route (App Router) | kebab-case, không dấu | `app/kham-pha/page.tsx` |
| Hằng số | UPPER_SNAKE_CASE | `FEEDBACK_CHIP_OPTIONS` |
| Type/Interface | PascalCase | `RecipeCardProps` |
| Biến/hàm thường | camelCase | `formatCookTime()` |

- Text tiếng Việt hiển thị UI: tập trung các chuỗi cố định lặp lại (nhãn nút, tiêu đề trang) vào 1 file constants để dễ rà soát chính tả/đồng bộ thay vì rải JSX khắp nơi.

---

## 11. Chất lượng code

- TypeScript `strict: true`, không dùng `any` (dùng `unknown` + kiểm tra kiểu nếu thực sự chưa rõ type).
- Bật ESLint + Prettier, format nhất quán trước khi coi 1 task là xong.
- Không để `console.log` sót lại trong code khi hoàn thành tính năng.
- Component đã có trong `UI_Component.md` thì PHẢI implement đúng cấu trúc/trạng thái đã mô tả ở đó — nếu cần đổi, sửa tài liệu trước rồi mới sửa code, không để code và tài liệu lệch nhau.

---

## Ghi chú liên kết tài liệu
- `design-reference.md` — luật thiết kế chung (token, navbar, page list, flow)
- `UI_Component.md` — chi tiết anatomy/trạng thái từng component
- `page_structure.md` — route map, cấu trúc thư mục, bố cục từng trang
- `FRONTEND_RULES.md` (file này) — quy tắc viết code frontend, áp dụng khi implement bất kỳ phần nào ở 3 file trên
