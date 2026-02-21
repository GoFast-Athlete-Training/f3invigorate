import Link from "next/link";

const cards = [
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
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10 max-w-4xl">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Welcome to the 3F Impact Hub
          </h1>
          <p className="mt-4 text-white/85">
            Welcome to the 3F Impact Hub where each AO is motivated to create projects in
            their local communities and give back.
          </p>
          <p className="mt-3 text-white/85">
            This hub also functions as a means for individuals to find opportunities (think
            Volunteer Match) and to raise funds for causes they personally support.
          </p>
          <p className="mt-3 text-white/85">
            Demo geography is focused on Washington, DC and Arlington, VA to reflect the
            F3 Capital region.
          </p>
          <p className="mt-3 text-white/70">
            This is a demo experience powered by fake data so you can get a feel for how it
            could work and provide meaningful feedback.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-white/20 bg-black/30 p-6 backdrop-blur-sm"
            >
              <h2 className="text-xl font-semibold text-white">{card.title}</h2>
              <p className="mt-2 text-sm text-white/75">{card.description}</p>
              <Link
                href={card.href}
                className="mt-5 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
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
