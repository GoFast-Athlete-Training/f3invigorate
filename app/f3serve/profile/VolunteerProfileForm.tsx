"use client";

import { useState } from "react";

type Initial = {
  photoURL: string;
  bio: string;
  phoneNumber: string;
  city: string;
  state: string;
  myCauses: string[];
  volunteerSkills: string;
  availability: string;
};

export default function VolunteerProfileForm({ initial }: { initial: Initial }) {
  const [photoURL, setPhotoURL] = useState(initial.photoURL);
  const [bio, setBio] = useState(initial.bio);
  const [phoneNumber, setPhoneNumber] = useState(initial.phoneNumber);
  const [city, setCity] = useState(initial.city);
  const [state, setState] = useState(initial.state);
  const [myCauses, setMyCauses] = useState(initial.myCauses.join(", "));
  const [volunteerSkills, setVolunteerSkills] = useState(initial.volunteerSkills);
  const [availability, setAvailability] = useState(initial.availability);
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
          photoURL,
          bio,
          phoneNumber,
          city,
          state,
          myCauses: myCauses.split(",").map((s) => s.trim().toUpperCase().replace(/ /g, "_")).filter(Boolean),
          volunteerSkills,
          availability,
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
        <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
        <input
          type="url"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="https://example.com/profile.jpg"
        />
        <p className="mt-1 text-xs text-gray-500">
          Link to your profile picture (from Firebase, Gravatar, or image host)
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Why you serve, personal story..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="(704) 555-1234"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Charlotte"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="NC"
            maxLength={2}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Causes I Care About (comma-separated)</label>
        <input
          type="text"
          value={myCauses}
          onChange={(e) => setMyCauses(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="e.g. Veterans, Youth Kids, Environment"
        />
        <p className="mt-1 text-xs text-gray-500">
          Examples: Veterans, Youth Kids, Families of Fallen, Homeless Housing, Environment, etc.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Volunteer Skills</label>
        <textarea
          value={volunteerSkills}
          onChange={(e) => setVolunteerSkills(e.target.value)}
          rows={2}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="e.g. Mentoring, construction experience, event planning"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Availability</label>
        <textarea
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          rows={2}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="e.g. Weekends, Tuesday evenings, open to remote"
        />
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
