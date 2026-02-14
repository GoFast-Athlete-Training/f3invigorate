/**
 * Fake volunteer opportunities for public display when DB has none.
 * Use as fallback so the volunteer home always shows cards.
 */

export type DisplayOpportunity = {
  id: string | null; // null = fake; detail via outlook slug
  slug?: string | null; // for fake: /f3serve/opportunities/outlook/[slug]
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
    slug: "travis-manion-character-does-matter",
    title: "Character Does Matter Mentor",
    description:
      "Lead character development sessions with youth, drawing on leadership principles from fallen heroes. Training provided. Help shape the next generation of leaders.",
    organizationName: "Travis Manion Foundation",
    category: "MENTORSHIP",
    commitmentType: "RECURRING",
    isRemote: false,
    location: "Arlington, VA",
  },
  {
    id: null,
    slug: "travis-manion-community-service",
    title: "Community Service Day Volunteer",
    description:
      "Join TMF and veterans for a day of service—park cleanup, facility repairs, or neighborhood projects. One Saturday, big impact.",
    organizationName: "Travis Manion Foundation",
    category: "LABOR",
    commitmentType: "ONE_TIME",
    isRemote: false,
    location: "Washington, DC",
  },
  {
    id: null,
    slug: "shelter-meal-prep",
    title: "Meal Prep & Serve",
    description:
      "Help prep and serve meals at our overnight shelter. Shifts available breakfast, lunch, or dinner. Gloves and training provided. No experience needed.",
    organizationName: "Arlington Street People's Assistance Network",
    category: "LABOR",
    commitmentType: "RECURRING",
    isRemote: false,
    location: "Arlington, VA",
  },
  {
    id: null,
    slug: "dc-soup-kitchen-serve",
    title: "Saturday Soup Kitchen Server",
    description:
      "Serve meals to neighbors in need. Set up, serve, and clean up. Friendly faces welcome. One-time or recurring—your choice.",
    organizationName: "Miriam's Kitchen",
    category: "LABOR",
    commitmentType: "ONE_TIME",
    isRemote: false,
    location: "Washington, DC",
  },
  {
    id: null,
    slug: "shelter-intake-volunteer",
    title: "Intake & Welcome Volunteer",
    description:
      "Greet guests, help with check-in, and connect people to services. Training provided. Flexible weekday or weekend shifts.",
    organizationName: "Community of Hope",
    category: "ADMIN",
    commitmentType: "RECURRING",
    isRemote: false,
    location: "Washington, DC",
  },
  {
    id: null,
    slug: "veteran-mentorship-remote",
    title: "Veteran-to-Veteran Mentor",
    description:
      "Support transitioning veterans one-on-one. Phone or video. Share your experience, help with resumes, job search, or just listen. Flexible, remote.",
    organizationName: "Travis Manion Foundation",
    category: "MENTORSHIP",
    commitmentType: "RECURRING",
    isRemote: true,
  },
];
