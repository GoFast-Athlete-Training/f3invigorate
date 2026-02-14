# Migration from f3volunteermatch

**F3 Volunteer Match** has been fully merged into **F3 Invigorate**. This repo is the single source of truth. The f3volunteermatch repo can be archived or deleted.

## What was merged

- **Volunteer Match features** live under the `/volunteer` path and share the same DB and auth (F3HIM).
- **Prisma schema**: Volunteer tables (`Organization`, `VolunteerOpportunity`, `VolunteerApplication`, `VolunteerProfile`) were added to the Invigorate schema. Applications use a real FK to `F3HIM.id`.
- **Routes**:
  - `/volunteer` – Volunteer Match front door (landing)
  - `/volunteer/opportunities`, `/volunteer/opportunities/[id]` – Browse and detail
  - `/volunteer/dashboard` – My applications
  - `/volunteer/dashboard/organization` – Org dashboard (stub)
  - `/volunteer/profile` – Volunteer profile/preferences
  - `/volunteer/create-opportunity`
- **APIs**: `/api/organizations`, `/api/opportunities`, `/api/opportunities/[id]/apply`, `/api/applications/me`, `/api/volunteers` (GET/PUT).
- **Auth**: One login/signup for both products. Login supports `?next=` (e.g. `/login?next=/volunteer/dashboard`). `/register` redirects to `/signup`.

## Production URLs (host-based)

| Product           | URL |
|-------------------|-----|
| **Volunteer Match** | https://f3capitalimpact.org (→ `/volunteer`) |
| **Invigorate**      | https://grow.f3capitalimpact.org (→ `/`) |

Middleware redirects `f3capitalimpact.org/` to `/volunteer`. Both hosts point at this app.

## After deleting f3volunteermatch

1. Remove f3volunteermatch from your workspace / codespace.
2. Update any bookmarks or links that pointed at the old repo to this repo.
3. No data migration is needed if f3volunteermatch had no production data; if it did, that DB would need to be merged or migrated separately (this app uses the Invigorate DB with the combined schema).
