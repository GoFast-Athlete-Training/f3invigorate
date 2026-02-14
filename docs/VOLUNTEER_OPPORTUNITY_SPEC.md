# Volunteer Opportunity Spec — What We're Asking For

**Context:** Opportunities come from **external organizations**

**Demo region:** Washington, DC / Arlington, VA (e.g. Travis Manion Foundation, Team RWB, local nonprofits), not internal F3 admin tasks (backblasts, social media, etc.). We need to capture what matters for PAX browsing and deciding to volunteer.

---

## Data We Collect / Display

### Organization (required)

- **Name** — e.g. "Travis Manion Foundation", "Team RWB"
- **Logo** (optional) — org logo for cards and detail
- **Website** (optional)
- **Location** (optional) — HQ or primary region (like runcrew org location)

### Mission (enum / multi-select)

What cause does this serve? PAX filter by mission.

Examples:
- Veterans
- Families of the Fallen
- Youth / Kids
- Homeless / Housing
- Environmental
- Disaster Relief
- Community / General

*Multi-select* so an opportunity can serve more than one (e.g. Veterans + Families).

### Volunteer Type (enum / single-select)

How often / how committed:

- **One-time** — single event or day
- **Recurring** — weekly/monthly commitment
- **Project-based** — defined project with end date
- **Async** — flexible, no set schedule

*(Maps to current `CommitmentType`.)*

### Location (like runcrew)

- **State** (optional)
- **City** (optional)
- **Remote** — yes/no (can do from anywhere)
- **Specific address** (optional) — for in-person events

Search/filter by location (e.g. "show me stuff in NC" or "remote only").

### What You'll Do (description)

- **Teaser** (short) — 1–2 sentences for the card
- **Full description** — longer "what you'll do" for the detail view:
  - Tasks
  - Time commitment (e.g. "2–3 hours/week")
  - Who you'll work with
  - Dates if applicable

---

## Card vs Detail (like runcrew)

### Card (list view)

- Org name + logo
- Title
- Mission tag(s)
- Volunteer type (One-time, Recurring, etc.)
- Location (city/state or "Remote")
- Teaser
- **See details →**

### Detail (click-through)

- Org (name, logo, website if present)
- Title
- Mission tag(s)
- Volunteer type
- Location (full)
- **What you'll do** — full description
- Apply / sign-in CTA

---

## Runcrew Parallels

| Runcrew | f3serve |
|---------|---------|
| Crew name + logo | Org name + logo |
| Purpose (Training, Social, etc.) | Mission (Veterans, Youth, etc.) |
| Location (state/city) | Location (state/city) |
| "View details" expand | "See details" → detail page |
| Join CTA | Apply / volunteer CTA |

---

## Current Schema vs Spec

| Spec field | Current schema | Notes |
|------------|----------------|------|
| Org | `Organization` | Has name, description, website, location. Add `logoUrl`? |
| Mission | Missing | New enum + relation (multi-select) |
| Volunteer type | `CommitmentType` | ✅ One-time, Recurring, Project-based, Async |
| Location | `location` (string), `isRemote` | Consider state/city split for filtering |
| Teaser | — | Could use `description` truncation or add `teaser` |
| Full description | `description` | ✅ |
| Category | `OpportunityCategory` | LABOR, MENTORSHIP, EVENTS, etc. — may overlap with Mission; consider consolidating or keeping both (type of work vs cause) |

---

## Open Questions

1. **Mission vs Category** — Keep both? Category = type of work (labor, mentorship, admin). Mission = cause (veterans, youth). Different dimensions.
2. **Org logo** — Add `logoUrl` to Organization? Needed for cards.
3. **State/city** — Split `location` into `state`, `city` for runcrew-style filtering?
4. **Teaser** — Separate field or just truncate `description` on cards?
