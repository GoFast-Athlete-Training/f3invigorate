import Link from "next/link";

const demoCauses = [
  {
    title: "Support Veteran Family Food Kits",
    goal: "$5,000",
    raised: "$1,850",
  },
  {
    title: "Youth Mentorship Supplies Drive",
    goal: "$2,500",
    raised: "$930",
  },
  {
    title: "River Cleanup Equipment Fund",
    goal: "$3,000",
    raised: "$1,120",
  },
];

export default function CauseRallyingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900">Individual Cause Rallying</h1>
        <p className="mt-2 text-gray-600">
          Demo view for cause-based fundraising and personal rally campaigns.
        </p>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {demoCauses.map((cause) => (
            <article key={cause.title} className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-gray-900">{cause.title}</h2>
              <p className="mt-3 text-sm text-gray-600">Goal: {cause.goal}</p>
              <p className="text-sm text-gray-600">Raised: {cause.raised}</p>
            </article>
          ))}
        </section>

        <Link href="/demowelcome" className="mt-6 inline-flex text-blue-600 hover:underline">
          ← Back to 3F Impact Hub
        </Link>
      </div>
    </main>
  );
}
