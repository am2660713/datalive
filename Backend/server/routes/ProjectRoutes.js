import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import Project from "../models/Project.js";

const router = express.Router();

// 🔐 Protected routes
router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.get("/:email", async (req, res) => {
  try {
    const projects = await Project.find({ userEmail: req.params.email });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;