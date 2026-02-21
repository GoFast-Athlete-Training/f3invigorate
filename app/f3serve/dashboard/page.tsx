import Link from "next/link";
import { getCurrentF3HIM } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function F3ServeDashboardPage() {
  const f3him = await getCurrentF3HIM();
  if (!f3him) {
    redirect("/login?next=/f3serve/dashboard");
  }

  const commitments = await prisma.volunteerCommitment.findMany({
    where: { f3himId: f3him.id },
    include: {
      opportunity: { include: { organization: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">f3serve Dashboard</h1>
      <p className="mt-2 text-gray-600">Your volunteer commitments and activity.</p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800">My Commitments</h2>
        {commitments.length === 0 ? (
          <div className="mt-2 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
            You haven&apos;t committed to any opportunities yet.{" "}
            <Link href="/f3serve/opportunities" className="text-blue-600 hover:underline">
              Browse opportunities
            </Link>
          </div>
        ) : (
          <ul className="mt-2 space-y-2">
            {commitments.map((commitment) => (
              <li
                key={commitment.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <Link
                    href={`/f3serve/opportunities/${commitment.opportunityId}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {commitment.opportunity.title}
                  </Link>
                  <span className="text-sm text-gray-500 ml-2">
                    {commitment.opportunity.organization.name}
                  </span>
                  {commitment.hoursLogged > 0 && (
                    <span className="text-sm text-green-600 ml-2">
                      {commitment.hoursLogged} hrs logged
                    </span>
                  )}
                </div>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                    commitment.completedAt
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {commitment.completedAt ? "Complete" : "Active"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6 flex gap-3">
        <Link
          href="/f3serve/opportunities"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Browse opportunities
        </Link>
        <Link
          href="/f3serve/profile"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Edit profile
        </Link>
      </div>
    </div>
  );
}
