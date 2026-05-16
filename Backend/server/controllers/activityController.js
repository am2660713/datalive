import ActivityLog from "../models/ActivityLog.js";

export const getActivityLogs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view activity logs" });
    }

    const logs = await ActivityLog.find({})
      .populate("actor", "name email role")
      .populate("project", "name client status priority deadline")
      .populate("targetUser", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
