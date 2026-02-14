import Link from "next/link";

export const dynamic = "force-dynamic";

/**
 * Root route – no nav. Two entry points: Invigorate and f3serve.
 */
export default function RootSplash() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-2">F3</h1>
        <p className="text-lg text-gray-600 mb-12">
          Fitness, fellowship, and faith. Pick your path.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <Link
            href="/signup"
            className="block p-6 bg-black text-white rounded-xl hover:bg-gray-800 transition shadow-lg"
          >
            <h2 className="text-xl font-bold mb-1">Invigorate</h2>
            <p className="text-sm text-gray-300">
              Log workouts, join AOs, track your impact.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-gray-300">
              Get started →
            </span>
          </Link>

          <Link
            href="/f3serve"
            className="block p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-1">f3serve</h2>
            <p className="text-sm text-gray-600">
              Volunteer opportunities. Give back with F3.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-blue-600">
              Browse opportunities →
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
