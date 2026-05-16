import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://datalive-2.onrender.com/api" : "http://localhost:8080/api");
const API_URL = `${API_BASE}/projects`;
const AUTH_URL = `${API_BASE}/auth`;
const ACTIVITY_URL = `${API_BASE}/activity`;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("app-auth-updated"));
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

const createProject = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

const getProjects = async (token) => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

const getEmployees = async (token) => {
  const res = await axios.get(`${AUTH_URL}/employees`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

const getManagers = async (token) => {
  const res = await axios.get(`${AUTH_URL}/managers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

const assignEmployeeManager = async (employeeId, managerId, token) => {
  const res = await axios.put(
    `${AUTH_URL}/employees/${employeeId}/manager`,
    { employeeId, managerId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

const updateProject = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

const deleteProject = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

const addProjectComment = async (id, message, token) => {
  const res = await axios.post(
    `${API_URL}/${id}/comments`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

const getActivityLogs = async (token) => {
  const res = await axios.get(ACTIVITY_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export default {
  createProject,
  getProjects,
  getEmployees,
  getManagers,
  assignEmployeeManager,
  updateProject,
  deleteProject,
  getActivityLogs,
  addProjectComment,
};
