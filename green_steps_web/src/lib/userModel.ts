import mongoose, { Schema, models, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  notifications?: boolean;
  ecoInterests?: string[];
  createdAt?: Date;
  ecoTips?: number;
  challenges?: number;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  notifications: { type: Boolean, default: true },
  ecoInterests: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  ecoTips: { type: Number, default: 0 },
  challenges: { type: Number, default: 0 },
});

export const User = models.User || mongoose.model<IUser>("User", UserSchema);
