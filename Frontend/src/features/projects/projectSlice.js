import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import projectService from "./projectService";

const initialState = {
  projects: [],
  isLoading: false,
  isError: false,
  message: "",
};

// 🔹 Create
export const createProject = createAsyncThunk(
  "projects/create",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await projectService.createProject(data, token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// 🔹 Get All
export const getProjects = createAsyncThunk(
  "projects/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await projectService.getProjects(token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// 🔹 Update
export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await projectService.updateProject(id, data, token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// 🔹 Delete
export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await projectService.deleteProject(id, token);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.projects = state.projects.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (p) => p._id !== action.payload
        );
      });
  },
});

export default projectSlice.reducer;