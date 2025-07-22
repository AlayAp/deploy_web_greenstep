// models/Challenge.ts
import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  icon: String,
  title: String,
  desc: String,
  daysCompleted: Number,
  totalDays: Number,
  status: String,
  userEmail: { type: String, required: true }, // <-- This!
}, { timestamps: true });

export const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);
export interface Challenge {
  id: string;
  icon: string;
  title: string;
  desc: string;
  daysCompleted: number;
  totalDays: number;
  status?: 'Ongoing' | 'Completed';
  userEmail?: string; // Optional for public challenges
  daysLeft?: number; // Calculated field
  progress?: number; // Calculated field
  total?: number; // Calculated field
}