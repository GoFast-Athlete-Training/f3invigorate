export type OrgCategory = "YOUTH" | "VETERANS" | "FAITH" | "COMMUNITY" | "HEALTH";

export type Ao = {
  id: string;
  name: string;
  city: string;
  quarterlyGoalHours: number;
  quarterlyGoalFunds: number;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  aoId: string;
  totalHours: number;
  totalFundsRaised: number;
  createdAt: string;
};

export type Org = {
  id: string;
  name: string;
  mission: string;
  category: OrgCategory;
  website: string;
  createdAt: string;
};

export type OpportunityTemplate = {
  id: string;
  orgId: string;
  title: string;
  description: string;
  location: string;
  isTemplate: boolean;
  createdAt: string;
};

export type F3Project = {
  f3ProjectId: string;
  opportunityId: string;
  aoId: string;
  title: string;
  startTime: string;
  hoursWorking: number;
  description: string;
  isCompleted: boolean;
  createdAt: string;
};

export type ProjectMembership = {
  id: string;
  f3ProjectId: string;
  userId: string;
  hoursLogged: number;
  joinedAt: string;
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const now = new Date();

const daysFromNow = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const daysAgo = (days: number) => daysFromNow(-days);

export const aos: Ao[] = [
  {
    id: "ao-midtown",
    name: "Midtown AO",
    city: "Chicago",
    quarterlyGoalHours: 400,
    quarterlyGoalFunds: 0,
    createdAt: daysAgo(60),
  },
  {
    id: "ao-southside",
    name: "Southside AO",
    city: "Chicago",
    quarterlyGoalHours: 250,
    quarterlyGoalFunds: 0,
    createdAt: daysAgo(60),
  },
];

export const users: User[] = [
  {
    id: "u-mid-1",
    name: "Avery Quinn",
    email: "avery@example.org",
    aoId: "ao-midtown",
    totalHours: 16,
    totalFundsRaised: 0,
    createdAt: daysAgo(45),
  },
  {
    id: "u-mid-2",
    name: "Jordan Reyes",
    email: "jordan@example.org",
    aoId: "ao-midtown",
    totalHours: 16,
    totalFundsRaised: 0,
    createdAt: daysAgo(42),
  },
  {
    id: "u-mid-3",
    name: "Riley Park",
    email: "riley@example.org",
    aoId: "ao-midtown",
    totalHours: 16,
    totalFundsRaised: 0,
    createdAt: daysAgo(40),
  },
  {
    id: "u-mid-4",
    name: "Mason Lee",
    email: "mason@example.org",
    aoId: "ao-midtown",
    totalHours: 16,
    totalFundsRaised: 0,
    createdAt: daysAgo(38),
  },
  {
    id: "u-mid-5",
    name: "Taylor Chen",
    email: "taylor@example.org",
    aoId: "ao-midtown",
    totalHours: 0,
    totalFundsRaised: 0,
    createdAt: daysAgo(36),
  },
  {
    id: "u-south-1",
    name: "Noah Rivera",
    email: "noah@example.org",
    aoId: "ao-southside",
    totalHours: 0,
    totalFundsRaised: 0,
    createdAt: daysAgo(35),
  },
  {
    id: "u-south-2",
    name: "Maya Patel",
    email: "maya@example.org",
    aoId: "ao-southside",
    totalHours: 0,
    totalFundsRaised: 0,
    createdAt: daysAgo(33),
  },
  {
    id: "u-south-3",
    name: "Eli Brooks",
    email: "eli@example.org",
    aoId: "ao-southside",
    totalHours: 0,
    totalFundsRaised: 0,
    createdAt: daysAgo(31),
  },
  {
    id: "u-south-4",
    name: "Samira Khan",
    email: "samira@example.org",
    aoId: "ao-southside",
    totalHours: 0,
    totalFundsRaised: 0,
    createdAt: daysAgo(30),
  },
];

export const orgs: Org[] = [
  {
    id: "org-river",
    name: "River City Cleanup",
    mission: "Keep neighborhood waterways clean and make service tangible for local AO members.",
    category: "COMMUNITY",
    website: "https://example.org/river-city-cleanup",
    createdAt: daysAgo(90),
  },
  {
    id: "org-veterans",
    name: "Veterans Food Bank",
    mission: "Sort and distribute food for veterans and families in need.",
    category: "VETERANS",
    website: "https://example.org/veterans-food-bank",
    createdAt: daysAgo(90),
  },
  {
    id: "org-youth",
    name: "Youth Mentorship Alliance",
    mission: "Connect adults and teens to create steady, local mentorship.",
    category: "YOUTH",
    website: "https://example.org/youth-mentorship-alliance",
    createdAt: daysAgo(90),
  },
];

export const opportunities: OpportunityTemplate[] = [
  {
    id: "opp-river",
    orgId: "org-river",
    title: "Monthly River Cleanup",
    description: "Template cleanup event for a river neighborhood service project.",
    location: "Riverside Park",
    isTemplate: true,
    createdAt: daysAgo(60),
  },
  {
    id: "opp-veterans",
    orgId: "org-veterans",
    title: "Food Sorting Volunteer Shift",
    description: "Template event for warehouse food sorting and prep.",
    location: "Main Warehouse",
    isTemplate: true,
    createdAt: daysAgo(60),
  },
  {
    id: "opp-youth",
    orgId: "org-youth",
    title: "After School Mentoring",
    description: "Template event for recurring after-school mentoring sessions.",
    location: "Lincoln Middle School",
    isTemplate: true,
    createdAt: daysAgo(60),
  },
];

export const projects: F3Project[] = [
  {
    f3ProjectId: "f3proj-clean-up-demo",
    opportunityId: "opp-river",
    aoId: "ao-midtown",
    title: "Clean Up Demo",
    startTime: daysFromNow(3),
    hoursWorking: 3,
    description:
      "Public demo project page for F3 Capital Impact. Join this neighborhood cleanup effort and bring gloves and water.",
    isCompleted: false,
    createdAt: daysAgo(2),
  },
  {
    f3ProjectId: "f3proj-mid-river",
    opportunityId: "opp-river",
    aoId: "ao-midtown",
    title: "Midtown River Push",
    startTime: daysFromNow(10),
    hoursWorking: 4,
    description: "City river cleanup led by Midtown AO with supplies provided on-site.",
    isCompleted: false,
    createdAt: daysFromNow(-10),
  },
  {
    f3ProjectId: "f3proj-south-serves",
    opportunityId: "opp-veterans",
    aoId: "ao-southside",
    title: "Southside Serves",
    startTime: daysFromNow(7),
    hoursWorking: 4,
    description: "Warehouse sorting project supporting veteran family food distribution.",
    isCompleted: false,
    createdAt: daysFromNow(-8),
  },
  {
    f3ProjectId: "f3proj-mid-mentor",
    opportunityId: "opp-youth",
    aoId: "ao-midtown",
    title: "Mentor Launch Night",
    startTime: daysAgo(20),
    hoursWorking: 8,
    description: "Kickoff mentoring night pairing Midtown HIMs with middle school students.",
    isCompleted: true,
    createdAt: daysAgo(30),
  },
];

export const projectMemberships: ProjectMembership[] = [
  { id: "pm-demo-1", f3ProjectId: "f3proj-clean-up-demo", userId: "u-mid-1", hoursLogged: 0, joinedAt: daysAgo(1) },
  { id: "pm-demo-2", f3ProjectId: "f3proj-clean-up-demo", userId: "u-mid-2", hoursLogged: 0, joinedAt: daysAgo(1) },
  { id: "pm-demo-3", f3ProjectId: "f3proj-clean-up-demo", userId: "u-mid-3", hoursLogged: 0, joinedAt: daysAgo(1) },
  { id: "pm-1", f3ProjectId: "f3proj-mid-river", userId: "u-mid-1", hoursLogged: 0, joinedAt: daysAgo(1) },
  { id: "pm-2", f3ProjectId: "f3proj-mid-river", userId: "u-mid-2", hoursLogged: 0, joinedAt: daysAgo(1) },
  { id: "pm-3", f3ProjectId: "f3proj-mid-river", userId: "u-mid-3", hoursLogged: 0, joinedAt: daysAgo(1) },
  { id: "pm-4", f3ProjectId: "f3proj-south-serves", userId: "u-south-1", hoursLogged: 0, joinedAt: daysAgo(1) },
  { id: "pm-5", f3ProjectId: "f3proj-south-serves", userId: "u-south-2", hoursLogged: 0, joinedAt: daysAgo(1) },
  { id: "pm-6", f3ProjectId: "f3proj-mid-mentor", userId: "u-mid-1", hoursLogged: 8, joinedAt: daysAgo(20) },
  { id: "pm-7", f3ProjectId: "f3proj-mid-mentor", userId: "u-mid-2", hoursLogged: 8, joinedAt: daysAgo(20) },
  { id: "pm-8", f3ProjectId: "f3proj-mid-mentor", userId: "u-mid-3", hoursLogged: 8, joinedAt: daysAgo(20) },
  { id: "pm-9", f3ProjectId: "f3proj-mid-mentor", userId: "u-mid-4", hoursLogged: 8, joinedAt: daysAgo(20) },
];

export const getAo = (id: string) => aos.find((ao) => ao.id === id);
export const getUser = (id: string) => users.find((user) => user.id === id);
export const getOrg = (id: string) => orgs.find((org) => org.id === id);
export const getOpportunity = (id: string) =>
  opportunities.find((opp) => opp.id === id);
export const getF3Project = (f3ProjectId: string) =>
  projects.find((project) => project.f3ProjectId === f3ProjectId);
export const getF3ProjectBySlug = (slugOrId: string) =>
  projects.find(
    (project) =>
      project.f3ProjectId === slugOrId || slugify(project.title) === slugOrId
  );

export const getMembershipsForProject = (f3ProjectId: string) =>
  projectMemberships.filter((membership) => membership.f3ProjectId === f3ProjectId);

export const getProjectsForAo = (aoId: string) =>
  projects.filter((project) => project.aoId === aoId);

export const getUsersForAo = (aoId: string) => users.filter((user) => user.aoId === aoId);

export const getProjectsForTemplate = (opportunityId: string) =>
  projects.filter((project) => project.opportunityId === opportunityId);
export const getOrgBySlug = (slugOrId: string) =>
  orgs.find((org) => org.id === slugOrId || slugify(org.name) === slugOrId);
export const getOpportunityBySlug = (slugOrId: string) =>
  opportunities.find(
    (opportunity) =>
      opportunity.id === slugOrId || slugify(opportunity.title) === slugOrId
  );

export const getMembershipSummary = (f3ProjectId: string) => {
  const rows = getMembershipsForProject(f3ProjectId);
  const totalHours = rows.reduce((sum, row) => sum + row.hoursLogged, 0);
  const membersWithLoggedHours = rows.filter((row) => row.hoursLogged > 0).length;
  return {
    rows,
    totalMembers: rows.length,
    membersWithLoggedHours,
    totalHours,
  };
};

export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
