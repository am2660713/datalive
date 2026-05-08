import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = "http://localhost:8080/api/auth";

// Register user
const register = async (userData) => {
  const response = await axios.post(`http://localhost:8080/api/auth/register`, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.user)); // ✅ only user
    localStorage.setItem("token", response.data.token); // ✅ token
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`http://localhost:8080/api/auth/login`, userData);

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