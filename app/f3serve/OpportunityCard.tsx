import Link from "next/link";
import type { DisplayOpportunity } from "@/lib/volunteer-fake-data";

const BASE = "/f3serve";

function formatCategory(s: string) {
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function OpportunityCard({ opp }: { opp: DisplayOpportunity }) {
  const href = opp.id
    ? `${BASE}/opportunities/${opp.id}`
    : opp.slug
      ? `${BASE}/opportunities/outlook/${opp.slug}`
      : null;

  const content = (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{opp.title}</h3>
        <span className="text-sm text-gray-500 shrink-0">{opp.organizationName}</span>
      </div>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{opp.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {formatCategory(opp.category)}
        </span>
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {formatCategory(opp.commitmentType)}
        </span>
        {opp.isRemote && (
          <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            Remote
          </span>
        )}
      </div>
      {href && (
        <p className="mt-3 text-sm font-medium text-blue-600">View details →</p>
      )}
    </>
  );

  const cardClass =
    "block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition text-left h-full flex flex-col";

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
