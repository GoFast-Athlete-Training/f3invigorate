# F3 Service - Final Clean Architecture ✅

**Status:** Schema migrated, database updated  
**Date:** February 21, 2026

---

## Core Principles

1. **f3himId is universal identity** - no separate profile tables
2. **No booleans** - use date/enum logic
3. **Role on junction tables** - not separate relations
4. **Honor system** - no approval workflows
5. **Data as cards** - Organizations & Opportunities hydrated from multiple sources (like RunClubs)

---

## The Model

### F3HIM (Universal Identity)
```prisma
model F3HIM {
  id String @id @default(cuid())

  // Auth
  firebaseId String  @unique
  email      String?

  // Identity
  firstName String?
  lastName  String?
  f3Handle  String? @unique
  photoURL  String?

  // Personal
  bio         String? @db.Text
  phoneNumber String?
  city        String?
  state       String?

  // Service
  myCauses        ServiceCause[] @default([])  // Enum array (no FK)
  volunteerSkills String?        @db.Text
  availability    String?        @db.Text

  // Relations (4 total)
  activityLog          F3ActivityLog[]       // 1
  aoMemberships        AOCentral[]           // 2
  projectCommitments   ProjectCentral[]      // 3
  volunteerCommitments VolunteerCommitment[] // 4
}
```

**Total fields:** 15 (reasonable!)  
**Total relations:** 4 (clean!)

---

## The Two Service Systems

### 1. F3Project (Group Events - PAX Organized)
```
F3HIM ←→ ProjectCentral ←→ F3Project
       (junction w/ role)
```

**Flow:**
1. PAX creates F3Project ("Park cleanup Saturday 9am")
2. Auto-creates ProjectCentral entry (role: ORGANIZER)
3. Other PAX click "Join" → creates ProjectCentral (role: PARTICIPANT)
4. Everyone logs hours
5. Complete when NOW > endTime

**Example:**
- "Freedom Park cleanup" (PAX-organized, no partner)
- "TMF 9/11 Run Support" (PAX-organized, partnerOrg: "Travis Manion Foundation")
- "Charlotte AO Monthly Food Bank" (aoId set, organized by AO)

---

### 2. VolunteerOpportunity (Individual - External Data)
```
F3HIM ←→ VolunteerCommitment ←→ VolunteerOpportunity ←→ Organization
       (junction)                 (data card)          (data)
```

**Flow:**
1. Organization & Opportunities hydrated (SuperAdmin, PAX, VolunteerMatch API, VA)
2. PAX browses opportunity cards
3. PAX clicks "I'm doing this" → creates VolunteerCommitment
4. PAX self-reports hours (honor system)
5. Optional completedAt when done

**Example:**
- "TMF Character Does Matter Mentor" (external org, individual work)
- "Local food bank volunteer" (external org, individual shifts)

---

## Junction Tables

### AOCentral (AO Membership)
**Many-to-many: F3HIM ←→ AO**

```
f3himId + aoId + role (MEMBER, Q, SITE_Q)
```

**Purpose:** Which AOs is this PAX part of?  
**Query:** "Show me my AOs" or "Show me all Site Qs"

---

### ProjectCentral (Service Participation)
**Many-to-many: F3HIM ←→ F3Project**

```
f3himId + f3ProjectId + role (ORGANIZER, PARTICIPANT) + hoursLogged
```

**Purpose:** Which service projects am I involved in?  
**Query organized:** WHERE role = ORGANIZER  
**Query joined:** WHERE role = PARTICIPANT  
**Query all:** WHERE f3himId = X

---

### VolunteerCommitment (Opportunity Participation)
**Many-to-many: F3HIM ←→ VolunteerOpportunity**

```
f3himId + opportunityId + hoursLogged + note
```

**Purpose:** Which external opportunities am I committed to?  
**No role** - just participation  
**No status** - honor system

---

## Total Service Hours (Unified)

```typescript
const pax = await prisma.f3HIM.findUnique({
  where: { id },
  include: {
    projectCommitments: true,
    volunteerCommitments: true,
  }
});

const totalHours = 
  pax.projectCommitments.reduce((sum, p) => sum + p.hoursLogged, 0) +
  pax.volunteerCommitments.reduce((sum, v) => sum + v.hoursLogged, 0);
```

---

## Profile Display

```
[PAX Profile]

John "Fastlane" Smith
📍 Charlotte, NC
📞 (704) 555-1234

Bio: "10 years Army infantry. Passionate about helping 
      vets transition and working with youth."

Causes I Care About:
[VETERANS] [YOUTH_KIDS] [COMMUNITY_GENERAL]

Skills: "Mentoring, event planning, construction experience"
Availability: "Weekends, Tuesday evenings, open to remote"

Home AOs:
├─ Charlotte Metro (SITE_Q)
└─ Raleigh South (MEMBER)

Service Stats:
├─ 47 total hours
├─ 3 group projects joined
├─ 1 project organized
└─ 2 external commitments

Recent Activity:
├─ Park Cleanup @ Freedom Park (3 hrs, complete) - F3Project
├─ TMF 9/11 Run Support (4 hrs, complete) - F3Project
└─ TMF Character Does Matter Mentor (ongoing) - VolunteerOpportunity
```

---

## Data Hydration Sources

**Organizations & Opportunities can be created by:**

1. **SuperAdmin** - Manually creates known orgs/opportunities
2. **PAX** - Creates their own opportunities they know about
3. **VolunteerMatch API** - Import from external source
4. **VA/Assistant** - Bulk upload via script

**All just DATA.** Like RunClubs in GoFast getting hydrated from multiple sources.

---

## No Booleans ✅

All boolean logic replaced:
- ~~isCompleted~~ → `endTime` (NOW > endTime = complete)
- ~~remotePreference~~ → `availability` text field
- ~~isRemote~~ → `locationType` enum (IN_PERSON, REMOTE, HYBRID)

---

## No Approval Workflows ✅

**Removed:**
- ❌ ApplicationStatus enum (PENDING/APPROVED/REJECTED)
- ❌ VolunteerApplication.status field
- ❌ Approval/rejection logic

**Replaced with:**
- ✅ VolunteerCommitment - just click "I'm doing this"
- ✅ Honor system for hours
- ✅ Self-report when complete

---

## Clean FK Naming ✅

All FKs consistently named:
- `f3himId` (always references F3HIM)
- `aoId` (always references AO)
- `f3ProjectId` (always references F3Project)
- `opportunityId` (always references VolunteerOpportunity)
- `organizationId` (always references Organization)

---

## What's Next

### 1. Update Existing Code
Files that need updating for new schema:

**API Routes:**
- `/api/opportunities/route.ts` - Update types
- `/api/opportunities/[id]/apply/route.ts` - Change to "commit" (VolunteerCommitment)
- `/api/volunteers/route.ts` - Update to use F3HIM fields directly

**Pages:**
- `/app/f3serve/opportunities/[id]/page.tsx` - "Apply" → "Commit"
- `/app/f3serve/dashboard/page.tsx` - Show commitments not applications
- `/app/f3serve/profile/page.tsx` - Update to F3HIM fields

**Components:**
- `/app/f3serve/opportunities/[id]/ApplyButton.tsx` - Rename to CommitButton
- `/app/f3serve/profile/VolunteerProfileForm.tsx` - Update to F3HIM fields

**Lib:**
- `/lib/volunteer-fake-data.ts` - Update DisplayOpportunity type

---

### 2. Build New Features

**F3Project Pages (NEW):**
- `/app/f3serve/projects/page.tsx` - Browse group service events
- `/app/f3serve/projects/[id]/page.tsx` - Project detail + join button
- `/app/f3serve/projects/create/page.tsx` - Create new project

**F3Project APIs (NEW):**
- `POST /api/projects` - Create F3Project
- `GET /api/projects` - List projects
- `POST /api/projects/[id]/join` - Join project (creates ProjectCentral)
- `PUT /api/projects/[id]/hours` - Log hours

---

## Schema Summary

**Tables:** 9 total
1. F3HIM (universal identity)
2. AO (workout locations)
3. AOCentral (junction - AO membership with role)
4. F3ActivityLog (workout tracking)
5. F3Project (group service events)
6. ProjectCentral (junction - project participation with role)
7. Organization (external orgs - data)
8. VolunteerOpportunity (external opportunities - data)
9. VolunteerCommitment (junction - opportunity participation)

**Enums:** 7 total
1. ServiceCause
2. CommitmentType
3. OpportunityStatus
4. LocationType
5. ProjectRole
6. AOMemberRole
7. AttendanceSource

**No booleans. No approval workflows. No separate profile tables.**

**Clean!** 🎉
