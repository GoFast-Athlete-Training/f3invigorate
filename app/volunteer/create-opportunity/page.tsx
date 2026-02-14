import { getCurrentF3HIM } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CreateOpportunityPage() {
  const f3him = await getCurrentF3HIM();
  if (!f3him) {
    redirect("/login?next=/volunteer/create-opportunity");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Create opportunity</h1>
      <p className="mt-2 text-gray-600">
        Create a volunteer opportunity (requires an organization). Use the API or add a form here.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        POST /api/organizations to create an org, then POST /api/opportunities with
        organizationId, title, description, category, etc.
      </p>
      <Link
        href="/volunteer/dashboard"
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}
