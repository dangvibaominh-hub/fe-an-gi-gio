# Backend implementation status (mirror)

> **Nguồn gốc:** `be-an-gi-gio/docs/IMPLEMENTATION_STATUS.md` + kiểm tra codebase ngày 2026-06-24.  
> Cập nhật file gốc ở backend khi có thay đổi lớn; đồng bộ bản mirror này vào frontend repo để agent làm việc trên FE không cần mở repo backend.

## Trạng thái hiện tại

Backend **đã hoàn tất Phase 0–5**. Phase 6 (Admin) và Phase 7 (Phụ Bếp) **chưa bắt đầu**.

Production API: `https://api-production-afd7.up.railway.app`  
Swagger: `https://api-production-afd7.up.railway.app/docs/`

---

## Phase 0 — Khảo sát & hợp đồng

| Yêu cầu | Trạng thái |
|---------|------------|
| Express + module structure | Done |
| Supabase PostgreSQL schema | Done |
| OpenAPI (`docs/openapi.yaml`) | Done |
| ERD, ADR | Done |
| Migration, seed, lint, test, env validation | Done |

---

## Phase 1 — Recipe catalog

| Yêu cầu | Trạng thái |
|---------|------------|
| Schema Category, Recipe, Ingredient, RecipeStep, CookingTerm | Done — `001_recipe_catalog.sql` |
| Seed từ mock recipes | Done |
| `GET /api/v1/categories` | Done |
| `GET /api/v1/recipes` (filter, pagination, sort) | Done |
| `GET /api/v1/recipes/{slug}` | Done |
| Dữ liệu Supabase | 6 categories, 10 recipes |

---

## Phase 2 — Recommendation

| Yêu cầu | Trạng thái |
|---------|------------|
| `POST /api/v1/recommendations` | Done |
| Normalize / alias nguyên liệu tiếng Việt | Done |
| matched/missing ingredients + score | Done |
| Gemini fallback → recipe `PENDING` | Done |
| Admin duyệt recipe `PENDING` | **Chưa** (thuộc Phase 6) |

---

## Phase 3 — Auth & saved recipes

| Yêu cầu | Trạng thái |
|---------|------------|
| Register / login / refresh / logout | Done — `002_identity_saved_recipes.sql` |
| `GET|PATCH /api/v1/me` | Done |
| Saved recipes CRUD | Done |
| Google OAuth (`POST /api/v1/auth/google`) | Code có; cần `GOOGLE_OAUTH_CLIENT_ID` + id token từ FE |

---

## Phase 4 — Cooking sessions & history

| Yêu cầu | Trạng thái |
|---------|------------|
| `POST|PATCH /api/v1/cooking-sessions` | Done — `003_cooking_sessions.sql` |
| `POST .../complete` | Done |
| `GET /api/v1/me/cooking-history` | Done |
| Resume session `IN_PROGRESS` | Done |

---

## Phase 5 — Feedback & personalization

Chi tiết: `docs/PHASE_5_BACKEND_STATUS.md`

| Yêu cầu | Trạng thái |
|---------|------------|
| `POST /api/v1/cooking-sessions/{id}/feedback` | Done — `004_feedback_personalization.sql` |
| `GET /api/v1/me/personalization` | Done |
| Preference rule engine + recommendation rerank | Done |
| History `sort=rating-desc` + feedback embed | Done |

---

## Phase 6–8 — Chưa triển khai

- **Phase 6:** `/api/v1/admin/*` — CRUD công thức, kiểm duyệt Gemini, quản lý user
- **Phase 7:** Chat / Phụ Bếp conversation APIs
- **Phase 8:** E2E toàn hệ thống, a11y audit (backend đã deploy Railway)

---

## Tests (backend)

- `recipe-api`, `recommendation-api`, `auth-saved-api`, `cooking-session-api`, `feedback-api`
- `ingredient-normalizer`, `gemini-recipe-adapter`, `recommendation-service`
