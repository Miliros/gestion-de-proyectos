import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

const getToken = () => {
  return localStorage.getItem("token");
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async ({ page = 1, search = "" }, { rejectWithValue, getState }) => {
    // Añadir search como parámetro
    try {
      const response = await axios.get(
        `${API_URL}?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      return response.data;
    } catch (error) {
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
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Acción para obtener proyectos por userId con búsqueda y paginado
export const fetchProjectsByUser = createAsyncThunk(
  "projects/fetchProjectsByUser",
  async ({ userId, page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/usuario/${userId}?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
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
    search: "",
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
        state.error = action.payload || action.error.message;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        localStorage.setItem("projects", JSON.stringify(state.projects));
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        state.projects = state.projects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        );
        localStorage.setItem("projects", JSON.stringify(state.projects));
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload
        );
        localStorage.setItem("projects", JSON.stringify(state.projects));
      })
      .addCase(fetchProjectsByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProjectsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default projectSlice.reducer;
