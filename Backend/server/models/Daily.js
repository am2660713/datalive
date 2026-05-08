import mongoose from "mongoose";

const dailySchema = new mongoose.Schema({
  date: String,
  month: String,
  day: String,
  client: String,
  project: String,
  jobType: String,
  b: Number,
  nb: Number,
  userEmail: String,
}, { timestamps: true });

export default mongoose.model("Daily", dailySchema);