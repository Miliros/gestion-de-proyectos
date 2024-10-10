import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

const getToken = () => {
  return localStorage.getItem("token"); // obtengo el token de local
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Añadir el token al encabezado
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
        Authorization: `Bearer ${getToken()}`, // Añadir el token al encabezado
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
        Authorization: `Bearer ${getToken()}`, // mando id body y token
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
        Authorization: `Bearer ${getToken()}`, // Añadir el token al encabezado
      },
    });
    return id; // Devolver el ID para eliminarlo del estado
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
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
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (project) => project.id === action.payload.id
        );
        if (index !== -1) {
          state.projects[index] = { ...action.payload };
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload
        );
      });
  },
});

// Exportar el reducer
export default projectSlice.reducer;
