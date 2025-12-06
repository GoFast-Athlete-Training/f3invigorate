# F3 Invigorate - Application Purpose & Architecture

## 🎯 **What is F3 Invigorate?**

F3 Invigorate is a **workout tracking and community engagement platform** designed for F3 (Fitness, Fellowship, and Faith) workout groups. The app helps PAX (participants) track their attendance, effort, reflections, and personal growth across multiple dimensions.

## 📋 **Core Features**

### 1. **Attendance Tracking**
- **Q Backblast Creation**: Qs (workout leaders) can create backblast entries that automatically log attendance for multiple PAX at once
- **Self-Report Attendance**: Individual PAX can log their own attendance at an AO (Area of Operations/workout location)
- Tracks attendance by date, AO, and source (backblast vs self-report)

### 2. **Effort Tracking**
- **Manual Effort Entry**: Log workout effort including:
  - Calories burned
  - Duration (in minutes)
  - Automatically calculates calories per minute
- Helps PAX track their workout intensity and progress over time

### 3. **Weekly Reflection**
- Track weekly reflections across multiple dimensions:
  - **Mood**: How you're feeling
  - **Wins**: What went well this week
  - **Struggles**: What was challenging
  - **Intention**: Goals for the upcoming week
- Encourages mindfulness and intentional growth

### 4. **Self-Report Entries**
- Log personal entries across different life categories:
  - **Fellowship**: Community engagement and relationships
  - **Service**: Acts of service to others
  - **Marriage & Family**: Family relationships and commitments
  - **Diet Queen**: Nutrition and dietary choices
  - **Mental Health**: Mental wellness and self-care
  - **Spiritual**: Spiritual growth and practices
- Helps PAX track holistic growth beyond just physical fitness

## 🏗️ **Architecture Overview**

### **Tech Stack**
- **Next.js 15** (App Router) - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Prisma ORM** - Database access (connects to existing GoFast PostgreSQL database)
- **Firebase Auth** - Authentication (client-side + server-side admin SDK)
- **Zod** - Schema validation

### **Database Schema**

The app connects to the existing GoFast database and uses the `Athlete` table. New tables are added:

- **`attendance_records`** - Tracks attendance (from backblast or self-report)
- **`effort_records`** - Tracks workout effort (calories, duration)
- **`weekly_reflections`** - Weekly reflection entries
- **`self_report_entries`** - Self-report entries across different categories

All records are tied to `Athlete.id` via foreign keys.

### **Authentication Flow**

1. **Splash Screen** (`/`) - Shows "f3" branding, checks auth state
2. **Signup/Signin** (`/signup`) - Firebase authentication (Google or Email)
3. **Athlete Creation** - After auth, calls `/api/athlete/create` to create/find athlete in database
4. **Dashboard** (`/dashboard`) - Main dashboard showing attendance, effort, reflections

### **API Routes**

All API routes use Firebase token authentication via `Authorization: Bearer <token>` header:

- `POST /api/athlete/create` - Create or find athlete after Firebase auth
- `POST /api/backblast/create` - Create backblast and log attendance for multiple PAX
- `POST /api/attendance/self` - Log self-attendance
- `POST /api/effort/manual` - Log manual effort entry
- `POST /api/reflection/week` - Create weekly reflection
- `POST /api/self-report/new` - Create self-report entry

## 🎨 **Design Philosophy**

- **Minimalist Black & White**: Clean, professional design with "f3" branding in black
- **Community-Focused**: Designed to support F3 workout groups and their values
- **Holistic Tracking**: Goes beyond just physical fitness to track mental, spiritual, and relational growth
- **Easy to Use**: Simple interfaces for quick logging during or after workouts

## 🚀 **Use Cases**

### **For Qs (Workout Leaders)**
- Create backblast entries after leading a workout
- Quickly log attendance for all PAX who attended
- Track community engagement

### **For PAX (Participants)**
- Log personal attendance if not included in backblast
- Track workout effort and intensity
- Reflect on weekly progress
- Track growth across multiple life dimensions

## 📊 **Data Insights**

The app enables tracking of:
- Weekly/monthly attendance patterns
- Workout intensity trends (calories, duration)
- Reflection patterns and personal growth
- Engagement across different life categories

## 🔮 **Future Potential**

Potential enhancements could include:
- Workout plan builder (as mentioned in user query)
- Leaderboards and community challenges
- Integration with fitness trackers
- Analytics and insights dashboard
- Mobile app version
- AO-specific tracking and statistics

---

**Note**: This app is built on the GoFast infrastructure but is specifically designed for F3 Invigorate workout groups and their unique tracking needs.

