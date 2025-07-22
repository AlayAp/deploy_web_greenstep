"use client";
import { useState } from "react";
import { saveActivityToLocalStorage, getActivityLogs } from "@/app/utils/localStorage";

const ActivityLogger = () => {
  const [transport, setTransport] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [diet, setDiet] = useState(0);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    const today = new Date().toISOString().split("T")[0];

    const newActivity = {
      transport,
      energy,
      diet,
      co2: transport + energy + diet,
    };

    // Save locally (aggregate if already saved today)
    saveActivityToLocalStorage(newActivity);

    // Get updated local log for today to send to MongoDB
    const logs = getActivityLogs();
    const todayLog = logs.find((log: any) => log.date === today);

    try {
      const res = await fetch("/api/save-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: "test@example.com", // Replace with dynamic user
          ...todayLog,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Activity saved successfully!");
      } else {
        setMessage("Saved locally, but MongoDB failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Saved locally, but error sending to server.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Log Your Eco Activity</h2>
      <div className="mb-2">
        <label>Transport CO₂ Saved:</label>
        <input
          type="number"
          value={transport}
          onChange={(e) => setTransport(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label>Energy CO₂ Saved:</label>
        <input
          type="number"
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label>Diet CO₂ Saved:</label>
        <input
          type="number"
          value={diet}
          onChange={(e) => setDiet(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded mt-2"
      >
        Save Today's Activity
      </button>
      {message && <p className="mt-3 text-sm text-blue-600">{message}</p>}
    </div>
  );
};

export default ActivityLogger;
