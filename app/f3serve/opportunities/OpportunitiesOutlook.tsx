"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { DisplayOpportunity } from "@/lib/volunteer-fake-data";
import { FAKE_OPPORTUNITIES } from "@/lib/volunteer-fake-data";
import { CATEGORY_CONFIG, FALLBACK_CATEGORY_CONFIG } from "../category-config";
import OpportunityCardsContainer from "../OpportunityCardsContainer";

/**
 * Volunteer opportunities list loaded via fetch.
 * GET /api/opportunities returns { opportunities }; fake data used when DB is empty.
 * On API error, fall back to FAKE_OPPORTUNITIES so we always show demo data.
 */
export default function OpportunitiesOutlook() {
  const [opportunities, setOpportunities] = useState<DisplayOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

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

  // Unique categories present in loaded opportunities, preserving a logical display order
  const CATEGORY_ORDER = ["MENTORSHIP", "LABOR", "EVENTS", "ADMIN", "BOARD", "TECHNICAL"];
  const availableCategories = useMemo(() => {
    const present = new Set(opportunities.map((o) => o.category));
    return CATEGORY_ORDER.filter((c) => present.has(c));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunities]);

  const filtered = useMemo(
    () =>
      activeCategory === "ALL"
        ? opportunities
        : opportunities.filter((o) => o.category === activeCategory),
    [opportunities, activeCategory]
  );

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
          {/* Filter bar — only when there are 2+ categories */}
          {availableCategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
              {/* All pill */}
              <button
                onClick={() => setActiveCategory("ALL")}
                className={`flex-none px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === "ALL"
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                All ({opportunities.length})
              </button>

              {availableCategories.map((cat) => {
                const config = CATEGORY_CONFIG[cat] ?? FALLBACK_CATEGORY_CONFIG;
                const CategoryIcon = config.Icon;
                const count = opportunities.filter((o) => o.category === cat).length;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(isActive ? "ALL" : cat)}
                    className={`flex-none inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? `${config.activeBg} ${config.activeText}`
                        : `bg-white border border-gray-200 ${config.pillText} hover:border-gray-400`
                    }`}
                  >
                    <CategoryIcon className="w-3.5 h-3.5" />
                    {config.label}
                    <span
                      className={`text-xs ${isActive ? "opacity-75" : "text-gray-400"}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Cards or empty state */}
          {filtered.length === 0 && activeCategory !== "ALL" ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-3">
                No {(CATEGORY_CONFIG[activeCategory] ?? FALLBACK_CATEGORY_CONFIG).label.toLowerCase()} opportunities right now.
              </p>
              <button
                onClick={() => setActiveCategory("ALL")}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                See all opportunities
              </button>
            </div>
          ) : (
            <OpportunityCardsContainer
              opportunities={filtered}
              emptyMessage="No open opportunities yet. Check back later or sign in to create one."
            />
          )}

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
