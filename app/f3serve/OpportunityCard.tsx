import Link from "next/link";
import type { DisplayOpportunity } from "@/lib/volunteer-fake-data";
import { CATEGORY_CONFIG, FALLBACK_CATEGORY_CONFIG } from "./category-config";

const BASE = "/f3serve";

const COMMITMENT_LABELS: Record<string, string> = {
  ONE_TIME: "One-time",
  RECURRING: "Recurring",
  PROJECT_BASED: "Project-based",
  ASYNC: "Async / flexible",
};

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

export default function OpportunityCard({ opp }: { opp: DisplayOpportunity }) {
  const href = opp.id
    ? `${BASE}/opportunities/${opp.id}`
    : opp.slug
      ? `${BASE}/opportunities/outlook/${opp.slug}`
      : null;

  const config = CATEGORY_CONFIG[opp.category] ?? FALLBACK_CATEGORY_CONFIG;
  const CategoryIcon = config.Icon;

  const inner = (
    <>
      {/* Category color accent bar */}
      <div className={`h-1.5 flex-none ${config.accentBg}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Category pill + remote badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${config.pillBg} ${config.pillText}`}
          >
            <CategoryIcon className="w-3.5 h-3.5" />
            {config.label}
          </span>
          {opp.isRemote && (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Remote
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors">
          {opp.title}
        </h3>

        {/* Org name */}
        <p className="mt-1 text-sm font-medium text-gray-500">{opp.organizationName}</p>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 line-clamp-2 flex-1">{opp.description}</p>

        {/* Location + commitment meta */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
          {opp.location && (
            <span className="flex items-center gap-1">
              <LocationIcon className="w-3.5 h-3.5 flex-none" />
              {opp.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5 flex-none" />
            {opp.timeCommitment ?? COMMITMENT_LABELS[opp.commitmentType] ?? opp.commitmentType}
          </span>
        </div>

        {/* CTA */}
        {href && (
          <p className="mt-4 text-sm font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            View details
            <ArrowRight className="w-3.5 h-3.5" />
          </p>
        )}
      </div>
    </>
  );

  const cardClass =
    "bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 flex flex-col h-full group";

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return <div className={cardClass}>{inner}</div>;
}
