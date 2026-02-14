/**
 * Fake volunteer opportunities for public display when DB has none.
 * Use as fallback so the volunteer home always shows cards.
 */

export type DisplayOpportunity = {
  id: string | null; // null = fake, no detail page
  title: string;
  description: string;
  organizationName: string;
  category: string;
  commitmentType: string;
  isRemote: boolean;
  location?: string | null;
};

export const FAKE_OPPORTUNITIES: DisplayOpportunity[] = [
  {
    id: null,
    title: "Weekend Trail Cleanup",
    description:
      "Join F3 brothers for a Saturday morning trail cleanup at a local park. Gloves and bags provided. Great way to give back and get some fresh air.",
    organizationName: "F3 Capital Region",
    category: "LABOR",
    commitmentType: "ONE_TIME",
    isRemote: false,
    location: "Charlotte, NC",
  },
  {
    id: null,
    title: "Mentor a New PAX",
    description:
      "Help new F3 members get oriented: show them the ropes at workouts, answer questions, and be a friendly point of contact for their first 30 days.",
    organizationName: "F3 Nation",
    category: "MENTORSHIP",
    commitmentType: "RECURRING",
    isRemote: true,
  },
  {
    id: null,
    title: "Backblast & Social Media",
    description:
      "Write backblasts after workouts and help manage our region's social media. Flexible, async-friendly. No experience required.",
    organizationName: "F3 Capital Region",
    category: "ADMIN",
    commitmentType: "ASYNC",
    isRemote: true,
  },
  {
    id: null,
    title: "HIM Dinner Setup & Teardown",
    description:
      "One-time help setting up and breaking down our quarterly HIM dinner. Arrive early, stay a bit after—food and fellowship included.",
    organizationName: "F3 Capital Region",
    category: "EVENTS",
    commitmentType: "ONE_TIME",
    isRemote: false,
    location: "TBD",
  },
  {
    id: null,
    title: "Regional Leadership Board",
    description:
      "Serve on the regional board: help set strategy, approve new AOs, and support site Qs. Monthly meetings plus occasional async decisions.",
    organizationName: "F3 Capital Region",
    category: "BOARD",
    commitmentType: "RECURRING",
    isRemote: true,
  },
  {
    id: null,
    title: "Website & Signup Tools",
    description:
      "Light technical help: update the regional website, tweak signup forms, or integrate with our communication tools. Project-based, remote.",
    organizationName: "F3 Nation",
    category: "TECHNICAL",
    commitmentType: "PROJECT_BASED",
    isRemote: true,
  },
];
