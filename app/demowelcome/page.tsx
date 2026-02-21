import Link from "next/link";

const cards = [
  {
    title: "Example Profile",
    description:
      "See how individual users will view their stats and stay engaged.",
    href: "/profile-example",
    cta: "View Profile Example",
  },
  {
    title: "AO-organized Projects",
    description:
      "Hydrates one example project container so you can see the AO project flow, who is joining, and detail behavior.",
    href: "/project/rock-creek-park-restoration",
    cta: "Open Example Project Container",
  },
  {
    title: "See Individual Volunteer Match",
    description:
      "Discover opportunities like Volunteer Match and explore templates from mission-aligned organizations.",
    href: "/f3serve",
    cta: "Open Volunteer Match",
  },
  {
    title: "See Individual Cause Rallying",
    description:
      "Explore cause-focused fundraising and personal impact campaigns for local and national needs.",
    href: "/cause-rallying",
    cta: "Open Cause Rallying",
  },
  {
    title: "See AO Leaderboard",
    description:
      "Compare AO service activity, hours, and participation momentum across the region.",
    href: "/ao-leaderboard",
    cta: "Open AO Leaderboard",
  },
];

export default function DemoWelcomePage() {
  return (
    <main className="min-h-screen overflow-auto bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-7">
        <div className="mb-5 max-w-5xl">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Welcome to the 3F Impact Hub
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            Welcome to the 3F Impact Hub where each AO is motivated to create projects in
            their local communities and give back.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            This hub also functions as a means for individuals to find opportunities (think
            Volunteer Match) and to raise funds for causes they personally support.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            Demo geography is focused on Washington, DC and Arlington, VA to reflect the
            F3 Capital region.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">
            This is a demo experience powered by fake data so you can get a feel for how it
            could work and provide meaningful feedback.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-white/20 bg-black/30 p-4 backdrop-blur-sm sm:p-5"
            >
              <h2 className="text-lg font-semibold text-white sm:text-xl">{card.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-white/75">{card.description}</p>
              <Link
                href={card.href}
                className="mt-3 inline-flex rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                {card.cta}
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
