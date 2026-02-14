import { getCurrentF3HIM } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrganizationDashboardPage() {
  const f3him = await getCurrentF3HIM();
  if (!f3him) {
    redirect("/login?next=/f3serve/dashboard/organization");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Organization Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Manage your organization and opportunities.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Create organizations via POST /api/organizations, then create opportunities
        via POST /api/opportunities. A full UI for this can be added later.
      </p>
      <Link
        href="/f3serve/dashboard"
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}
