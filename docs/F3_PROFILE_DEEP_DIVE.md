# F3 Profile Deep Dive - Service & Identity

**Context:** We have TWO service systems that need ONE unified profile approach.

**Key Learning from GoFast:** Don't require prerequisite memberships. Make it ad-hoc and barrier-free.

---

## The Two Systems

### 1. F3Project (Group Service Events)
**PAX-driven, grassroots service**

```
F3HIM ←→ F3ProjectMembership ←→ F3Project
       (many-to-many junction)
```

**Example:** "Park cleanup this Saturday at Freedom Park"
- Any PAX creates it
- Any PAX joins it (no prerequisite)
- Log hours together
- Complete the project

**Current Schema:**
```prisma
model F3Project {
  f3ProjectId  String    @id
  createdById  String    // Who organized it
  title        String
  startTime    DateTime
  hoursWorking Int
  description  String
  isCompleted  Boolean
  
  memberships  F3ProjectMembership[]  // Who joined
}

model F3ProjectMembership {
  f3ProjectId String
  f3himId     String
  hoursLogged Int
  
  @@unique([f3ProjectId, f3himId])  // Many-to-many
}
```

---

### 2. VolunteerOpportunity (Individual External Work)
**External org partnerships**

```
F3HIM → VolunteerApplication → VolunteerOpportunity ← Organization
```

**Example:** "Travis Manion Foundation needs mentors for Character Does Matter program"
- External org posts opportunity
- Individual PAX applies
- PAX volunteers on their own (not as a group)
- Track personal hours with that org

**Current Schema:**
```prisma
model Organization {
  name         String
  opportunities VolunteerOpportunity[]
}

model VolunteerOpportunity {
  organizationId String
  title          String
  description    String
  category       OpportunityCategory  // MENTORSHIP, LABOR, EVENTS, etc.
  commitmentType CommitmentType       // ONE_TIME, RECURRING, etc.
  
  applications   VolunteerApplication[]
}

model VolunteerApplication {
  volunteerId   String  // FK to F3HIM
  opportunityId String
  status        ApplicationStatus  // PENDING, APPROVED, REJECTED
}
```

---

## Current Profile Structure

### F3HIM (Core Identity)
**What you have now:**
```prisma
model F3HIM {
  id         String  @id
  firebaseId String  @unique
  email      String?
  
  firstName  String?
  lastName   String?
  f3Handle   String? @unique
  photoURL   String?
  
  createdAt  DateTime
  updatedAt  DateTime
}
```

**What's MISSING (compared to Athlete in GoFast):**
- ❌ `bio` - Personal story, why they serve
- ❌ `city` - Where they're based
- ❌ `state` - Geographic location
- ❌ `phoneNumber` - Contact for organizing projects
- ❌ `instagram` - Social connection
- ❌ Causes they care about

---

### VolunteerProfile (Separate Optional Table)
**What you have now:**
```prisma
model VolunteerProfile {
  f3himId              String   @id
  skills               String[] // "Mentoring", "Construction", "Events"
  interests            String[] // "Youth", "Veterans", "Environment"
  availability         String   // "Weekends, Tuesday evenings"
  commitmentPreference CommitmentType
  remotePreference     Boolean
}
```

**Purpose:** This feels like a **resume for external opportunities** (VolunteerMatch concept). Skills/interests help match PAX to external org opportunities.

**Question:** Is this needed for F3Project? No - you just join projects you care about.

---

## What Belongs Where?

Let's compare to Athlete model and think about F3 service:

| Field | Athlete Model | Where it should live | Why |
|-------|--------------|---------------------|-----|
| **firstName** | ✅ On Athlete | ✅ F3HIM core | Identity |
| **lastName** | ✅ On Athlete | ✅ F3HIM core | Identity |
| **handle** | ✅ gofastHandle | ✅ f3Handle (have it) | F3 name/callsign |
| **bio** | ✅ On Athlete | ➕ **Add to F3HIM** | "Why I serve", personal story |
| **city** | ✅ On Athlete | ➕ **Add to F3HIM** | Where they're based |
| **state** | ✅ On Athlete | ➕ **Add to F3HIM** | Geographic location |
| **phoneNumber** | ✅ On Athlete | ➕ **Add to F3HIM** | For organizing projects |
| **instagram** | ✅ On Athlete | ➕ **Add to F3HIM** | Social connection |
| **primarySport** | ✅ On Athlete | N/A | Running-specific |
| **runClubId** | ✅ On Athlete | ❓ **aoId?** | AO membership (optional) |

---

## Service-Specific Fields

### Option A: Add to F3HIM Core
```prisma
model F3HIM {
  // ... existing identity fields
  
  // Personal
  bio         String?  @db.Text  // Why they serve, personal story
  city        String?
  state       String?
  phoneNumber String?
  instagram   String?
  
  // Service-related
  myCauses    String[]  @default([])  // ["VETERANS", "YOUTH", "ENVIRONMENT"]
  aoId        String?   // Optional AO affiliation
}
```

**Pros:**
- All core identity in one place
- Easier to query and display
- Matches Athlete model pattern

**Cons:**
- F3HIM gets bigger
- Service fields mixed with core identity

---

### Option B: Keep VolunteerProfile Separate (Current)
```prisma
model F3HIM {
  // Just auth + basic identity
}

model VolunteerProfile {
  f3himId              String
  bio                  String?  @db.Text  // NEW
  city                 String?           // NEW
  state                String?           // NEW
  phoneNumber          String?           // NEW
  myCauses             String[]  @default([])  // NEW
  
  // For external opportunities (VolunteerMatch style)
  skills               String[]  @default([])
  interests            String[]  @default([])
  availability         String    @db.Text
  commitmentPreference CommitmentType
  remotePreference     Boolean
}
```

**Pros:**
- F3HIM stays lean (just auth)
- All service-related stuff in one table
- Optional (only create if PAX wants to volunteer)

**Cons:**
- Have to join tables to get profile
- Bio/city/state feel like core identity (not optional)

---

## Recommended Structure

### Core Identity (F3HIM)
**These should be on F3HIM directly** (not optional):
```prisma
model F3HIM {
  // Auth
  firebaseId String  @unique
  email      String?
  
  // Identity
  firstName  String?
  lastName   String?
  f3Handle   String? @unique
  photoURL   String?
  
  // Personal (NEW - matches Athlete pattern)
  bio        String? @db.Text    // Why I serve, personal story
  city       String?             // Where I'm based
  state      String?             // Geographic location
  phoneNumber String?            // For organizing
  instagram  String?             // Social connection
  
  // F3-specific (NEW)
  aoId       String?             // Optional AO affiliation
  myCauses   String[] @default([]) // Causes I care about
  
  // Relations
  volunteerProfile      VolunteerProfile?
  volunteerApplications VolunteerApplication[]
  createdProjects       F3Project[]           @relation("ProjectCreatedBy")
  projectMemberships    F3ProjectMembership[]
}
```

**Why these belong on F3HIM:**
- `bio`, `city`, `state`, `phoneNumber`, `instagram` - Core personal info (like Athlete)
- `myCauses` - Helps discover projects they'd care about ("Show me VETERANS projects")
- `aoId` - Optional AO affiliation (but NOT required to participate)

---

### Optional Volunteer Profile (VolunteerProfile)
**Keep separate for external opportunity matching**:
```prisma
model VolunteerProfile {
  f3himId              String         @id
  
  // For matching to external opportunities (VolunteerOpportunity)
  skills               String[]       @default([])  // "Mentoring", "Construction", "Event Planning"
  interests            String[]       @default([])  // "Working with youth", "Outdoor work"
  availability         String         @db.Text      // "Weekends, Tuesday evenings"
  commitmentPreference CommitmentType @default(ONE_TIME)
  remotePreference     Boolean        @default(false)
  
  // Maybe add later:
  // backgroundCheck      Boolean?       // For sensitive roles (youth mentorship)
  // certifications       String[]       // "CPR", "First Aid", etc.
}
```

**Purpose:** Optional "resume" for when PAX wants to apply to external org opportunities. NOT needed for F3Project (just join projects you care about).

---

## How They Work Together

### F3Project Flow (Group Service)
1. PAX visits `/f3serve/projects` (browse all upcoming projects)
2. Filters by `myCauses` from their F3HIM profile
3. Sees "Park cleanup this Saturday" created by another PAX
4. Clicks "Join" → creates F3ProjectMembership
5. Shows up, logs hours
6. Profile shows:
   - Projects I've joined (history)
   - Total service hours (sum of hoursLogged)
   - Projects I've created/organized

**Doesn't need VolunteerProfile** - just core F3HIM identity + myCauses.

---

### VolunteerOpportunity Flow (Individual External)
1. PAX visits `/f3serve/opportunities` (browse external org opportunities)
2. Sees "TMF needs mentors"
3. Clicks "Apply" → creates VolunteerApplication
4. **Optional:** IF they have VolunteerProfile filled out, org can see their skills/interests
5. Org approves application
6. PAX volunteers individually (hours tracked separately? Or just application status?)

**Uses VolunteerProfile (optional)** - helps orgs understand PAX background.

---

## The Critical Question: Hours Tracking

### F3Project Hours
- Tracked in **F3ProjectMembership.hoursLogged**
- Per project, per PAX
- Easy to sum up: "Total service hours = SUM(hoursLogged) across all memberships"

### VolunteerOpportunity Hours
- **NOT currently tracked!**
- VolunteerApplication has `status` but no `hoursWorked` field

**Options:**
1. Add `hoursWorked` to VolunteerApplication
2. Don't track hours for external opportunities (just track applications)
3. Create separate VolunteerHours table (if one PAX does multiple shifts with same org)

---

## Proposed Schema Changes

### 1. Enrich F3HIM Core
```prisma
model F3HIM {
  id String @id @default(cuid())

  // Auth
  firebaseId String @unique
  email      String?

  // Identity
  firstName String?
  lastName  String?
  f3Handle  String? @unique
  photoURL  String?

  // Personal (NEW - inspired by Athlete)
  bio         String? @db.Text
  city        String?
  state       String?
  phoneNumber String?
  instagram   String?
  
  // F3 Service (NEW)
  aoId      String?   // Optional AO affiliation (not required)
  myCauses  String[]  @default([]) // ["VETERANS", "YOUTH", "ENVIRONMENT"]
  
  // System
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  attendanceRecords     AttendanceRecord[]
  effortRecords         EffortRecord[]
  volunteerProfile      VolunteerProfile?
  volunteerApplications VolunteerApplication[]
  createdProjects       F3Project[]            @relation("ProjectCreatedBy")
  projectMemberships    F3ProjectMembership[]
}
```

### 2. Keep VolunteerProfile Lean (Optional External Resume)
```prisma
model VolunteerProfile {
  f3himId              String         @id
  
  // For external opportunity matching only
  skills               String[]       @default([])
  interests            String[]       @default([])  // Maybe redundant with myCauses?
  availability         String         @db.Text
  commitmentPreference CommitmentType @default(ONE_TIME)
  remotePreference     Boolean        @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  
  @@map("volunteer_profiles")
}
```

**Decision Point:** Should `interests` stay in VolunteerProfile, or just use `myCauses` from F3HIM? (Might be redundant)

---

### 3. Add Hours Tracking to External Opportunities?
```prisma
model VolunteerApplication {
  id            String            @id @default(cuid())
  volunteerId   String
  opportunityId String
  status        ApplicationStatus @default(PENDING)
  message       String?           @db.Text
  
  // NEW - if you want to track hours for external work
  hoursCompleted Int?              // Hours worked (optional)
  completedAt    DateTime?         // When they finished
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Or keep it simple:** External opportunities just track application status (PENDING → APPROVED), no hours. F3Project tracks hours via membership.

---

## Comparison: Athlete vs F3HIM

| Field | Athlete (GoFast) | F3HIM (Current) | Recommended |
|-------|------------------|-----------------|-------------|
| **firebaseId** | ✅ | ✅ | Keep |
| **email** | ✅ | ✅ | Keep |
| **firstName** | ✅ | ✅ | Keep |
| **lastName** | ✅ | ✅ | Keep |
| **handle** | gofastHandle | f3Handle | Keep |
| **photoURL** | ✅ | ✅ | Keep |
| **bio** | ✅ | ❌ | ➕ **Add to F3HIM** |
| **city** | ✅ | ❌ | ➕ **Add to F3HIM** |
| **state** | ✅ | ❌ | ➕ **Add to F3HIM** |
| **phoneNumber** | ✅ | ❌ | ➕ **Add to F3HIM** |
| **instagram** | ✅ | ❌ | ➕ **Add to F3HIM** |
| **birthday** | ✅ | ❌ | ❓ Optional later |
| **gender** | ✅ | ❌ | ❓ Optional later |
| **companyId** | ✅ (required) | ❌ | Not needed for F3 |
| **runClubId** | ✅ (optional) | ❌ | ➕ **aoId** (optional) |
| **primarySport** | ✅ | ❌ | Not needed for F3 |
| **myCauses** | ❌ | ❌ | ➕ **Add to F3HIM** |

---

## What Is "myCauses"?

**Concept:** The causes/missions a PAX cares about.

**Use cases:**
1. **Browse F3Projects filtered by causes** ("Show me VETERANS projects")
2. **Discover PAX with similar interests** ("Who else cares about YOUTH?")
3. **Profile display** ("I care about: Veterans, Environment")

**Type:** Array of enum values

**Suggested Enum:**
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

model F3HIM {
  myCauses ServiceCause[] @default([])
}
```

**Or keep it simpler:** Just `String[]` (free text) for flexibility?

---

## What About AO Membership?

**The GoFast Mistake:** Required `runClubId` before joining RunCrews → barrier to entry.

**F3 Service Approach:** `aoId` is **optional** on F3HIM.
- Some PAX are active at AOs, some aren't
- Don't require AO membership to join F3Projects
- BUT if present, can show "PAX from Charlotte AO organizing this"

**Schema:**
```prisma
model F3HIM {
  aoId String?  // Optional AO affiliation (not required)
}

// Elsewhere in schema (if you have AO table)
model AO {
  id       String  @id
  name     String  // "Charlotte AO", "Raleigh AO"
  city     String?
  state    String?
  f3hims   F3HIM[] // Reverse relation
}
```

**Do you have an AO table?** If not, we might need to create it. Or is `aoId` just a string reference to an external system?

---

## The Profile Should Show

### Public Profile Display
When viewing a PAX profile (for organizing or joining projects):

**Core:**
- F3 handle (callsign)
- Photo
- Bio (why they serve, personal story)
- City, state (where they're based)

**Service:**
- Causes I care about (badges/tags)
- Projects I've organized (list)
- Projects I've joined (list)
- Total service hours (calculated from F3ProjectMembership)
- Optional: AO affiliation badge

**External (if VolunteerProfile exists):**
- Skills (for external orgs to see)
- Availability, preferences

---

## Questions to Answer

### 1. Core Identity on F3HIM?
Should we move these to F3HIM directly:
- bio
- city, state
- phoneNumber
- instagram
- myCauses

**My recommendation:** YES - these are core identity, not optional. Makes F3HIM more complete.

---

### 2. What is VolunteerProfile For?
**Current design:** Skills/interests resume for external opportunity matching.

**Question:** Is this actually needed? Or can we:
- Use `myCauses` from F3HIM for matching
- Keep VolunteerProfile minimal (just skills/availability for external orgs)
- Or eliminate VolunteerProfile entirely and just use F3HIM?

**My recommendation:** Keep VolunteerProfile BUT make it leaner. It's for external org matching only (skills, certs, availability). Everything else goes on F3HIM core.

---

### 3. Do You Have an AO Table?
**For aoId reference:**
- Do you have an AO model in another schema?
- Or is aoId just a string identifier?
- Or should we create AO table?

**My recommendation:** If AOs are important for organizing projects ("Charlotte AO's monthly food bank day"), create an AO table:
```prisma
model AO {
  id       String  @id
  name     String
  city     String?
  state    String?
  region   String? // "F3 Charlotte", "F3 Raleigh"
  createdAt DateTime @default(now())
  
  f3hims    F3HIM[]     // Members affiliated
  projects  F3Project[] // Projects organized by this AO (optional)
}
```

---

### 4. Hours Tracking for External Opportunities?
Should VolunteerApplication track hours?
```prisma
model VolunteerApplication {
  // ... existing
  hoursCompleted Int?      // NEW - hours worked
  completedAt    DateTime? // NEW - completion date
}
```

**Or:** Only track hours in F3Project (group events), not external opportunities (just application status)?

---

## Summary

**Core problem:** F3HIM is too lean. It needs to match Athlete's richness:
- ➕ bio, city, state, phoneNumber, instagram
- ➕ myCauses (service-specific)
- ➕ aoId (optional AO affiliation)

**VolunteerProfile should be:**
- Optional (only for external opportunities)
- Focused on matching (skills, availability, preferences)
- NOT a duplicate of core identity

**Next steps:**
1. Decide: Should bio/city/state/myCauses go on F3HIM core? (I vote yes)
2. Decide: Do we need AO table, or is aoId just a string?
3. Decide: Track hours for external opportunities, or just F3Projects?

Want me to create a migration plan to enrich F3HIM and clarify VolunteerProfile's role?
