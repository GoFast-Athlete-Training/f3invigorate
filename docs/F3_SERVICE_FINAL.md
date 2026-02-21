# F3 Service Architecture - Final Clean Model

**Key Insight:** This is like RunClubs in GoFast - opportunities are DATA (hydrated from various sources), participation is ad-hoc (no approval).

---

## The Parallel to GoFast RunClubs

| GoFast RunClubs | F3 Service |
|-----------------|------------|
| **RunClub** (data entry) | **Organization** + **VolunteerOpportunity** |
| Hydrated from Strava | Hydrated from VolunteerMatch API, PAX, VA, SuperAdmin |
| Browse clubs | Browse opportunities |
| Click "Join" (no approval) | Click "I'm doing this" (no approval) |
| Track runs/attendance | Track service hours |
| RunCrewMembership (junction) | VolunteerCommitment (junction) |

**Bottom line:** Organizations and Opportunities are DATA ENTRIES (like RunClubs), not user management systems.

---

## Clean Schema

### F3HIM (Minimal Core)
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

  // Relations (6 total)
  profile               F3Profile?            // 1 - Optional extended info
  activityLog           F3ActivityLog[]       // 2 - F3 workouts
  aoMemberships         AOCentral[]           // 3 - AO membership
  organizedProjects     F3Project[]           // 4 - Group events organized
  projectParticipation  ProjectCentral[]      // 5 - Group events joined
  volunteerCommitments  VolunteerCommitment[] // 6 - Individual opportunities (NO APPROVAL)

  @@map("f3_hims")
}
```

---

### F3Profile (Optional Extended Info)
```prisma
model F3Profile {
  f3himId String @id
  
  bio         String? @db.Text
  phoneNumber String?
  city        String?
  state       String?
  myCauses    ServiceCause[] @default([])
  
  // Optional for external matching (keep minimal)
  volunteerSkills String? @db.Text  // Just one text field, not array
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  
  @@map("f3_profiles")
}
```

---

### AO System
```prisma
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
```

---

### F3 Workout Tracking
```prisma
model F3ActivityLog {
  id      String @id @default(cuid())
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
```

---

## F3 Service Engine

### 1. Group Service Events (F3Project)
**PAX-organized group events**

```prisma
model F3Project {
  id      String  @id @default(cuid())
  f3himId String  // Who organized it
  aoId    String? // Optional AO
  
  title       String
  slug        String? @unique
  description String  @db.Text
  
  // Timing
  startTime      DateTime
  endTime        DateTime
  estimatedHours Int?
  
  // Location
  city       String?
  state      String?
  address    String?
  
  // Partner (TEXT - not FK!)
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
  hoursLogged Int      @default(0)
  joinedAt    DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project F3Project @relation(fields: [f3ProjectId], references: [id], onDelete: Cascade)
  f3him   F3HIM     @relation(fields: [f3himId], references: [id], onDelete: Cascade)

  @@unique([f3ProjectId, f3himId])
  @@map("project_central")
}
```

**Flow:**
- PAX creates F3Project: "Park cleanup Saturday"
- Other PAX click "Join" → creates ProjectCentral
- Everyone logs hours after
- **No approval, just show up**

---

### 2. External Opportunities (Data Entries)
**Opportunity cards (like RunClubs)**

```prisma
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
  
  // What's needed
  skillsNeeded    String? @db.Text  // Text field: "Construction experience helpful"
  hoursCommitment Int?              // Expected hours
  
  // Location
  locationType LocationType @default(IN_PERSON)
  city         String?
  state        String?
  address      String?
  
  // Timing
  startDate DateTime?
  endDate   DateTime?
  status    OpportunityStatus @default(OPEN)
  
  // Categorization
  commitmentType CommitmentType
  causes         ServiceCause[] @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  organization Organization          @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  commitments  VolunteerCommitment[] // Who's doing this (NO APPROVAL)

  @@index([status])
  @@map("volunteer_opportunities")
}

model VolunteerCommitment {
  id            String @id @default(cuid())
  f3himId       String
  opportunityId String
  
  // Hours tracking (honor system)
  hoursLogged Int      @default(0)
  note        String?  @db.Text
  
  // Timing
  startedAt   DateTime @default(now())
  completedAt DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  volunteer   F3HIM                @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  opportunity VolunteerOpportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)

  @@unique([f3himId, opportunityId])
  @@index([f3himId])
  @@map("volunteer_commitments")
}
```

**Flow:**
- PAX sees "TMF needs mentors" card
- Clicks "I'm doing this" → creates VolunteerCommitment
- **No PENDING/APPROVED status!** Just committed.
- PAX self-reports hours (honor system)
- Optional `completedAt` when done

---

## Killed Tables
- ❌ VolunteerApplication (replaced with VolunteerCommitment - no approval)
- ❌ VolunteerSpecialties (merged into F3Profile as single text field)
- ❌ ApplicationStatus enum (PENDING/APPROVED - don't need!)

---

## Hydration Sources

**Organizations & Opportunities can be created by:**
1. **SuperAdmin** - manually creates known orgs/opportunities
2. **PAX** - creates their own ("I know about this opportunity")
3. **VolunteerMatch API** - import from external source
4. **VA/assistant** - bulk upload

All just DATA. Like RunClubs getting hydrated from Strava.

---

Is THIS the model? Browse opportunities (data cards), click "I'm doing this", self-report hours?