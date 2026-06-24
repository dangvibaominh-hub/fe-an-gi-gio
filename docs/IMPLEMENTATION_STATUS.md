# Implementation status — 2026-06-24

> **Mục đích:** Tài liệu này nằm trong repo frontend để AI agent và developer nắm tiến độ **cả hai repo** khi làm việc trên `fe-an-gi-gio`. Contract API đầy đủ: `../be-an-gi-gio/docs/openapi.yaml` hoặc Swagger production tại `https://api-production-afd7.up.railway.app/docs/`.

## Tóm tắt nhanh

| Repo | Vị trí theo PRD §20 | Ghi chú |
|------|---------------------|---------|
| **Backend** (`be-an-gi-gio`) | **Hoàn tất Phase 0–5** | API live trên Railway; Phase 6 (Admin) và Phase 7 (Phụ Bếp) chưa có |
| **Frontend** (`fe-an-gi-gio`) | **Phase 0 done; Phase 1 catalog E2E done** | API client + catalog pages wired; auth/cooking/feedback chưa |

**Mốc nghiệm thu (PRD §24):**

| Mốc | Backend | Frontend |
|-----|---------|----------|
| M1 Catalog | Sẵn sàng | **Done** — `/kham-pha`, `/ket-qua`, `/cong-thuc/[slug]` dùng API |
| M2 Recommendation | Sẵn sàng | Chưa |
| M3 Identity | Sẵn sàng (Google OAuth cần env) | Chưa — auth modal mock, bookmark `localStorage` |
| M4 Cooking | Sẵn sàng | Chưa — thiếu route `/nau`, `/lich-su` |
| M5 Learning | Sẵn sàng | Chưa — thiếu Feedback Modal, `/ho-so` |
| M6 Administration | Chưa | Chưa |
| M7 Assistant | Chưa | Chưa |

---

## Frontend — đối chiếu PRD §20

### Giai đoạn 0 — Foundation

| Hạng mục | Trạng thái |
|----------|------------|
| API client (`src/lib/api/`) | Done |
| `NEXT_PUBLIC_API_URL` | Done — `.env.example`; fallback production URL trong `config.ts` |
| Tách type khỏi `mockRecipes.ts` | Done — `src/lib/types/recipe.ts`; `mockRecipes.ts` đã xóa |
| `error.tsx` / `not-found.tsx` | Done |
| Loading/error/retry convention | Done — `loading.tsx` trên catalog routes, `ErrorState`, global `error.tsx` |

### Giai đoạn 1 — Recipe catalog E2E

| Route | UI | API |
|-------|-----|-----|
| `/kham-pha` | Có | API |
| `/ket-qua` | Có | API (`sort=difficulty-asc`) |
| `/cong-thuc/[slug]` | Có | API + `notFound()` |

### Giai đoạn 2 — Tìm món theo nguyên liệu

| Hạng mục | Trạng thái |
|----------|------------|
| `/` — `IngredientPillInput` → recommendation | UI có; chưa truyền nguyên liệu sang `/ket-qua` |
| `POST /api/v1/recommendations` | Chưa tích hợp |

### Giai đoạn 3 — Auth & saved recipes

| Hạng mục | Trạng thái |
|----------|------------|
| `AuthModal` | UI + validation; submit mock |
| Session / JWT | Chưa |
| Bookmark / `/da-luu` | `localStorage` + catalog API (saved slugs lọc từ API) |

### Giai đoạn 4 — Cooking & history

| Hạng mục | Trạng thái |
|----------|------------|
| `/cong-thuc/[slug]/nau` | Chưa có route |
| `/lich-su` | Chưa có route (Navbar đã link) |
| Cooking components | Chưa có |

### Giai đoạn 5 — Feedback & personalization

| Hạng mục | Trạng thái |
|----------|------------|
| `FeedbackModal` | Chưa |
| `/ho-so` | Chưa |
| `InsightCard` | Chưa |

### Giai đoạn 6–8

Chưa bắt đầu trên frontend.

---

## Backend — tóm tắt (chi tiết trong `BACKEND_IMPLEMENTATION_STATUS.md`)

Backend đã triển khai các endpoint sau (production: `https://api-production-afd7.up.railway.app`):

- **Catalog:** `GET /health`, `GET /api/v1/categories`, `GET /api/v1/recipes`, `GET /api/v1/recipes/{slug}`
- **Recommendation:** `POST /api/v1/recommendations`
- **Auth:** `POST /api/v1/auth/register|login|google|refresh|logout`, `GET|PATCH /api/v1/me`
- **Saved:** `GET /api/v1/me/saved-recipes`, `POST|DELETE /api/v1/me/saved-recipes/{slug}`
- **Cooking:** `POST|PATCH /api/v1/cooking-sessions`, `POST .../complete`, `GET /api/v1/me/cooking-history`
- **Feedback:** `POST /api/v1/cooking-sessions/{id}/feedback`, `GET /api/v1/me/personalization`

Chưa có: Admin APIs, Phụ Bếp chat APIs.

---

## Việc nên làm tiếp theo trên frontend (ưu tiên)

1. ~~**Phase 0:** API client, env, types, error/not-found~~ ✅
2. ~~**Phase 1:** Catalog E2E~~ ✅
3. **Phase 2:** Luồng Trang chủ → `POST /recommendations` → `/ket-qua` → **M2**
4. **Phase 3:** Auth thật + saved recipes server-side → **M3**
5. Phase 4–5 sau khi M2–M3 ổn định.

---

## Tài liệu liên quan trong repo này

- `docs/BACKEND_IMPLEMENTATION_STATUS.md` — bản sao chi tiết tiến độ backend (mirror từ `be-an-gi-gio`)
- `docs/PHASE_5_BACKEND_STATUS.md` — chi tiết Phase 5 backend
- `docs/PRD.md` — yêu cầu sản phẩm đầy đủ
