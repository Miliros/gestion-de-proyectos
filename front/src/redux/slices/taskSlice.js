import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

const getToken = () => {
  return localStorage.getItem("token"); // Obtengo el token del localStorage
};

// Acción asíncrona para obtener las tareas filtradas por proyecto
// Acción asíncrona para obtener las tareas filtradas por proyecto
export const fetchTasksByProject = createAsyncThunk(
  "tasks/fetchByProject",
  async (projectId) => {
    const response = await axios.get(`${API_URL}?project_id=${projectId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Agregar el token aquí
      },
    });
    return response.data; // Asegúrate de que la respuesta sea el formato esperado
  }
);

// Acción asíncrona para crear una nueva tarea
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (newTask) => {
    const response = await axios.post(API_URL, newTask, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data; // Devuelve la nueva tarea creada
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
    return response.data; // Devuelve la tarea actualizada
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true; // Comienza la carga
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false; // Finaliza la carga
        state.tasks = action.payload; // Guarda las tareas
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false; // Finaliza la carga
        state.error = action.error.message; // Manejo de error
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true; // Establecer loading a true durante la creación
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false; // Establecer loading a false
        state.tasks.push(action.payload); // Añadir la nueva tarea al estado
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false; // Establecer loading a false
        state.error = action.error.message; // Manejo de error
      });
  },
});

export default tasksSlice.reducer;
