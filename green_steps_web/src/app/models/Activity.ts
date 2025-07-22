import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  transport: Number,
  energy: Number,
  diet: Number,
  co2: Number,
});

export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
