import Link from "next/link";
import { getCurrentF3HIM } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const f3him = await getCurrentF3HIM();

  if (!f3him) {
    redirect("/signup");
  }

  // Get this week's attendance count
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const attendanceCount = await prisma.f3ActivityLog.count({
    where: {
      f3himId: f3him.id,
      date: {
        gte: startOfWeek,
      },
    },
  });

  // Get recent activity entries (last 5)
  const recentActivity = await prisma.f3ActivityLog.findMany({
    where: {
      f3himId: f3him.id,
    },
    orderBy: {
      date: "desc",
    },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">f3</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Invigorate Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">This Week&apos;s Attendance</h2>
            <p className="text-4xl font-bold text-black">{attendanceCount}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/attendance/self"
                className="block w-full text-left px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Log Attendance
              </Link>
              <Link
                href="/effort/manual"
                className="block w-full text-left px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Log Effort
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <p className="text-gray-500">No activity yet</p>
            ) : (
              <ul className="space-y-2">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                      <span className="text-gray-600">
                        {activity.calories ? `${activity.calories} cal` : "—"} / {activity.durationSec != null ? `${Math.round(activity.durationSec / 60)} min` : "—"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Activity</h2>
            <p className="text-gray-500 text-sm">
              Track your service hours through{" "}
              <Link href="/f3serve" className="text-blue-600 hover:underline">
                f3serve
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/backblast/create"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Create Q Backblast
          </Link>
          <Link
            href="/f3serve"
            className="inline-block px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            f3serve →
          </Link>
        </div>
      </div>
    </div>
  );
}

