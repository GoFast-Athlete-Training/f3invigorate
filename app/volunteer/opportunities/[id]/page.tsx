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
        <Link href="/volunteer/opportunities" className="text-blue-600 mt-2 inline-block">
          ← Back to opportunities
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/volunteer/opportunities"
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
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {opportunity.category}
          </span>
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {opportunity.commitmentType}
          </span>
          {opportunity.isRemote && (
            <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              Remote
            </span>
          )}
        </div>
        {opportunity.location && (
          <p className="mt-2 text-sm text-gray-600">Location: {opportunity.location}</p>
        )}
        {f3him && (
          <div className="mt-6">
            <ApplyButton opportunityId={opportunity.id} />
          </div>
        )}
        {!f3him && (
          <p className="mt-6 text-sm text-gray-500">
            <Link href="/login?next=/volunteer" className="text-blue-600 hover:underline">
              Sign in
            </Link>{" "}
            to apply.
          </p>
        )}
      </div>
    </div>
  );
}
