import Link from "next/link";
import { FAKE_OPPORTUNITIES } from "@/lib/volunteer-fake-data";
import OpportunityCardsContainer from "./OpportunityCardsContainer";

export const dynamic = "force-dynamic";

export default async function F3ServePage() {
  const displayList = FAKE_OPPORTUNITIES;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 -mx-4 -mt-8 px-4 py-10 mb-8 sm:mx-0 sm:px-0">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Volunteer opportunity outlook
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Browse ways to give back with F3. Click any opportunity for details.
          </p>
          <div className="mt-6">
            <Link
              href="/f3serve/opportunities"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              See all opportunities
            </Link>
          </div>
        </div>
      </header>

      <section>
        <OpportunityCardsContainer opportunities={displayList} />
        {displayList.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/f3serve/opportunities"
              className="text-blue-600 font-medium hover:underline"
            >
              View all opportunities →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
