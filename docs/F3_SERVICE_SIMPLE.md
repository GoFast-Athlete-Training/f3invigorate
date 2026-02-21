# F3 Service - Simple Architecture

**Core Principle:** Track F3 service hours. Honor system. Not a volunteer management platform.

---

## What You Actually Want

### Scenario 1: Group Service Event
```
PAX posts: "Park cleanup Saturday 9am at Freedom Park"
  ↓
Other PAX click "Join"
  ↓
Everyone shows up, logs hours
  ↓
Done.
```

### Scenario 2: Individual Partner Work
```
PAX volunteers at TMF
  ↓
PAX self-reports: "I did 4 hours mentoring for Travis Manion Foundation"
  ↓
Gets credit in platform
  ↓
Done.
```

**NO APPROVAL. NO VETTING. NO APPLICATION WORKFLOW.**

All credentialing/vetting happens OFF-platform with the actual org.

---

## Kill The Bloat

### Delete These Tables:
- ❌ Organization (don't manage external orgs)
- ❌ VolunteerOpportunity (no formal opportunity posting)
- ❌ VolunteerApplication (no approval workflow!)
- ❌ VolunteerSpecialties (no skills resume)
- ❌ VolunteerProfile (no matching system)
- ❌ AttendanceRecord (consolidate)
- ❌ EffortRecord (consolidate)
- ❌ WeeklyReflection (deprecated)
- ❌ SelfReportEntry (deprecated)

---

## Simple Schema

```prisma
// ============================================================================
// CORE IDENTITY
// ============================================================================

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
  
  // System
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations (JUST 5!)
  profile              F3Profile?            // Optional bio/location/causes
  activityLog          F3ActivityLog[]       // F3 workout tracking
  aoMemberships        AOCentral[]           // AO membership
  organizedProjects    F3Project[]           // Group service organized
  projectParticipation ProjectCentral[]      // Group service joined + individual service

  @@map("f3_hims")
}

// ============================================================================
// OPTIONAL PROFILE
// ============================================================================

model F3Profile {
  f3himId String @id
  
  bio         String? @db.Text
  phoneNumber String?
  city        String?
  state       String?
  myCauses    ServiceCause[] @default([])
  
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
  
  members           AOCentral[]
  activityLogs      F3ActivityLog[]
  organizedProjects F3Project[]
  
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

// ============================================================================
// F3 WORKOUT TRACKING
// ============================================================================

model F3ActivityLog {
  id      String @id @default(cuid())
  f3himId String
  aoId    String?
  date    DateTime
  
  calories    Int?
  durationSec Int?
  
  source AttendanceSource @default(SELF)
  
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
// F3 SERVICE ENGINE
// ============================================================================

model F3Project {
  id      String  @id @default(cuid())
  f3himId String  // Who organized/posted it
  aoId    String? // Optional AO affiliation
  
  title       String
  slug        String? @unique
  description String  @db.Text
  
  // Timing
  startTime      DateTime
  endTime        DateTime
  estimatedHours Int?
  
  // Location
  city    String?
  state   String?
  address String?
  
  // Optional partner org (TEXT - not FK!)
  partnerOrg String?  // "Travis Manion Foundation", "Local Food Bank"
  
  // Categorization
  causes ServiceCause[] @default([])
  
  organizer    F3HIM          @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  ao           AO?            @relation(fields: [aoId], references: [id], onDelete: SetNull)
  participants ProjectCentral[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([startTime])
  @@index([endTime])
  @@map("f3_projects")
}

model ProjectCentral {
  id          String @id @default(cuid())
  f3ProjectId String
  f3himId     String
  
  // Type of participation
  participationType ParticipationType @default(GROUP_EVENT)
  
  // Hours
  hoursLogged Int      @default(0)
  
  // Timing
  joinedAt  DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  project F3Project @relation(fields: [f3ProjectId], references: [id], onDelete: Cascade)
  f3him   F3HIM     @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  @@unique([f3ProjectId, f3himId])
  @@map("project_central")
}

enum ParticipationType {
  GROUP_EVENT      // Joined group service event
  INDIVIDUAL_LOG   // Self-reported individual work (honor system)
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
```

---

## How It Works (SIMPLE)

### Group Event (F3Project)
```
1. PAX creates F3Project: "Park cleanup Saturday 9am"
   - title: "Park Cleanup"
   - partnerOrg: null (or "City Parks Dept")
   - startTime/endTime
   
2. Other PAX join (creates ProjectCentral entry)
   - participationType: GROUP_EVENT
   - hoursLogged: 0 (to be updated)
   
3. After event, everyone logs their hours
   - Update ProjectCentral.hoursLogged

4. Done. No approval needed.
```

### Individual Partner Work (Self-Report)
```
1. PAX creates F3Project: "TMF Character Does Matter Mentoring"
   - title: "TMF Mentoring" 
   - partnerOrg: "Travis Manion Foundation"
   - startTime/endTime (ongoing? recurring?)
   - OR just make it a date range
   
2. PAX creates their own ProjectCentral entry
   - participationType: INDIVIDUAL_LOG
   - hoursLogged: 4
   
3. Honor system. Done.
```

**OR even simpler:**

### Self-Report As Direct Log (No F3Project)
```
PAX clicks "Log Individual Service Hours"
  ↓
Form: 
  - Partner org name (text)
  - Hours (number)
  - Date
  - Cause (enum)
  - Note
  ↓
Creates ServiceCommitment entry (separate from F3Project)
```

---

## Two Possible Simple Models

### Model 1: Everything Through F3Project
```prisma
F3HIM
  ↓
ProjectCentral (junction)
  ↓
F3Project

// Group events AND individual logs both use F3Project
// participationType distinguishes them
```

**Pros:** One system  
**Cons:** F3Project represents both "events" and "self-reports" (weird)

---

### Model 2: Split Group vs Individual
```prisma
// Group events
F3HIM → ProjectCentral → F3Project

// Individual self-reports
F3HIM → ServiceCommitment (direct, no junction)
```

```prisma
model ServiceCommitment {
  id      String @id @default(cuid())
  f3himId String
  
  // What they did
  partnerOrg  String?           // "Travis Manion Foundation"
  description String  @db.Text  // What they did
  hoursLogged Int
  date        DateTime
  
  // Categorization
  causes ServiceCause[] @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  @@index([f3himId, date])
  @@map("service_commitments")
}
```

**Pros:** Clear separation - events vs self-reports  
**Cons:** Two tables instead of one

---

## My Recommendation: Model 2 (Split)

### F3HIM Relations (JUST 6)
```prisma
model F3HIM {
  profile              F3Profile?           // 1 - bio/location/causes (optional)
  activityLog          F3ActivityLog[]      // 2 - F3 workouts
  aoMemberships        AOCentral[]          // 3 - AO membership
  organizedProjects    F3Project[]          // 4 - Group events organized
  projectParticipation ProjectCentral[]     // 5 - Group events joined
  serviceCommitments   ServiceCommitment[]  // 6 - Individual self-reports
}
```

### Use Cases

**Group Service Event:**
- PAX creates F3Project
- Others join via ProjectCentral
- Everyone logs hours
- Optional `partnerOrg` text field

**Individual Work:**
- PAX logs ServiceCommitment directly
- Just self-report: org name, hours, date, cause
- No approval, no application

**Total service hours:**
```typescript
const totalHours = 
  SUM(ProjectCentral.hoursLogged) +  // Group events
  SUM(ServiceCommitment.hoursLogged) // Individual work
```

---

## Kill All This Crap

**DELETE:**
- ❌ Organization table (no external org management)
- ❌ VolunteerOpportunity table (no formal opportunities)
- ❌ VolunteerApplication table (NO APPROVAL WORKFLOW!)
- ❌ VolunteerSpecialties table (no skills resume)
- ❌ ApplicationStatus enum (PENDING/APPROVED/REJECTED - nuts!)
- ❌ OpportunityStatus enum
- ❌ OpportunityCategory enum
- ❌ LocationType enum

**KEEP:**
- ✅ F3HIM (minimal)
- ✅ F3Profile (optional - bio, city, causes)
- ✅ AO + AOCentral
- ✅ F3Project + ProjectCentral (group events)
- ✅ ServiceCommitment (individual self-reports)
- ✅ ServiceCause enum
- ✅ CommitmentType enum (ONE_TIME, RECURRING, etc.)

---

## Clean Final Schema

```prisma
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
  
  profile              F3Profile?
  activityLog          F3ActivityLog[]
  aoMemberships        AOCentral[]
  organizedProjects    F3Project[]
  projectParticipation ProjectCentral[]
  serviceCommitments   ServiceCommitment[]
}

model F3Profile {
  f3himId     String @id
  bio         String? @db.Text
  phoneNumber String?
  city        String?
  state       String?
  myCauses    ServiceCause[] @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
}

model AO {
  id     String @id @default(cuid())
  name   String
  city   String?
  state  String?
  region String?
  
  members           AOCentral[]
  activityLogs      F3ActivityLog[]
  organizedProjects F3Project[]
}

model AOCentral {
  id      String       @id @default(cuid())
  f3himId String
  aoId    String
  role    AOMemberRole @default(MEMBER)
  joinedAt  DateTime   @default(now())
  
  f3him F3HIM @relation(fields: [f3himId], references: [id])
  ao    AO    @relation(fields: [aoId], references: [id])
  
  @@unique([f3himId, aoId])
}

model F3ActivityLog {
  id      String @id @default(cuid())
  f3himId String
  aoId    String?
  date    DateTime
  calories    Int?
  durationSec Int?
  source      AttendanceSource
  
  f3him F3HIM @relation(fields: [f3himId], references: [id])
  ao    AO?    @relation(fields: [aoId], references: [id])
}

model F3Project {
  id      String  @id @default(cuid())
  f3himId String  // Who organized it
  aoId    String? // Optional AO
  
  title       String
  description String @db.Text
  
  startTime      DateTime
  endTime        DateTime
  estimatedHours Int?
  
  city       String?
  state      String?
  address    String?
  partnerOrg String?  // TEXT field: "Travis Manion Foundation"
  causes     ServiceCause[] @default([])
  
  organizer    F3HIM          @relation(fields: [f3himId], references: [id])
  ao           AO?            @relation(fields: [aoId], references: [id])
  participants ProjectCentral[]
}

model ProjectCentral {
  id          String @id @default(cuid())
  f3ProjectId String
  f3himId     String
  hoursLogged Int      @default(0)
  joinedAt    DateTime @default(now())
  
  project F3Project @relation(fields: [f3ProjectId], references: [id])
  f3him   F3HIM     @relation(fields: [f3himId], references: [id])
  
  @@unique([f3ProjectId, f3himId])
}

// Individual self-reports (honor system)
model ServiceCommitment {
  id      String @id @default(cuid())
  f3himId String
  
  partnerOrg  String?           // "Travis Manion Foundation" (text)
  description String  @db.Text  // What they did
  hoursLogged Int
  date        DateTime
  causes      ServiceCause[] @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id])
  
  @@index([f3himId, date])
  @@map("service_commitments")
}

enums ServiceCause, AOMemberRole, AttendanceSource, CommitmentType
```

---

## Total Service Hours (Simple)

```typescript
const totalHours = 
  SUM(ProjectCentral.hoursLogged WHERE f3himId = X) +     // Group events
  SUM(ServiceCommitment.hoursLogged WHERE f3himId = X)    // Individual work
```

Done. Honor system. No approval workflow.

---

## What Gets Killed

All the VolunteerMatch complexity:
- ❌ Organization management
- ❌ Opportunity posting
- ❌ Application workflow (PENDING → APPROVED)
- ❌ Skills resume
- ❌ External vetting

**Partner orgs are just text fields.** If PAX says "I volunteered at TMF" - we believe them. Honor system.

---

Is THIS what you want? Just F3 service tracking, no volunteer management suite?
