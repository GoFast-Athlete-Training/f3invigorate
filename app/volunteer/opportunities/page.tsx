import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function VolunteerOpportunitiesPage() {
  const opportunities = await prisma.volunteerOpportunity.findMany({
    where: { status: "OPEN" },
    include: { organization: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
      <p className="mt-2 text-gray-600">Browse and apply to volunteer opportunities.</p>
      <div className="mt-6 space-y-4">
        {opportunities.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            No open opportunities yet.
          </div>
        ) : (
          opportunities.map((opp) => (
            <Link
              key={opp.id}
              href={`/volunteer/opportunities/${opp.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-semibold text-gray-900">{opp.title}</h2>
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
    </div>
  );
}
