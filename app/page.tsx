import Link from "next/link";
import { getCurrentF3HIM } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Home() {
  const f3him = await getCurrentF3HIM();

  if (!f3him) {
    redirect("/signup");
  }

  // Get this week's attendance count for impact display
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekAttendance = await prisma.attendanceRecord.count({
    where: {
      f3HIMId: f3him.id,
      date: {
        gte: startOfWeek,
      },
    },
  });

  // Get total attendance count
  const totalAttendance = await prisma.attendanceRecord.count({
    where: {
      f3HIMId: f3him.id,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8 pt-8">
          <h1 className="text-5xl font-bold text-black mb-2">f3</h1>
          <h2 className="text-xl font-semibold text-gray-700">Invigorate</h2>
        </div>

        {/* AO Membership Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">AO Membership</h2>
          <p className="text-gray-600 text-sm mb-4">
            {/* TODO: Implement AO membership model */}
            Join an AO to start tracking workouts
          </p>
          <Link
            href="/ao/join"
            className="block w-full text-center px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
          >
            Join / Manage AO
          </Link>
        </div>

        {/* Primary Actions */}
        <div className="space-y-4 mb-6">
          {/* Log Workout */}
          <Link
            href="/attendance/self"
            className="block w-full bg-black text-white rounded-lg p-6 hover:bg-gray-800 transition shadow-lg"
          >
            <div className="text-xl font-bold mb-1">Log Workout</div>
            <div className="text-sm text-gray-300">
              Manual entry • Q-created workout (coming soon)
            </div>
          </Link>

          {/* Join Service Project */}
          <Link
            href="/service/join"
            className="block w-full bg-gray-800 text-white rounded-lg p-6 hover:bg-gray-700 transition shadow-lg"
          >
            <div className="text-xl font-bold mb-1">Join Service Project</div>
            <div className="text-sm text-gray-300">
              Track your service participation
            </div>
          </Link>
        </div>

        {/* Optional: See Points / Impact */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Impact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-black">{thisWeekAttendance}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black">{totalAttendance}</div>
              <div className="text-sm text-gray-600">Total Workouts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

