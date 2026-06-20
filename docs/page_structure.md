# Ăn Gì Giờ? — Page Structure

> **Cách dùng:** Dán file này cùng `design-reference.md` (luật chung) và `UI_Component.md` (chi tiết component) khi yêu cầu AI dựng từng trang hoặc scaffold codebase. File này là bản lắp ráp: mỗi trang gồm những section nào, theo thứ tự nào, dùng component nào (tham chiếu mục tương ứng trong `UI_Component.md`), route gì, và liên kết sang trang nào.
>
> Không định nghĩa lại màu/token/component ở đây — chỉ tham chiếu ngược lại 2 file kia.

---

## 1. Route Map

| Trang | Route đề xuất | Loại |
|---|---|---|
| Trang chủ | `/` | Trang đầy đủ |
| Khám phá công thức | `/kham-pha` | Trang đầy đủ |
| Kết quả công thức | `/ket-qua` | Trang đầy đủ |
| Chi tiết công thức | `/cong-thuc/[slug]` | Trang đầy đủ, dynamic |
| Cooking Mode | `/cong-thuc/[slug]/nau` | Trang đầy đủ, không navbar |
| Lịch sử nấu | `/lich-su` | Trang đầy đủ, cần đăng nhập hoặc lưu local |
| Công thức đã lưu | `/da-luu` | Trang đầy đủ |
| Hồ sơ & Cá nhân hóa | `/ho-so` (tab con: `/ho-so?tab=ca-nhan-hoa`) | Trang đầy đủ, cần đăng nhập |
| Modal đánh giá sau khi nấu | overlay trên `/cong-thuc/[slug]/nau` | Modal, không có route riêng |
| Modal đăng nhập/đăng ký | overlay trên route hiện tại | Modal, không có route riêng |
| Phụ Bếp | overlay trên mọi route | Widget toàn cục, không có route riêng |

---

## 2. Cấu trúc thư mục gợi ý (Next.js App Router)

```
src/
├─ app/
│  ├─ layout.tsx                 # Root layout: Navbar + Phụ Bếp Widget bọc toàn site
│  ├─ page.tsx                   # Trang chủ → "/"
│  ├─ kham-pha/
│  │  └─ page.tsx                # Khám phá công thức
│  ├─ ket-qua/
│  │  └─ page.tsx                # Kết quả công thức
│  ├─ cong-thuc/
│  │  └─ [slug]/
│  │     ├─ page.tsx             # Chi tiết công thức
│  │     └─ nau/
│  │        └─ page.tsx          # Cooking Mode (KHÔNG dùng layout có Navbar)
│  ├─ lich-su/
│  │  └─ page.tsx                # Lịch sử nấu
│  ├─ da-luu/
│  │  └─ page.tsx                # Công thức đã lưu
│  └─ ho-so/
│     └─ page.tsx                # Hồ sơ & Cá nhân hóa (đọc query ?tab=)
│
├─ components/
│  ├─ layout/
│  │  ├─ Navbar.tsx
│  │  └─ Footer.tsx              # (nếu cần, chưa có trong scope hiện tại)
│  ├─ home/
│  │  ├─ IngredientPillInput.tsx
│  │  └─ CategoryCard.tsx
│  ├─ recipe/
│  │  ├─ RecipeCard.tsx
│  │  ├─ DifficultyBadge.tsx
│  │  ├─ FilterSidebar.tsx
│  │  ├─ ServingStepper.tsx
│  │  ├─ IngredientChecklist.tsx
│  │  └─ StepList.tsx
│  ├─ cooking-mode/
│  │  ├─ CookingProgressBar.tsx
│  │  ├─ CookingTimerPanel.tsx
│  │  └─ StepNavigationButtons.tsx
│  ├─ modals/
│  │  ├─ ModalBase.tsx           # khung modal dùng chung (mục K trong UI_Component.md)
│  │  ├─ FeedbackModal.tsx
│  │  └─ AuthModal.tsx
│  ├─ phu-bep/
│  │  ├─ PhuBepTriggerButton.tsx
│  │  ├─ PhuBepChatPanel.tsx
│  │  └─ ChatMessageBubble.tsx
│  ├─ profile/
│  │  └─ InsightCard.tsx
│  └─ ui/                        # component nền tảng (mục A trong UI_Component.md)
│     ├─ ButtonPrimary.tsx
│     ├─ ButtonSecondary.tsx
│     ├─ IconButton.tsx
│     ├─ Toast.tsx
│     ├─ EmptyState.tsx
│     └─ LoadingState.tsx
│
└─ styles/
   └─ globals.css                # @tailwind base/components/utilities

tailwind.config.ts                # màu/token từ design-reference.md mục 1, khai báo ở theme.extend
```

---

## 2b. Cấu hình Tailwind (`tailwind.config.ts`)

> Khai báo màu thương hiệu thành theme token để dùng dạng `bg-terracotta`, `text-charcoal`, v.v. — KHÔNG dùng mã hex trực tiếp (`bg-[#E2725B]`) rải rác trong component.

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        terracotta: "#E2725B",
        mustard: "#E8A33D",
        sage: "#8FAE7E",
        cream: "#FAF3E7",
        charcoal: "#2B2420",
      },
      borderRadius: {
        card: "16px",
      },
      fontFamily: {
        sans: ["var(--font-rounded)", "sans-serif"], // chọn 1 rounded sans-serif cụ thể khi tích hợp font, vd Quicksand/Baloo 2/Be Vietnam Pro
      },
    },
  },
  plugins: [],
};

export default config;
```

- **Gradient primary** (dùng cho Button Primary, Phụ Bếp trigger): `bg-gradient-to-r from-terracotta to-mustard`
- **Badge độ khó:** `bg-sage/15 text-sage` (Dễ) · `bg-mustard/15 text-charcoal` (Trung bình) · `bg-terracotta/15 text-terracotta` (Khó) — dùng opacity modifier của Tailwind thay vì khai báo thêm màu nhạt riêng
- **Bo góc:** card/modal dùng `rounded-2xl` (~16px, khớp `borderRadius.card`); button primary dùng `rounded-full`
- **Font tiếng Việt:** chọn font có đủ dấu tiếng Việt (vd Be Vietnam Pro, Quicksand, Baloo 2) khi tích hợp qua `next/font`



### 3.1 Trang chủ — `/`
```
1. Navbar (cố định)
2. Hero Section
   - Heading "Bạn đang có gì trong bếp?"
   - Ingredient Pill Input
3. Quick-suggestion strip "Gợi ý hôm nay" (3-4 dish chip)
4. Category Card row (4 card: Món xào / Món canh / Món chiên / Món hấp)
5. Button Primary "Tìm món ngay"
6. Phụ Bếp Widget (overlay, luôn nổi)
```
- **Điểm ra:** [Tìm món ngay] → `/ket-qua` · [Category card] → `/kham-pha`
- **Trạng thái đặc biệt:** Loading State hiện trong lúc chờ kết quả sau khi bấm "Tìm món ngay" (có thể hiện ngay tại trang này trước khi chuyển route, hoặc tại trang đích — chọn 1 cách và giữ nhất quán)

### 3.2 Khám phá công thức — `/kham-pha`
```
1. Navbar (active: "Khám phá công thức")
2. Category Tabs ngang (Món xào / Món canh / Món chiên / Món hấp / Món chay / Tráng miệng)
3. Recipe Card Grid (responsive, lọc theo tab đang chọn)
4. Phụ Bếp Widget
```
- **Điểm ra:** click Recipe Card → `/cong-thuc/[slug]`
- **Trạng thái đặc biệt:** Empty State nếu danh mục chưa có công thức nào

### 3.3 Kết quả công thức — `/ket-qua`
```
1. Navbar
2. Layout 2 cột:
   - Trái: Filter Sidebar (sticky)
   - Phải: Recipe Card Grid, sắp xếp dễ → khó
3. Phụ Bếp Widget
```
- **Điểm ra:** click Recipe Card → `/cong-thuc/[slug]`
- **Trạng thái đặc biệt:** Loading State khi đang chờ AI trả kết quả; Empty State nếu không có công thức phù hợp nguyên liệu đã nhập

### 3.4 Chi tiết công thức — `/cong-thuc/[slug]`
```
1. Navbar
2. Header công thức: ảnh món + tên món + Icon Button (lưu/share/print)
3. Layout 2 cột:
   - Trái: Serving Stepper → Ingredient Checklist ("Bạn đã có" / "Cần mua thêm")
   - Phải: Step List (đầy đủ, có tooltip thuật ngữ + caution badge)
4. Button Primary "Bắt đầu nấu" (phía trên Step List)
5. Phụ Bếp Widget
```
- **Điểm ra:** [Bắt đầu nấu] → `/cong-thuc/[slug]/nau`
- **Điểm vào:** từ Kết quả công thức, Khám phá công thức, Đã lưu, Lịch sử nấu, hoặc Recipe Card nhúng trong Phụ Bếp

### 3.5 Cooking Mode — `/cong-thuc/[slug]/nau`
```
(KHÔNG dùng layout có Navbar — route này tự override layout)
1. Icon đóng (X) góc trên-trái/phải → quay về /cong-thuc/[slug]
2. Cooking Progress Bar (vị trí trên cùng)
3. Khu vực nội dung bước hiện tại (chữ lớn)
4. Cooking Timer Panel (chỉ hiện ở bước có thời gian chờ)
5. Step Navigation Buttons (Bước trước / Bước sau, cố định dưới cùng)
```
- **Điểm ra:** bước cuối → [Hoàn thành món ăn] → mở Feedback Modal (overlay, vẫn ở route này)
- **Sau khi gửi đánh giá:** điều hướng về `/` kèm Toast cảm ơn

### 3.6 Lịch sử nấu — `/lich-su`
```
1. Navbar (active: "Lịch sử nấu")
2. Page heading "Lịch sử nấu của bạn" + filter dropdown (Gần đây nhất / Đánh giá cao nhất)
3. Timeline dọc các món đã nấu (thumbnail, ngày, rating, feedback chip)
4. Phụ Bếp Widget
```
- **Trạng thái đặc biệt:** Empty State nếu chưa nấu món nào

### 3.7 Công thức đã lưu — `/da-luu`
```
1. Navbar (active: "Công thức đã lưu")
2. Page heading "Công thức đã lưu"
3. Recipe Card Grid (chỉ công thức đã bookmark)
4. Phụ Bếp Widget
```
- **Trạng thái đặc biệt:** Empty State "Bạn chưa lưu công thức nào"

### 3.8 Hồ sơ & Cá nhân hóa — `/ho-so`
```
1. Navbar (không có link nào active — vào từ avatar dropdown)
2. Layout 2 cột:
   - Trái: sub-nav (Thông tin cá nhân / Cá nhân hóa / Cài đặt)
   - Phải: nội dung theo tab
       Tab "Cá nhân hóa":
         - Progress Bar "Mức độ tự tin nấu ăn của bạn"
         - 2-3 Insight Card
3. Phụ Bếp Widget
```

### 3.9 Modal đánh giá sau khi nấu (overlay)
```
Hiện trên route /cong-thuc/[slug]/nau khi bấm "Hoàn thành món ăn"
→ cấu trúc chi tiết: xem UI_Component.md mục K1
```

### 3.10 Modal đăng nhập/đăng ký (overlay)
```
Hiện trên BẤT KỲ route nào khi bấm "Đăng nhập" ở Navbar
→ cấu trúc chi tiết: xem UI_Component.md mục K2
```

### 3.11 Phụ Bếp (widget toàn cục)
```
Render ở Root Layout (app/layout.tsx), không thuộc route cụ thể nào
→ luôn nổi trên mọi trang trừ Cooking Mode (do Cooking Mode override layout)
→ cấu trúc chi tiết: xem UI_Component.md mục L
```

---

## 4. Quy tắc bố cục chung (áp dụng mọi trang có Navbar)

1. Mọi trang đầy đủ đều bọc trong Root Layout → tự động có Navbar + Phụ Bếp Widget, không cần khai báo lại thủ công ở từng trang.
2. Riêng Cooking Mode override Root Layout để ẩn Navbar (giữ trải nghiệm tập trung).
3. Container nội dung chính: max-width cố định, căn giữa — áp dụng đồng nhất mọi trang trừ Cooking Mode (full-bleed).
4. Thứ tự section trong mỗi trang ở mục 3 là **thứ tự bắt buộc**, không tự ý đảo vị trí trừ khi được yêu cầu rõ.

---

## Ghi chú liên kết tài liệu
- `design-reference.md` — token, navbar, page list, flow, logic cá nhân hóa (luật chung)
- `UI_Component.md` — chi tiết anatomy/trạng thái từng component
- `page_structure.md` (file này) — cách lắp ráp component thành từng trang + route map
- `an-gi-gio-stitch-prompts.md` — prompt thực thi để dựng UI trên Stitch, phải khớp với cấu trúc ở file này
