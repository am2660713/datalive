import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://datalive-2.onrender.com/api" : "http://localhost:8080/api");

const authClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      notifyAuthUpdated();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

const notifyAuthUpdated = () => {
  window.dispatchEvent(new Event("app-auth-updated"));
};

const saveAuth = (data) => {
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("token", data.token);
  notifyAuthUpdated();
};

const register = async (userData) => {
  const response = await authClient.post("/auth/register", userData);

  if (response.data) {
    saveAuth(response.data);
  }

  return response.data;
};

const login = async (userData) => {
  const response = await authClient.post("/auth/login", userData);

  if (response.data) {
    saveAuth(response.data);
  }

  return response.data;
};

const logout = async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  notifyAuthUpdated();
  return true;
};

const changePassword = async (passwordData, token) => {
  const response = await authClient.put("/auth/change-password", passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const forgotPassword = async (email) => {
  const response = await authClient.post("/auth/forgot-password", { email });
  return response.data;
};

const resetPassword = async (data) => {
  const response = await authClient.post("/auth/reset-password", data);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
};

export default authService;
