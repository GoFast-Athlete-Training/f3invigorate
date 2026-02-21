# F3 Service - Clean Junction Tables

**Rule:** Use ROLE on junction tables instead of separate relations. Avoid junction table hell.

---

## F3HIM Relations (DOWN TO 4!)

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
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations (JUST 4 TOTAL!)
  profile              F3Profile?            // 1 - Optional extended info
  activityLog          F3ActivityLog[]       // 2 - F3 workouts
  aoMemberships        AOCentral[]           // 3 - AO membership (with role)
  projectCommitments   ProjectCentral[]      // 4 - Group events (with role: ORGANIZER or PARTICIPANT)
  volunteerCommitments VolunteerCommitment[] // 5 - Individual opportunities (just FK, no status)

  @@map("f3_hims")
}
```

Wait that's 5. Let me think...

Actually, can we consolidate projectCommitments and volunteerCommitments into ONE junction table?

---

## Option A: Two Junction Tables (Separate Concepts)

### ProjectCentral (Group Events)
```prisma
model ProjectCentral {
  id          String      @id @default(cuid())
  f3ProjectId String
  f3himId     String
  role        ProjectRole @default(PARTICIPANT)
  hoursLogged Int         @default(0)
  joinedAt    DateTime    @default(now())
  
  project F3Project @relation(fields: [f3ProjectId], references: [id], onDelete: Cascade)
  f3him   F3HIM     @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  @@unique([f3ProjectId, f3himId])
}

enum ProjectRole {
  ORGANIZER    // Created the project
  PARTICIPANT  // Joined the project
}
```

**Query:**
- Projects I organized: `WHERE role = ORGANIZER`
- Projects I joined: `WHERE role = PARTICIPANT`

---

### VolunteerCommitment (Individual Opportunities)
```prisma
model VolunteerCommitment {
  id            String @id @default(cuid())
  f3himId       String
  opportunityId String  // FK to VolunteerOpportunity
  
  hoursLogged Int      @default(0)
  note        String?  @db.Text
  startedAt   DateTime @default(now())
  completedAt DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  volunteer   F3HIM                @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  opportunity VolunteerOpportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)

  @@unique([f3himId, opportunityId])
  @@map("volunteer_commitments")
}
```

**No status field!** Just clicked "I'm doing this", log hours, done.

---

## Option B: ONE Junction Table (Everything)

**Crazy idea:** Could ProjectCentral handle BOTH?

```prisma
model ProjectCentral {
  id          String       @id @default(cuid())
  f3himId     String
  
  // Links to EITHER F3Project OR VolunteerOpportunity (one is null)
  f3ProjectId   String?
  opportunityId String?
  
  role        ProjectRole  @default(PARTICIPANT)
  hoursLogged Int          @default(0)
  
  f3Project   F3Project?           @relation(fields: [f3ProjectId], references: [id])
  opportunity VolunteerOpportunity? @relation(fields: [opportunityId], references: [id])
  f3him       F3HIM                 @relation(fields: [f3himId], references: [id])
  
  // Constraint: exactly one must be set
}
```

**Pros:** ONE junction table for all service  
**Cons:** Weird nullable FK (one or the other)

---

## Recommendation: Keep Separate (Option A)

**They're different concepts:**
- **F3Project** = Group events PAX organize/join
- **VolunteerOpportunity** = External opportunity data (populated by various sources)

**Different cardinality:**
- F3Project: One PAX organizes, many join (role distinguishes)
- VolunteerOpportunity: No organizer, just commitments

---

## Final Clean Schema

```prisma
// ============================================================================
// CORE
// ============================================================================

model F3HIM {
  id         String @id @default(cuid())
  firebaseId String @unique
  email      String?
  firstName  String?
  lastName   String?
  f3Handle   String? @unique
  photoURL   String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  // Relations (5 total - clean!)
  profile              F3Profile?            // 1
  activityLog          F3ActivityLog[]       // 2
  aoMemberships        AOCentral[]           // 3
  projectCommitments   ProjectCentral[]      // 4 (group events - with role)
  volunteerCommitments VolunteerCommitment[] // 5 (individual opportunities)
  
  @@map("f3_hims")
}

model F3Profile {
  f3himId         String @id
  bio             String? @db.Text
  phoneNumber     String?
  city            String?
  state           String?
  myCauses        ServiceCause[] @default([])
  volunteerSkills String? @db.Text  // Single text field
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  
  @@map("f3_profiles")
}

// ============================================================================
// AO
// ============================================================================

model AO {
  id     String @id @default(cuid())
  name   String
  city   String?
  state  String?
  region String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  members      AOCentral[]
  activityLogs F3ActivityLog[]
  projects     F3Project[]
  
  @@map("aos")
}

model AOCentral {
  id      String       @id @default(cuid())
  f3himId String
  aoId    String
  role    AOMemberRole @default(MEMBER)
  joinedAt  DateTime   @default(now())
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
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

// ============================================================================
// F3 WORKOUTS
// ============================================================================

model F3ActivityLog {
  id      String           @id @default(cuid())
  f3himId String
  aoId    String?
  date    DateTime
  calories    Int?
  durationSec Int?
  source      AttendanceSource
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  ao    AO?    @relation(fields: [aoId], references: [id], onDelete: SetNull)

  @@index([f3himId, date])
  @@map("f3_activity_log")
}

enum AttendanceSource {
  BACKBLAST
  SELF
}

// ============================================================================
// F3 SERVICE - GROUP EVENTS
// ============================================================================

model F3Project {
  id      String  @id @default(cuid())
  aoId    String? // Optional AO
  
  title       String
  slug        String? @unique
  description String  @db.Text
  
  startTime      DateTime
  endTime        DateTime
  estimatedHours Int?
  
  city       String?
  state      String?
  address    String?
  partnerOrg String?  // TEXT: "Travis Manion Foundation"
  causes     ServiceCause[] @default([])
  
  ao           AO?            @relation(fields: [aoId], references: [id], onDelete: SetNull)
  participants ProjectCentral[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([startTime])
  @@index([endTime])
  @@map("f3_projects")
}

model ProjectCentral {
  id          String      @id @default(cuid())
  f3ProjectId String
  f3himId     String
  role        ProjectRole @default(PARTICIPANT)  // ORGANIZER or PARTICIPANT
  hoursLogged Int         @default(0)
  joinedAt    DateTime    @default(now())
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  project F3Project @relation(fields: [f3ProjectId], references: [id], onDelete: Cascade)
  f3him   F3HIM     @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  @@unique([f3ProjectId, f3himId])
  @@map("project_central")
}

enum ProjectRole {
  ORGANIZER
  PARTICIPANT
}

// ============================================================================
// F3 SERVICE - INDIVIDUAL OPPORTUNITIES (DATA)
// ============================================================================

model Organization {
  id           String @id @default(cuid())
  name         String
  description  String @db.Text
  contactEmail String?
  website      String?
  logoUrl      String?
  city         String?
  state        String?
  
  createdAt     DateTime               @default(now())
  updatedAt     DateTime               @updatedAt
  opportunities VolunteerOpportunity[]

  @@map("organizations")
}

model VolunteerOpportunity {
  id             String @id @default(cuid())
  organizationId String
  
  title       String
  description String @db.Text
  
  skillsNeeded    String? @db.Text
  hoursCommitment Int?
  
  locationType LocationType @default(IN_PERSON)
  city         String?
  state        String?
  address      String?
  
  startDate DateTime?
  endDate   DateTime?
  status    OpportunityStatus @default(OPEN)  // OPEN or CLOSED (admin closes it)
  
  commitmentType CommitmentType
  causes         ServiceCause[] @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  organization Organization          @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  commitments  VolunteerCommitment[] // FK - who's committed to this

  @@index([status])
  @@map("volunteer_opportunities")
}

model VolunteerCommitment {
  id            String @id @default(cuid())
  f3himId       String  // FK to F3HIM
  opportunityId String  // FK to VolunteerOpportunity
  
  hoursLogged Int      @default(0)
  note        String?  @db.Text
  startedAt   DateTime @default(now())
  completedAt DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  volunteer   F3HIM                @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  opportunity VolunteerOpportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)

  @@unique([f3himId, opportunityId])
  @@map("volunteer_commitments")
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

enum OpportunityStatus {
  OPEN
  CLOSED
}

enum LocationType {
  IN_PERSON
  REMOTE
  HYBRID
}

enum ProjectRole {
  ORGANIZER
  PARTICIPANT
}

enum AOMemberRole {
  MEMBER
  Q
  SITE_Q
}

enum AttendanceSource {
  BACKBLAST
  SELF
}
```

---

## Queries with Role

### Find projects I organized:
```typescript
const organized = await prisma.projectCentral.findMany({
  where: {
    f3himId: userId,
    role: 'ORGANIZER'
  },
  include: { project: true }
});
```

### Find projects I joined:
```typescript
const joined = await prisma.projectCentral.findMany({
  where: {
    f3himId: userId,
    role: 'PARTICIPANT'
  },
  include: { project: true }
});
```

### All my service:
```typescript
const all = await prisma.projectCentral.findMany({
  where: { f3himId: userId },
  include: { project: true }
});
```

---

## F3HIM Relations Summary

```prisma
model F3HIM {
  profile              F3Profile?            // 1 - Bio/location/causes (optional)
  activityLog          F3ActivityLog[]       // 2 - F3 workouts
  aoMemberships        AOCentral[]           // 3 - AO membership (with role)
  projectCommitments   ProjectCentral[]      // 4 - Group events (with role)
  volunteerCommitments VolunteerCommitment[] // 5 - Individual opportunities (FK only)
}
```

**5 relations total.** Down from 9+!

---

## What Gets Removed From F3Project

```diff
model F3Project {
  id      String  @id @default(cuid())
- f3himId String  // NO! This creates separate "organizedProjects" relation
  aoId    String?
  
  // ... fields
  
- organizer  F3HIM @relation(fields: [f3himId], references: [id])  // REMOVE
  participants ProjectCentral[]  // Keep - has role
}
```

**Organizer is determined by:** `ProjectCentral WHERE role = ORGANIZER`

---

## VolunteerCommitment Confirmed

Yes, it's just:
- FK to F3HIM
- FK to VolunteerOpportunity  
- hoursLogged (self-report, honor system)
- No status, no approval!

```prisma
model VolunteerCommitment {
  f3himId       String  // FK
  opportunityId String  // FK
  hoursLogged   Int
  
  // That's it!
}
```

---

## Final Count

**F3HIM has 5 relations:**
1. F3Profile (optional)
2. F3ActivityLog (workouts)
3. AOCentral (AO membership with role)
4. ProjectCentral (group service with role)
5. VolunteerCommitment (individual opportunities, just FK)

**Clean!**

Ready to update schema.prisma?
