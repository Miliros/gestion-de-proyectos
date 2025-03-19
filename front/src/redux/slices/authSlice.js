import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers } from "./userSlice";
import api from "../../../axiosConfig";

import { toast } from "react-toastify";

//accion para registrar un nuevo usuario
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/register", userData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Usuario registrado con éxito");

      return user;
    } catch (error) {
      toast.error("Error al registrar usuario");
      return rejectWithValue(error.response.data);
    }
  }
);

// Acción para el login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/login", userData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(fetchUsers());

      return user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Estado inicial con verificación del token y el usuario en localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      // Remueve el token y el usuario de localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Error desconocido";
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Error desconocido";
        state.loading = false;

        if (action.payload?.error === "Token has expired") {
          state.isAuthenticated = false;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
