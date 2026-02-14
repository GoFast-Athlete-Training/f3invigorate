import Link from "next/link";
import { getCurrentF3HIM } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function VolunteerDashboardPage() {
  const f3him = await getCurrentF3HIM();
  if (!f3him) {
    redirect("/login?next=/volunteer/dashboard");
  }

  const applications = await prisma.volunteerApplication.findMany({
    where: { volunteerId: f3him.id },
    include: {
      opportunity: { include: { organization: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Volunteer Dashboard</h1>
      <p className="mt-2 text-gray-600">Your applications and volunteer activity.</p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800">My Applications</h2>
        {applications.length === 0 ? (
          <div className="mt-2 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
            You haven&apos;t applied to any opportunities yet.{" "}
            <Link href="/volunteer/opportunities" className="text-blue-600 hover:underline">
              Browse opportunities
            </Link>
          </div>
        ) : (
          <ul className="mt-2 space-y-2">
            {applications.map((app) => (
              <li
                key={app.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <Link
                    href={`/volunteer/opportunities/${app.opportunityId}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {app.opportunity.title}
                  </Link>
                  <span className="text-sm text-gray-500 ml-2">
                    {app.opportunity.organization.name}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                    app.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : app.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {app.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6 flex gap-3">
        <Link
          href="/volunteer/opportunities"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Browse opportunities
        </Link>
        <Link
          href="/volunteer/profile"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Edit profile
        </Link>
      </div>
    </div>
  );
}
