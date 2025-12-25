import Link from "next/link";
import { getCurrentF3HIM } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const f3him = await getCurrentF3HIM();

  if (!f3him) {
    redirect("/signup");
  }

  // Get this week's attendance count
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const attendanceCount = await prisma.attendanceRecord.count({
    where: {
      f3HIMId: f3him.id,
      date: {
        gte: startOfWeek,
      },
    },
  });

  // Get recent effort entries (last 5)
  const recentEfforts = await prisma.effortRecord.findMany({
    where: {
      f3HIMId: f3him.id,
    },
    orderBy: {
      date: "desc",
    },
    take: 5,
  });

  // Get latest weekly reflection (deprecated, kept for data)
  const latestReflection = await prisma.weeklyReflection.findFirst({
    where: {
      f3HIMId: f3him.id,
    },
    orderBy: {
      date: "desc",
    },
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
              <Link
                href="/reflection/week"
                className="block w-full text-left px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Weekly Reflection
              </Link>
              <Link
                href="/self-report/new"
                className="block w-full text-left px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                New Self-Report
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Effort Entries</h2>
            {recentEfforts.length === 0 ? (
              <p className="text-gray-500">No effort entries yet</p>
            ) : (
              <ul className="space-y-2">
                {recentEfforts.map((effort) => (
                  <li key={effort.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        {new Date(effort.date).toLocaleDateString()}
                      </span>
                      <span className="text-gray-600">
                        {effort.calories} cal / {Math.round(effort.durationSec / 60)} min
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Weekly Reflection</h2>
            {latestReflection ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  {new Date(latestReflection.date).toLocaleDateString()}
                </p>
                {latestReflection.mood && (
                  <div>
                    <span className="font-semibold">Mood:</span> {latestReflection.mood}
                  </div>
                )}
                {latestReflection.wins && (
                  <div>
                    <span className="font-semibold">Wins:</span> {latestReflection.wins}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No reflections yet</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/backblast/create"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Create Q Backblast
          </Link>
        </div>
      </div>
    </div>
  );
}

