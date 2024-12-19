import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

const getToken = () => {
  return localStorage.getItem("token");
};

export const fetchAllTasks = createAsyncThunk(
  "tasks/fetchAllTasks",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/all?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data; // Asegúrate de que el backend devuelva los datos correctamente
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchTasksByProject = createAsyncThunk(
  "tasks/fetchByProject",
  async (projectId) => {
    const response = await axios.get(`${API_URL}?project_id=${projectId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (newTask) => {
    const response = await axios.post(API_URL, newTask, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updatedTask }) => {
    const response = await axios.patch(`${API_URL}/${id}`, updatedTask, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  }
);
export const fetchTasksByUserId = createAsyncThunk(
  "tasks/fetchByUserId",
  async ({ userId, page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/${userId}?page=${page}&search=${search}`,
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
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId) => {
    await axios.delete(`${API_URL}/${taskId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return taskId; // Retornar el ID de la tarea eliminada
  }
);
const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    search: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks; // Asumiendo que el backend devuelve una propiedad 'tasks'
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTasksByUserId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchTasksByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateTask.rejected, (state, action) => {
        console.error(action.payload); // Log de error si algo falla
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        // Filtrar la tarea eliminada
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default tasksSlice.reducer;
