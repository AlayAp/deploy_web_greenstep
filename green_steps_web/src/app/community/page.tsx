"use client";

import React, { useEffect, useState } from "react";

// User type definition
type User = {
  id: number;
  name: string;
  currentStreak: number;
  bestStreak: number;
  totalCO2: number;
  dailyAverage: number;
  dailyChange: number;
  achievements: { icon: string; label: string }[];
  totalChallengesCompleted: number;
};

export default function CommunityPage() {
  const [users, setUsers] = useState<User[]>([]);
  const currentUserId = 1;

  useEffect(() => {
    fetch("/data/user.json")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
      });
  }, []);

  if (!users.length) {
    return <div className="p-8 text-center text-gray-400">Loading community data...</div>;
  }

  const user = users.find(u => u.id === currentUserId);
  const others = users.filter(u => u.id !== currentUserId);

  // Calculate community averages (excluding current user)
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
  const avgCO2 = avg(others.map(u => u.totalCO2));
  const avgStreak = avg(others.map(u => u.currentStreak));
  const avgChallenges = avg(others.map(u => u.totalChallengesCompleted));

  const getDiffClass = (userVal: number, avgVal: number) =>
    userVal >= avgVal ? "text-green-600" : "text-red-600";

  return (
    // <div className="max-w-4xl mx-auto p-6 min-w-screen
    //     bg-[url('/abstract-blur-green-nature.jpg')]
    //     bg-cover
    //     bg-center
    //     bg-no-repeat">
      <div>
      {/* Dull overlay */}
      {/* <div className="absolute inset-0 bg-black/60 pointer-events-none" /> */}
      
      <div className="relative z-10 max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-12 mb-12">
        
        <h2 className="text-xl font-bold text-green-700 mb-4">Your Stats vs Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
          {/* CO2 Comparison */}
          <div>
            <div className="text-gray-500 text-sm mb-1">CO₂ Saved</div>
            <div className="text-2xl font-bold text-green-700">{user?.totalCO2 ?? "--"} kg</div>
            <div className="text-xs text-gray-500 mb-1">Community Avg: {avgCO2.toFixed(1)} kg</div>
            <div className={getDiffClass(user?.totalCO2 ?? 0, avgCO2)}>
              {user && (user.totalCO2 >= avgCO2 ? "Above" : "Below")} average
            </div>
          </div>
          {/* Streak Comparison */}
          <div>
            <div className="text-gray-500 text-sm mb-1">Current Streak</div>
            <div className="text-2xl font-bold text-green-700">{user?.currentStreak ?? "--"} days</div>
            <div className="text-xs text-gray-500 mb-1">Community Avg: {avgStreak.toFixed(1)} days</div>
            <div className={getDiffClass(user?.currentStreak ?? 0, avgStreak)}>
              {user && (user.currentStreak >= avgStreak ? "Above" : "Below")} average
            </div>
          </div>
          {/* Challenges Comparison */}
          <div>
            <div className="text-gray-500 text-sm mb-1">Challenges Completed</div>
            <div className="text-2xl font-bold text-green-700">{user?.totalChallengesCompleted ?? "--"}</div>
            <div className="text-xs text-gray-500 mb-1">Community Avg: {avgChallenges.toFixed(1)}</div>
            <div className={getDiffClass(user?.totalChallengesCompleted ?? 0, avgChallenges)}>
              {user && (user.totalChallengesCompleted >= avgChallenges ? "Above" : "Below")} average
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 text-green-800 bg-green-50 rounded p-3 text-center font-medium">
          {user && user.totalCO2 >= avgCO2
            ? "Great job! You're leading the way in the community."
            : "Keep it up! Every step counts and the community is here to support you."}
        </div>
      </div>
    </div>
  );
}
