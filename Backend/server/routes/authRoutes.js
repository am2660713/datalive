import express from "express";
import {
  assignEmployeeManager,
  changePassword,
  forgotPassword,
  getEmployees,
  getManagers,
  loginUser,
  registerUser,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/employees", protect, getEmployees);
router.get("/managers", protect, getManagers);
router.put("/employees/:id/manager", protect, assignEmployeeManager);
router.put("/change-password", protect, changePassword);

export default router;
