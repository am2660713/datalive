import express from "express";
import { loginUser, registerUser, getEmployees } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/employees", protect, getEmployees);

export default router;
