import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentF3HIM } from "@/lib/auth";
import ApplyButton from "./ApplyButton";

type Props = { params: Promise<{ id: string }> };

export default async function OpportunityDetailPage({ params }: Props) {
  const { id } = await params;
  const f3him = await getCurrentF3HIM();

  const opportunity = await prisma.volunteerOpportunity.findUnique({
    where: { id },
    include: { organization: true },
  });

  if (!opportunity) {
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
          <h1 className="text-2xl font-bold text-gray-900">{opportunity.title}</h1>
          <span className="text-sm text-gray-500">{opportunity.organization.name}</span>
        </div>
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">{opportunity.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {opportunity.causes.map((cause) => (
            <span key={cause} className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              {cause.replace(/_/g, ' ')}
            </span>
          ))}
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {opportunity.commitmentType}
          </span>
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
            opportunity.locationType === 'REMOTE' 
              ? 'bg-green-100 text-green-800' 
              : opportunity.locationType === 'HYBRID'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {opportunity.locationType.replace(/_/g, ' ')}
          </span>
        </div>
        {(opportunity.city || opportunity.state) && (
          <p className="mt-2 text-sm text-gray-600">
            Location: {opportunity.city}{opportunity.city && opportunity.state ? ', ' : ''}{opportunity.state}
          </p>
        )}
        <div className="mt-6 border-t border-gray-100 pt-4">
          {f3him ? (
            <ApplyButton opportunityId={opportunity.id} />
          ) : (
            <p className="text-sm text-gray-500">
              Want to volunteer for this?{" "}
              <Link href="/login?next=/f3serve" className="text-blue-600 hover:underline">
                Sign in when you’re ready
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
