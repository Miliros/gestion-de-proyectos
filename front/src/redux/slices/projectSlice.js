import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

const getToken = () => {
  return localStorage.getItem("token");
};
// Función para manejar la redirección a login
const redirectToLogin = (history) => {
  history.push("/login");
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async ({ page = 1 }, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(`${API_URL}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      return response.data;
    } catch (error) {
      // Si el error es 401 o 403, se redirige al login
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        redirectToLogin(getState().history);
      }
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Acción para crear un proyecto
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (newProject, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, newProject, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        redirectToLogin(); // Redirigir al login si el token no es válido
      }
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Acción para actualizar un proyecto
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, updatedProject }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedProject, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        redirectToLogin();
      }
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Acción para eliminar un proyecto
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return id;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        redirectToLogin();
      }
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Obtener proyectos por userId
export const fetchProjectsByUser = createAsyncThunk(
  "projects/fetchProjectsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/usuario/${userId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        redirectToLogin();
      }
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
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
        const updatedProject = action.payload;
        state.projects = state.projects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        );
        localStorage.setItem("projects", JSON.stringify(state.projects)); // Actualiza localStorage
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload
        );
        localStorage.setItem("projects", JSON.stringify(state.projects)); // Guarda en localStorage
      });
  },
});

export default projectSlice.reducer;
