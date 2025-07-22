// app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { User } from '@/lib/userModel';
import { EcoActivity } from '@/lib/ecoActivityModel';
import { Challenge } from '@/lib/ChallengeModel';
import mongoose from 'mongoose';

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;

  // Fetch user base info
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // ⬇️ Calculate total CO2 saved
  const ecoData = await EcoActivity.aggregate([
    { $match: { userEmail: email } },
    {
      $group: {
        _id: null,
        totalCO2: { $sum: '$co2Saved' },
        averageCO2: { $avg: '$co2Saved' }
      }
    }
  ]);

  const ecoStats = ecoData[0] || { totalCO2: 0, averageCO2: 0 };

  // ⬇️ Count challenges completed
  const completedChallenges = await Challenge.countDocuments({ userEmail: email, status: 'Completed' });

  // Custom achievements for demo
  const achievements = [
    { icon: 'bicycle', label: 'Bike 5 Days' },
    { icon: 'leaf', label: 'Meatless Week' }
  ];

  return NextResponse.json({
    name: user.name,
    totalCO2: parseFloat(ecoStats.totalCO2.toFixed(1)),
    dailyAverage: parseFloat(ecoStats.averageCO2.toFixed(1)),
    currentStreak: 12, // You can calculate this too from activity timestamps
    bestStreak: 15,
    dailyChange: -5, // Compare with last week (optional)
    totalChallengesCompleted: completedChallenges,
    achievements
  });
}
