import Project from "../models/Project.js";
import User from "../models/User.js";
import { getEffectiveRole } from "../utils/roles.js";

const getManagerEmployeeIds = async (managerId) => {
  const employees = await User.find({ manager: managerId }).select("_id");
  return employees.map((employee) => employee._id);
};

export const createProject = async (req, res) => {
  try {
    const { assigneeId, ...projectPayload } = req.body;

    let projectOwnerId = req.user.id;
    let assignedBy = null;

    if (["admin", "manager"].includes(req.user.role)) {
      if (!assigneeId) {
        return res.status(400).json({ message: "Please select an employee" });
      }

      const employee = await User.findOne({
        $and: [{ _id: assigneeId }, { _id: { $ne: req.user._id } }],
      });
      if (!employee || getEffectiveRole(employee) !== "employee") {
        return res.status(400).json({ message: "Selected employee not found" });
      }

      if (req.user.role === "manager" && employee.manager?.toString() !== req.user.id) {
        return res.status(403).json({ message: "Employee is not assigned to this manager" });
      }

      projectOwnerId = employee._id;
      assignedBy = req.user.id;
    }

    const project = await Project.create({
      ...projectPayload,
      user: projectOwnerId,
      assignedBy,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("user", "name email role")
      .populate("assignedBy", "name email role");

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    let query = { user: req.user.id };

    if (req.user.role === "admin") {
      query = {};
    } else if (req.user.role === "manager") {
      query = { user: { $in: await getManagerEmployeeIds(req.user._id) } };
    }

    const projects = await Project.find(query)
      .populate("user", "name email role")
      .populate("assignedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { user, assignedBy, assigneeId, ...projectPayload } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.user.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    const managerEmployeeIds =
      req.user.role === "manager" ? await getManagerEmployeeIds(req.user._id) : [];
    const isTeamManager = managerEmployeeIds.some(
      (employeeId) => employeeId.toString() === project.user.toString()
    );

    if (!isOwner && !isAdmin && !isTeamManager) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, projectPayload, {
      new: true,
    })
      .populate("user", "name email role")
      .populate("assignedBy", "name email role");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.user.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    const managerEmployeeIds =
      req.user.role === "manager" ? await getManagerEmployeeIds(req.user._id) : [];
    const isTeamManager = managerEmployeeIds.some(
      (employeeId) => employeeId.toString() === project.user.toString()
    );

    if (!isOwner && !isAdmin && !isTeamManager) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
