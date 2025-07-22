"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ActivityLoggerPage() {
  const { data: session } = useSession();
  const [activityType, setActivityType] = useState("");
  const [co2Saved, setCo2Saved] = useState<number>(0);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!session?.user?.email) {
      setMessage("You must be logged in to save activity.");
      return;
    }

    try {
      const res = await fetch("/api/save-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          activityType,
          co2Saved,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Activity saved successfully!");
        setActivityType("");
        setCo2Saved(0);
      } else {
        setMessage("Failed to save activity.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error saving activity.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Log Eco Activity</h2>

      <input
        type="text"
        placeholder="Activity Type (e.g., Biking)"
        value={activityType}
        onChange={(e) => setActivityType(e.target.value)}
        className="w-full p-2 border mb-2"
      />

      <input
        type="number"
        placeholder="CO₂ Saved (kg)"
        value={co2Saved}
        onChange={(e) => setCo2Saved(Number(e.target.value))}
        className="w-full p-2 border mb-2"
      />

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Today's Activity
      </button>

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
