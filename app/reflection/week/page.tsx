"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WeeklyReflectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    mood: "",
    wins: "",
    struggles: "",
    intention: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reflection/week", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save reflection");
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Weekly Reflection</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-2">
              Mood
            </label>
            <textarea
              id="mood"
              value={formData.mood}
              onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="How are you feeling this week?"
            />
          </div>

          <div>
            <label htmlFor="wins" className="block text-sm font-medium text-gray-700 mb-2">
              Wins
            </label>
            <textarea
              id="wins"
              value={formData.wins}
              onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="What went well this week?"
            />
          </div>

          <div>
            <label htmlFor="struggles" className="block text-sm font-medium text-gray-700 mb-2">
              Struggles
            </label>
            <textarea
              id="struggles"
              value={formData.struggles}
              onChange={(e) => setFormData({ ...formData, struggles: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="What challenges did you face?"
            />
          </div>

          <div>
            <label htmlFor="intention" className="block text-sm font-medium text-gray-700 mb-2">
              Intention
            </label>
            <textarea
              id="intention"
              value={formData.intention}
              onChange={(e) => setFormData({ ...formData, intention: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="What are your intentions for next week?"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Reflection"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

