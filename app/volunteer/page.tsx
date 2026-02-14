import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function VolunteerFrontDoor() {
  const opportunities = await prisma.volunteerOpportunity.findMany({
    where: { status: "OPEN" },
    include: { organization: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            F3 Volunteer Match
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Find volunteer opportunities and give back to your community.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/volunteer/opportunities"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              See opportunities
            </Link>
            <Link
              href="/login?next=/volunteer"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-10 sm:px-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Volunteer opportunities
        </h2>
        <div className="space-y-4">
          {opportunities.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              <p>No open opportunities yet.</p>
              <p className="mt-1 text-sm">Check back later or sign in to create one.</p>
            </div>
          ) : (
            opportunities.map((opp) => (
              <Link
                key={opp.id}
                href={`/volunteer/opportunities/${opp.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">{opp.title}</h3>
                  <span className="text-sm text-gray-500">{opp.organization.name}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{opp.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {opp.category}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {opp.commitmentType}
                  </span>
                  {opp.isRemote && (
                    <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Remote
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
        {opportunities.length > 0 && (
          <div className="mt-6 text-center">
            <Link
              href="/volunteer/opportunities"
              className="text-blue-600 font-medium hover:underline"
            >
              View all opportunities →
            </Link>
          </div>
        )}
      </section>

      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center text-sm text-gray-500">
          <span>F3 Volunteer Match</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-gray-700">
              Invigorate
            </Link>
            <Link href="/volunteer/opportunities" className="hover:text-gray-700">
              Opportunities
            </Link>
            <Link href="/login?next=/volunteer" className="hover:text-gray-700">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
