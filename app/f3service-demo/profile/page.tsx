import Link from "next/link";
import {
  activations,
  getAo,
  getAttendanceByActivation,
  participants,
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

  const myParticipation = participants.filter((row) => row.userId === currentUser.id);
  const completedCount = myParticipation.filter((row) => row.status === "ATTENDED").length;
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
            <p className="text-gray-500">Events Attended</p>
            <p className="text-2xl font-semibold text-gray-900">{completedCount}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-gray-500">Funds Raised</p>
            <p className="text-2xl font-semibold text-gray-900">${currentUser.totalFundsRaised}</p>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900">Your service history</h3>
        <ul className="mt-3 space-y-3">
          {myParticipation.map((row) => {
            const activation = activations.find((evt) => evt.id === row.activationId);
            const opp = activation ? getOpportunity(activation.opportunityId) : null;
            const rsvp = getAttendanceByActivation(row.activationId);
            const statusLabel = row.status === "ATTENDED" ? "Attended" : "RSVP";

            return (
              <li key={row.id} className="rounded-lg border border-gray-200 p-3">
                <p className="font-medium text-gray-900">{activation?.title ?? row.activationId}</p>
                <p className="text-sm text-gray-600">Template: {opp?.title ?? "Unknown template"}</p>
                <p className="text-sm text-gray-600">
                  {statusLabel} · {row.hoursLogged}h logged · {rsvp.totalCount} total RSVPs
                </p>
              </li>
            );
          })}
          {myParticipation.length === 0 ? (
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
