import Link from "next/link";
import { FAKE_OPPORTUNITIES } from "@/lib/volunteer-fake-data";
import OpportunityCardsContainer from "../OpportunityCardsContainer";

export const dynamic = "force-dynamic";

export default async function F3ServeOpportunitiesPage() {
  const displayList = FAKE_OPPORTUNITIES;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All opportunities</h1>
          <p className="mt-1 text-gray-600">
            Browse the outlook. Click through for full details.
          </p>
        </div>
        <Link href="/f3serve" className="text-sm text-blue-600 hover:underline shrink-0">
          ← Home
        </Link>
      </div>

      <OpportunityCardsContainer
        opportunities={displayList}
        emptyMessage="No open opportunities yet. Check back later or sign in to create one."
      />
    </div>
  );
}
