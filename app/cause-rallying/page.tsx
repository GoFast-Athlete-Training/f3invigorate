import Link from "next/link";
import { Heart, Users, Share2, ChevronRight } from "lucide-react";

const demoCauses = [
  {
    id: 1,
    organizer: {
      name: "Avictor Martinez",
      initials: "AM",
      role: "F3 PAX · Capital Region",
      avatarColor: "bg-red-600",
    },
    title: "Ben-David Warner Concert for Contigo Youth Club",
    story:
      "I support Contigo Youth Club, which runs holistic after-school programs and summer camps for at-risk students in the Bailey's Crossroads area. The target demographic is largely Hispanic, lower-income families — kids who lack both mentors and access to extracurricular enrichment.\n\nThis benefit concert features Americana/Irish/Folk artist Ben-David Warner. 100% of your $20 admission, beer and wine purchases, and raffle sales go directly to the kids.",
    coverGradient: "from-red-700 to-red-900",
    eventDetails: "Sat Feb 21 · 7–9 PM · St. James Catholic Church, Heller Hall, Falls Church, VA",
    goal: 5000,
    raised: 1850,
    donors: 34,
    daysLeft: 1,
    perks: [
      {
        amount: 20,
        label: "Admission + Good Vibes",
        description: "Event entry + helping a kid get a mentor.",
      },
      {
        amount: 50,
        label: "Supporter",
        description: "Entry + your name listed as a cause champion.",
      },
      {
        amount: 100,
        label: "Champion",
        description: "Entry + shoutout on stage + raffle ticket.",
      },
    ],
    impact: [
      { stat: "1 mentor", detail: "matched per $150 raised" },
      { stat: "12 kids", detail: "enrolled in summer STEM camp" },
      { stat: "100%", detail: "of funds go directly to students" },
    ],
  },
  {
    id: 2,
    organizer: {
      name: "Duke Callahan",
      initials: "DC",
      role: "F3 PAX · Capital Region",
      avatarColor: "bg-blue-700",
    },
    title: "River Cleanup Equipment Fund",
    story:
      "Our crew has been hitting the Potomac trails every month, but we need proper equipment — gloves, bags, grabbers, and a few kayaks to reach the hard spots. Every dollar goes toward gear that makes our cleanups more effective and safer for volunteers.",
    coverGradient: "from-blue-700 to-teal-800",
    eventDetails: "Ongoing · Potomac River Corridor, Northern Virginia",
    goal: 3000,
    raised: 1120,
    donors: 19,
    daysLeft: 14,
    perks: [
      {
        amount: 25,
        label: "Gear Backer",
        description: "Funds a pair of gloves and cleanup bags for one session.",
      },
      {
        amount: 75,
        label: "Trail Keeper",
        description: "Funds a grabber kit + name on our gear bag.",
      },
      {
        amount: 200,
        label: "River Guardian",
        description: "Named sponsor + invite to our next launch cleanup.",
      },
    ],
    impact: [
      { stat: "800 lbs", detail: "of trash removed last year" },
      { stat: "3 miles", detail: "of trail adopted for monthly cleanup" },
      { stat: "40+", detail: "volunteers mobilized each quarter" },
    ],
  },
  {
    id: 3,
    organizer: {
      name: "Stonewall Jackson",
      initials: "SJ",
      role: "F3 PAX · Capital Region",
      avatarColor: "bg-green-700",
    },
    title: "Youth Mentorship Supplies Drive",
    story:
      "We're collecting school supplies, backpacks, and sports gear for underserved youth in the area. My PAX brothers and I are rallying our network to close the gap for kids who show up to school without the basics they need to compete and succeed.",
    coverGradient: "from-green-700 to-emerald-900",
    eventDetails: "Drop-off by Mar 15 · Multiple locations, DC Metro Area",
    goal: 2500,
    raised: 930,
    donors: 22,
    daysLeft: 23,
    perks: [
      { amount: 15, label: "Backer", description: "Covers a backpack for one student." },
      {
        amount: 40,
        label: "Booster",
        description: "Full school supply kit for one student.",
      },
      {
        amount: 100,
        label: "Mentor Match",
        description: "Supplies kit + connects one student to a PAX mentor.",
      },
    ],
    impact: [
      { stat: "60 kids", detail: "served last school year" },
      { stat: "15 PAX", detail: "actively mentoring youth weekly" },
      { stat: "$40", detail: "covers one student's full supply kit" },
    ],
  },
];

function ProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const pct = Math.min(Math.round((raised / goal) * 100), 100);
  return (
    <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-green-500 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function CauseCard({ cause }: { cause: (typeof demoCauses)[0] }) {
  const pct = Math.min(Math.round((cause.raised / cause.goal) * 100), 100);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Cover */}
      <div className={`relative h-44 bg-gradient-to-br ${cause.coverGradient}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Cause Rally
          </p>
          <h2 className="mt-1 text-lg font-bold leading-snug text-white drop-shadow">
            {cause.title}
          </h2>
        </div>
        {/* share icon */}
        <button className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm hover:bg-white/30">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5">
        {/* Organizer */}
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${cause.organizer.avatarColor}`}
          >
            {cause.organizer.initials}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{cause.organizer.name}</p>
            <p className="text-xs text-gray-500">{cause.organizer.role}</p>
          </div>
        </div>

        {/* Event detail */}
        <p className="mt-3 text-xs text-gray-500">{cause.eventDetails}</p>

        {/* Story snippet */}
        <p className="mt-3 line-clamp-3 text-sm text-gray-700">{cause.story.split("\n")[0]}</p>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-end justify-between">
            <span className="text-xl font-bold text-gray-900">
              ${cause.raised.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">of ${cause.goal.toLocaleString()} goal</span>
          </div>
          <ProgressBar raised={cause.raised} goal={cause.goal} />
          <div className="mt-1.5 flex gap-4 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{pct}% funded</span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {cause.donors} donors
            </span>
            <span>{cause.daysLeft}d left</span>
          </div>
        </div>

        {/* Donate CTA */}
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 active:bg-green-800">
          <Heart className="h-4 w-4" /> Donate Now
        </button>

        {/* Perks */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            What you get
          </p>
          <div className="flex flex-col gap-2">
            {cause.perks.map((perk) => (
              <div
                key={perk.label}
                className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
              >
                <span className="mt-0.5 shrink-0 rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                  ${perk.amount}+
                </span>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{perk.label}</p>
                  <p className="text-xs text-gray-500">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            How it impacts
          </p>
          <div className="grid grid-cols-3 gap-2">
            {cause.impact.map((item) => (
              <div
                key={item.stat}
                className="rounded-lg bg-red-50 px-2 py-2.5 text-center"
              >
                <p className="text-base font-bold text-red-700">{item.stat}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full story link */}
        <button className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
          Read full story <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}

export default function CauseRallyingPage() {
  const totalRaised = demoCauses.reduce((s, c) => s + c.raised, 0);
  const totalDonors = demoCauses.reduce((s, c) => s + c.donors, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
            F3 Capital Region
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Cause Rallying</h1>
          <p className="mt-1 text-sm text-gray-500">
            PAX-led campaigns making a real difference in the community.
          </p>

          {/* Totals bar */}
          <div className="mt-4 flex flex-wrap gap-6">
            <div>
              <p className="text-xl font-bold text-gray-900">${totalRaised.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total raised</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{totalDonors}</p>
              <p className="text-xs text-gray-500">Total donors</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{demoCauses.length}</p>
              <p className="text-xs text-gray-500">Active causes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoCauses.map((cause) => (
            <CauseCard key={cause.id} cause={cause} />
          ))}
        </div>

        <Link
          href="/demowelcome"
          className="mt-8 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          ← Back to 3F Impact Hub
        </Link>
      </div>
    </main>
  );
}
