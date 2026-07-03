# Phase 6 backend status

> **Nguồn gốc:** `be-an-gi-gio/docs/PHASE_6_BACKEND_STATUS.md` (mirror cho frontend repo, kiểm tra ngày 2026-07-03).

Phase 6 backend admin baseline is implemented and merged.

## Implemented

- Migration `005_admin_phase.sql`.
- JWT `ADMIN` RBAC và `requireRole("ADMIN")`.
- `GET|POST /api/v1/admin/recipes`.
- `GET|PATCH|DELETE /api/v1/admin/recipes/:id`; DELETE là soft-hide.
- Gemini moderation qua `PATCH .../:id/moderation` và approve/reject aliases.
- `GET /api/v1/admin/users`.
- `PATCH /api/v1/admin/users/:id/status`.
- `GET /api/v1/admin/audit-logs`.
- Audit log cho recipe create/update/hide/moderation và user status.
- Suspend user thu hồi refresh token; self-suspend bị chặn.
- OpenAPI, ERD và `admin-api` tests đã cập nhật.

## Frontend

Frontend `/admin` và toàn bộ màn hình Phase 6 đã được triển khai theo contract trên.
