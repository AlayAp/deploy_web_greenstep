// "use client"; // 

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import clsx from "clsx";

// // Chart.js imports
// import { Bar } from "react-chartjs-2";
// import {
//   Chart,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register chart.js components (required for rendering)
// Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// // React-icons
// import {
//   FaBicycle,
//   FaLeaf,
//   FaTint,
//   FaSolarPanel,
//   FaBus,
//   FaUtensils,
// } from "react-icons/fa";

// // User type for CO2 and challenge stats
// type User = {
//   id: number;
//   name: string;
//   currentStreak: number;
//   bestStreak: number;
//   totalCO2: number;
//   dailyAverage: number;
//   dailyChange: number;
//   achievements: { icon: string; label: string }[];
//   totalChallengesCompleted: number;
// };

// // Challenge type for weekly challenge list
// type Challenge = {
//   id: number;
//   icon: string;
//   title: string;
//   desc: string;
//   daysCompleted: number;
//   totalDays: number;
//   status: string; // "Ongoing" | "Completed"
// };

// //  Map between icon keywords and React icons
// const iconMap: Record<string, React.JSX.Element> = {
//   bicycle: <FaBicycle className="text-green-500 text-2xl" />,
//   leaf: <FaLeaf className="text-green-500 text-2xl" />,
//   tint: <FaTint className="text-blue-400 text-2xl" />,
//   solar: <FaSolarPanel className="text-yellow-400 text-2xl" />,
//   bus: <FaBus className="text-blue-500 text-xl" />,
//   utensils: <FaUtensils className="text-green-500 text-xl" />,
// };

// // Tabs for challenge filtering
// const challengeTabs = ["All", "Ongoing", "Completed"];

// export default function DashboardPage() {
//   const [users, setUsers] = useState<User[]>([]); // All users (from mock JSON)
//   const [challenges, setChallenges] = useState<Challenge[]>([]); // Challenge data
//   const [selectedTab, setSelectedTab] = useState("All"); // Tabs: All/Ongoing/Completed
//   const currentUserId = 1; // Currently logged-in user's ID (mocked)

//   // Fetch users and challenges on initial render
//   useEffect(() => {
//     fetch("/api/user")
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) setUsers(data);
//       });

//     fetch("/api/challenges")
//       .then((res) => res.json())
//       .then(setChallenges);
//   }, []);

//   const user = users.find((u) => u.id === currentUserId); // Get current user

//   if (!user || challenges.length === 0) {
//     return (
//       <div className="p-8 text-center text-gray-400">Loading...</div>
//     );
//   }

//   // Filter challenges based on selected tab
//   const filteredChallenges =
//     selectedTab === "All"
//       ? challenges
//       : challenges.filter((c) => c.status === selectedTab);

//   // Prepare CO₂ chart: names and totals
//   const co2Labels = users.map((u) => u.name);
//   const co2Dataset = users.map((u) => u.totalCO2);

//   const barData = {
//     labels: co2Labels,
//     datasets: [
//       {
//         label: "Total CO₂ Saved (kg)",
//         data: co2Dataset,
//         backgroundColor: "rgba(34,197,94,0.7)",
//         borderColor: "rgba(34,197,94,1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const barOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: "Kg CO₂",
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: "User",
//         },
//       },
//     },
//   };

//   return (
//     <div className="bg-[#f6faf7]">
//       <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-screen">
//         {/*  Community CO₂ Chart */}
//         <div className="bg-white p-4 rounded-md shadow mb-8">
//           <div className="font-semibold mb-2 text-black">CO₂ Saved by Community</div>
//           <Bar data={barData} options={barOptions} />
//         </div>

//         {/*  Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6 flex flex-col">
//             <div className="text-gray-500 text-sm mb-1">Current Streak</div>
//             <div className="text-3xl font-bold text-green-600">
//               {user.currentStreak} Days
//             </div>
//             <div className="text-xs text-gray-400">
//               Best: {user.bestStreak} days
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6 flex flex-col">
//             <div className="text-gray-500 text-sm mb-1">
//               Total CO₂ Saved
//             </div>
//             <div className="text-3xl font-bold text-green-600">
//               {user.totalCO2} kg
//             </div>
//             <div className="text-xs text-gray-400">This month</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6 flex flex-col">
//             <div className="text-gray-500 text-sm mb-1">
//               Daily Average
//             </div>
//             <div className="text-3xl font-bold text-green-600">
//               {user.dailyAverage} kg
//             </div>
//             <div className="text-xs text-gray-400">
//               {user.dailyChange > 0 ? "+" : ""}
//               {user.dailyChange}% vs last week
//             </div>
//           </div>
//         </div>

//         {/*  Achievements */}
//         <div>
//           <div className="font-semibold text-lg text-black mb-2">
//             Your Achievements
//           </div>
//           <div className="flex flex-wrap gap-4 mb-8">
//             {user.achievements.map((a, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-lg shadow flex flex-col items-center px-4 py-3 w-[110px] sm:w-[120px] md:w-[140px]"
//               >
//                 {iconMap[a.icon]}
//                 <div className="text-xs text-gray-700 mt-2 text-center">{a.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/*  Weekly Challenges */}
//         <div>
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
//             <div className="font-semibold text-black text-lg">Weekly Challenges</div>
//             <div className="flex gap-2 flex-wrap">
//               {challengeTabs.map((tab) => (
//                 <button
//                   key={tab}
//                   className={clsx(
//                     "px-3 py-1 rounded text-sm font-medium",
//                     selectedTab === tab
//                       ? "bg-green-600 text-white"
//                       : "bg-gray-100 text-black hover:bg-gray-200"
//                   )}
//                   onClick={() => setSelectedTab(tab)}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             {filteredChallenges.map((c) => (
//               <div key={c.id} className="bg-white rounded-lg shadow p-4">
//                 <div className="flex items-center gap-3 mb-1">
//                   {iconMap[c.icon]}
//                   <div className="font-semibold">{c.title}</div>
//                   <span
//                     className={clsx(
//                       "ml-auto px-2 py-0.5 rounded text-xs font-semibold",
//                       c.status === "Completed"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     )}
//                   >
//                     {c.status}
//                   </span>
//                 </div>
//                 <div className="text-xs text-gray-500 mb-2">{c.desc}</div>
//                 <div className="w-full bg-gray-100 h-2 rounded mb-2">
//                   <div
//                     className={clsx(
//                       "h-2 rounded",
//                       c.status === "Completed" ? "bg-green-600" : "bg-blue-500"
//                     )}
//                     style={{
//                       width: `${(c.daysCompleted / c.totalDays) * 100}%`,
//                     }}
//                   />
//                 </div>
//                 <div className="text-xs text-gray-600">
//                   {c.daysCompleted}/{c.totalDays} days completed
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/*  Explore Buttons */}
//         <div className="flex flex-col md:flex-row gap-4 mb-4">
//           <Link
//             href="/community"
//             className="w-full md:w-1/2 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition text-center"
//           >
//             Compare with Community
//           </Link>
//           <button
//             className="w-full md:w-1/2 bg-gray-100 text-gray-700 py-2 rounded font-semibold hover:bg-gray-200 transition"
//             onClick={() => alert("Your data has been reset!")}
//           >
//             Reset Data
//           </button>
//         </div>

//         {/* 🧾 Footer Stats */}
//         <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 border-t pt-3 gap-2 text-center">
//           <div>
//             Total Challenges: {user.totalChallengesCompleted} completed this week
//           </div>
//           <Link href="/challenge-feed" className="text-green-700 hover:underline">
//             View All Challenges
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { useSession } from 'next-auth/react';

// Chart.js Register
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Icons
import {
  FaBicycle,
  FaLeaf,
  FaTint,
  FaSolarPanel,
  FaBus,
  FaUtensils
} from 'react-icons/fa';

const iconMap: Record<string, JSX.Element> = {
  bicycle: <FaBicycle className="text-green-500 text-2xl" />,
  leaf: <FaLeaf className="text-green-500 text-2xl" />,
  tint: <FaTint className="text-blue-400 text-2xl" />,
  solar: <FaSolarPanel className="text-yellow-400 text-2xl" />,
  bus: <FaBus className="text-blue-500 text-xl" />,
  utensils: <FaUtensils className="text-green-500 text-xl" />,
};

const challengeTabs = ['All', 'Ongoing', 'Completed'];

type UserData = {
  name: string;
  totalCO2: number;
  dailyAverage: number;
  dailyChange: number;
  currentStreak: number;
  bestStreak: number;
  totalChallengesCompleted: number;
  achievements: { icon: string; label: string }[];
};

type Challenge = {
  _id: string;
  title: string;
  desc: string;
  icon: string;
  progress?: number;
  total?: number;
  status?: 'Completed' | 'Ongoing';
  daysLeft?: number;
};

type ComparisonUser = {
  name: string;
  totalCO2: number;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const [comparisonUsers, setComparisonUsers] = useState<ComparisonUser[]>([]);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error);

    fetch('/api/challenges')
      .then((res) => res.json())
      .then((data) => setChallenges(Array.isArray(data) ? data : []));

    // Example comparison users data
    setComparisonUsers([
      { name: 'Alice', totalCO2: 120 },
      { name: 'Bob', totalCO2: 150 },
      { name: 'Charlie', totalCO2: 100 },
    ]);
  }, [status, session]);

  const filteredChallenges =
    selectedTab === 'All'
      ? challenges
      : challenges.filter((c) => c.status === selectedTab);

  // Build chart labels including user + community
  const labels = comparisonUsers.map((u) => u.name);
  if (user && !labels.includes(user.name)) {
    labels.push(user.name);
  }

  // Data aligned with labels
  const dataValues = labels.map((name) =>
    name === user?.name
      ? user.totalCO2
      : comparisonUsers.find((u) => u.name === name)?.totalCO2 ?? 0
  );

  const barData = {
    labels,
    datasets: [
      {
        label: 'Total CO₂ Saved (kg)',
        data: dataValues,
        backgroundColor: labels.map((name) =>
          name === user?.name ? 'rgba(34,197,94,0.9)' : 'rgba(107,114,128,0.7)'
        ),
        borderColor: labels.map((name) =>
          name === user?.name ? 'rgba(34,197,94,1)' : 'rgba(107,114,128,1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    plugins: { legend: { display: false } },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Kg CO₂' },
      },
      x: {
        title: { display: true, text: 'Users' },
      },
    },
  };

  if (!user || (status === 'loading' && !session)) {
    return <div className="text-center text-gray-400 p-10">Loading...</div>;
  }

  return (
    <div className="bg-[#f6faf7] min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">

        {/* Comparison Chart (includes user) */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-black mb-3">
            Your CO₂ Saved Compared to Others
          </h3>
          <Bar data={barData} options={barOptions} />
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card title="Current Streak" value={`${user.currentStreak} Days`} sub={`Best: ${user.bestStreak} Days`} />
          <Card title="Total CO₂ Saved" value={`${user.totalCO2} kg`} sub="This month" />
          <Card title="Daily Average" value={`${user.dailyAverage} kg`} sub={`${user.dailyChange >= 0 ? '+' : ''}${user.dailyChange}% vs last week`} />
        </div>

        {/* Achievements */}
        <Section title="Your Achievements">
          <div className="flex flex-wrap gap-4">
            {user.achievements.map((a, i) => (
              <div key={i} className="bg-white rounded-lg shadow flex flex-col items-center px-4 py-3 w-[120px]">
                {iconMap[a.icon]}
                <div className="text-xs text-gray-700 mt-2 text-center">{a.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Challenges */}
        <Section title="Your Challenges">
          <div className="flex gap-2 mb-3">
            {challengeTabs.map((tab) => (
              <button
                key={tab}
                className={clsx(
                  "px-3 py-1 rounded text-sm font-medium",
                  selectedTab === tab
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                )}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChallenges.map((c) => (
              <div key={c._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-3 mb-1">
                  {iconMap[c.icon]}
                  <div className="font-semibold">{c.title}</div>
                  {c.status && (
                    <span
                      className={clsx(
                        "ml-auto px-2 py-0.5 rounded text-xs font-semibold",
                        c.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      )}
                    >
                      {c.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">{c.desc}</p>

                {c.progress !== undefined && c.total !== undefined ? (
                  <>
                    <div className="w-full bg-gray-100 h-2 rounded mb-2">
                      <div
                        style={{ width: `${(c.progress / c.total) * 100}%` }}
                        className={clsx(
                          "h-2 rounded",
                          c.status === "Completed" ? "bg-green-600" : "bg-blue-500"
                        )}
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      {c.progress}/{c.total} days completed
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-600">Days left: {c.daysLeft ?? 'N/A'}</p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Explore Footer */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-4">
          <button onClick={() => alert("Your data has been reset!")} className="w-full sm:w-1/2 bg-gray-100 text-gray-700 py-2 rounded font-semibold hover:bg-gray-200">
            Reset Data
          </button>
        </div>

        <footer className="text-xs text-gray-500 border-t pt-3 text-center sm:flex sm:justify-between">
          <span>Total Challenges: {user.totalChallengesCompleted}</span>
          <Link href="/challenge-feed" className="text-green-700 hover:underline">
            View All Challenges
          </Link>
        </footer>
      </div>
    </div>
  );
}

function Card({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col">
      <div className="text-gray-500 text-sm mb-1">{title}</div>
      <div className="text-3xl font-bold text-green-600">{value}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-black mb-3">{title}</h3>
      {children}
    </section>
  );
}
