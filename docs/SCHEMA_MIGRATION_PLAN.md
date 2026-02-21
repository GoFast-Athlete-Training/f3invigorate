# F3 Service Schema Migration - Clean Architecture

**Mission:** Kill all booleans, fix FK naming, add AO table, enrich F3HIM.

---

## Changes Summary

### 🔪 Booleans to Kill
1. ~~`F3Project.isCompleted`~~ → Use `endTime` logic (NOW > endTime = complete)
2. ~~`VolunteerProfile.remotePreference`~~ → Remove or add to availability text
3. ~~`VolunteerOpportunity.isRemote`~~ → Replace with `locationType` enum

### 🏗️ New Tables
1. **AO** - Area of Operation (home base for PAX)
2. **AOCentral** - Junction for F3HIM ←→ AO (many-to-many membership)

### 📝 Rename Tables
1. **F3ProjectMembership** → **ProjectCentral**
2. **VolunteerProfile** → **VolunteerSpecialties**

### 🔗 Fix FK Naming
1. `F3Project.createdById` → `f3himId` (and rename relation field)
2. `VolunteerApplication.volunteerId` → `f3himId`
3. All string FK fields → proper ID fields

### ➕ Enrich F3HIM
Add: bio, city, state, phoneNumber, instagram, aoId, myCauses

---

## The Two Junction Tables

### 1. AOCentral (AO Membership)
**Many-to-many: F3HIM ←→ AO**

```prisma
model AOCentral {
  id      String @id @default(cuid())
  f3himId String
  aoId    String
  
  role      AOMemberRole @default(MEMBER)
  joinedAt  DateTime     @default(now())
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  ao    AO    @relation(fields: [aoId], references: [id], onDelete: Cascade)

  @@unique([f3himId, aoId])  // Each PAX can only join an AO once
  @@index([aoId])
  @@index([f3himId])
  @@map("ao_central")
}

enum AOMemberRole {
  MEMBER  // Regular PAX
  Q       // Workout leader
  SITE_Q  // AO leader
}
```

**Why many-to-many?** PAX might be active in multiple AOs (home + visits).

---

### 2. ProjectCentral (Project Participation)
**Many-to-many: F3HIM ←→ F3Project**

```prisma
model ProjectCentral {
  id          String @id @default(cuid())
  f3ProjectId String
  f3himId     String
  
  hoursLogged Int      @default(0)
  joinedAt    DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project F3Project @relation(fields: [f3ProjectId], references: [id], onDelete: Cascade)
  f3him   F3HIM     @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  @@unique([f3ProjectId, f3himId])
  @@index([f3ProjectId])
  @@index([f3himId])
  @@map("project_central")
}
```

**No collision!** Different concepts:
- **AOCentral** = Which AOs am I a member of? (optional affiliation)
- **ProjectCentral** = Which service projects have I joined? (ad-hoc participation)

---

## Complete Clean Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// CORE IDENTITY
// ============================================================================

model F3HIM {
  id String @id @default(cuid())

  // Auth
  firebaseId String  @unique
  email      String?

  // Identity
  firstName  String?
  lastName   String?
  f3Handle   String? @unique
  photoURL   String?

  // Personal (NEW - from Athlete pattern)
  bio         String? @db.Text
  city        String?
  state       String?
  phoneNumber String?
  instagram   String?
  
  // Service (NEW)
  myCauses ServiceCause[] @default([])
  
  // System
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  attendanceRecords      AttendanceRecord[]
  effortRecords          EffortRecord[]
  weeklyReflections      WeeklyReflection[]
  selfReportEntries      SelfReportEntry[]
  aoMemberships          AOCentral[]              // AO memberships (junction)
  volunteerSpecialties   VolunteerSpecialties?
  volunteerApplications  VolunteerApplication[]
  organizedProjects      F3Project[]
  projectParticipation   ProjectCentral[]         // Project memberships (junction)

  @@map("f3_hims")
}

// ============================================================================
// ATTENDANCE & EFFORT (existing)
// ============================================================================

model AttendanceRecord {
  id      String           @id @default(cuid())
  f3himId String
  aoId    String
  date    DateTime
  source  AttendanceSource
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("attendance_records")
}

enum AttendanceSource {
  BACKBLAST
  SELF
}

model EffortRecord {
  id          String @id @default(cuid())
  f3himId     String
  date        DateTime
  calories    Int?
  durationSec Int?
  calPerMin   Float?
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("effort_records")
}

model WeeklyReflection {
  id        String   @id @default(cuid())
  f3himId   String
  date      DateTime @default(now())
  mood      String?
  wins      String?
  struggles String?
  intention String?
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("weekly_reflections")
}

model SelfReportEntry {
  id       String             @id @default(cuid())
  f3himId  String
  date     DateTime           @default(now())
  category SelfReportCategory
  note     String?
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("self_report_entries")
}

enum SelfReportCategory {
  FELLOWSHIP
  SERVICE
  MARRIAGE_FAMILY
  DIET_QUEEN
  MENTAL_HEALTH
  SPIRITUAL
}

// ============================================================================
// AO (Area of Operation)
// ============================================================================

model AO {
  id   String @id @default(cuid())
  name String
  
  // Location
  city  String?
  state String?
  
  // Optional metadata
  region      String? // "F3 Charlotte", "F3 Nation Capital"
  description String? @db.Text
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  members            AOCentral[]         // PAX members (junction)
  attendanceRecords  AttendanceRecord[]  // Attendance at this AO
  organizedProjects  F3Project[]         // Projects organized by this AO (optional)
  
  @@index([city, state])
  @@index([region])
  @@map("aos")
}

model AOCentral {
  id      String @id @default(cuid())
  f3himId String
  aoId    String
  
  role AOMemberRole @default(MEMBER)
  
  joinedAt  DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  ao    AO    @relation(fields: [aoId], references: [id], onDelete: Cascade)

  @@unique([f3himId, aoId])
  @@index([aoId])
  @@index([f3himId])
  @@map("ao_central")
}

enum AOMemberRole {
  MEMBER  // Regular PAX
  Q       // Workout leader
  SITE_Q  // AO leader / site Q
}

// ============================================================================
// F3 SERVICE ENGINE (Group Projects)
// ============================================================================

model F3Project {
  id      String @id @default(cuid())
  f3himId String  // Who organized it (FK)
  aoId    String? // Optional: which AO organized it (FK)
  
  title       String
  slug        String? @unique
  description String  @db.Text
  
  // Timing (NO BOOLEANS - use date logic)
  startTime      DateTime
  endTime        DateTime  // Complete when NOW > endTime
  estimatedHours Int?
  
  // Location
  location String?
  city     String?
  state    String?
  address  String? // Specific address for meetup
  
  // Categorization
  causes ServiceCause[] @default([])
  
  // Relations
  organizer    F3HIM          @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  ao           AO?            @relation(fields: [aoId], references: [id], onDelete: SetNull)
  participants ProjectCentral[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([startTime])
  @@index([endTime])
  @@index([f3himId])
  @@index([aoId])
  @@map("f3_projects")
}

model ProjectCentral {
  id          String @id @default(cuid())
  f3ProjectId String
  f3himId     String
  
  hoursLogged Int      @default(0)
  joinedAt    DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project F3Project @relation(fields: [f3ProjectId], references: [id], onDelete: Cascade)
  f3him   F3HIM     @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  @@unique([f3ProjectId, f3himId])
  @@index([f3ProjectId])
  @@index([f3himId])
  @@map("project_central")
}

// ============================================================================
// EXTERNAL ORG SYSTEM (Individual Partnerships)
// ============================================================================

model Organization {
  id           String @id @default(cuid())
  name         String
  description  String @db.Text
  contactEmail String
  website      String?
  logoUrl      String?
  
  // Location
  location String?
  city     String?
  state    String?
  
  createdAt     DateTime               @default(now())
  updatedAt     DateTime               @updatedAt
  opportunities VolunteerOpportunity[]

  @@map("organizations")
}

model VolunteerOpportunity {
  id              String            @id @default(cuid())
  organizationId  String
  
  title           String
  description     String            @db.Text
  category        OpportunityCategory
  
  // Location (NO BOOLEAN - use enum)
  locationType    LocationType      @default(IN_PERSON)  // IN_PERSON, REMOTE, HYBRID
  location        String?
  city            String?
  state           String?
  address         String?
  
  // Details
  commitmentType  CommitmentType
  estimatedHours  Int?
  requiredSkills  String[]
  volunteersNeeded Int             @default(1)
  
  // Timing
  startDate       DateTime?
  endDate         DateTime?
  status          OpportunityStatus @default(OPEN)
  
  // Categorization
  causes          ServiceCause[]    @default([])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  organization    Organization      @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  applications    VolunteerApplication[]

  @@index([status])
  @@index([locationType])
  @@index([organizationId])
  @@map("volunteer_opportunities")
}

model VolunteerApplication {
  id             String            @id @default(cuid())
  f3himId        String            // FK (renamed from volunteerId)
  opportunityId  String
  
  status         ApplicationStatus @default(PENDING)
  message        String?           @db.Text
  
  // Hours tracking
  hoursCompleted Int?
  completedAt    DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  volunteer    F3HIM                @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  opportunity  VolunteerOpportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)

  @@unique([f3himId, opportunityId])
  @@index([f3himId])
  @@index([opportunityId])
  @@map("volunteer_applications")
}

// ============================================================================
// OPTIONAL EXTERNAL RESUME
// ============================================================================

model VolunteerSpecialties {
  f3himId String @id
  
  // For external opportunity matching only (NO BOOLEANS)
  skills              String[]       @default([])  // "Mentoring", "Construction"
  availability        String         @db.Text      // "Weekends, Tuesday evenings, open to remote"
  commitmentPreference CommitmentType @default(ONE_TIME)
  
  // Credentials
  backgroundCheckDate DateTime?
  certifications      String[] @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  
  @@map("volunteer_specialties")
}

// ============================================================================
// ENUMS
// ============================================================================

enum ServiceCause {
  VETERANS
  YOUTH_KIDS
  FAMILIES_OF_FALLEN
  HOMELESS_HOUSING
  ENVIRONMENT
  DISASTER_RELIEF
  FAITH_BASED
  EDUCATION
  HEALTH_WELLNESS
  COMMUNITY_GENERAL
}

enum CommitmentType {
  ONE_TIME
  RECURRING
  PROJECT_BASED
  ASYNC
}

enum OpportunityCategory {
  MENTORSHIP
  LABOR
  EVENTS
  ADMIN
  BOARD
  TECHNICAL
}

enum ApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}

enum OpportunityStatus {
  OPEN
  CLOSED
}

enum LocationType {
  IN_PERSON
  REMOTE
  HYBRID
}

enum AOMemberRole {
  MEMBER  // Regular PAX
  Q       // Workout leader
  SITE_Q  // AO leader
}
```

---

## How AOs and Projects Relate

### PAX Can:
1. **Be a member of multiple AOs** (AOCentral junction)
   - Charlotte AO (home AO, SITE_Q role)
   - Raleigh AO (visiting, MEMBER role)
   - DC AO (traveling, MEMBER role)

2. **Join any F3Project** (ProjectCentral junction)
   - "Park cleanup" organized by Charlotte AO
   - "Food bank volunteer" organized by random PAX
   - "TMF 9/11 run support" organized by Raleigh AO

3. **No prerequisite:** Don't need AO membership to join projects!

---

## F3Project with Optional AO

```prisma
model F3Project {
  id      String  @id @default(cuid())
  f3himId String  // Who organized it
  aoId    String? // OPTIONAL: which AO organized it
  
  // If aoId present: "Charlotte AO's monthly food bank day"
  // If aoId null: "John organized park cleanup"
}
```

**Use case for aoId:**
- AO leaders can organize official AO service projects
- But individual PAX can also organize projects (aoId = null)
- Browse: "Show me all projects by Charlotte AO" or "Show me all projects"

---

## No Collisions - They're Separate

| Concept | Junction Table | Purpose |
|---------|----------------|---------|
| **AO Membership** | AOCentral | Which AOs am I part of? (home base, affiliation) |
| **Project Participation** | ProjectCentral | Which service projects have I joined? (ad-hoc) |

**Example PAX:**
- Member of Charlotte AO (via AOCentral)
- Joined "Park cleanup" project organized by Charlotte AO (via ProjectCentral)
- Joined "Food bank" project organized by random PAX (via ProjectCentral)
- Joined "TMF mentor" project organized by DC AO (via ProjectCentral)

**No conflict!** AO membership is general affiliation. Project participation is specific events.

---

## Migration Steps

### Step 1: Add to F3HIM
```prisma
model F3HIM {
  // ... existing fields
  
  // Add:
  bio         String? @db.Text
  city        String?
  state       String?
  phoneNumber String?
  instagram   String?
  myCauses    ServiceCause[] @default([])
}
```

### Step 2: Create AO + AOCentral
```prisma
model AO {
  id          String @id @default(cuid())
  name        String
  city        String?
  state       String?
  region      String?
  description String? @db.Text
  
  members            AOCentral[]
  attendanceRecords  AttendanceRecord[]
  organizedProjects  F3Project[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("aos")
}

model AOCentral {
  id      String       @id @default(cuid())
  f3himId String
  aoId    String
  role    AOMemberRole @default(MEMBER)
  
  joinedAt  DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  ao    AO    @relation(fields: [aoId], references: [id], onDelete: Cascade)

  @@unique([f3himId, aoId])
  @@map("ao_central")
}

enum AOMemberRole {
  MEMBER
  Q
  SITE_Q
}
```

### Step 3: Update F3Project (Kill Boolean, Fix FK)
```prisma
model F3Project {
  id      String  @id @default(cuid())
  f3himId String  // Renamed from createdById
  aoId    String? // Optional AO affiliation
  
  // ... existing fields
  
  endTime        DateTime  // NEW - no more isCompleted boolean
  causes         ServiceCause[] @default([])  // NEW
  
  // Updated relation names
  organizer    F3HIM          @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  ao           AO?            @relation(fields: [aoId], references: [id], onDelete: SetNull)
  participants ProjectCentral[]
}

// Remove:
// - isCompleted Boolean
```

### Step 4: Rename Junction Table
```prisma
// OLD: F3ProjectMembership
// NEW: ProjectCentral

model ProjectCentral {
  id          String @id @default(cuid())
  f3ProjectId String
  f3himId     String
  hoursLogged Int      @default(0)
  
  joinedAt  DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  project F3Project @relation(fields: [f3ProjectId], references: [id], onDelete: Cascade)
  f3him   F3HIM     @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  @@unique([f3ProjectId, f3himId])
  @@map("project_central")
}
```

### Step 5: Kill Booleans in VolunteerOpportunity
```prisma
model VolunteerOpportunity {
  // ... existing fields
  
  // Replace isRemote boolean with enum
  locationType LocationType @default(IN_PERSON)  // IN_PERSON, REMOTE, HYBRID
  
  // Add causes
  causes ServiceCause[] @default([])
}

enum LocationType {
  IN_PERSON
  REMOTE
  HYBRID
}

// Remove:
// - isRemote Boolean
```

### Step 6: Rename & Clean VolunteerProfile
```prisma
// OLD: VolunteerProfile
// NEW: VolunteerSpecialties

model VolunteerSpecialties {
  f3himId String @id
  
  skills              String[]       @default([])
  availability        String         @db.Text  // Now includes remote preference as text
  commitmentPreference CommitmentType @default(ONE_TIME)
  backgroundCheckDate DateTime?
  certifications      String[]       @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  
  @@map("volunteer_specialties")
}

// Remove:
// - interests String[] (use myCauses on F3HIM instead)
// - remotePreference Boolean (add to availability text instead)
```

### Step 7: Fix VolunteerApplication FK Name
```prisma
model VolunteerApplication {
  id            String @id @default(cuid())
  f3himId       String  // Renamed from volunteerId
  opportunityId String
  
  // Add hours tracking
  hoursCompleted Int?
  completedAt    DateTime?
  
  // Updated relation name
  volunteer F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
}
```

---

## The Two Systems Side-by-Side

### F3Project (Group, Ad-Hoc)
```
PAX → Create project
    ↓
Other PAX → Join via ProjectCentral
    ↓
Everyone logs hours
    ↓
Project completes (NOW > endTime)
```

**No prerequisites:**
- Don't need AO membership
- Don't need VolunteerSpecialties
- Just join and go

**Optional AO affiliation:**
- Project can be tied to an AO (aoId)
- But also can be organized by individual PAX (aoId = null)

---

### VolunteerOpportunity (Individual, External)
```
External Org → Posts opportunity
    ↓
PAX → Applies via VolunteerApplication
    ↓
Org → Approves/rejects
    ↓
PAX → Completes work, logs hours
```

**Optional VolunteerSpecialties:**
- If PAX has skills/certs filled out, helps org see qualifications
- But not required to apply

---

## Profile Display Logic

### PAX Profile Page
```typescript
// Fetch for profile display
const pax = await prisma.f3HIM.findUnique({
  where: { id },
  include: {
    aoMemberships: {
      include: { ao: true }
    },
    organizedProjects: true,
    projectParticipation: {
      include: { project: true }
    },
    volunteerApplications: {
      include: { opportunity: { include: { organization: true } } }
    },
    volunteerSpecialties: true,
  }
});

// Calculate stats
const totalHours = 
  pax.projectParticipation.reduce((sum, p) => sum + p.hoursLogged, 0) +
  pax.volunteerApplications.reduce((sum, app) => sum + (app.hoursCompleted || 0), 0);

const projectsOrganized = pax.organizedProjects.length;
const projectsJoined = pax.projectParticipation.length;
const externalPartnerships = pax.volunteerApplications.filter(a => a.status === 'APPROVED').length;
```

### Display:
```
[Profile Card]

John "Fastlane" Smith
📍 Charlotte, NC
📞 (704) 555-1234
📷 @fastlane_charlotte

Home AOs:
- Charlotte Metro (SITE_Q)
- Raleigh South (MEMBER)

Bio:
"10 years Army infantry. Passionate about helping vets transition 
and working with youth. Let's make an impact."

Causes I Care About:
[VETERANS] [YOUTH_KIDS] [COMMUNITY_GENERAL]

Service Stats:
├─ 47 total hours
├─ 3 group projects joined
├─ 1 project organized
└─ 2 external partnerships

Recent Activity:
├─ Park Cleanup @ Freedom Park (3 hrs, complete) - F3Project
├─ TMF 9/11 Run Support (4 hrs, complete) - F3Project
└─ TMF Character Does Matter Mentor (ongoing) - External
```

---

## Final Questions

### 1. Project Creator Auto-Join?
When PAX creates F3Project, should we auto-create a ProjectCentral entry?

**Option A:** Yes - creator automatically participates (makes sense)
**Option B:** No - creator must explicitly join

**Recommendation:** **A** - auto-create on project creation, saves a step.

---

### 2. AttendanceRecord.aoId
Should this be an FK to AO table now?

```prisma
model AttendanceRecord {
  aoId String
  ao   AO     @relation(fields: [aoId], references: [id])  // NEW FK
}
```

**Recommendation:** Yes - proper FK for data integrity.

---

### 3. Interests Removed from VolunteerSpecialties
I removed `interests` (was redundant with `myCauses` on F3HIM). Agree?

**Rationale:** 
- `myCauses` on F3HIM = causes I care about (VETERANS, YOUTH)
- No need for separate `interests` array
- External orgs can see `myCauses` when reviewing applications

---

### 4. Remote Handling
**VolunteerOpportunity:**
- Replaced `isRemote` boolean with `locationType` enum (IN_PERSON, REMOTE, HYBRID)

**VolunteerSpecialties:**
- Removed `remotePreference` boolean
- PAX can write "open to remote" in `availability` text field

**Good?** Or need different approach?

---

## What You Get

### 🎯 Clean Architecture
- ✅ No booleans (use date/enum logic)
- ✅ All FKs proper IDs (f3himId, aoId, organizationId)
- ✅ Consistent naming (ProjectCentral, AOCentral)
- ✅ Many-to-many junctions (no prerequisite memberships)

### 🎯 Unified Profile
- ✅ F3HIM enriched (bio, location, causes, etc.)
- ✅ Total service hours across both systems
- ✅ Optional VolunteerSpecialties for external matching

### 🎯 Flexible Participation
- ✅ PAX can join AOs (optional)
- ✅ PAX can create/join F3Projects (ad-hoc, no AO required)
- ✅ PAX can apply to external opportunities (individual)
- ✅ AO can organize projects (aoId on F3Project)

### 🎯 No Barriers
- ✅ Don't need AO membership to join projects
- ✅ Don't need VolunteerSpecialties to join projects
- ✅ Just jump in and serve

---

Ready to generate the Prisma migration? Confirm the decisions above and I'll create the migration file!
