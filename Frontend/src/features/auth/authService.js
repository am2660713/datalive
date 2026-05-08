import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.user)); // ✅ only user
    localStorage.setItem("token", response.data.token); // ✅ token
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Logout
 const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  return true; // 🔥 important
});

const authService = {
  register,
  login,
  logout,
};

export default authService;
