"use client";

import { useState } from "react";

type Initial = {
  skills: string[];
  interests: string[];
  availability: string;
  commitmentPreference: string;
  remotePreference: boolean;
};

export default function VolunteerProfileForm({ initial }: { initial: Initial }) {
  const [skills, setSkills] = useState(initial.skills.join(", "));
  const [interests, setInterests] = useState(initial.interests.join(", "));
  const [availability, setAvailability] = useState(initial.availability);
  const [commitmentPreference, setCommitmentPreference] = useState(
    initial.commitmentPreference
  );
  const [remotePreference, setRemotePreference] = useState(initial.remotePreference);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/volunteers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          interests: interests.split(",").map((s) => s.trim()).filter(Boolean),
          availability,
          commitmentPreference,
          remotePreference,
        }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="e.g. Mentoring, Construction, Events"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Interests (comma-separated)</label>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="e.g. Youth, Veterans, Environment"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Availability</label>
        <textarea
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          rows={3}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="e.g. Weekends, Tuesday evenings"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Commitment preference</label>
        <select
          value={commitmentPreference}
          onChange={(e) => setCommitmentPreference(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="ONE_TIME">One-time</option>
          <option value="RECURRING">Recurring</option>
          <option value="PROJECT_BASED">Project-based</option>
          <option value="ASYNC">Async</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remote"
          checked={remotePreference}
          onChange={(e) => setRemotePreference(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="remote" className="text-sm text-gray-700">
          Open to remote opportunities
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved.</span>}
      </div>
    </form>
  );
}
