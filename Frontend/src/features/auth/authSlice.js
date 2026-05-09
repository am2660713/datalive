import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  token: localStorage.getItem("token") || null, // ✅ add this
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// 🔹 Register
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        error.code === "ECONNABORTED"
          ? "Signup is taking too long. Please try again."
          : error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 🔹 Login
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message =
        error.code === "ECONNABORTED"
          ? "Login is taking too long. Please try again."
          : error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 🔹 Logout
export const logout = createAsyncThunk("AUTH/LOGOUT", async () => {
    return await authService.logout();
})

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
    .addCase(register.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;

  state.user = action.payload.user;   // ✅ correct
  state.token = action.payload.token; // ✅ optional but good
})
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
     .addCase(login.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;

  state.user = action.payload.user;   // ✅ correct
  state.token = action.payload.token; // ✅
})
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null; // 🔥 ye missing tha
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
