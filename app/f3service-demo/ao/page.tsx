import Link from "next/link";
import {
  getProjectsForAo,
  getMembershipSummary,
  getUsersForAo,
  formatDate,
  aos,
} from "@/lib/f3service-demo-data";
import { ServiceEngineNav } from "../_components/ServiceEngineNav";

export default function AOTrainingDashboard() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Service Engine Demo — AO Dashboard</h1>
      <p className="text-gray-600">
        Minimal AO-level view with project memberships and goals.
      </p>

      <ServiceEngineNav activeHref="/f3service-demo/ao" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {aos.map((ao) => {
          const aoMembers = getUsersForAo(ao.id);
          const aoHours = aoMembers.reduce((sum, user) => sum + user.totalHours, 0);
          const goalPct = Math.min(Math.round((aoHours / ao.quarterlyGoalHours) * 100), 100);
          const aoProjects = getProjectsForAo(ao.id);

          return (
            <section key={ao.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{ao.name}</h2>
                  <p className="text-sm text-gray-600">{ao.city}</p>
                </div>
                <p className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {aoMembers.length} members
                </p>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>Goal Hours: {ao.quarterlyGoalHours}</p>
                <p>Current Hours: {aoHours}</p>
                <p>Progress: {goalPct}%</p>
                <p>Projects: {aoProjects.length}</p>
              </div>

              <div className="mt-4">
                <h3 className="font-medium text-gray-900">Upcoming and completed projects</h3>
                <div className="mt-2 space-y-2">
                  {aoProjects.map((project) => {
                    const memberships = getMembershipSummary(project.f3ProjectId);
                    return (
                      <Link
                        key={project.f3ProjectId}
                        href={`/f3service-demo/events/${project.f3ProjectId}`}
                        className="block rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50/40"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="font-semibold text-gray-900">{project.title}</p>
                          <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                            {project.isCompleted ? "COMPLETED" : "UPCOMING"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(project.startTime)}</p>
                        <p className="text-sm text-gray-600">
                          Members joined: {memberships.totalMembers}
                        </p>
                        <p className="text-xs text-gray-500">
                          Logged hours: {memberships.totalHours}h
                        </p>
                      </Link>
                    );
                  })}

                  {aoProjects.length === 0 ? (
                    <p className="text-sm text-gray-500">No projects yet.</p>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <p className="text-sm text-gray-500">
        Note: this is static demo data for UI hydration and layout validation.
      </p>
    </div>
  );
}
