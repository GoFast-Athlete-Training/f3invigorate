import type { DisplayOpportunity } from "@/lib/volunteer-fake-data";
import OpportunityCard from "./OpportunityCard";

/**
 * Container that renders a grid of volunteer opportunity cards.
 * Used on the f3serve home and opportunities list. Pass fake or real data.
 */
export default function OpportunityCardsContainer({
  opportunities,
  emptyMessage = "No open opportunities yet.",
}: {
  opportunities: DisplayOpportunity[];
  emptyMessage?: string;
}) {
  if (opportunities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {opportunities.map((opp, i) => (
        <OpportunityCard key={opp.id ?? `fake-${i}`} opp={opp} />
      ))}
    </div>
  );
}
