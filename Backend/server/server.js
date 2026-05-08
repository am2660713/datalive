import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/ProjectRoutes.js";
import dailyRoutes from "./routes/dailyRoutes.js";
import targetRoutes from "./routes/target.js";
import cors from "cors";

// ❗ IMPORTANT: models import karo
import Project from "./models/Project.js";


dotenv.config();
connectDB();

const app = express();

// middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/target", targetRoutes);
// ✅ GET projects by email (SAFE VERSION)
app.get("/api/projects/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const projects = await Project.find({ userEmail: email });
    res.json(projects);
  } catch (error) {
    console.error("Projects error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET daily
app.use("/api/daily", dailyRoutes);

// ✅ Monthly (temporary)
app.get("/api/monthly/:email", async (req, res) => {
  res.json([]); // temp
});

app.post("/api/monthly", async (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});