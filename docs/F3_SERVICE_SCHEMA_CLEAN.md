# F3 Service Schema - Clean Architecture

**Philosophy:** Ad-hoc participation, no barriers, no prerequisite memberships. Learn from GoFast.

---

## Core Identity: F3HIM

**Enriched with Athlete-style fields + service-specific:**

```prisma
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

  // Personal (NEW - matches Athlete pattern)
  bio         String? @db.Text    // Why I serve, personal story
  city        String?             // Where I'm based
  state       String?             // Geographic location
  phoneNumber String?             // For organizing projects
  instagram   String?             // Social connection
  
  // Service-specific (NEW)
  aoId      String?               // Optional AO affiliation (not required)
  myCauses  ServiceCause[]  @default([])  // Causes I care about
  
  // System
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  attendanceRecords      AttendanceRecord[]
  effortRecords          EffortRecord[]
  weeklyReflections      WeeklyReflection[]
  selfReportEntries      SelfReportEntry[]
  volunteerSpecialties   VolunteerSpecialties?   // Optional external resume
  volunteerApplications  VolunteerApplication[]  // External opportunities
  organizedProjects      F3Project[]             // Projects I created
  projectParticipation   ProjectCentral[]        // Projects I joined (junction)

  @@map("f3_hims")
}
```

---

## Service Causes Enum

```prisma
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

## F3 Service Engine (Group Projects)

### F3Project
**PAX-driven service events**

```prisma
model F3Project {
  id          String   @id @default(cuid())
  f3himId     String   // Who organized it (FK to F3HIM)
  
  title       String
  slug        String?  @unique
  description String   @db.Text
  
  // Timing (NO BOOLEANS - use date logic)
  startTime   DateTime
  endTime     DateTime  // Project end time
  // Service is complete if: NOW > endTime
  
  // Metadata
  estimatedHours Int?    // Expected hours per person
  location       String? // Where (address or description)
  city           String?
  state          String?
  causes         ServiceCause[] @default([])  // What causes this serves
  
  // Relations
  organizer       F3HIM          @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  participants    ProjectCentral[] // Junction table
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([startTime])
  @@index([endTime])
  @@index([f3himId])
  @@map("f3_projects")
}
```

**Logic:**
- `isComplete = NOW > endTime` (calculated, not stored)
- No boolean fields!

---

### ProjectCentral (Junction Table)
**Many-to-many: F3HIM ←→ F3Project**

```prisma
model ProjectCentral {
  id          String    @id @default(cuid())
  f3ProjectId String
  f3himId     String
  
  // Hours tracking
  hoursLogged Int       @default(0)
  
  // Timestamps
  joinedAt    DateTime  @default(now())
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  project     F3Project @relation(fields: [f3ProjectId], references: [id], onDelete: Cascade)
  f3him       F3HIM     @relation("projectParticipation", fields: [f3himId], references: [id], onDelete: Cascade)

  @@unique([f3ProjectId, f3himId])  // Each PAX can only join a project once
  @@index([f3ProjectId])
  @@index([f3himId])
  @@map("project_central")
}
```

**Key points:**
- PAX can join ANY project (no prerequisite)
- Hours tracked per PAX, per project
- Creator automatically gets a ProjectCentral entry? Or not?

---

## External Org System (Individual Partnerships)

### Organization
**External nonprofits**

```prisma
model Organization {
  id           String   @id @default(cuid())
  name         String
  description  String   @db.Text
  contactEmail String
  website      String?
  logoUrl      String?
  location     String?
  city         String?
  state        String?
  
  createdAt     DateTime               @default(now())
  updatedAt     DateTime               @updatedAt
  opportunities VolunteerOpportunity[]

  @@map("organizations")
}
```

---

### VolunteerOpportunity
**Opportunities posted by external orgs**

```prisma
model VolunteerOpportunity {
  id              String            @id @default(cuid())
  organizationId  String
  
  title           String
  description     String            @db.Text
  category        OpportunityCategory
  location        String?
  city            String?
  state           String?
  commitmentType  CommitmentType
  estimatedHours  Int?
  
  // Timing
  startDate       DateTime?
  endDate         DateTime?
  // Opportunity is closed if: NOW > endDate (or status = CLOSED)
  
  isRemote        Boolean           @default(false)  // OK to keep - external orgs need this
  requiredSkills  String[]
  volunteersNeeded Int             @default(1)
  status          OpportunityStatus @default(OPEN)
  causes          ServiceCause[]    @default([])  // NEW - align with F3Project
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  organization    Organization      @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  applications    VolunteerApplication[]

  @@map("volunteer_opportunities")
}
```

---

### VolunteerApplication
**PAX applying to external opportunities**

```prisma
model VolunteerApplication {
  id            String            @id @default(cuid())
  f3himId       String            // FK to F3HIM (renamed from volunteerId)
  opportunityId String
  
  status        ApplicationStatus @default(PENDING)
  message       String?           @db.Text
  
  // Hours tracking (optional - for external work)
  hoursCompleted Int?
  completedAt    DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  volunteer    F3HIM                @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  opportunity  VolunteerOpportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)

  @@unique([f3himId, opportunityId])
  @@map("volunteer_applications")
}
```

---

## VolunteerSpecialties (Renamed from VolunteerProfile)

**Optional "resume" for external org matching only**

```prisma
model VolunteerSpecialties {
  f3himId     String   @id
  
  // For external opportunity matching
  skills              String[] @default([])  // "Mentoring", "Construction", "Event Planning"
  availability        String   @db.Text      // "Weekends, Tuesday evenings"
  commitmentPreference CommitmentType @default(ONE_TIME)
  remoteWilling       Boolean  @default(false)  // OK - external orgs need this
  
  // Optional credentials
  backgroundCheckDate DateTime?  // For youth mentorship, etc.
  certifications      String[]   @default([])  // "CPR", "First Aid"
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  
  @@map("volunteer_specialties")
}
```

**Purpose:** ONLY for matching to external org opportunities. NOT needed for F3Project (just join what you care about).

**Fields removed from original:**
- `interests` → Use `myCauses` on F3HIM instead (redundant)

**Fields kept:**
- `skills` → For external orgs ("Looking for someone with construction experience")
- `availability` → For external scheduling
- `remoteWilling` → Boolean OK here (external orgs need this filter)

---

## Enums

```prisma
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
```

---

## Key Changes Summary

### F3HIM Additions
```diff
model F3HIM {
  // ... existing
+ bio         String? @db.Text
+ city        String?
+ state       String?
+ phoneNumber String?
+ instagram   String?
+ aoId        String?
+ myCauses    ServiceCause[] @default([])
}
```

### Renamed Tables
```diff
- model F3ProjectMembership
+ model ProjectCentral

- model VolunteerProfile
+ model VolunteerSpecialties
```

### Field Name Fixes
```diff
model F3Project {
- createdById String
- createdBy   F3HIM @relation("ProjectCreatedBy", ...)
+ f3himId     String
+ organizer   F3HIM @relation(fields: [f3himId], references: [id], ...)
}

model VolunteerApplication {
- volunteerId String
+ f3himId     String
}

model ProjectCentral {
- (keep f3ProjectId and f3himId)
}
```

### Remove Booleans
```diff
model F3Project {
- isCompleted Boolean @default(false)
  // Calculated: NOW > endTime = complete
}
```

---

## Open Questions

### 1. AO Table?
Do you want an AO model?

```prisma
model AO {
  id       String  @id @default(cuid())
  name     String  // "Charlotte AO", "Raleigh AO"
  city     String?
  state    String?
  region   String? // "F3 Charlotte Region"
  createdAt DateTime @default(now())
  
  f3hims    F3HIM[]     // PAX affiliated with this AO
  projects  F3Project[] // Projects organized by this AO (optional)
}
```

**Or:** Just keep `aoId` as a string on F3HIM (references external system)?

---

### 2. Project Creator Auto-Join?
When PAX creates F3Project, should they automatically get a ProjectCentral entry?

**Option A:** Yes - creator is automatically a participant
**Option B:** No - creator must explicitly join their own project

**Recommendation:** **A** - auto-create ProjectCentral entry for creator.

---

### 3. Hours Tracking Strategy
**F3Project:** Hours tracked via ProjectCentral.hoursLogged ✅

**VolunteerOpportunity:** Should we track hours?
- **Option A:** Add `hoursCompleted` to VolunteerApplication (like I showed)
- **Option B:** Don't track hours for external work (just status)

**Recommendation:** **A** - track hours so PAX can see total impact across both systems.

---

### 4. ServiceCause vs OpportunityCategory
Do we need both?

**ServiceCause:** WHAT cause (VETERANS, YOUTH, ENVIRONMENT) - emotional/mission alignment
**OpportunityCategory:** HOW you help (MENTORSHIP, LABOR, EVENTS) - type of work

**Keep both?** Yes - they're different dimensions. Filter by "I care about VETERANS" + "I want to do LABOR".

---

## Migration Steps

1. **Add fields to F3HIM**
   ```sql
   ALTER TABLE f3_hims ADD COLUMN bio TEXT;
   ALTER TABLE f3_hims ADD COLUMN city VARCHAR(255);
   ALTER TABLE f3_hims ADD COLUMN state VARCHAR(255);
   ALTER TABLE f3_hims ADD COLUMN phone_number VARCHAR(255);
   ALTER TABLE f3_hims ADD COLUMN instagram VARCHAR(255);
   ALTER TABLE f3_hims ADD COLUMN ao_id VARCHAR(255);
   ALTER TABLE f3_hims ADD COLUMN my_causes TEXT[] DEFAULT '{}';
   ```

2. **Rename tables**
   ```sql
   ALTER TABLE f3_project_memberships RENAME TO project_central;
   ALTER TABLE volunteer_profiles RENAME TO volunteer_specialties;
   ```

3. **Update F3Project**
   ```sql
   ALTER TABLE f3_projects ADD COLUMN end_time TIMESTAMP;
   ALTER TABLE f3_projects DROP COLUMN is_completed;
   ALTER TABLE f3_projects RENAME COLUMN created_by_id TO f3him_id;
   ALTER TABLE f3_projects ADD COLUMN causes TEXT[] DEFAULT '{}';
   ```

4. **Update VolunteerApplication**
   ```sql
   ALTER TABLE volunteer_applications RENAME COLUMN volunteer_id TO f3him_id;
   ALTER TABLE volunteer_applications ADD COLUMN hours_completed INT;
   ALTER TABLE volunteer_applications ADD COLUMN completed_at TIMESTAMP;
   ```

5. **Update VolunteerOpportunity**
   ```sql
   ALTER TABLE volunteer_opportunities ADD COLUMN causes TEXT[] DEFAULT '{}';
   ```

6. **Remove interests from VolunteerSpecialties** (redundant with myCauses)
   ```sql
   ALTER TABLE volunteer_specialties DROP COLUMN interests;
   ALTER TABLE volunteer_specialties RENAME COLUMN remote_preference TO remote_willing;
   ```

---

## Final Clean Schema

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
  firstName  String?
  lastName   String?
  f3Handle   String? @unique
  photoURL   String?

  // Personal
  bio         String? @db.Text
  city        String?
  state       String?
  phoneNumber String?
  instagram   String?
  
  // Service
  aoId      String?
  myCauses  ServiceCause[] @default([])
  
  // System
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  attendanceRecords      AttendanceRecord[]
  effortRecords          EffortRecord[]
  weeklyReflections      WeeklyReflection[]
  selfReportEntries      SelfReportEntry[]
  volunteerSpecialties   VolunteerSpecialties?
  volunteerApplications  VolunteerApplication[]
  organizedProjects      F3Project[]
  projectParticipation   ProjectCentral[]

  @@map("f3_hims")
}

// ============================================================================
// F3 SERVICE ENGINE (Group Projects)
// ============================================================================

model F3Project {
  id       String @id @default(cuid())
  f3himId  String  // Who organized it
  
  title       String
  slug        String? @unique
  description String  @db.Text
  
  // Timing (NO booleans!)
  startTime      DateTime
  endTime        DateTime  // Service complete if NOW > endTime
  estimatedHours Int?
  
  // Location
  location String?
  city     String?
  state    String?
  
  // Categorization
  causes ServiceCause[] @default([])
  
  // Relations
  organizer    F3HIM          @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  participants ProjectCentral[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([startTime])
  @@index([endTime])
  @@index([f3himId])
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
  f3him   F3HIM     @relation("projectParticipation", fields: [f3himId], references: [id], onDelete: Cascade)

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
  location     String?
  city         String?
  state        String?
  
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
  
  // Location
  location        String?
  city            String?
  state           String?
  isRemote        Boolean           @default(false)  // OK - external orgs need this
  
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
  causes          ServiceCause[]    @default([])  // Align with F3Project
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  organization    Organization      @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  applications    VolunteerApplication[]

  @@map("volunteer_opportunities")
}

model VolunteerApplication {
  id             String            @id @default(cuid())
  f3himId        String            // FK to F3HIM (renamed from volunteerId)
  opportunityId  String
  
  status         ApplicationStatus @default(PENDING)
  message        String?           @db.Text
  
  // Hours tracking (for total service hours across both systems)
  hoursCompleted Int?
  completedAt    DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  volunteer    F3HIM                @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  opportunity  VolunteerOpportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)

  @@unique([f3himId, opportunityId])
  @@map("volunteer_applications")
}

// ============================================================================
// OPTIONAL EXTERNAL RESUME
// ============================================================================

model VolunteerSpecialties {
  f3himId String @id
  
  // For external opportunity matching only
  skills              String[]       @default([])  // "Mentoring", "Construction"
  availability        String         @db.Text      // "Weekends, Tuesday evenings"
  commitmentPreference CommitmentType @default(ONE_TIME)
  remoteWilling       Boolean        @default(false)  // OK - for external matching
  
  // Credentials (optional)
  backgroundCheckDate DateTime?
  certifications      String[] @default([])  // "CPR", "First Aid"
  
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
```

---

## How They Work Together

### Total Service Hours (Unified View)
```typescript
// Calculate PAX total service hours across BOTH systems
const totalHours = 
  // F3Project hours (group events)
  SUM(ProjectCentral.hoursLogged WHERE f3himId = X)
  +
  // VolunteerOpportunity hours (individual external)
  SUM(VolunteerApplication.hoursCompleted WHERE f3himId = X)
```

### Profile Display
```
[PAX Profile Card]

John "Fastlane" Smith
📍 Charlotte, NC
🏛️ AO: Charlotte Metro (optional)

Bio: "Served 10 years Army, passionate about helping 
      transitioning veterans find community."

Causes I Care About:
[VETERANS] [YOUTH_KIDS] [ENVIRONMENT]

Service Stats:
- 47 total hours
- 3 group projects joined
- 1 project organized
- 2 external partnerships

Recent Activity:
- Park Cleanup @ Freedom Park (3 hrs) - F3Project
- TMF Character Does Matter Mentor (ongoing) - External
```

---

## The Difference

| Aspect | F3Project | VolunteerOpportunity |
|--------|-----------|---------------------|
| **Who creates** | Any PAX | External org (or SuperAdmin) |
| **Who participates** | Multiple PAX (group event) | Individual PAX |
| **Entry** | Just join (via ProjectCentral) | Apply → Approved |
| **Hours tracking** | ProjectCentral.hoursLogged | VolunteerApplication.hoursCompleted |
| **Discovery** | Filter by myCauses on F3HIM | Match by skills in VolunteerSpecialties |
| **Prerequisite** | None (ad-hoc) | None (ad-hoc) |
| **Example** | "Park cleanup Saturday 9am" | "TMF needs mentors" |

---

## Questions for You

1. **AO Table?** Should we create an AO model, or is `aoId` just a string reference?
2. **Project creator auto-join?** When PAX creates F3Project, auto-create ProjectCentral entry for them?
3. **Keep isRemote boolean?** You said no booleans, but external orgs need remote filter - OK to keep for VolunteerOpportunity?
4. **interests field?** I removed it (redundant with myCauses) - agree?

Ready to generate the Prisma migration once you confirm these decisions!
