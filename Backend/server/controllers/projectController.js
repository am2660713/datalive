import Project from "../models/Project.js";

// 🔹 Create Project
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      user: req.user.id, // 🔥 logged-in user
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Projects (user-wise)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update Project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔥 security check
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};