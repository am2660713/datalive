import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      default: "",
    },
    hours: {
      type: Number,
      default: 0,
    },
    web: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Delivered", "In Progress", "Pending Approval", "Blocked"],
      default: "In Progress",
    },
    timesheet: {
      type: String,
      enum: ["Delivered", "—", "Pending"],
      default: "—",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 🔥 important (auth ke liye)
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);