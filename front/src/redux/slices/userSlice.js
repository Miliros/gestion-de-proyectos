// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Definir la acción asíncrona para obtener los usuarios
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get("http://localhost:5000/api/usuarios");
  return response.data; // Suponiendo que el API devuelve una lista de usuarios
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // Guarda los usuarios en el estado
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Maneja errores
      });
  },
});

// Exportar el selector para obtener la lista de usuarios
export const selectUsers = (state) => state.users.users;
export const selectLoading = (state) => state.users.loading;
export const selectError = (state) => state.users.error;

// Exportar el reducer
export default userSlice.reducer;
