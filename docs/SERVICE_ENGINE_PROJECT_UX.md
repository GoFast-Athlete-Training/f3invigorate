# F3 Service Engine — Project UX Draft

**Primary user:** **AO Lead**

This UX starts from the AO lead point of view: create and run service projects for his AO, then make it easy for PAX to find and join those projects.

---

## Product Goal

Turn service into a repeatable flow:

1. AO lead sets up a project
2. AO publishes it to the AO container (cityrun/runcrew style)
3. PAX finds the project and joins
4. AO lead tracks attendance and hours worked

---

## Core UX Model

Use a **container pattern** similar to cityrun/runcrew:

- Container = AO service feed (e.g., Midtown AO Service)
- Items in feed = projects/events
- Members = AO PAX who join projects
- Owner/Admin = AO lead

---

## Primary Flow (AO Lead)

### 1) AO Lead Lands on Dashboard

- Sees active projects
- Sees upcoming start times
- Sees joined-member counts and filled headcount
- CTA: **Set Up Project**

### 2) Set Up Project (Create Form)

Required fields for MVP:

- **Name of Project**
- **Start Time**
- **Hours Working** (estimated/projected)
- **Description**

Suggested add-ons (nice-to-have, not required now):

- Goal headcount
- Location
- Org template source (if project was adopted from an org)

### 3) Publish to AO Feed

After submit:

- Project appears in AO container/feed
- Status defaults to `UPCOMING`
- AO lead can edit/update details

### 4) Manage Membership + Attendance

- AO lead sees:
  - membership count
  - attendee list
  - attendance confirmation
  - total hours logged vs planned hours

---

## Secondary Flow (PAX / Member)

### 1) Discover Projects

PAX enters AO service container and sees project cards.

### 2) Project Card Content (MVP)

Each card should show:

- **Name of Project**
- **Start Time**
- **Hours Working**
- **Description** (short preview)

Optional badge:

- `UPCOMING` / `COMPLETED`

### 3) Open Project Detail

Detail view includes full description and RSVP action.

### 4) Join Project

- CTA: **Join Project**
- membership count updates immediately in UI
- user sees that they are joined

---

## Information Architecture (MVP)

- `/f3service-demo` → splash/start
- `/f3service-demo/ao` → AO lead dashboard (container admin view)
- `/f3service-demo/projects/[slug]` → project detail + membership
- `/f3service-demo/profile` → personal totals (hours + participation)

---

## Screen Requirements

### AO Dashboard (Lead)

- List of project cards in AO container
- Create project button
- Project status + membership counts
- Quick link to project detail

### Project Detail

- Full project metadata:
  - Name of Project
  - Start Time
  - Hours Working
  - Description
- Join/leave action
- Participant list + count

### Profile

- Total hours
- Events attended
- Participation history

---

## MVP Acceptance Criteria

1. AO lead can create a project with:
   - Name of Project
   - Start Time
   - Hours Working
   - Description
2. New project appears in AO container feed immediately.
3. PAX can open a project and join.
4. membership count is visible on both card and detail.
5. Hours worked can be represented in profile totals.

---

## Open UX Questions

1. Should **Hours Working** mean per-person expected hours or total event hours?
2. Should project creation require a linked org template, or allow free-form projects by default?
3. Should project membership support only join/leave in MVP, or later add waitlist?
4. Should AO lead be able to duplicate prior projects as templates?
