// pages/api/saveActivity.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { format } from 'date-fns';

const uri = process.env.MONGODB_URI!;
const dbName = 'eco_app';
const collectionName = 'daily_activities';

const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { userId, totalCO2, challengesCompleted, achievements } = req.body;

  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  const today = format(new Date(), 'yyyy-MM-dd');

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const existing = await collection.findOne({ userId, date: today });

    if (existing) {
      // Update existing record
      await collection.updateOne(
        { userId, date: today },
        {
          $inc: {
            totalCO2: totalCO2 || 0,
            challengesCompleted: challengesCompleted || 0,
          },
          $addToSet: {
            achievements: { $each: achievements || [] },
          },
        }
      );
    } else {
      // Insert new
      await collection.insertOne({
        userId,
        date: today,
        totalCO2,
        challengesCompleted,
        achievements,
      });
    }

    return res.status(200).json({ message: 'Activity saved to MongoDB!' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'MongoDB connection failed.' });
  } finally {
    await client.close();
  }
}
