import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://datalive-2.onrender.com/api" : "http://localhost:8080/api");
const API_URL = `${API_BASE}/projects`;

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
