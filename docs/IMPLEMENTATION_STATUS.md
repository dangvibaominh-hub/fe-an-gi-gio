# Implementation status — 2026-07-03

> **Mục đích:** Tài liệu này nằm trong repo frontend để AI agent và developer nắm tiến độ **cả hai repo** khi làm việc trên `fe-an-gi-gio`. Contract API đầy đủ: `../be-an-gi-gio/docs/openapi.yaml` hoặc Swagger production tại `https://api-production-afd7.up.railway.app/docs/`.

## Tóm tắt nhanh

| Repo | Vị trí theo PRD §20 | Ghi chú |
|------|---------------------|---------|
| **Backend** (`be-an-gi-gio`) | **Hoàn tất Phase 0–6** | Phase 6 Admin đã merge; Phase 7 (Phụ Bếp) chưa có |
| **Frontend** (`fe-an-gi-gio`) | **Hoàn tất Phase 0–6** | `/admin` và các màn hình quản trị đã nối API |

**Mốc nghiệm thu (PRD §24):**

| Mốc | Backend | Frontend |
|-----|---------|----------|
| M1 Catalog | Sẵn sàng | **Done** — `/kham-pha`, `/ket-qua`, `/cong-thuc/[slug]` dùng API |
| M2 Recommendation | Sẵn sàng | **Done** — Trang chủ → `POST /recommendations` → `/ket-qua` |
| M3 Identity | Sẵn sàng (Google OAuth cần env) | **Done** — JWT auth, server bookmarks, auth gates |
| M4 Cooking | Sẵn sàng | **Done** — `/cong-thuc/[slug]/nau`, `/lich-su`, session API |
| M5 Learning | Sẵn sàng | **Done** — `/ho-so`, personalization tab, InsightCard |
| M6 Administration | Sẵn sàng | **Done** — recipe CRUD, kiểm duyệt AI, tài khoản, audit log |
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
| `/` — `IngredientPillInput` → recommendation | Done — `HomePageClient` + validation + session restore |
| Truyền search session sang `/ket-qua` | Done — `?ingredients=` query + `sessionStorage` |
| `POST /api/v1/recommendations` | Done — `src/lib/api/recommendations.ts` |
| Hiển thị matched/missing + score | Done — `RecipeMatchSummary` trên `RecipeCard` |
| Loading/empty/error | Done — `ket-qua/loading.tsx`, `error.tsx`, empty state |
| Chi tiết: checklist theo match | Done — `RecipeIngredientsPanelWithSession` |

### Giai đoạn 3 — Auth & saved recipes

| Hạng mục | Trạng thái |
|----------|------------|
| `AuthModal` | Done — register/login API; mật khẩu tối thiểu 8 ký tự |
| Session / JWT | Done — `AuthProvider`, token refresh, `localStorage` tokens |
| Google OAuth | Done khi có `NEXT_PUBLIC_GOOGLE_CLIENT_ID` |
| Bookmark / `/da-luu` | Done — `GET/POST/DELETE /me/saved-recipes`; auth gate cho guest |
| Auth gate | Done — bookmark, "Bắt đầu nấu" mở login modal |

### Giai đoạn 4 — Cooking & history

| Hạng mục | Trạng thái |
|----------|------------|
| `/cong-thuc/[slug]/nau` | Done — full-screen, no navbar, progress + timer |
| Cooking session API | Done — start/resume, PATCH step, complete |
| `FeedbackModal` | Done — rating + issues + note → home toast |
| `/lich-su` | Done — timeline, sort, auth guard |
| Auth gate | Done — cooking mode yêu cầu đăng nhập |

### Giai đoạn 5 — Feedback & personalization

| Hạng mục | Trạng thái |
|----------|------------|
| `FeedbackModal` | Done (Phase 4 cooking flow) |
| `/ho-so` | Done — sub-nav: Thông tin / Cá nhân hóa / Cài đặt |
| `InsightCard` + confidence bar | Done — `GET /me/personalization`, 2–3 insights |
| Chỉnh sửa hồ sơ | Done — `PATCH /api/v1/me` (displayName) |

### Giai đoạn 6 — Admin

| Hạng mục | Trạng thái |
|----------|------------|
| Layout và auth guard `/admin` | Done — chỉ hiển thị cho role `ADMIN` |
| Tổng quan quản trị | Done — số công thức, hàng chờ, tài khoản, audit log |
| Quản lý công thức | Done — danh sách/filter, tạo, sửa, soft-hide |
| Form công thức | Done — thông tin, nguyên liệu động, bước nấu động |
| Kiểm duyệt Gemini | Done — hàng chờ `PENDING`, approve/reject |
| Quản lý tài khoản | Done — filter, suspend/reactivate, chặn self-suspend trên UI |
| Nhật ký quản trị | Done — filter và xem JSON chi tiết |
| Admin API client/types | Done — token refresh, pagination và contract Phase 6 |

### Giai đoạn 7–8

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
- **Admin:** recipe CRUD/soft-hide/moderation, user status, audit logs dưới `/api/v1/admin/*`

Chưa có: Phụ Bếp chat APIs.

---

## Việc nên làm tiếp theo trên frontend (ưu tiên)

1. ~~**Phase 0:** API client, env, types, error/not-found~~ ✅
2. ~~**Phase 1:** Catalog E2E~~ ✅
3. ~~**Phase 2:** Recommendation flow~~ ✅
4. ~~**Phase 3:** Auth thật + saved recipes server-side → **M3**~~ ✅
5. ~~**Phase 4:** Cooking mode + history → **M4**~~ ✅
6. ~~**Phase 5:** `/ho-so` + personalization → **M5**~~ ✅
7. ~~**Phase 6:** Admin recipe/user/moderation/audit → **M6**~~ ✅
8. **Phase 7:** Phụ Bếp khi backend conversation APIs sẵn sàng.

---

## Tài liệu liên quan trong repo này

- `docs/BACKEND_IMPLEMENTATION_STATUS.md` — bản sao chi tiết tiến độ backend (mirror từ `be-an-gi-gio`)
- `docs/PHASE_5_BACKEND_STATUS.md` — chi tiết Phase 5 backend
- `docs/PHASE_6_BACKEND_STATUS.md` — chi tiết Phase 6 backend
- `docs/PRD.md` — yêu cầu sản phẩm đầy đủ
