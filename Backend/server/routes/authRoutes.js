import express from "express";
import {
  assignEmployeeManager,
  getEmployees,
  getManagers,
  loginUser,
  registerUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/employees", protect, getEmployees);
router.get("/managers", protect, getManagers);
router.put("/employees/:id/manager", protect, assignEmployeeManager);

export default router;
