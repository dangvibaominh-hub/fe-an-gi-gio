# Implementation status — 2026-06-24

> **Mục đích:** Tài liệu này nằm trong repo frontend để AI agent và developer nắm tiến độ **cả hai repo** khi làm việc trên `fe-an-gi-gio`. Contract API đầy đủ: `../be-an-gi-gio/docs/openapi.yaml` hoặc Swagger production tại `https://api-production-afd7.up.railway.app/docs/`.

## Tóm tắt nhanh

| Repo | Vị trí theo PRD §20 | Ghi chú |
|------|---------------------|---------|
| **Backend** (`be-an-gi-gio`) | **Hoàn tất Phase 0–5** | API live trên Railway; Phase 6 (Admin) và Phase 7 (Phụ Bếp) chưa có |
| **Frontend** (`fe-an-gi-gio`) | **Phase 0–5 profile + personalization done** | `/ho-so`, InsightCard, confidence bar |

**Mốc nghiệm thu (PRD §24):**

| Mốc | Backend | Frontend |
|-----|---------|----------|
| M1 Catalog | Sẵn sàng | **Done** — `/kham-pha`, `/ket-qua`, `/cong-thuc/[slug]` dùng API |
| M2 Recommendation | Sẵn sàng | **Done** — Trang chủ → `POST /recommendations` → `/ket-qua` |
| M3 Identity | Sẵn sàng (Google OAuth cần env) | **Done** — JWT auth, server bookmarks, auth gates |
| M4 Cooking | Sẵn sàng | **Done** — `/cong-thuc/[slug]/nau`, `/lich-su`, session API |
| M5 Learning | Sẵn sàng | **Done** — `/ho-so`, personalization tab, InsightCard |
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
3. ~~**Phase 2:** Recommendation flow~~ ✅
4. ~~**Phase 3:** Auth thật + saved recipes server-side → **M3**~~ ✅
5. ~~**Phase 4:** Cooking mode + history → **M4**~~ ✅
6. ~~**Phase 5:** `/ho-so` + personalization → **M5**~~ ✅
7. **Phase 6+** khi backend Admin sẵn sàng.

---

## Tài liệu liên quan trong repo này

- `docs/BACKEND_IMPLEMENTATION_STATUS.md` — bản sao chi tiết tiến độ backend (mirror từ `be-an-gi-gio`)
- `docs/PHASE_5_BACKEND_STATUS.md` — chi tiết Phase 5 backend
- `docs/PRD.md` — yêu cầu sản phẩm đầy đủ
