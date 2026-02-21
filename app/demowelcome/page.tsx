import Link from "next/link";

const cards = [
  {
    title: "See AO Service",
    description:
      "Browse community projects run by each AO, view who is joining, and open project details.",
    href: "/project/clean-up-demo",
    cta: "Open AO Service",
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
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Welcome to the 3F Impact Hub
          </h1>
          <p className="mt-4 text-gray-700">
            Welcome to the 3F Impact Hub where each AO is motivated to create projects in
            their local communities and give back.
          </p>
          <p className="mt-3 text-gray-700">
            This hub also functions as a means for individuals to find opportunities (think
            Volunteer Match) and to raise funds for causes they personally support.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900">{card.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{card.description}</p>
              <Link
                href={card.href}
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
