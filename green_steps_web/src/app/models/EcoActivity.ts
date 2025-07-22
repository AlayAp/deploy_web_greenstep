// models/EcoActivity.ts
import mongoose from "mongoose";

const EcoActivitySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  activityType: { type: String, required: true },
  co2Saved: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.EcoActivity || mongoose.model("EcoActivity", EcoActivitySchema);
