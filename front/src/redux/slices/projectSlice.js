import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

const getToken = () => {
  return localStorage.getItem("token");
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (newProject) => {
    const response = await axios.post(API_URL, newProject, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, updatedProject }) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedProject, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return id;
  }
);

// Obtener proyectos por userId
export const fetchProjectsByUser = createAsyncThunk(
  "projects/fetchProjectsByUser",
  async (userId) => {
    const response = await axios.get(`${API_URL}/usuario/${userId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: JSON.parse(localStorage.getItem("projects")) || [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        // Evitar duplicados
        const uniqueProjects = action.payload.filter((newProject) =>
          state.projects.every(
            (existingProject) => existingProject.id !== newProject.id
          )
        );
        state.projects.push(...uniqueProjects); // Agregar solo proyectos únicos
        localStorage.setItem("projects", JSON.stringify(state.projects)); // Guarda en localStorage
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        localStorage.setItem("projects", JSON.stringify(state.projects)); // Guarda en localStorage
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (project) => project.id === action.payload.id
        );
        if (index !== -1) {
          state.projects[index] = { ...action.payload };
        }
        localStorage.setItem("projects", JSON.stringify(state.projects)); // Guarda en localStorage
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload
        );
        localStorage.setItem("projects", JSON.stringify(state.projects)); // Guarda en localStorage
      })
      .addCase(fetchProjectsByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectsByUser.fulfilled, (state, action) => {
        state.loading = false;
        // Evitar duplicados
        const uniqueProjects = action.payload.filter((newProject) =>
          state.projects.every(
            (existingProject) => existingProject.id !== newProject.id
          )
        );
        state.projects.push(...uniqueProjects); // Agregar solo proyectos únicos
        localStorage.setItem("projects", JSON.stringify(state.projects)); // Guarda en localStorage
      })
      .addCase(fetchProjectsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Exportar el reducer
export default projectSlice.reducer;
