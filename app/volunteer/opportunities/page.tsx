import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FAKE_OPPORTUNITIES, type DisplayOpportunity } from "@/lib/volunteer-fake-data";
import OpportunityCard from "../OpportunityCard";

export const dynamic = "force-dynamic";

function toDisplay(opp: {
  id: string;
  title: string;
  description: string;
  category: string;
  commitmentType: string;
  isRemote: boolean;
  location: string | null;
  organization: { name: string };
}): DisplayOpportunity {
  return {
    id: opp.id,
    title: opp.title,
    description: opp.description,
    organizationName: opp.organization.name,
    category: opp.category,
    commitmentType: opp.commitmentType,
    isRemote: opp.isRemote,
    location: opp.location,
  };
}

export default async function VolunteerOpportunitiesPage() {
  const real = await prisma.volunteerOpportunity.findMany({
    where: { status: "OPEN" },
    include: { organization: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const displayList: DisplayOpportunity[] =
    real.length > 0 ? real.map(toDisplay) : FAKE_OPPORTUNITIES;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All opportunities</h1>
          <p className="mt-1 text-gray-600">
            Browse and apply to volunteer opportunities. Sign in to apply.
          </p>
        </div>
        <Link
          href="/volunteer"
          className="text-sm text-blue-600 hover:underline shrink-0"
        >
          ← Home
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayList.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            No open opportunities yet. Check back later or sign in to create one.
          </div>
        ) : (
          displayList.map((opp, i) => (
            <OpportunityCard key={opp.id ?? `fake-${i}`} opp={opp} />
          ))
        )}
      </div>
    </div>
  );
}
