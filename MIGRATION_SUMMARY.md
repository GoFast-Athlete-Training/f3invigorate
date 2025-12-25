# F3Invigorate Full Spine Refactor - Migration Summary

## ✅ Completed Changes

### 1. Prisma Schema Refactor
- ✅ Created `F3HIM` model replacing `Athlete`
- ✅ Removed `GoFastCompany` model and all company relations
- ✅ Removed all GoFast-specific fields (gofastHandle, companyId, etc.)
- ✅ Removed Garmin, Strava, training profile, and sport fields
- ✅ Updated all relations to use `f3HIMId` instead of `athleteId`:
  - `AttendanceRecord.f3HIMId`
  - `EffortRecord.f3HIMId`
  - `WeeklyReflection.f3HIMId`
  - `SelfReportEntry.f3HIMId`
- ✅ Made `EffortRecord` fields optional (calories, durationSec, calPerMin)

### 2. Authentication & Identity
- ✅ Updated `lib/auth.ts`:
  - Created `getCurrentF3HIM()` function
  - Kept `getCurrentAthlete()` as legacy alias for backward compatibility
- ✅ Created new API route: `/api/f3him/create`
- ✅ Updated signup page to use `/api/f3him/create` endpoint

### 3. API Routes Updated
All API routes now use `f3HIMId`:
- ✅ `/api/attendance/self` - Updated to use `getCurrentF3HIM()` and `f3HIMId`
- ✅ `/api/effort/manual` - Updated to use `getCurrentF3HIM()` and `f3HIMId`
- ✅ `/api/backblast/create` - Updated to resolve emails to F3HIM IDs
- ✅ `/api/reflection/week` - Updated (deprecated UX, kept for data)
- ✅ `/api/self-report/new` - Updated (deprecated UX, kept for data)

### 4. Home Route Refactor
- ✅ Refactored `/app/page.tsx` to be F3HIM Home
- ✅ Displays:
  - AO membership status (placeholder for future AO model)
  - Log Workout action (links to `/attendance/self`)
  - Join Service action (placeholder link to `/service/join`)
  - Optional impact display (this week's attendance, total workouts)
- ✅ Removed reflection and self-report entry points from home

### 5. Dashboard Updates
- ✅ Updated `/app/dashboard/page.tsx` to use `getCurrentF3HIM()` and `f3HIMId`
- ✅ Note: Dashboard still shows reflection data (deprecated UX)

## ⚠️ Deprecated (Kept for Data Retention)

### Models & Tables
- `WeeklyReflection` - Table kept, UX removed from home
- `SelfReportEntry` - Table kept, UX removed from home

### Routes (Still Functional, Not Promoted)
- `/api/reflection/week` - Still works, but not linked from home
- `/api/self-report/new` - Still works, but not linked from home
- `/app/reflection/week` - Page exists but not linked
- `/app/self-report/new` - Page exists but not linked
- `/app/dashboard` - Still exists but redirects to home recommended

### Legacy Route (Backward Compatibility)
- `/api/athlete/create` - Still exists but should be deprecated
  - Consider redirecting to `/api/f3him/create` or removing after migration

## 🔄 Required Database Migration

### Migration Steps

1. **Create F3HIM table from Athlete data:**
   ```sql
   -- Create F3HIM table
   CREATE TABLE f3_hims (
     id TEXT PRIMARY KEY,
     firebase_id TEXT UNIQUE NOT NULL,
     email TEXT,
     first_name TEXT,
     last_name TEXT,
     f3_handle TEXT UNIQUE,
     photo_url TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Migrate data from athletes to f3_hims
   INSERT INTO f3_hims (id, firebase_id, email, first_name, last_name, f3_handle, photo_url, created_at, updated_at)
   SELECT 
     id,
     firebase_id,
     email,
     first_name,
     last_name,
     gofast_handle,
     photo_url,
     created_at,
     updated_at
   FROM athletes;
   ```

2. **Update foreign keys:**
   ```sql
   -- Add new f3_him_id columns
   ALTER TABLE attendance_records ADD COLUMN f3_him_id TEXT;
   ALTER TABLE effort_records ADD COLUMN f3_him_id TEXT;
   ALTER TABLE weekly_reflections ADD COLUMN f3_him_id TEXT;
   ALTER TABLE self_report_entries ADD COLUMN f3_him_id TEXT;

   -- Migrate data (athlete_id -> f3_him_id)
   UPDATE attendance_records SET f3_him_id = athlete_id;
   UPDATE effort_records SET f3_him_id = athlete_id;
   UPDATE weekly_reflections SET f3_him_id = athlete_id;
   UPDATE self_report_entries SET f3_him_id = athlete_id;

   -- Add foreign key constraints
   ALTER TABLE attendance_records 
     ADD CONSTRAINT fk_attendance_f3him 
     FOREIGN KEY (f3_him_id) REFERENCES f3_hims(id) ON DELETE CASCADE;
   
   ALTER TABLE effort_records 
     ADD CONSTRAINT fk_effort_f3him 
     FOREIGN KEY (f3_him_id) REFERENCES f3_hims(id) ON DELETE CASCADE;
   
   ALTER TABLE weekly_reflections 
     ADD CONSTRAINT fk_reflection_f3him 
     FOREIGN KEY (f3_him_id) REFERENCES f3_hims(id) ON DELETE CASCADE;
   
   ALTER TABLE self_report_entries 
     ADD CONSTRAINT fk_selfreport_f3him 
     FOREIGN KEY (f3_him_id) REFERENCES f3_hims(id) ON DELETE CASCADE;

   -- Make f3_him_id NOT NULL
   ALTER TABLE attendance_records ALTER COLUMN f3_him_id SET NOT NULL;
   ALTER TABLE effort_records ALTER COLUMN f3_him_id SET NOT NULL;
   ALTER TABLE weekly_reflections ALTER COLUMN f3_him_id SET NOT NULL;
   ALTER TABLE self_report_entries ALTER COLUMN f3_him_id SET NOT NULL;

   -- Drop old foreign keys and columns (after verification)
   -- ALTER TABLE attendance_records DROP CONSTRAINT attendance_records_athlete_id_fkey;
   -- ALTER TABLE attendance_records DROP COLUMN athlete_id;
   -- (Repeat for other tables)
   ```

3. **Run Prisma migration:**
   ```bash
   npx prisma migrate dev --name f3him_refactor
   ```

## 📋 Next Steps

### Immediate Actions Required

1. **Database Migration**
   - Review and execute migration SQL above
   - Test migration on staging/dev environment first
   - Verify data integrity after migration

2. **Remove Legacy Code** (After Migration Verified)
   - Delete `/api/athlete/create/route.ts` (or add deprecation redirect)
   - Consider removing `getCurrentAthlete()` alias after full migration
   - Update any remaining references to `athlete` terminology

3. **Implement Missing Features**
   - **AO Model**: Create AO (Area of Operations) model and membership tracking
   - **Service Projects**: Create service project model and join functionality
   - **Shield Lock**: Implement AO membership management (join/manage)

### Future Enhancements

- Q-created workout logging (future)
- Garmin integration (event-level only, later)
- Points/Impact calculation and display

## 🎯 Product Scope Lock

The product now supports only three primary actions:
1. ✅ Join / Manage AO (or Shield Lock) - **Placeholder created**
2. ✅ Log a Workout - **Functional** (manual entry)
3. ✅ Join a Service Project - **Placeholder created**

Reflection, journaling, and life-category tracking are explicitly out of scope for Home UX.

## 📝 Notes

- All changes maintain backward compatibility during migration period
- Legacy `athlete` references kept where needed for smooth transition
- Deprecated UX routes still functional but not promoted
- Home route optimized for 10-second interactions (tired, low-context users)

## 🔍 Files Changed

### Schema
- `prisma/schema.prisma` - Complete refactor

### Core Library
- `lib/auth.ts` - Updated to F3HIM

### API Routes
- `app/api/f3him/create/route.ts` - **NEW**
- `app/api/attendance/self/route.ts` - Updated
- `app/api/effort/manual/route.ts` - Updated
- `app/api/backblast/create/route.ts` - Updated
- `app/api/reflection/week/route.ts` - Updated (deprecated)
- `app/api/self-report/new/route.ts` - Updated (deprecated)

### Pages
- `app/page.tsx` - Complete refactor to F3HIM Home
- `app/signup/page.tsx` - Updated to use f3him/create
- `app/dashboard/page.tsx` - Updated to use F3HIM

### Legacy (Keep for Migration Period)
- `app/api/athlete/create/route.ts` - **DEPRECATED** (keep for backward compat)

