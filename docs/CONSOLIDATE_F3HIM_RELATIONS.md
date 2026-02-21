# Consolidate F3HIM Relations - Kill The Monster

**Problem:** F3HIM has 10+ foreign key relationships. Insane.

**Current mess:**
```prisma
model F3HIM {
  // Auth + identity (4 fields) ✅
  // Relations (10+ tables!!) 🚨
  attendanceRecords      AttendanceRecord[]      // 1
  effortRecords          EffortRecord[]          // 2
  weeklyReflections      WeeklyReflection[]      // 3
  selfReportEntries      SelfReportEntry[]       // 4
  aoMemberships          AOCentral[]             // 5
  volunteerSpecialties   VolunteerSpecialties?   // 6
  volunteerApplications  VolunteerApplication[]  // 7
  organizedProjects      F3Project[]             // 8
  projectParticipation   ProjectCentral[]        // 9
}
```

**That's 9 relations!** And 4 of them are just tracking workout/effort stuff.

---

## Consolidation Plan

### Core Identity (Minimal)
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
  
  // System
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations (CONSOLIDATED)
  profile               F3Profile?              // Optional extended profile (bio, city, causes)
  activityLog           F3ActivityLog[]         // ONE table for all F3 tracking
  aoMemberships         AOCentral[]             // AO membership
  organizedProjects     F3Project[]             // Service projects organized
  projectParticipation  ProjectCentral[]        // Service projects joined
  volunteerApplications VolunteerApplication[]  // External opportunities
  volunteerSpecialties  VolunteerSpecialties?   // Optional external resume

  @@map("f3_hims")
}
```

**Reduced from 9 relations to 7** (and could go further).

---

## F3ActivityLog (Consolidate 4 Tables into 1)

**Kill these 4 tables:**
- ❌ AttendanceRecord
- ❌ EffortRecord
- ❌ WeeklyReflection
- ❌ SelfReportEntry

**Replace with ONE table:**

```prisma
model F3ActivityLog {
  id      String           @id @default(cuid())
  f3himId String
  date    DateTime
  
  // What kind of entry
  activityType F3ActivityType
  
  // Workout/Attendance data (if activityType = WORKOUT)
  aoId         String?
  calories     Int?
  durationSec  Int?
  calPerMin    Float?
  
  // Reflection data (if activityType = REFLECTION)
  mood      String?
  wins      String?
  struggles String?
  intention String?
  
  // Self-report data (if activityType = SELF_REPORT)
  category SelfReportCategory?
  note     String?             @db.Text
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  ao    AO?    @relation(fields: [aoId], references: [id], onDelete: SetNull)

  @@index([f3himId, date])
  @@index([activityType])
  @@map("f3_activity_log")
}

enum F3ActivityType {
  WORKOUT       // Attended workout (with effort data)
  REFLECTION    // Weekly reflection
  SELF_REPORT   // Self-report entry (fellowship, service, etc.)
}

enum SelfReportCategory {
  FELLOWSHIP
  SERVICE
  MARRIAGE_FAMILY
  DIET_QUEEN
  MENTAL_HEALTH
  SPIRITUAL
}
```

**Why this works:**
- ONE table for all F3 tracking
- Use `activityType` to determine which fields are populated
- Query: "Show me workouts" → `WHERE activityType = WORKOUT`
- Query: "Show me reflections" → `WHERE activityType = REFLECTION`

---

## Or... Simpler: Just Kill The Old Stuff?

**Question:** Are you even using these?
- WeeklyReflection (deprecated UX in schema comment!)
- SelfReportEntry (deprecated UX in schema comment!)

**If they're deprecated, just DROP them:**

```prisma
model F3HIM {
  // Relations
  activityLog           F3ActivityLog[]         // Just attendance + effort
  aoMemberships         AOCentral[]
  organizedProjects     F3Project[]
  projectParticipation  ProjectCentral[]
  volunteerApplications VolunteerApplication[]
}
```

**Down to 5 relations!**

---

## F3ActivityLog (Simple Version - No Deprecated Stuff)

```prisma
model F3ActivityLog {
  id      String   @id @default(cuid())
  f3himId String
  aoId    String?
  date    DateTime
  
  // Effort metrics
  calories    Int?
  durationSec Int?
  calPerMin   Float?
  
  // Source
  source AttendanceSource @default(SELF)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  ao    AO?    @relation(fields: [aoId], references: [id], onDelete: SetNull)

  @@index([f3himId, date])
  @@index([aoId])
  @@map("f3_activity_log")
}

enum AttendanceSource {
  BACKBLAST  // Posted by Q
  SELF       // Self-reported
}
```

**ONE table replaces AttendanceRecord + EffortRecord.**

---

## Volunteer Side - Also Too Many Relations

**Current volunteer relations on F3HIM:**
```prisma
volunteerSpecialties   VolunteerSpecialties?   // 1
volunteerApplications  VolunteerApplication[]  // 2
organizedProjects      F3Project[]             // 3
projectParticipation   ProjectCentral[]        // 4
```

**Can we consolidate?**

### Option 1: Keep All 4 (Current)
- They serve different purposes
- Hard to consolidate further without losing functionality

### Option 2: Merge volunteerSpecialties into F3Profile
```prisma
model F3Profile {
  f3himId String @id
  
  // Personal
  bio         String? @db.Text
  phoneNumber String?
  city        String?
  state       String?
  
  // Service
  myCauses ServiceCause[] @default([])
  
  // External matching (from VolunteerSpecialties)
  skills              String[] @default([])
  availability        String?  @db.Text
  commitmentPreference CommitmentType?
  backgroundCheckDate DateTime?
  certifications      String[] @default([])
}
```

**Kills one relation!** Now:
```prisma
model F3HIM {
  profile               F3Profile?              // Extended profile + external resume
  volunteerApplications VolunteerApplication[]  // External opportunities
  organizedProjects     F3Project[]             // Service projects organized
  projectParticipation  ProjectCentral[]        // Service projects joined
}
```

---

## Final Minimal Schema

```prisma
// ============================================================================
// CORE IDENTITY (MINIMAL)
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

  // Relations (MINIMAL - 6 total)
  profile               F3Profile?              // Extended profile (bio, location, causes, skills)
  activityLog           F3ActivityLog[]         // F3 workout tracking (consolidated)
  aoMemberships         AOCentral[]             // AO membership
  organizedProjects     F3Project[]             // Service projects organized
  projectParticipation  ProjectCentral[]        // Service projects joined
  volunteerApplications VolunteerApplication[]  // External opportunities

  @@map("f3_hims")
}

// ============================================================================
// EXTENDED PROFILE (OPTIONAL - EVERYTHING ELSE)
// ============================================================================

model F3Profile {
  f3himId String @id
  
  // Personal
  bio         String? @db.Text
  phoneNumber String?
  city        String?
  state       String?
  
  // Service
  myCauses ServiceCause[] @default([])
  
  // External opportunity matching (merged from VolunteerSpecialties)
  skills              String[] @default([])
  availability        String?  @db.Text
  commitmentPreference CommitmentType?
  backgroundCheckDate DateTime?
  certifications      String[] @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  
  @@map("f3_profiles")
}

// ============================================================================
// F3 WORKOUT TRACKING (CONSOLIDATED)
// ============================================================================

model F3ActivityLog {
  id      String @id @default(cuid())
  f3himId String
  aoId    String?
  date    DateTime
  
  // Effort metrics
  calories    Int?
  durationSec Int?
  calPerMin   Float?
  
  // Source
  source AttendanceSource @default(SELF)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  ao    AO?    @relation(fields: [aoId], references: [id], onDelete: SetNull)

  @@index([f3himId, date])
  @@index([aoId])
  @@map("f3_activity_log")
}

enum AttendanceSource {
  BACKBLAST
  SELF
}

// ============================================================================
// AO (Area of Operation)
// ============================================================================

model AO {
  id       String @id @default(cuid())
  name     String
  city     String?
  state    String?
  region   String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  members            AOCentral[]
  activityLogs       F3ActivityLog[]
  organizedProjects  F3Project[]
  
  @@index([city, state])
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
  @@index([aoId])
  @@index([f3himId])
  @@map("ao_central")
}

enum AOMemberRole {
  MEMBER
  Q
  SITE_Q
}

// ============================================================================
// F3 SERVICE ENGINE (Group Projects)
// ============================================================================

model F3Project {
  id      String  @id @default(cuid())
  f3himId String  // Who organized it
  aoId    String? // Optional AO affiliation
  
  title       String
  slug        String? @unique
  description String  @db.Text
  
  // Timing (NO BOOLEANS)
  startTime      DateTime
  endTime        DateTime
  estimatedHours Int?
  
  // Location
  location String?
  city     String?
  state    String?
  address  String?
  
  // Categorization
  causes ServiceCause[] @default([])
  
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
  category    OpportunityCategory
  
  // Location (NO BOOLEAN - use enum)
  locationType LocationType      @default(IN_PERSON)
  city         String?
  state        String?
  address      String?
  
  // Details
  commitmentType   CommitmentType
  estimatedHours   Int?
  requiredSkills   String[]
  volunteersNeeded Int             @default(1)
  
  // Timing
  startDate DateTime?
  endDate   DateTime?
  status    OpportunityStatus @default(OPEN)
  
  // Categorization
  causes ServiceCause[] @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  organization Organization           @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  applications VolunteerApplication[]

  @@index([status])
  @@index([locationType])
  @@map("volunteer_opportunities")
}

model VolunteerApplication {
  id            String @id @default(cuid())
  f3himId       String
  opportunityId String
  
  status  ApplicationStatus @default(PENDING)
  message String?           @db.Text
  
  // Hours tracking
  hoursCompleted Int?
  completedAt    DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  volunteer   F3HIM                @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  opportunity VolunteerOpportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)

  @@unique([f3himId, opportunityId])
  @@index([f3himId])
  @@map("volunteer_applications")
}

// ============================================================================
// OPTIONAL PROFILE
// ============================================================================

model F3Profile {
  f3himId String @id
  
  // Personal
  bio         String? @db.Text
  phoneNumber String?
  city        String?
  state       String?
  
  // Service preferences
  myCauses ServiceCause[] @default([])
  
  // External opportunity matching (merged from VolunteerSpecialties)
  skills              String[] @default([])
  availability        String?  @db.Text
  commitmentPreference CommitmentType?
  backgroundCheckDate DateTime?
  certifications      String[] @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  
  @@map("f3_profiles")
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
  MEMBER
  Q
  SITE_Q
}

enum F3ActivityType {
  WORKOUT
  REFLECTION
  SELF_REPORT
}

enum SelfReportCategory {
  FELLOWSHIP
  SERVICE
  MARRIAGE_FAMILY
  DIET_QUEEN
  MENTAL_HEALTH
  SPIRITUAL
}
```

---

## Relations Count

### Before:
```prisma
model F3HIM {
  attendanceRecords      // 1
  effortRecords          // 2
  weeklyReflections      // 3 (deprecated)
  selfReportEntries      // 4 (deprecated)
  aoMemberships          // 5
  volunteerSpecialties   // 6
  volunteerApplications  // 7
  organizedProjects      // 8
  projectParticipation   // 9
}
```
**9 relations**

---

### After (Option A - Consolidate Everything):
```prisma
model F3HIM {
  profile               // 1 - bio, location, causes, skills (merged)
  activityLog           // 2 - workouts + reflections + self-reports (merged)
  aoMemberships         // 3 - AO membership
  organizedProjects     // 4 - service organized
  projectParticipation  // 5 - service joined
  volunteerApplications // 6 - external opportunities
}
```
**6 relations** (-3!)

---

### After (Option B - Drop Deprecated):
```prisma
model F3HIM {
  profile               // 1 - bio, location, causes, skills (merged)
  activityLog           // 2 - workouts only (no reflections/self-reports)
  aoMemberships         // 3 - AO membership
  organizedProjects     // 4 - service organized
  projectParticipation  // 5 - service joined
  volunteerApplications // 6 - external opportunities
}
```
**6 relations** (and simpler F3ActivityLog)

---

## My Recommendation

### F3HIM Core (Minimal)
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
  
  // 6 relations (down from 9+)
  profile               F3Profile?
  activityLog           F3ActivityLog[]
  aoMemberships         AOCentral[]
  organizedProjects     F3Project[]
  projectParticipation  ProjectCentral[]
  volunteerApplications VolunteerApplication[]
}
```

### F3Profile (Everything Optional)
```prisma
model F3Profile {
  f3himId     String @id
  bio         String? @db.Text
  phoneNumber String?
  city        String?
  state       String?
  myCauses    ServiceCause[] @default([])
  
  // External matching (merged from VolunteerSpecialties)
  skills              String[] @default([])
  availability        String?  @db.Text
  commitmentPreference CommitmentType?
  backgroundCheckDate DateTime?
  certifications      String[] @default([])
}
```

### F3ActivityLog (Consolidated)
```prisma
model F3ActivityLog {
  f3himId     String
  aoId        String?
  date        DateTime
  activityType F3ActivityType  // WORKOUT, REFLECTION, SELF_REPORT
  
  // Conditionally populated based on type
  calories    Int?
  durationSec Int?
  // ... etc
}
```

---

## Questions

1. **Drop deprecated tables?** (WeeklyReflection, SelfReportEntry) - schema says "deprecated UX"
2. **Merge VolunteerSpecialties into F3Profile?** Or keep separate?
3. **F3ActivityLog approach?** One table with activityType enum, or just workouts only?

What do you think? Should we go aggressive and drop the deprecated stuff + merge everything?
