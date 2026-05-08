import mongoose from "mongoose";

const targetSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },

  yearlyTarget: {
    type: Number,
    default: 1000,
  },

  monthlyTargets: {
    type: Map,
    of: Number,
    default: {},
  },
});

export default mongoose.model("Target", targetSchema);