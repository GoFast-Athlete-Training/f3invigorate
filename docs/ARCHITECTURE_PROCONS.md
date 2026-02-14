# F3 Invigorate + Volunteer Match: Architecture Pros & Cons

## 1. Universal person = Invigorate, string lookup in Volunteer Match

**Idea:** Identity lives only in F3 Invigorate. Volunteer Match stores `volunteerFirebaseId` (string) on applications and profiles—no foreign key to another app. "My Volunteer Opportunities" = API that queries by that string.

### Pros

| Pro | Why it helps |
|-----|----------------|
| **Single source of truth** | One place for name, email, photo, F3 handle. No sync or drift between apps. |
| **No cross-DB FKs** | Volunteer Match can use its own DB (or same DB later). No FK from Volunteer Match → Invigorate. |
| **Stable identifier** | `firebaseId` is immutable and unique. Safe for lookups and joins inside Volunteer Match. |
| **Independent deploy** | Volunteer Match can ship without touching Invigorate. Clear API boundary. |
| **Same login everywhere** | One Firebase project; one account works for both "why I work out" and "volunteer match." |

### Cons

| Con | Mitigation |
|-----|------------|
| **No DB-level referential integrity** | Can't CASCADE DELETE from Invigorate. Acceptable; rarely delete users. Validate "person exists" on write (e.g. call Invigorate when creating an application). |
| **Orphaned rows if Invigorate deletes user** | Use soft-delete in Invigorate. If hard-delete ever happens, keep `volunteerFirebaseId` and treat as "unknown volunteer" or run a one-off cleanup. |
| **Depends on Invigorate API** | If Invigorate is down, Volunteer Match can't resolve "current user." Use same Firebase token + optional caching of minimal profile (e.g. firebaseId + display name) for resilience. |
| **Two codebases to run** | Combine into one app with two URL front doors (see below). |

---

## 2. Separate apps vs one combined app

### Option A: Two separate apps (two repos / two deploys)

| Pros | Cons |
|------|------|
| Clear separation of "workout" vs "volunteer" product. | Two deploys, two envs, two DBs (or shared DB but two schemas). |
| Can scale or secure them differently. | User has two URLs; slightly more confusing. |
| Smaller blast radius per deploy. | Duplicate auth/session logic unless shared via API (as we did). |

### Option B: One combined app, different URLs / front doors

**Idea:** One codebase (e.g. Invigorate repo), one deploy, one DB. Two "front doors":

- **Invigorate:** `https://app.example.com/` or `https://invigorate.example.com/`  
  → Dashboard, attendance, effort, reflections, backblast, etc.

- **Volunteer Match:** `https://app.example.com/volunteer` or `https://volunteer.example.com/`  
  → Opportunities, apply, my applications, org management.

| Pros | Cons |
|------|------|
| One repo, one deploy, one DB. | Slightly larger app surface; need clear route/nav structure. |
| One Prisma schema: F3HIM + Invigorate tables + Volunteer tables. Real FK from applications to F3HIM. | Must merge routes and avoid path collisions (e.g. `/dashboard` for both). |
| Single auth/session; no cross-app API for "who am I." | Different "brand" per front door (Invigorate vs Volunteer) needs layout/nav handling. |
| One Firebase project, one `getCurrentF3HIM()`. | |

---

## 3. Implemented: Combined app with two URL front doors

This repo is the **combined app**. Routing is by **host** (middleware):

- **f3capitalimpact.org** → Volunteer Match. Root `/` redirects to `/volunteer`.
- **grow.f3capitalimpact.org** → Invigorate. Root `/` is Invigorate home.

Same codebase, one deploy. Set DNS so both hosts point at this app.

### Production URLs

| Product          | URL                        |
|------------------|----------------------------|
| **Volunteer Match** | https://f3capitalimpact.org (→ `/volunteer`) |
| **Invigorate**      | https://grow.f3capitalimpact.org (→ `/`)     |

Optional env (defaults above): `VOLUNTEER_HOST=f3capitalimpact.org`, `INVIGORATE_HOST=grow.f3capitalimpact.org`.

### URL layout (path structure)

```
/                          → Invigorate home (only on grow.f3capitalimpact.org)
/login, /signup            → Shared auth (same F3HIM)
/dashboard                 → Invigorate dashboard
/attendance, /effort, ...  → Invigorate features

/volunteer                 → Volunteer Match home (f3capitalimpact.org/ redirects here)
/volunteer/opportunities   → Browse opportunities
/volunteer/opportunities/[id]  → Detail + Apply
/volunteer/dashboard       → My applications
/volunteer/profile         → Volunteer profile/preferences
/volunteer/create-opportunity
```

---

## Summary

| Topic | Recommendation |
|-------|----------------|
| **Identity** | Universal person = F3 Invigorate (F3HIM). In this combined app, Volunteer uses the same F3HIM with a real FK. |
| **String lookup vs FK** | In this combined app we use FK to F3HIM. No string lookup or cross-app API. |
| **Structure** | One app, two hosts: **f3capitalimpact.org** (Volunteer), **grow.f3capitalimpact.org** (Invigorate). |
| **Pros of combining** | One deploy, one DB, one auth, simpler ops. |
| **Cons of combining** | More routes; keep nav/layout clear so each front door has its own branding. |
