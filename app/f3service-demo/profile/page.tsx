import Link from "next/link";
import {
  projects,
  getAo,
  getMembershipSummary,
  projectMemberships,
  users,
  getOpportunity,
} from "@/lib/f3service-demo-data";
import { ServiceEngineNav } from "../_components/ServiceEngineNav";

const currentUserId = "u-mid-1";

export default function ProfilePage() {
  const currentUser = users.find((u) => u.id === currentUserId);
  if (!currentUser) {
    return <p className="text-gray-600">Demo user not found.</p>;
  }

  const myMemberships = projectMemberships.filter((row) => row.userId === currentUser.id);
  const completedCount = myMemberships.filter((row) => row.hoursLogged > 0).length;
  const ao = getAo(currentUser.aoId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Personal Profile</h1>
      <ServiceEngineNav activeHref="/f3service-demo/profile" />

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900">{currentUser.name}</h2>
        <p className="text-sm text-gray-600">{currentUser.email}</p>
        <p className="text-sm text-gray-600">AO: {ao?.name ?? currentUser.aoId}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-gray-500">Total Hours</p>
            <p className="text-2xl font-semibold text-gray-900">{currentUser.totalHours}h</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-gray-500">Projects Completed</p>
            <p className="text-2xl font-semibold text-gray-900">{completedCount}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-gray-500">Funds Raised</p>
            <p className="text-2xl font-semibold text-gray-900">${currentUser.totalFundsRaised}</p>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900">Your project history</h3>
        <ul className="mt-3 space-y-3">
          {myMemberships.map((row) => {
            const project = projects.find((evt) => evt.f3ProjectId === row.f3ProjectId);
            const opp = project ? getOpportunity(project.opportunityId) : null;
            const summary = getMembershipSummary(row.f3ProjectId);
            const statusLabel = row.hoursLogged > 0 ? "Completed" : "Joined";

            return (
              <li key={row.id} className="rounded-lg border border-gray-200 p-3">
                <p className="font-medium text-gray-900">{project?.title ?? row.f3ProjectId}</p>
                <p className="text-sm text-gray-600">Template: {opp?.title ?? "Unknown template"}</p>
                <p className="text-sm text-gray-600">
                  {statusLabel} · {row.hoursLogged}h logged · {summary.totalMembers} total members
                </p>
              </li>
            );
          })}
          {myMemberships.length === 0 ? (
            <p className="text-sm text-gray-500">No participation yet.</p>
          ) : null}
        </ul>
      </section>

      <Link href="/f3service-demo/orgs" className="inline-flex text-blue-600 hover:underline">
        Explore org templates →
      </Link>
    </div>
  );
}
