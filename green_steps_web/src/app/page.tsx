"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";

interface ActivityData {
  transport: { mode: string; distance: number };
  diet: { type: string; localProduce: number };
  electricity: { usage: number; green: number };
}

function calculateCO2({ transport, diet, electricity }: ActivityData): number {
  const transportFactors: Record<string, number> = {
    Car: 0.21,
    Bus: 0.08,
    Bike: 0,
    Walk: 0,
  };

  const dietFactors: Record<string, number> = {
    "Plant-based": 2,
    Mixed: 4,
    "Meat-heavy": 7,
  };

  const transportCO2 = transport.distance * (transportFactors[transport.mode] || 0);
  const dietCO2 = dietFactors[diet.type] * (1 - diet.localProduce / 100);
  const electricityCO2 = electricity.usage * 0.5 * (1 - electricity.green / 100);

  return +(transportCO2 + dietCO2 + electricityCO2).toFixed(1);
}

export default function FootprintDashboard() {
  const { data: session } = useSession();
  const [activity, setActivity] = useState<ActivityData>({
    transport: { mode: "Car", distance: 0 },
    diet: { type: "Plant-based", localProduce: 50 },
    electricity: { usage: 0, green: 0 },
  });

  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!session?.user?.email) {
      setMessage("You must be logged in to save activity.");
      return;
    }

    const co2 = calculateCO2(activity);

    try {
      const res = await fetch("/api/save-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          activityType: JSON.stringify(activity),
          co2Saved: co2,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("✅ Activity saved to MongoDB!");
      } else {
        setMessage("❌ Failed to save activity.");
      }
    } catch (error) {
      console.error("Error saving activity:", error);
      setMessage("❌ Error while saving activity.");
    }
  };

  const co2 = calculateCO2(activity);

  return (
    <div className="min-h-screen bg-[#f6faf7] py-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-0 overflow-hidden border border-[#ededed]">
        {/* Banner */}
        <div className="relative bg-gradient-to-b from-[#eafaf1] to-[#f6faf7] rounded-b-xl py-10 text-center overflow-hidden border-b border-[#ededed]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80')"
            }}
          />
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-green-700 mb-2">Log Today's Footprint</h1>
            <p className="text-gray-700 text-lg">Track your daily activities and their environmental impact</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 px-6 py-8">
          {/* Left: Forms */}
          <div className="flex-1 space-y-6">
            {/* Transportation */}
            <div className="bg-white rounded-xl shadow-sm border border-[#ededed] p-6">
              <h3 className="flex items-center text-green-700 font-bold text-lg mb-4">
                <span className="mr-2 text-2xl">🚗</span> Transportation
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Mode of Transport</label>
                  <select
                    className="w-full rounded-md border border-gray-200 bg-[#f6faf7] p-2 text-black"
                    value={activity.transport.mode}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        transport: { ...activity.transport, mode: e.target.value },
                      })
                    }
                  >
                    <option value="Car">Car</option>
                    <option value="Bus">Bus</option>
                    <option value="Bike">Bike</option>
                    <option value="Walk">Walk</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Distance (km)</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-md border border-gray-200 bg-[#f6faf7] p-2 text-black"
                    value={activity.transport.distance}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        transport: {
                          ...activity.transport,
                          distance: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Diet */}
            <div className="bg-white rounded-xl shadow-sm border border-[#ededed] p-6">
              <h3 className="flex items-center text-green-700 font-bold text-lg mb-4">
                <span className="mr-2 text-2xl">🥗</span> Diet
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Meal Type</label>
                  <select
                    className="w-full rounded-md border border-gray-200 bg-[#f6faf7] p-2 text-black"
                    value={activity.diet.type}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        diet: { ...activity.diet, type: e.target.value },
                      })
                    }
                  >
                    <option value="Plant-based">Plant-based</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Meat-heavy">Meat-heavy</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Local Produce %</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    className="w-full"
                    value={activity.diet.localProduce}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        diet: { ...activity.diet, localProduce: Number(e.target.value) },
                      })
                    }
                  />
                  <span className="ml-2">{activity.diet.localProduce}%</span>
                </div>
              </div>
            </div>

            {/* Electricity */}
            <div className="bg-white rounded-xl shadow-sm border border-[#ededed] p-6">
              <h3 className="flex items-center text-green-700 font-bold text-lg mb-4">
                <span className="mr-2 text-2xl">⚡</span> Electricity
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Usage (kWh)</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-md border border-gray-200 bg-[#f6faf7] p-2 text-black"
                    value={activity.electricity.usage}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        electricity: {
                          ...activity.electricity,
                          usage: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Green Energy Used</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    className="w-full"
                    value={activity.electricity.green}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        electricity: {
                          ...activity.electricity,
                          green: Number(e.target.value),
                        },
                      })
                    }
                  />
                  <span className="ml-2">{activity.electricity.green}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md mt-4 font-semibold"
            >
              💾 Save Today's Activity
            </button>

            {message && (
              <div className="text-center text-sm text-gray-700 mt-2">{message}</div>
            )}
          </div>

          {/* Sidebar (optional) */}
          <aside className="w-full max-w-xs flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-[#ededed] p-6">
              <h4 className="text-gray-800 font-semibold mb-4">Today's Impact</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">CO₂ Output</span>
                <span className="font-bold text-green-600 text-xl">{co2} kg</span>
              </div>
              <div className="text-green-700 font-medium text-sm mb-4">
                Keep going green! 🌍
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
