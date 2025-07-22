// 'use client';

// import React, { useEffect, useState } from 'react';
// import ChallengeCard from './challange_card';

// // ✅ Correctly define allowed status and filter types
// type StatusType = 'Ongoing' | 'Completed';
// type FilterType = 'all' | StatusType;

// type Challenge = {
//   id: string;
//   title: string;
//   category: string;
//   type?: 'active' | 'featured';
//   description?: string;
//   daysLeft?: number;
//   progress?: number;
//   total?: number;
//   status?: StatusType;
// };

// export default function ChallengeFeedPage() {
//   const [challengesJson, setChallengesJson] = useState<Challenge[]>([]);
//   const [joinedChallengeIds, setJoinedChallengeIds] = useState<string[]>([]);
//   const [filter, setFilter] = useState<FilterType>('all');
//   // ✅ Fetch challenges from MongoDB API
//   useEffect(() => {
//     fetch('/api/challenges')
//       .then((res) => {
//         if (!res.ok) throw new Error('Failed to load challenges data');
//         return res.json();
//       })
//       .then((data: Challenge[]) => {
//         setChallengesJson(data);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   }, []);

//   // Load joined challenge IDs from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem('joinedChallenges');
//     if (stored) {
//       setJoinedChallengeIds(JSON.parse(stored));
//     }
//   }, []);

//   // Save joined challenge IDs to localStorage on change
//   useEffect(() => {
//     localStorage.setItem('joinedChallenges', JSON.stringify(joinedChallengeIds));
//   }, [joinedChallengeIds]);

//   const handleJoin = (id: string) => {
//     if (!joinedChallengeIds.includes(id)) {
//       setJoinedChallengeIds((prev) => [...prev, id]);
//     }
//   };

//   const handleRemove = (id: string) => {
//     setJoinedChallengeIds((prev) => prev.filter((item) => item !== id));
//   };

//   // ✅ Filter and assign status while ensuring correct type
//   const filteredChallenges: Challenge[] = challengesJson
//     .map((challenge): Challenge => ({
//       ...challenge,
//       daysLeft: challenge.daysLeft !== undefined ? Number(challenge.daysLeft) : undefined,
//       progress: challenge.progress !== undefined ? Number(challenge.progress) : undefined,
//       total: challenge.total !== undefined ? Number(challenge.total) : undefined,
//       status: joinedChallengeIds.includes(challenge.id)
//         ? 'Ongoing'
//         : (challenge.progress !== undefined &&
//             challenge.total !== undefined &&
//             challenge.progress === challenge.total)
//         ? 'Completed'
//         : undefined,
//     }))
//     .filter((challenge) => {
//       if (filter === 'all') return true;
//       if (filter === 'Ongoing') return challenge.status === 'Ongoing';
//       if (filter === 'Completed') return challenge.status === 'Completed';
//       return challenge.category === filter;
//     });

//   const featuredChallenges = filteredChallenges.filter((c) => c.type === 'featured');
//   const activeChallenges = filteredChallenges.filter((c) => c.type !== 'featured');

//   return (
//     <main className="max-w-7xl mx-auto px-4 py-6">
//       {/* User Info */}
//       <div className="flex items-center gap-4 mb-6">
//         <img
//           src="https://randomuser.me/api/portraits/women/44.jpg"
//           alt="User"
//           className="w-10 h-10 rounded-full"
//         />
//         <div>
//           <h1 className="text-base font-medium">Hi 👋</h1>
//           <p className="text-xs text-gray-500">Level 12 Eco-Warrior</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left 2/3 content */}
//         <div className="lg:col-span-2">
//           {/* Weekly Progress */}
//           <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl p-4 shadow mb-6">
//             <h2 className="text-sm font-semibold mb-1">Weekly Progress</h2>
//             <div className="h-2 bg-white/30 rounded-full mb-2 overflow-hidden">
//               <div className="h-2 bg-white rounded-full w-[65%]" />
//             </div>
//             <div className="flex justify-between text-xs">
//               <span>13 of 20 challenges completed</span>
//               <span>Week 21 • 65%</span>
//             </div>
//           </div>

//           {/* Filter Buttons */}
//           <div className="mb-6 flex gap-4">
//             {['all', 'Ongoing', 'Completed'].map((f) => (
//               <button
//                 key={f}
//                 className={`px-4 py-2 rounded-full text-sm font-medium border ${
//                   filter === f ? 'bg-green-600 text-white' : 'text-black'
//                 }`}
//                 onClick={() => setFilter(f as FilterType)}
//               >
//                 {f}
//               </button>
//             ))}
//           </div>

//           {/* Active Challenges */}
//           <h3 className="text-lg font-semibold mb-4">Active Challenges</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {activeChallenges.map((challenge) => (
//               <ChallengeCard
//                 key={challenge.id}
//                 challenge={challenge}
//                 onJoin={handleJoin}
//                 onRemove={handleRemove}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right 1/3: Featured */}
//         <div>
//           <h3 className="text-base font-semibold mb-3">Featured Challenges</h3>
//           <div className="space-y-4">
//             {featuredChallenges.map((challenge) => (
//               <ChallengeCard
//                 key={challenge.id}
//                 challenge={challenge}
//                 onJoin={handleJoin}
//                 onRemove={handleRemove}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }




















'use client';

import React, { useEffect, useState } from 'react';
import ChallengeCard from './challange_card';  // Make sure filename matches

type StatusType = 'Ongoing' | 'Completed';
type FilterType = 'all' | StatusType;

type Challenge = {
  id: string;
  title: string;
  category: string;
  type?: 'active' | 'featured';
  description?: string;
  daysLeft?: number;
  progress?: number;
  total?: number;
  status?: StatusType;
};

export default function ChallengeFeedPage() {
  const [challengesJson, setChallengesJson] = useState<Challenge[]>([]);
  const [joinedChallengeIds, setJoinedChallengeIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  // Fetch challenge data from API
  useEffect(() => {
    fetch('/api/challenges')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load challenges data');
        return res.json();
      })
      .then((data: Challenge[]) => {
        setChallengesJson(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Load joined challenge IDs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('joinedChallenges');
    if (stored) {
      setJoinedChallengeIds(JSON.parse(stored));
    }
  }, []);

  // Save joined challenge IDs to localStorage
  useEffect(() => {
    localStorage.setItem('joinedChallenges', JSON.stringify(joinedChallengeIds));
  }, [joinedChallengeIds]);

  const handleJoin = (id: string) => {
    if (!joinedChallengeIds.includes(id)) {
      setJoinedChallengeIds((prev) => [...prev, id]);
    }
  };

  const handleRemove = (id: string) => {
    setJoinedChallengeIds((prev) => prev.filter((item) => item !== id));
  };

  // Normalize and assign status
  const normalizedChallenges: Challenge[] = challengesJson.map((challenge): Challenge => ({
    ...challenge,
    daysLeft: challenge.daysLeft !== undefined ? Number(challenge.daysLeft) : undefined,
    progress: challenge.progress !== undefined ? Number(challenge.progress) : undefined,
    total: challenge.total !== undefined ? Number(challenge.total) : undefined,
    status:
      challenge.status ??
      (joinedChallengeIds.includes(challenge.id)
        ? 'Ongoing'
        : challenge.progress !== undefined &&
          challenge.total !== undefined &&
          challenge.progress === challenge.total
        ? 'Completed'
        : undefined),
  }));

  // Filter challenges (excluding featured)
  const filteredChallenges = normalizedChallenges.filter((challenge) => {
    if (challenge.type === 'featured') return false;
    if (filter === 'all') return true;
    return challenge.status === filter;
  });

  // Featured section
  const featuredChallenges = normalizedChallenges.filter((c) => c.type === 'featured');

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="User"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h1 className="text-base font-medium">Hi 👋</h1>
          <p className="text-xs text-gray-500">Level 12 Eco-Warrior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Challenges */}
        <div className="lg:col-span-2">
          {/* Weekly Progress */}
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl p-4 shadow mb-6">
            <h2 className="text-sm font-semibold mb-1">Weekly Progress</h2>
            <div className="h-2 bg-white/30 rounded-full mb-2 overflow-hidden">
              <div className="h-2 bg-white rounded-full w-[65%]" />
            </div>
            <div className="flex justify-between text-xs">
              <span>13 of 20 challenges completed</span>
              <span>Week 21 • 65%</span>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6 flex gap-4">
            {['all', 'Ongoing', 'Completed'].map((f) => (
              <button
                key={f}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  filter === f ? 'bg-green-600 text-white' : 'text-black'
                }`}
                onClick={() => setFilter(f as FilterType)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Active Challenges */}
          <h3 className="text-lg font-semibold mb-4">Active Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={handleJoin}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

        {/* Right: Featured Challenges */}
        <div>
          <h3 className="text-base font-semibold mb-3">Featured Challenges</h3>
          <div className="space-y-4">
            {featuredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={handleJoin}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
