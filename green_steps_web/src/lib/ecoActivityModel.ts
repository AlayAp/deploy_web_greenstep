import mongoose, { Schema, models, model, Document } from 'mongoose';

// TypeScript interface
export interface IEcoActivity extends Document {
  userEmail: string;
  activityType: {
    transport: {
      mode: string;
      distance: number;
    };
    diet: {
      type: string;
      localProduce: number; // percent
    };
    electricity: {
      usage: number;   // kWh
      green: number;   // percent
    };
  };
  co2Saved: number;
  timestamp: Date;
}

// Mongoose schema
const EcoActivitySchema = new Schema<IEcoActivity>({
  userEmail: { type: String, required: true },
  activityType: {
    transport: {
      mode: { type: String, required: true },
      distance: { type: Number, required: true }
    },
    diet: {
      type: { type: String, required: true },
      localProduce: { type: Number, required: true }
    },
    electricity: {
      usage: { type: Number, required: true },
      green: { type: Number, required: true }
    }
  },
  co2Saved: { type: Number, required: true },
  timestamp: { type: Date, required: true, default: Date.now }
});

// Export the model (safe with hot-reload for Next.js)
export const EcoActivity =
  models.EcoActivity || model<IEcoActivity>('EcoActivity', EcoActivitySchema);
