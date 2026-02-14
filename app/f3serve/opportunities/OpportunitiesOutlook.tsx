"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { DisplayOpportunity } from "@/lib/volunteer-fake-data";
import { FAKE_OPPORTUNITIES } from "@/lib/volunteer-fake-data";
import OpportunityCardsContainer from "../OpportunityCardsContainer";

/**
 * Volunteer opportunities list loaded via fetch (like runcrew container).
 * GET /api/opportunities returns { opportunities }; fake data used when DB is empty.
 * On API error, fall back to FAKE_OPPORTUNITIES so we always show demo data.
 */
export default function OpportunitiesOutlook() {
  const [opportunities, setOpportunities] = useState<DisplayOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/opportunities");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load");
        const list =
          Array.isArray(data.opportunities) ? data.opportunities
          : Array.isArray(data) ? data
          : FAKE_OPPORTUNITIES;
        if (!cancelled) setOpportunities(list);
      } catch (e) {
        console.error("Fetch opportunities:", e);
        if (!cancelled) setOpportunities(FAKE_OPPORTUNITIES);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <header className="bg-white border-b border-gray-200 -mx-4 -mt-8 px-4 py-10 mb-8 sm:mx-0 sm:px-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Volunteer opportunity outlook
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                Browse ways to give back with F3. Click any opportunity for details.
              </p>
            </div>
            <Link
              href="/f3serve"
              className="text-sm text-blue-600 hover:underline shrink-0"
            >
              ← Home
            </Link>
          </div>
          <div className="mt-6">
            <span className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg">
              See all opportunities
            </span>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading opportunities…</p>
          </div>
        </div>
      ) : (
        <section>
          <OpportunityCardsContainer
            opportunities={opportunities}
            emptyMessage="No open opportunities yet. Check back later or sign in to create one."
          />
          {opportunities.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/f3serve"
                className="text-blue-600 font-medium hover:underline"
              >
                View all opportunities →
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
