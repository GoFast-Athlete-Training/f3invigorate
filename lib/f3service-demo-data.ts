export type OrgCategory = "YOUTH" | "VETERANS" | "FAITH" | "COMMUNITY" | "HEALTH";
export type ActivationStatus = "UPCOMING" | "COMPLETED";
export type ParticipantStatus = "GOING" | "ATTENDED";

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

export type Activation = {
  id: string;
  opportunityId: string;
  aoId: string;
  title: string;
  date: string;
  goalHeadcount: number;
  goalHours: number;
  status: ActivationStatus;
  createdAt: string;
};

export type Participant = {
  id: string;
  activationId: string;
  userId: string;
  status: ParticipantStatus;
  hoursLogged: number;
  createdAt: string;
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

export const activations: Activation[] = [
  {
    id: "act-mid-river",
    opportunityId: "opp-river",
    aoId: "ao-midtown",
    title: "Midtown River Push",
    date: daysFromNow(10),
    goalHeadcount: 15,
    goalHours: 60,
    status: "UPCOMING",
    createdAt: daysFromNow(-10),
  },
  {
    id: "act-south-serves",
    opportunityId: "opp-veterans",
    aoId: "ao-southside",
    title: "Southside Serves",
    date: daysFromNow(7),
    goalHeadcount: 10,
    goalHours: 40,
    status: "UPCOMING",
    createdAt: daysFromNow(-8),
  },
  {
    id: "act-mid-mentor",
    opportunityId: "opp-youth",
    aoId: "ao-midtown",
    title: "Mentor Launch Night",
    date: daysAgo(20),
    goalHeadcount: 8,
    goalHours: 32,
    status: "COMPLETED",
    createdAt: daysAgo(30),
  },
];

export const participants: Participant[] = [
  { id: "p-1", activationId: "act-mid-river", userId: "u-mid-1", status: "GOING", hoursLogged: 0, createdAt: daysAgo(1) },
  { id: "p-2", activationId: "act-mid-river", userId: "u-mid-2", status: "GOING", hoursLogged: 0, createdAt: daysAgo(1) },
  { id: "p-3", activationId: "act-mid-river", userId: "u-mid-3", status: "GOING", hoursLogged: 0, createdAt: daysAgo(1) },
  { id: "p-4", activationId: "act-south-serves", userId: "u-south-1", status: "GOING", hoursLogged: 0, createdAt: daysAgo(1) },
  { id: "p-5", activationId: "act-south-serves", userId: "u-south-2", status: "GOING", hoursLogged: 0, createdAt: daysAgo(1) },
  { id: "p-6", activationId: "act-mid-mentor", userId: "u-mid-1", status: "ATTENDED", hoursLogged: 8, createdAt: daysAgo(20) },
  { id: "p-7", activationId: "act-mid-mentor", userId: "u-mid-2", status: "ATTENDED", hoursLogged: 8, createdAt: daysAgo(20) },
  { id: "p-8", activationId: "act-mid-mentor", userId: "u-mid-3", status: "ATTENDED", hoursLogged: 8, createdAt: daysAgo(20) },
  { id: "p-9", activationId: "act-mid-mentor", userId: "u-mid-4", status: "ATTENDED", hoursLogged: 8, createdAt: daysAgo(20) },
];

export const getAo = (id: string) => aos.find((ao) => ao.id === id);
export const getUser = (id: string) => users.find((user) => user.id === id);
export const getOrg = (id: string) => orgs.find((org) => org.id === id);
export const getOpportunity = (id: string) =>
  opportunities.find((opp) => opp.id === id);
export const getActivation = (id: string) =>
  activations.find((activation) => activation.id === id);
export const getActivationBySlug = (slugOrId: string) =>
  activations.find(
    (activation) =>
      activation.id === slugOrId || slugify(activation.title) === slugOrId
  );

export const getParticipantsForActivation = (activationId: string) =>
  participants.filter((p) => p.activationId === activationId);

export const getActivationsForAo = (aoId: string) =>
  activations.filter((activation) => activation.aoId === aoId);

export const getUsersForAo = (aoId: string) => users.filter((user) => user.aoId === aoId);

export const getActivationsForTemplate = (opportunityId: string) =>
  activations.filter((activation) => activation.opportunityId === opportunityId);
export const getOrgBySlug = (slugOrId: string) =>
  orgs.find((org) => org.id === slugOrId || slugify(org.name) === slugOrId);
export const getOpportunityBySlug = (slugOrId: string) =>
  opportunities.find(
    (opportunity) =>
      opportunity.id === slugOrId || slugify(opportunity.title) === slugOrId
  );

export const getAttendanceByActivation = (activationId: string) => {
  const rows = getParticipantsForActivation(activationId);
  const going = rows.filter((row) => row.status === "GOING");
  const attended = rows.filter((row) => row.status === "ATTENDED");
  const totalHours = rows.reduce((sum, row) => sum + row.hoursLogged, 0);
  return {
    rows,
    going,
    attended,
    totalCount: rows.length,
    totalHours,
  };
};

export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
