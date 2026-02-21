# F3 Profile - Minimal Core Approach

**Problem:** Cramming bio/city/state/causes onto F3HIM creates a monster table.

**Solution:** Keep F3HIM lean, use optional profile tables.

---

## What's ACTUALLY Core?

### F3HIM (Minimal - Just Auth + Identity)
```prisma
model F3HIM {
  id String @id @default(cuid())

  // Auth (REQUIRED)
  firebaseId String  @unique
  email      String?

  // Identity (REQUIRED)
  firstName String?
  lastName  String?
  f3Handle  String? @unique
  photoURL  String?
  
  // System
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  attendanceRecords      AttendanceRecord[]
  effortRecords          EffortRecord[]
  weeklyReflections      WeeklyReflection[]
  selfReportEntries      SelfReportEntry[]
  profile                F3Profile?              // Optional extended profile
  aoMemberships          AOCentral[]
  volunteerSpecialties   VolunteerSpecialties?
  volunteerApplications  VolunteerApplication[]
  organizedProjects      F3Project[]
  projectParticipation   ProjectCentral[]

  @@map("f3_hims")
}
```

**That's it.** Just auth + name. Everything else is optional.

---

## Optional: F3Profile (Extended Info)

```prisma
model F3Profile {
  f3himId String @id
  
  // Personal
  bio         String? @db.Text
  phoneNumber String?
  
  // Location
  city  String?
  state String?
  
  // Service
  myCauses ServiceCause[] @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  
  @@map("f3_profiles")
}
```

**Purpose:** Extended profile info (only loaded when needed).

**When to create:**
- First time PAX joins a project
- First time PAX applies to opportunity
- First time PAX views their profile page

---

## Optional: VolunteerSpecialties (External Resume)

```prisma
model VolunteerSpecialties {
  f3himId String @id
  
  // For external org matching only
  skills              String[]       @default([])
  availability        String         @db.Text
  commitmentPreference CommitmentType @default(ONE_TIME)
  
  // Credentials
  backgroundCheckDate DateTime?
  certifications      String[]       @default([])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  
  @@map("volunteer_specialties")
}
```

**Purpose:** Only for applying to external opportunities.

---

## But Wait... Is This Too Much Joining?

### Profile Display Query:
```typescript
const pax = await prisma.f3HIM.findUnique({
  where: { id },
  include: {
    profile: true,              // Need to join
    aoMemberships: { include: { ao: true } },
    projectParticipation: { include: { project: true } },
  }
});

// Now you have to do:
const bio = pax.profile?.bio;
const city = pax.profile?.city;
const causes = pax.profile?.myCauses;
```

vs if on core:
```typescript
const bio = pax.bio;
const city = pax.city;
```

---

## Alternative: Selective Core Fields

**Keep commonly accessed fields on F3HIM:**

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
  
  // Commonly displayed (keep on core)
  bio   String? @db.Text  // Shows on profile cards
  city  String?           // Shows on profile cards
  state String?           // Shows on profile cards
  
  // Service (keep on core - used for filtering)
  myCauses ServiceCause[] @default([])
  
  // System
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  attendanceRecords      AttendanceRecord[]
  effortRecords          EffortRecord[]
  weeklyReflections      WeeklyReflection[]
  selfReportEntries      SelfReportEntry[]
  aoMemberships          AOCentral[]
  contactInfo            F3ContactInfo?          // Phone, socials (optional)
  volunteerSpecialties   VolunteerSpecialties?
  volunteerApplications  VolunteerApplication[]
  organizedProjects      F3Project[]
  projectParticipation   ProjectCentral[]

  @@map("f3_hims")
}

model F3ContactInfo {
  f3himId     String @id
  phoneNumber String?
  
  // Add later if needed:
  // twitter  String?
  // linkedin String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  f3him F3HIM @relation(fields: [f3himId], references: [id], onDelete: Cascade)
  
  @@map("f3_contact_info")
}
```

**Logic:**
- **bio, city, state, myCauses** → On F3HIM (displayed on every profile card/list)
- **phoneNumber** → Separate F3ContactInfo table (only load when organizing/contacting)
- ~~instagram~~ → Removed (not F3 culture)

---

## What Do You Think?

### Option A: Keep F3HIM Lean (Minimal Core)
```prisma
model F3HIM {
  // Just: firebaseId, email, firstName, lastName, f3Handle, photoURL
}

model F3Profile {
  // bio, city, state, myCauses
}
```
**Pros:** Clean core, optional extended info  
**Cons:** Extra join for profile display

---

### Option B: Selective Core (Recommended)
```prisma
model F3HIM {
  // Auth: firebaseId, email
  // Identity: firstName, lastName, f3Handle, photoURL
  // Display: bio, city, state, myCauses (commonly shown)
}

model F3ContactInfo {
  // phoneNumber (only when needed)
}
```
**Pros:** Commonly accessed fields on core, rare fields separate  
**Cons:** F3HIM still has ~10 fields

---

### Option C: Just Accept It
```prisma
model F3HIM {
  // Everything: auth, identity, bio, city, state, phoneNumber, myCauses
}
```
**Pros:** No joins, simple queries  
**Cons:** Big table (but Athlete has 50+ fields and works fine!)

---

## My Actual Recommendation

**Go with Option B or C.** Here's why:

Looking at your Athlete model - it has **50+ fields** (Garmin tokens, Strava, training data, etc.) and it works fine. Modern DBs handle wide tables easily.

**Keep on F3HIM core:**
- Auth: firebaseId, email
- Identity: firstName, lastName, f3Handle, photoURL
- Display: bio, city, state (shown on profile cards)
- Service: myCauses (for filtering projects)

**Maybe separate:**
- phoneNumber → Only needed when organizing projects, could be in F3ContactInfo

**Total fields on F3HIM:** ~12 fields (vs 50+ on Athlete - you're fine!)

Which approach do you want? Or should we just accept that F3HIM will have ~12 fields and that's OK?
