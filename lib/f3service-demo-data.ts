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
  f3Name: string;
  avatarUrl: string;
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
  slug?: string;
  opportunityId: string;
  aoId: string;
  title: string;
  startTime: string;
  endTime?: string;
  hoursWorking: number;
  description: string;
  whatYoullDo?: string;
  photoUrl: string;
  locationName: string;
  address?: string;
  postProjectCoffeeLocation?: string;
  googleMapsPlace: string;
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
    id: "ao-patriot",
    name: "Patriot",
    city: "Washington, DC",
    quarterlyGoalHours: 400,
    quarterlyGoalFunds: 0,
    createdAt: daysAgo(60),
  },
  {
    id: "ao-olympus",
    name: "Olympus",
    city: "Washington, DC",
    quarterlyGoalHours: 300,
    quarterlyGoalFunds: 0,
    createdAt: daysAgo(60),
  },
  {
    id: "ao-ignite",
    name: "Ignite",
    city: "Arlington, VA",
    quarterlyGoalHours: 250,
    quarterlyGoalFunds: 0,
    createdAt: daysAgo(60),
  },
];

export const users: User[] = [
  {
    id: "u-mid-1",
    name: "Avery Quinn",
    f3Name: "Ground Hog",
    avatarUrl: "https://randomuser.me/api/portraits/men/12.jpg",
    aoId: "ao-patriot",
    totalHours: 16,
    totalFundsRaised: 0,
    createdAt: daysAgo(45),
  },
  {
    id: "u-mid-2",
    name: "Jordan Reyes",
    f3Name: "Sling Shot",
    avatarUrl: "https://randomuser.me/api/portraits/men/24.jpg",
    aoId: "ao-patriot",
    totalHours: 16,
    totalFundsRaised: 0,
    createdAt: daysAgo(42),
  },
  {
    id: "u-mid-3",
    name: "Riley Park",
    f3Name: "Iron Mike",
    avatarUrl: "https://randomuser.me/api/portraits/men/31.jpg",
    aoId: "ao-patriot",
    totalHours: 16,
    totalFundsRaised: 0,
    createdAt: daysAgo(40),
  },
  {
    id: "u-mid-4",
    name: "Mason Lee",
    f3Name: "Torch",
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    aoId: "ao-olympus",
    totalHours: 16,
    totalFundsRaised: 0,
    createdAt: daysAgo(38),
  },
  {
    id: "u-mid-5",
    name: "Taylor Chen",
    f3Name: "Bridge",
    avatarUrl: "https://randomuser.me/api/portraits/men/53.jpg",
    aoId: "ao-olympus",
    totalHours: 0,
    totalFundsRaised: 0,
    createdAt: daysAgo(36),
  },
  {
    id: "u-south-1",
    name: "Noah Rivera",
    f3Name: "Anchor",
    avatarUrl: "https://randomuser.me/api/portraits/men/61.jpg",
    aoId: "ao-ignite",
    totalHours: 0,
    totalFundsRaised: 0,
    createdAt: daysAgo(35),
  },
  {
    id: "u-south-2",
    name: "Maya Patel",
    f3Name: "Falcon",
    avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    aoId: "ao-ignite",
    totalHours: 0,
    totalFundsRaised: 0,
    createdAt: daysAgo(33),
  },
  {
    id: "u-south-3",
    name: "Eli Brooks",
    f3Name: "Hammer",
    avatarUrl: "https://randomuser.me/api/portraits/men/71.jpg",
    aoId: "ao-ignite",
    totalHours: 0,
    totalFundsRaised: 0,
    createdAt: daysAgo(31),
  },
  {
    id: "u-south-4",
    name: "Marcus Cole",
    f3Name: "Delta",
    avatarUrl: "https://randomuser.me/api/portraits/men/79.jpg",
    aoId: "ao-ignite",
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
    location: "Rock Creek Park",
    isTemplate: true,
    createdAt: daysAgo(60),
  },
  {
    id: "opp-veterans",
    orgId: "org-veterans",
    title: "Food Sorting Volunteer Shift",
    description: "Template event for warehouse food sorting and prep.",
    location: "Arlington Food Assistance Center",
    isTemplate: true,
    createdAt: daysAgo(60),
  },
  {
    id: "opp-youth",
    orgId: "org-youth",
    title: "After School Mentoring",
    description: "Template event for recurring after-school mentoring sessions.",
    location: "Kenmore Middle School",
    isTemplate: true,
    createdAt: daysAgo(60),
  },
];

export const projects: F3Project[] = [
  {
    f3ProjectId: "f3proj-rock-creek-restoration",
    slug: "rock-creek-park-restoration",
    opportunityId: "opp-river",
    aoId: "ao-patriot",
    title: "Banneker Park Cleanup",
    startTime: "2026-03-02T08:00:00.000-05:00",
    endTime: "2026-03-02T11:00:00.000-05:00",
    hoursWorking: 3,
    description:
      "Join The Patriot for a local park cleanup focused on restoring Banneker Park and serving the surrounding neighborhood.",
    whatYoullDo:
      "Pick up litter, clear light debris, and help with basic beautification tasks around walking paths and common areas.",
    photoUrl:
      "https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&w=1600&q=80",
    locationName: "Banneker Park, Washington, DC",
    address: "2500 Georgia Ave NW, Washington, DC 20001",
    postProjectCoffeeLocation: "Compass Coffee - Shaw",
    googleMapsPlace: "Banneker Park Washington DC",
    isCompleted: false,
    createdAt: daysAgo(2),
  },
  {
    f3ProjectId: "f3proj-mid-river",
    opportunityId: "opp-river",
    aoId: "ao-patriot",
    title: "Patriot Creek Push",
    startTime: daysFromNow(10),
    hoursWorking: 4,
    description: "City river cleanup led by AO: Patriot with supplies provided on-site.",
    photoUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    locationName: "Rock Creek Park, Washington, DC",
    googleMapsPlace: "Rock Creek Park Washington DC",
    isCompleted: false,
    createdAt: daysFromNow(-10),
  },
  {
    f3ProjectId: "f3proj-south-serves",
    opportunityId: "opp-veterans",
    aoId: "ao-ignite",
    title: "Forge Serves Arlington",
    startTime: daysFromNow(7),
    hoursWorking: 4,
    description: "Warehouse sorting project supporting veteran family food distribution.",
    photoUrl:
      "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=1600&q=80",
    locationName: "Arlington Food Assistance Center, Arlington, VA",
    googleMapsPlace: "Arlington Food Assistance Center Arlington VA",
    isCompleted: false,
    createdAt: daysFromNow(-8),
  },
  {
    f3ProjectId: "f3proj-mid-mentor",
    opportunityId: "opp-youth",
    aoId: "ao-patriot",
    title: "Mentor Launch Night",
    startTime: daysAgo(20),
    hoursWorking: 8,
    description: "Kickoff mentoring night pairing AO HIMs with middle school students in Arlington.",
    photoUrl:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600&q=80",
    locationName: "Kenmore Middle School, Arlington, VA",
    googleMapsPlace: "Kenmore Middle School Arlington VA",
    isCompleted: true,
    createdAt: daysAgo(30),
  },
];

export const projectMemberships: ProjectMembership[] = [
  { id: "pm-demo-1", f3ProjectId: "f3proj-rock-creek-restoration", userId: "u-mid-1", hoursLogged: 0, joinedAt: daysAgo(1) },
  { id: "pm-demo-2", f3ProjectId: "f3proj-rock-creek-restoration", userId: "u-mid-2", hoursLogged: 0, joinedAt: daysAgo(1) },
  { id: "pm-demo-3", f3ProjectId: "f3proj-rock-creek-restoration", userId: "u-mid-3", hoursLogged: 0, joinedAt: daysAgo(1) },
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
      project.f3ProjectId === slugOrId ||
      project.slug === slugOrId ||
      slugify(project.title) === slugOrId
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
