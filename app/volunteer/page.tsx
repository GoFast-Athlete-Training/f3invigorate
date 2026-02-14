import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FAKE_OPPORTUNITIES, type DisplayOpportunity } from "@/lib/volunteer-fake-data";
import OpportunityCard from "./OpportunityCard";

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

export default async function VolunteerFrontDoor() {
  const real = await prisma.volunteerOpportunity.findMany({
    where: { status: "OPEN" },
    include: { organization: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  const displayList: DisplayOpportunity[] =
    real.length > 0 ? real.map(toDisplay) : FAKE_OPPORTUNITIES;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Volunteer opportunities
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Find ways to give back with F3. Browse below or sign in to apply and track your applications.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/volunteer/opportunities"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              See all opportunities
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

      <section className="max-w-5xl mx-auto px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayList.map((opp, i) => (
            <OpportunityCard key={opp.id ?? `fake-${i}`} opp={opp} />
          ))}
        </div>
        {displayList.length > 0 && (
          <div className="mt-8 text-center">
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
        <div className="max-w-5xl mx-auto px-4 py-6 flex justify-between items-center text-sm text-gray-500">
          <span>F3 Volunteer</span>
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
