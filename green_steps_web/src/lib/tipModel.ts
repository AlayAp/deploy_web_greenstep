import mongoose, { Schema, models, model } from 'mongoose';

const TipSchema = new Schema({
  region: String,
  title: String,
  tip: String,
  createdAt: { type: Date, default: Date.now },
  image: String,
  likes: { type: Number, default: 0 },
  category: String,
});

export const Tip = models.Tip || model('Tip', TipSchema);
