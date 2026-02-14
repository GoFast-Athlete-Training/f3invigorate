# F3 Invigorate + Volunteer Match (combined)

Next.js 15 App Router app with **two front doors**:

- **F3 Invigorate** (grow.f3capitalimpact.org) – Attendance, effort, reflections, backblast.
- **F3 Volunteer Match** (f3capitalimpact.org) – Volunteer opportunities, apply, my applications, profile.

One codebase, one DB, one auth (F3HIM). See `docs/ARCHITECTURE_PROCONS.md` and `docs/MIGRATION_FROM_VOLUNTEERMATCH.md`.

## Features

- **Splash Screen**: Clean "f3" branding with black design
- **Authentication**: Firebase Auth with Google and Email signup/signin (similar to gofastapp-mvp)
- **Q Backblast → Attendance**: Create backblast entries that automatically log attendance for multiple PAX
- **Self-Report Attendance**: Log your own attendance at an AO
- **Manual Effort Entry**: Log workout effort (calories, duration) manually
- **Weekly Reflection**: Track mood, wins, struggles, and intentions
- **Self-Report Entry**: Log entries across different categories (Fellowship, Service, Marriage & Family, etc.)
- **F3 Volunteer Match** (under `/volunteer`): Browse opportunities, apply, volunteer profile, my applications, organization/opportunity management APIs

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Prisma ORM** (connected to existing GoFast PostgreSQL database)
- **Firebase Auth** (client-side + server-side admin SDK)
- **Zod** (validation)
- **Axios** (API client with automatic token injection)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gofast"

# Firebase Client (public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key

# Host-based routing (production; optional, defaults below)
VOLUNTEER_HOST=f3capitalimpact.org
INVIGORATE_HOST=grow.f3capitalimpact.org
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Push database schema (creates new tables):
```bash
npm run db:push
```

5. Run development server:
```bash
npm run dev
```

## Database Schema

This app uses the combined schema. Identity is **F3HIM** (F3 Invigorate Identity Model). Tables include:

- `f3_hims` - Identity (auth, name, F3 handle)
- `attendance_records`, `effort_records`, `weekly_reflections`, `self_report_entries` - Invigorate
- `organizations`, `volunteer_opportunities`, `volunteer_applications`, `volunteer_profiles` - Volunteer Match

All records are tied to `F3HIM.id` via foreign keys.

## Authentication

Uses Firebase Auth with pattern similar to gofastapp-mvp:
- **Splash Screen** (`/`) - Shows "f3" branding, checks auth state, routes to signup or dashboard
- **Signup/Signin** (`/signup`) - Firebase authentication (Google or Email)
- **F3HIM creation** - After auth, calls `/api/f3him/create` to create/find identity in database
- **Dashboard** (`/dashboard`) - Main dashboard (requires authentication)
- Client-side login via `lib/firebase.ts` (re-exports from `firebaseClient.ts`)
- Server-side token verification via `lib/firebaseAdmin.ts`
- API client (`lib/api.ts`) with automatic Firebase token injection
- `getCurrentAthlete()` function to get the current authenticated athlete

## Project Structure

```
/app
  /api
    /f3him/create/route.ts (create/find F3HIM after Firebase auth)
    /attendance/self/route.ts
    /backblast/create/route.ts
    /effort/manual/route.ts
    /reflection/week/route.ts
    /self-report/new/route.ts
  /attendance/self/page.tsx
  /backblast/create/page.tsx
  /dashboard/page.tsx (main dashboard)
  /effort/manual/page.tsx
  /reflection/week/page.tsx
  /self-report/new/page.tsx
  /signup/page.tsx (signup/signin page)
  page.tsx (splash screen)
/lib
  api.ts (Axios client with token injection)
  auth.ts (getCurrentAthlete)
  firebase.ts (re-exports from firebaseClient)
  firebaseClient.ts (Firebase client setup)
  firebaseAdmin.ts (Firebase Admin SDK)
  prisma.ts
/prisma
  schema.prisma
/docs
  APP_PURPOSE.md (application purpose and architecture)
```

## Documentation

See `docs/APP_PURPOSE.md` for detailed information about:
- What F3 Invigorate is and its purpose
- Core features and use cases
- Architecture overview
- Design philosophy
- Future potential enhancements

