import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import projectService from "./projectService";

const initialState = {
  projects: [],
  employees: [],
  managers: [],
  activityLogs: [],
  isLoading: false,
  isError: false,
  message: "",
};

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

export const getEmployees = createAsyncThunk(
  "projects/getEmployees",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await projectService.getEmployees(token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const getManagers = createAsyncThunk(
  "projects/getManagers",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await projectService.getManagers(token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const assignEmployeeManager = createAsyncThunk(
  "projects/assignEmployeeManager",
  async ({ employeeId, managerId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await projectService.assignEmployeeManager(employeeId, managerId, token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

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

export const getActivityLogs = createAsyncThunk(
  "projects/getActivityLogs",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await projectService.getActivityLogs(token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const addProjectComment = createAsyncThunk(
  "projects/addComment",
  async ({ id, message }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await projectService.addProjectComment(id, message, token);
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
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
      })
      .addCase(getManagers.fulfilled, (state, action) => {
        state.managers = action.payload;
      })
      .addCase(assignEmployeeManager.fulfilled, (state, action) => {
        state.employees = state.employees.map((employee) =>
          employee._id === action.payload._id ? action.payload : employee
        );
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.projects = state.projects.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      })
      .addCase(getActivityLogs.fulfilled, (state, action) => {
        state.activityLogs = action.payload;
      })
      .addCase(addProjectComment.fulfilled, (state, action) => {
        state.projects = state.projects.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      });
  },
});

export default projectSlice.reducer;
