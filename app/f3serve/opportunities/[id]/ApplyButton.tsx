"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyButton({ opportunityId }: { opportunityId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCommit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        router.refresh();
        alert("Committed! You can log hours from your dashboard.");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to commit");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCommit}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Committing..." : "I'm doing this"}
    </button>
  );
}
