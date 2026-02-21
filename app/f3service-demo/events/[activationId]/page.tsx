import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getActivation,
  getOrg,
  getOpportunity,
  getParticipantsForActivation,
  getUser,
  formatDate,
} from "@/lib/f3service-demo-data";
import { ServiceEngineNav } from "../../_components/ServiceEngineNav";

type Props = {
  params: Promise<{ activationId: string }>;
};

export default async function EventPage({ params }: Props) {
  const { activationId } = await params;
  const activation = getActivation(activationId);
  if (!activation) {
    notFound();
  }

  const template = getOpportunity(activation.opportunityId);
  const org = template ? getOrg(template.orgId) : null;
  const participants = getParticipantsForActivation(activation.id);
  const totalHours = participants.reduce((sum, row) => sum + row.hoursLogged, 0);
  const going = participants.filter((row) => row.status === "GOING");
  const attended = participants.filter((row) => row.status === "ATTENDED");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Service Event</h1>
      <ServiceEngineNav activeHref={`/f3service-demo/events/${activation.id}`} />

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-wrap justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{activation.title}</h2>
            <p className="text-sm text-gray-600">{org?.name ?? "Unknown org"}</p>
          </div>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
              activation.status === "UPCOMING"
                ? "bg-amber-100 text-amber-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {activation.status}
          </span>
        </div>

        <p className="mt-3 text-sm text-gray-700">
          Template: {template?.title ?? "No template"}
          {template ? ` • ${template.location}` : ""}
        </p>
        <p className="text-sm text-gray-700">Date: {formatDate(activation.date)}</p>
        <p className="text-sm text-gray-700">
          Targets: {activation.goalHeadcount} people • {activation.goalHours} hours
        </p>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900">RSVP + Attendance</h3>
        <p className="mt-1 text-gray-700">
          Total signups: {participants.length} | Going: {going.length} | Attended: {attended.length} | Logged:
          {" "}
          {totalHours}h
        </p>

        <ul className="mt-4 divide-y divide-gray-200">
          {participants.map((row) => {
            const user = getUser(row.userId);
            return (
              <li key={row.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{user?.name ?? row.userId}</p>
                  <p className="text-sm text-gray-600">{user?.email ?? "No email on file"}</p>
                </div>
                <div className="text-sm text-right">
                  <p className="text-gray-700">{row.status}</p>
                  <p className="text-gray-500">{row.hoursLogged}h logged</p>
                </div>
              </li>
            );
          })}
          {participants.length === 0 ? <p className="text-sm text-gray-500 py-3">No participants yet.</p> : null}
        </ul>
      </section>

      <Link href="/f3service-demo/ao" className="inline-flex text-blue-600 hover:underline">
        ← Back to AO dashboard
      </Link>
    </div>
  );
}
