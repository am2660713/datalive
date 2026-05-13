import Project from "../models/Project.js";
import User from "../models/User.js";

const employeeUserQuery = {
  $or: [
    { role: "employee" },
    { role: { $exists: false } },
    { role: null },
  ],
};

export const createProject = async (req, res) => {
  try {
    const { assigneeId, ...projectPayload } = req.body;

    let projectOwnerId = req.user.id;
    let assignedBy = null;

    if (req.user.role === "manager") {
      if (!assigneeId) {
        return res.status(400).json({ message: "Please select an employee" });
      }

      const employee = await User.findOne({
        _id: assigneeId,
        ...employeeUserQuery,
      });
      if (!employee) {
        return res.status(400).json({ message: "Selected employee not found" });
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

    if (req.user.role === "manager") {
      const employees = await User.find(employeeUserQuery).select("_id");
      query = { user: { $in: employees.map((employee) => employee._id) } };
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
    const isManager = req.user.role === "manager";

    if (!isOwner && !isManager) {
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
    const isManager = req.user.role === "manager";

    if (!isOwner && !isManager) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
