import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addProjectComment,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, updateProject);
router.post("/:id/comments", protect, addProjectComment);
router.delete("/:id", protect, deleteProject);

export default router;
