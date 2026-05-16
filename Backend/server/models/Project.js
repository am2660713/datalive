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
      enum: ["Delivered", "-", "Pending", "Not Submitted"],
      default: "-",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    deadline: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ user: 1 });
projectSchema.index({ assignedBy: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });
projectSchema.index({ deadline: 1 });

export default mongoose.model("Project", projectSchema);
