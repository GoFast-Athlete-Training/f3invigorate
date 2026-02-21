import Link from "next/link";
import { aos, getProjectsForAo, getUsersForAo, projectMemberships } from "@/lib/f3service-demo-data";

export default function AOLeaderboardPage() {
  const leaderboard = aos
    .map((ao) => {
      const members = getUsersForAo(ao.id);
      const projects = getProjectsForAo(ao.id);
      const projectIds = new Set(projects.map((project) => project.f3ProjectId));
      const joinedCount = projectMemberships.filter((membership) =>
        projectIds.has(membership.f3ProjectId)
      ).length;
      const totalHours = members.reduce((sum, member) => sum + member.totalHours, 0);

      return {
        id: ao.id,
        name: ao.name,
        members: members.length,
        projects: projects.length,
        joinedCount,
        totalHours,
      };
    })
    .sort((a, b) => b.totalHours - a.totalHours);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900">AO Leaderboard</h1>
        <p className="mt-2 text-gray-600">
          Demo rankings by total service hours and project activity.
        </p>

        <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left text-gray-700">
              <tr>
                <th className="px-4 py-3">AO</th>
                <th className="px-4 py-3">Members</th>
                <th className="px-4 py-3">Projects</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row) => (
                <tr key={row.id} className="border-t border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-gray-700">{row.members}</td>
                  <td className="px-4 py-3 text-gray-700">{row.projects}</td>
                  <td className="px-4 py-3 text-gray-700">{row.joinedCount}</td>
                  <td className="px-4 py-3 text-gray-700">{row.totalHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <Link href="/demowelcome" className="mt-6 inline-flex text-blue-600 hover:underline">
          ← Back to 3F Impact Hub
        </Link>
      </div>
    </main>
  );
}
