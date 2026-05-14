import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  getEffectiveRole,
  isApprovedAdminEmail,
  isApprovedManagerEmail,
} from "../utils/roles.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: getEffectiveRole(user),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, managerInviteCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    let normalizedRole = "employee";

    if (isApprovedAdminEmail(email)) {
      normalizedRole = "admin";
    } else if (
      role === "manager" &&
      process.env.MANAGER_INVITE_CODE &&
      managerInviteCode === process.env.MANAGER_INVITE_CODE &&
      isApprovedManagerEmail(email)
    ) {
      normalizedRole = "manager";
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: getEffectiveRole(user),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admins and managers can view employees" });
    }

    const query =
      req.user.role === "admin"
        ? { _id: { $ne: req.user._id } }
        : { manager: req.user._id };

    const employees = await User.find(query)
      .select("_id name email role manager")
      .populate("manager", "name email role")
      .sort({ name: 1 });

    res.json(
      employees.map((employee) => ({
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: getEffectiveRole(employee),
        manager: employee.manager,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getManagers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view managers" });
    }

    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("_id name email role")
      .sort({ name: 1 });

    const managers = users
      .map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: getEffectiveRole(user),
      }))
      .filter((user) => user.role === "manager");

    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignEmployeeManager = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can assign managers" });
    }

    const { employeeId, managerId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee is required" });
    }

    const employee = await User.findById(employeeId);
    if (!employee || getEffectiveRole(employee) !== "employee") {
      return res.status(400).json({ message: "Selected employee not found" });
    }

    let manager = null;
    if (managerId) {
      manager = await User.findById(managerId);
      if (!manager || getEffectiveRole(manager) !== "manager") {
        return res.status(400).json({ message: "Selected manager not found" });
      }
    }

    employee.manager = manager ? manager._id : null;
    await employee.save();
    await employee.populate("manager", "name email role");

    res.json({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      role: getEffectiveRole(employee),
      manager: employee.manager,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
