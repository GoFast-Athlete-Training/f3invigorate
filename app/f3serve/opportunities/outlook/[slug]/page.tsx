import Link from "next/link";
import { FAKE_OPPORTUNITIES } from "@/lib/volunteer-fake-data";

type Props = { params: Promise<{ slug: string }> };

function formatCategory(s: string) {
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function OutlookDetailPage({ params }: Props) {
  const { slug } = await params;
  const opp = FAKE_OPPORTUNITIES.find((o) => o.slug === slug);

  if (!opp) {
    return (
      <div>
        <p className="text-gray-600">Opportunity not found.</p>
        <Link href="/f3serve/opportunities" className="text-blue-600 mt-2 inline-block">
          ← Back to opportunities
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/f3serve/opportunities"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to opportunities
      </Link>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">{opp.title}</h1>
          <span className="text-sm text-gray-500">{opp.organizationName}</span>
        </div>
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">{opp.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
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
        {opp.location && (
          <p className="mt-2 text-sm text-gray-600">Location: {opp.location}</p>
        )}
        <p className="mt-6 text-sm text-gray-500 border-t border-gray-100 pt-4">
          Want to volunteer for this? You’ll sign in when you’re ready.
        </p>
      </div>
    </div>
  );
}
