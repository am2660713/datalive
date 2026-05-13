import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/ProjectRoutes.js";
import dailyRoutes from "./routes/dailyRoutes.js";
import targetRoutes from "./routes/target.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../Frontend/dist");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOriginPatterns = [/^https:\/\/.+\.vercel\.app$/];

// middleware
app.use(cors({
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      allowedOriginPatterns.some((pattern) => pattern.test(origin))
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());

// routes
app.get("/api/health", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/target", targetRoutes);

// ✅ GET daily
app.use("/api/daily", dailyRoutes);

// ✅ Monthly (temporary)
app.get("/api/monthly/:email", async (req, res) => {
  res.json([]); // temp
});

app.post("/api/monthly", async (req, res) => {
  res.json({ success: true });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDistPath));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
