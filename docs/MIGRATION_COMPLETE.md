# F3 Service Architecture - Migration Complete ✅

**Migration:** `20260221033129_clean_f3_service_architecture`  
**Status:** Applied successfully to database

---

## What Changed

### ✅ F3HIM Core (Enriched)
**Added fields:**
- `bio` (TEXT) - Why I serve, personal story
- `phoneNumber` (TEXT) - For organizing projects
- `city` (TEXT) - Where I'm based
- `state` (TEXT) - Geographic location
- `myCauses` (ServiceCause[]) - Causes I care about

**Removed fields:**
- ~~instagram~~ (not F3 culture)

**Relations cleaned:**
- ❌ Removed: attendanceRecords, effortRecords, weeklyReflections, selfReportEntries
- ❌ Removed: createdProjects, projectMemberships, volunteerProfile, volunteerApplications
- ✅ Added: profile, activityLog, aoMemberships, projectCommitments, volunteerCommitments

**Total relations: 5** (down from 8+)

---

### ✅ New Tables Created

#### 1. F3Profile (Optional Extended Profile)
```
f3himId (PK, FK)
volunteerSkills (text)
availability (text)
```
**Purpose:** Optional profile for external opportunity matching

#### 2. AO (Area of Operation)
```
id (PK)
name
city, state, region
```
**Purpose:** F3 workout locations

#### 3. AOCentral (Junction Table)
```
f3himId (FK)
aoId (FK)
role (MEMBER, Q, SITE_Q)
```
**Purpose:** Many-to-many AO membership with role

#### 4. F3ActivityLog (Consolidated)
```
f3himId (FK)
aoId (FK, optional)
date
calories, durationSec, calPerMin
source (BACKBLAST, SELF)
```
**Purpose:** Consolidates AttendanceRecord + EffortRecord into ONE table

#### 5. F3Project (Group Service Events)
```
id (PK)
aoId (FK, optional)
title, slug, description
startTime, endTime, estimatedHours
city, state, address
partnerOrg (text)
causes (ServiceCause[])
```
**Purpose:** PAX-organized group service events

**Removed:**
- ❌ `isCompleted` boolean (use endTime logic)
- ❌ `createdById` / separate organizer relation

#### 6. ProjectCentral (Junction Table with Role)
```
f3ProjectId (FK)
f3himId (FK)
role (ORGANIZER, PARTICIPANT)
hoursLogged
```
**Purpose:** Many-to-many project participation with role
**Query organizer:** WHERE role = ORGANIZER
**Query participants:** WHERE role = PARTICIPANT

#### 7. Organization (External Orgs - Data)
```
id (PK)
name, description
contactEmail, website, logoUrl
city, state
```
**Purpose:** External nonprofit data (like RunClubs)

#### 8. VolunteerOpportunity (External Opportunities - Data/Cards)
```
id (PK)
organizationId (FK)
title, description
skillsNeeded, hoursCommitment
locationType (IN_PERSON, REMOTE, HYBRID)
city, state, address
startDate, endDate, status
commitmentType
causes (ServiceCause[])
```
**Purpose:** External opportunity cards (hydrated from various sources)

**Removed:**
- ❌ `isRemote` boolean (replaced with locationType enum)
- ❌ `category` (OpportunityCategory - removed enum)

#### 9. VolunteerCommitment (Individual Participation)
```
f3himId (FK)
opportunityId (FK)
hoursLogged
note
startedAt, completedAt
```
**Purpose:** PAX commits to external opportunity (NO APPROVAL WORKFLOW)

**Removed:**
- ❌ `status` (PENDING/APPROVED/REJECTED - no vetting!)
- ❌ `message` (replaced with `note`)

---

### ✅ Tables Dropped

- ❌ AttendanceRecord (consolidated into F3ActivityLog)
- ❌ EffortRecord (consolidated into F3ActivityLog)
- ❌ WeeklyReflection (deprecated)
- ❌ SelfReportEntry (deprecated)
- ❌ VolunteerProfile (replaced with F3Profile)
- ❌ VolunteerApplication (replaced with VolunteerCommitment)
- ❌ F3ProjectMembership (renamed to ProjectCentral)

---

### ✅ Enums Removed
- ❌ ApplicationStatus (PENDING/APPROVED/REJECTED - no approval!)
- ❌ OpportunityCategory (not needed)
- ❌ SelfReportCategory (deprecated tables)

---

### ✅ Enums Added
- ✅ ServiceCause (VETERANS, YOUTH_KIDS, etc.)
- ✅ LocationType (IN_PERSON, REMOTE, HYBRID)
- ✅ ProjectRole (ORGANIZER, PARTICIPANT)
- ✅ AOMemberRole (MEMBER, Q, SITE_Q)
- ✅ AttendanceSource (BACKBLAST, SELF)

---

## The Clean Architecture

### F3HIM Relations (5 total)
```prisma
model F3HIM {
  profile              F3Profile?            // 1 - Optional extended info
  activityLog          F3ActivityLog[]       // 2 - Consolidated workout tracking
  aoMemberships        AOCentral[]           // 3 - AO membership with role
  projectCommitments   ProjectCentral[]      // 4 - Group service with role
  volunteerCommitments VolunteerCommitment[] // 5 - Individual opportunities
}
```

---

### Junction Tables (Role-Based)

#### AOCentral
**Purpose:** AO membership  
**Role:** MEMBER, Q, SITE_Q  
**Query:** "Which AOs am I a member of?"

#### ProjectCentral
**Purpose:** Service project participation  
**Role:** ORGANIZER, PARTICIPANT  
**Query:** "Projects I organized" vs "Projects I joined"

#### VolunteerCommitment
**Purpose:** External opportunity commitment  
**No role:** Just FK (clicked "I'm doing this")  
**Query:** "Opportunities I'm committed to"

---

## Key Principles Applied

### 1. No Booleans
- ❌ isCompleted → Use `endTime` logic (NOW > endTime)
- ❌ remotePreference → Text in availability field
- ❌ isRemote → LocationType enum

### 2. Use Role on Junction Tables
- Don't create separate relations for organizer vs participant
- Query by role instead

### 3. Clean FK Naming
- All FK fields named consistently: f3himId, aoId, f3ProjectId, opportunityId
- No weird "createdById" or "volunteerId"

### 4. Honor System (No Approval)
- No PENDING/APPROVED/REJECTED status
- Click "I'm doing this" → log hours
- Self-report (honor system)

### 5. Data as Cards (Like RunClubs)
- Organizations & Opportunities are DATA
- Can be hydrated from: PAX, SuperAdmin, VolunteerMatch API, VA
- Browse and commit (ad-hoc, no prerequisite)

---

## Total Service Hours (Unified)

```typescript
const totalHours = 
  // Group events
  SUM(ProjectCentral.hoursLogged WHERE f3himId = X) +
  // Individual opportunities
  SUM(VolunteerCommitment.hoursLogged WHERE f3himId = X)
```

---

## What's Next?

### Update Application Code
These files need updating to match new schema:

1. **API Routes:**
   - `/api/opportunities/route.ts` - Update to use VolunteerCommitment (not Application)
   - `/api/opportunities/[id]/apply/route.ts` - Rename to "commit" (no approval)
   - Need new: `/api/projects/route.ts` - Create F3Project
   - Need new: `/api/projects/[id]/join/route.ts` - Join project (ProjectCentral)

2. **Pages:**
   - `/app/f3serve/opportunities/[id]/page.tsx` - Update "Apply" to "Commit"
   - `/app/f3serve/dashboard/page.tsx` - Show commitments (not applications)
   - Need new: `/app/f3serve/projects/` - Browse group events
   - Need new: `/app/f3serve/projects/[id]/page.tsx` - Project detail + join button

3. **Components:**
   - `OpportunityCard.tsx` - Update for new schema
   - Need new: `ProjectCard.tsx` - For F3Project cards
   - `/app/f3serve/profile/VolunteerProfileForm.tsx` - Update to F3Profile schema

4. **Fake Data:**
   - `lib/volunteer-fake-data.ts` - Update DisplayOpportunity type

---

## Breaking Changes

### Database
- ✅ All old tables dropped (fresh start)
- ✅ New schema applied

### Code
- 🚨 TypeScript will error until we update imports
- 🚨 API routes need updating
- 🚨 Components need updating

---

## Summary

**Mission accomplished!**

✅ Killed all booleans  
✅ Fixed FK naming (consistent f3himId, aoId, etc.)  
✅ Consolidated junction tables with roles  
✅ Removed approval workflows (honor system)  
✅ Enriched F3HIM with personal fields  
✅ Created AO + AOCentral structure  
✅ Clean 5 relations on F3HIM (down from 8+)  

**Architecture:**
- F3Project (group service) + ProjectCentral (junction with role)
- VolunteerOpportunity (data cards) + VolunteerCommitment (simple FK, no approval)
- Organizations & Opportunities = DATA (like RunClubs in GoFast)

**Ready for:** Building the UX to create projects, join projects, browse opportunities, commit to opportunities, log hours!
