import axios from "axios";

const API_URL = "http://localhost:8080/api/projects";

// 🔹 Create
const createProject = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// 🔹 Get All
const getProjects = async (token) => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// 🔹 Update
const updateProject = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// 🔹 Delete
const deleteProject = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export default {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};