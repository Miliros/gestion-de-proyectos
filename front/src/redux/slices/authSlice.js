import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers } from "./userSlice"; // Asegúrate de que esta línea esté incluida

import axios from "axios";

// Accion asincrónica para manejar la auth
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        userData
      );
      const { token, user } = response.data;
      // Guardo el token en localStorage
      localStorage.setItem("token", token);

      // Despachar la acción para obtener los usuarios
      dispatch(fetchUsers());

      return user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null; // Resetear error al iniciar el login
        // No se establece `state.user` aquí
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
