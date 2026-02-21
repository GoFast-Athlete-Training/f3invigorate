# Volunteer Stack Analysis & Roadmap

**Last Updated:** February 14, 2026  
**Status:** 🟡 Core functionality built, organization onboarding flow needed

---

## 📋 Table of Contents

1. [Current State](#current-state)
2. [What's Working](#whats-working)
3. [Critical Gaps](#critical-gaps)
4. [Architecture Options](#architecture-options)
5. [Recommended Path Forward](#recommended-path-forward)
6. [Implementation Roadmap](#implementation-roadmap)

---

## Current State

### Database Schema

```
F3HIM (users)
  └─ VolunteerProfile (1:1) - skills, interests, availability
  └─ VolunteerApplication (1:many) - applies to opportunities

Organization (independent)
  └─ VolunteerOpportunity (1:many) - opportunities posted by org

VolunteerOpportunity
  └─ VolunteerApplication (1:many) - volunteers who applied
```

**Key Tables:**
- **F3HIM**: F3 members who can volunteer (firebaseId auth)
- **VolunteerProfile**: Optional volunteer preferences (skills, interests, commitment type)
- **Organization**: External nonprofits (Travis Manion Foundation, Team RWB, etc.)
- **VolunteerOpportunity**: Volunteer opportunities posted by organizations
- **VolunteerApplication**: Applications from F3 members to opportunities

### API Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `GET` | `/api/opportunities` | List open opportunities (fallback to fake data) | No |
| `POST` | `/api/opportunities` | Create new opportunity | No (🚨 Problem!) |
| `POST` | `/api/organizations` | Create organization | No (🚨 Problem!) |
| `POST` | `/api/opportunities/[id]/apply` | Apply to opportunity | Yes (F3HIM) |
| `GET` | `/api/applications/me` | My applications | Yes (F3HIM) |
| `GET/PUT` | `/api/volunteers` | Volunteer profile | Yes (F3HIM) |

### Public Pages

```
/f3serve                          → Home (shows opportunity cards)
/f3serve/opportunities            → Browse all opportunities
/f3serve/opportunities/[id]       → Opportunity detail + apply
/f3serve/opportunities/outlook/[slug] → Fake data detail pages

/f3serve/dashboard                → User's applications (auth required)
/f3serve/profile                  → Volunteer profile/preferences (auth required)

/f3serve/create-opportunity       → Stub (no form, just API docs)
/f3serve/dashboard/organization   → Stub (no functionality)
```

### Current Data Flow

1. **Public browsing (no auth):**
   - Anyone can visit `/f3serve` and see opportunity cards
   - GET `/api/opportunities` returns DB data OR fake data as fallback
   - Fake data is **hard-coded** in `lib/volunteer-fake-data.ts`
   - Clicking an opportunity shows details

2. **Applying (auth required):**
   - User must sign in (creates F3HIM record via Firebase)
   - "Apply" button on opportunity detail page
   - POST `/api/opportunities/[id]/apply` creates `VolunteerApplication`
   - Status: `PENDING` → `APPROVED`/`REJECTED` (manual for now)

3. **Creating opportunities (NO FLOW EXISTS):**
   - POST `/api/opportunities` has no auth guard
   - POST `/api/organizations` has no auth guard
   - No UI forms for creating orgs or opportunities
   - No concept of "org members" or "org admins"

---

## What's Working

✅ **Public browsing experience**
- Clean UI for browsing opportunities (like runcrew cards)
- Detail pages with full descriptions
- Category, commitment type, location filters (schema ready)
- Fake data fallback ensures demo always works

✅ **Volunteer application flow**
- F3 members can apply to opportunities
- Applications tracked in DB
- Dashboard shows user's applications with status
- Volunteer profile for preferences (optional)

✅ **Database schema**
- Clean separation between F3HIM (users) and Organizations
- Opportunity schema has all needed fields (category, commitment type, location, remote, etc.)
- Application status enum (PENDING, APPROVED, REJECTED)

✅ **Shared auth**
- Single login for both F3 Invigorate and f3serve
- Firebase auth tied to F3HIM
- `?next=` redirect flow works (e.g., `/login?next=/f3serve/dashboard`)

---

## Critical Gaps

### 🚨 1. No Organization Onboarding Flow

**Problem:** Organizations can't self-register or manage their profile.

**Current Reality:**
- Organizations must be manually created via API (POST `/api/organizations`)
- No UI, no auth, no validation
- No way for Travis Manion Foundation to "claim" their org

**What's Missing:**
- Organization signup/registration flow
- Organization authentication (separate from F3HIM users)
- Organization profile management
- Org logo upload
- Org verification (optional)

### 🚨 2. No Organization ID / Auth System

**Problem:** Anyone can create organizations and opportunities without auth.

**Current Reality:**
- No concept of "org owner" or "org admin"
- No foreign key from Organization to a "creator"
- No way to verify "is this person authorized to post on behalf of TMF?"

**What's Missing:**
- Organization user accounts (separate from F3HIM)
- Org admin role system
- Auth guard on POST `/api/opportunities` and POST `/api/organizations`
- Ownership validation (can only edit your org's opportunities)

### 🚨 3. Hard-Coded Public URL

**Problem:** Fake data is hard-coded; no real production data path.

**Current Reality:**
- `FAKE_OPPORTUNITIES` in `lib/volunteer-fake-data.ts`
- Used as fallback when DB is empty
- Works for demo, but not scalable

**What's Needed:**
- Real organizations entering real opportunities
- Seed script for demo/dev data (better than hard-coding in app)
- Clear distinction between demo and production

### 🚨 4. No Opportunity Management

**Problem:** Once created, opportunities can't be edited or closed.

**What's Missing:**
- Edit opportunity page
- Close/archive opportunity
- Approve/reject applications (org dashboard)
- Org dashboard to see their opportunities + applications

---

## Architecture Options

You outlined two possible paths. Let's analyze each:

### Option 1: SuperAdmin + Org Members (Separate Front Door)

**Concept:**
- **SuperAdmin** (platform admin, not F3 members) can create and manage orgs
- **Org Members** (e.g., TMF staff) can log in and manage their org's opportunities
- Org members are **NOT F3HIM users** (different auth system)
- Separate front door (e.g., `/f3serve/admin` or `/f3serve/org-portal`)

**Schema Changes:**
```prisma
model Organization {
  id           String   @id @default(cuid())
  name         String
  description  String   @db.Text
  contactEmail String
  website      String?
  location     String?
  logoUrl      String?  // NEW
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  opportunities VolunteerOpportunity[]
  members       OrganizationMember[]  // NEW
}

model OrganizationMember {
  id             String       @id @default(cuid())
  organizationId String
  email          String
  role           OrgRole      // ADMIN, MEMBER
  firebaseId     String?      @unique // Separate from F3HIM
  createdAt      DateTime     @default(now())
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  @@unique([organizationId, email])
}

enum OrgRole {
  ADMIN
  MEMBER
}
```

**Flow:**
1. SuperAdmin creates Organization via admin panel
2. SuperAdmin invites org members (email)
3. Org member signs up (separate auth, not F3HIM)
4. Org member logs in to `/f3serve/org-portal`
5. Org member creates/edits/closes opportunities for their org

**Pros:**
- Clean separation: F3 members (volunteers) vs Org members (admins)
- Easy to control who can post opportunities
- Platform admin can oversee all orgs
- No risk of F3 members accidentally creating fake orgs

**Cons:**
- Two separate auth systems (Firebase for F3HIM, another for org members)
- More complex: need org member signup, invite flow, role management
- Another UI to build (org portal vs volunteer portal)

---

### Option 2: F3 Members Can Populate Opportunities

**Concept:**
- Any F3 member can create an organization or opportunity
- Treat it like user-generated content (UGC)
- Add moderation/approval flow (optional)

**Schema Changes:**
```prisma
model Organization {
  id           String   @id @default(cuid())
  createdById  String   // NEW - FK to F3HIM
  name         String
  // ... existing fields
  createdBy    F3HIM    @relation(fields: [createdById], references: [id])
}

model VolunteerOpportunity {
  id              String       @id @default(cuid())
  organizationId  String
  createdById     String       // NEW - FK to F3HIM
  // ... existing fields
  createdBy       F3HIM        @relation(fields: [createdById], references: [id])
}
```

**Flow:**
1. F3 member signs in
2. Visits `/f3serve/create-opportunity`
3. Selects existing org OR creates new org
4. Posts opportunity
5. (Optional) SuperAdmin approves before it goes live

**Pros:**
- Single auth system (just F3HIM)
- Easier to build: no separate org member accounts
- F3 members can easily share volunteer opportunities they know about
- Community-driven content

**Cons:**
- Risk of spam or fake organizations
- Not official: "Travis Manion Foundation" posted by a random F3 member, not TMF staff
- Harder to trust authenticity
- Moderation burden

---

## Recommended Path Forward

### 🎯 Hybrid Approach (Best of Both Worlds)

**Short-term (MVP):**
- Start with **Option 1** (SuperAdmin + Org Members) for **official organizations**
- This ensures quality and authenticity
- Ideal for demo region (DC/Arlington) with known orgs (TMF, Team RWB)

**Long-term (Scale):**
- Add **Option 2** (F3 member submissions) as "Community Opportunities"
- Two tiers:
  - **Official** (verified org with logo, posted by org members)
  - **Community** (posted by F3 members, flagged as unofficial)
- Moderation flow: SuperAdmin reviews community submissions → approve → promote to official

**Why Hybrid?**
- Maintains quality for launch (official orgs only)
- Allows community growth (F3 members can share local opportunities)
- Clear trust signals (official vs community badge)

---

## Implementation Roadmap

### Phase 1: Organization Onboarding (Critical)

**Goal:** Organizations can register and manage opportunities.

**Tasks:**
1. **Add Organization Member table**
   ```prisma
   model OrganizationMember {
     id             String       @id @default(cuid())
     organizationId String
     email          String
     role           OrgRole
     firebaseId     String?      @unique
     createdAt      DateTime     @default(now())
     organization   Organization @relation(fields: [organizationId], references: [id])
     @@unique([organizationId, email])
   }
   ```

2. **Create SuperAdmin panel** (`/admin` or `/f3serve/admin`)
   - List all organizations
   - Create organization (form with name, description, contactEmail, logoUrl)
   - Invite org members (email + role)
   - View all opportunities across orgs

3. **Create Organization member portal** (`/f3serve/org-portal`)
   - Separate auth (Firebase, but NOT tied to F3HIM)
   - Org member signup (via invite link)
   - Dashboard:
     - My org's opportunities (list)
     - Create new opportunity (form)
     - Edit/close opportunity
     - View applications (list of volunteers who applied)
     - Approve/reject applications

4. **Auth guards**
   - `POST /api/opportunities` → require org member auth, validate organizationId ownership
   - `POST /api/organizations` → require SuperAdmin auth
   - `PUT /api/opportunities/[id]` → require org member auth, validate ownership

5. **Organization profile page**
   - `/f3serve/organizations/[id]` → show org info + their opportunities
   - Include logo, website, description

---

### Phase 2: Opportunity Management

**Goal:** Org members can manage their opportunities.

**Tasks:**
1. **Edit opportunity page** (`/f3serve/org-portal/opportunities/[id]/edit`)
   - Form pre-filled with current data
   - Save changes (PUT `/api/opportunities/[id]`)

2. **Close/archive opportunity**
   - Button to close opportunity (sets status: CLOSED)
   - Closed opportunities don't show in public list

3. **Application management**
   - Org dashboard shows list of applications per opportunity
   - Approve/reject buttons
   - POST `/api/applications/[id]/approve` (updates status)

---

### Phase 3: Enhanced Discovery

**Goal:** Better filtering and search for volunteers.

**Tasks:**
1. **Add Mission enum** (from VOLUNTEER_OPPORTUNITY_SPEC.md)
   ```prisma
   enum Mission {
     VETERANS
     FAMILIES_OF_FALLEN
     YOUTH
     HOMELESS
     ENVIRONMENTAL
     DISASTER_RELIEF
     COMMUNITY
   }
   
   model VolunteerOpportunity {
     // ...
     missions Mission[] // Multi-select
   }
   ```

2. **Split location into state/city**
   ```prisma
   model VolunteerOpportunity {
     city    String?
     state   String?
     isRemote Boolean @default(false)
   }
   ```

3. **Add filters to opportunities page**
   - Filter by mission, location, commitment type, category
   - Search bar (title, description)

4. **Add teaser field** (optional)
   ```prisma
   model VolunteerOpportunity {
     teaser String? // Short 1-2 sentence summary for cards
   }
   ```

---

### Phase 4: Community Opportunities (Future)

**Goal:** F3 members can submit volunteer opportunities.

**Tasks:**
1. **Add createdById to Organization and VolunteerOpportunity**
   ```prisma
   model Organization {
     createdById String?
     createdBy   F3HIM?  @relation(fields: [createdById], references: [id])
     isVerified  Boolean @default(false) // Official vs community
   }
   ```

2. **Allow F3 members to create opportunities**
   - `/f3serve/create-opportunity` form (auth required)
   - Select existing org or create new (flagged as community)
   - Status: PENDING (requires approval)

3. **SuperAdmin moderation**
   - Review pending opportunities
   - Approve → status: OPEN
   - Promote community org to official (isVerified: true)

4. **Badge system**
   - "Official" badge on verified orgs
   - "Community" badge on unverified orgs

---

## Open Questions & Decisions Needed

### 1. Organization Registration Flow

**Question:** Should orgs self-register, or SuperAdmin-only?

**Options:**
- **A) SuperAdmin-only (recommended for MVP):** Platform admin manually creates orgs, ensures quality
- **B) Self-registration:** Org fills out form, pending approval by SuperAdmin
- **C) Hybrid:** Self-registration with manual review before going live

**Recommendation:** Start with **A** (SuperAdmin-only) for DC/Arlington demo region with known orgs. Add **B** later for scale.

---

### 2. Organization Authentication

**Question:** Separate auth system, or reuse F3HIM?

**Options:**
- **A) Separate Firebase project for org members** (complex, clean separation)
- **B) Reuse same Firebase, add `role` to F3HIM** (simpler, but F3 members and org members mixed)
- **C) Email/password only for org members** (no social login)

**Recommendation:** **B** (reuse Firebase, add role). Simpler, fewer moving parts. Add `role` enum to F3HIM:
```prisma
enum F3HIMRole {
  VOLUNTEER      // Default - regular F3 member
  ORG_ADMIN      // Organization admin
  SUPER_ADMIN    // Platform admin
}
```

---

### 3. Application Approval Flow

**Question:** Manual approval by org, or auto-approve?

**Options:**
- **A) Manual approval (recommended):** Org member reviews application, approves/rejects
- **B) Auto-approve:** Application goes straight to APPROVED, org just sees list
- **C) Hybrid:** Some opportunities auto-approve, some require review (based on org preference)

**Recommendation:** Start with **A** (manual approval). Gives orgs control. Add **C** later (org setting: `autoApprove: boolean`).

---

### 4. Data Migration

**Question:** What to do with hard-coded fake data?

**Options:**
- **A) Keep as fallback** (current behavior)
- **B) Remove fallback, require real data** (cleaner, but empty state on fresh DB)
- **C) Seed script** (create fake orgs/opportunities in DB on setup)

**Recommendation:** **C** (seed script for dev/demo). Remove fallback from production. Clean separation of concerns.

---

## Next Immediate Steps

To move forward, you need to:

1. **Decide on auth approach** (separate Firebase vs role on F3HIM)
2. **Create Organization Member table** (Prisma migration)
3. **Build SuperAdmin panel** (create orgs, invite members)
4. **Build Org Member portal** (create/edit opportunities, manage applications)
5. **Add auth guards to API routes** (POST /api/opportunities requires org member auth)
6. **Remove hard-coded fake data** (create seed script instead)

**Estimated effort:**
- Phase 1 (Org onboarding): ~2-3 weeks (admin panel + org portal + auth)
- Phase 2 (Opportunity management): ~1 week
- Phase 3 (Enhanced discovery): ~1 week
- Phase 4 (Community opportunities): ~2 weeks

**Total:** ~6-7 weeks to full volunteer platform with org management.

---

## Summary

**You're close!** The core schema and public-facing experience are solid. The missing piece is the **organization onboarding and management flow**.

**Key decisions:**
1. Start with SuperAdmin + Org Members (Option 1) for quality control
2. Add F3 member submissions (Option 2) later as "Community Opportunities"
3. Hybrid approach scales while maintaining trust

**Next priority:** Build the org member portal so real organizations can post and manage opportunities. Once that's done, you can sunset the hard-coded fake data and launch with real DC/Arlington nonprofits.

---

**Questions or want to dive into implementation?** Let me know which phase to tackle first! 🚀
