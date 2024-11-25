import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchUsers } from "./userSlice";
import { toast } from "react-toastify";

//accion para registrar un nuevo usuario
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );
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
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        userData
      );
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
  user: JSON.parse(localStorage.getItem("user")) || null, // Carga el usuario desde localStorage
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"), // Verifica si hay un token almacenado
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
        state.error = null; // Resetea el error al iniciar el registro
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload; // Almacena el usuario en el estado
        state.isAuthenticated = true; // Marca el estado como autenticado
        state.loading = false; // Finaliza el estado de carga
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error =
          action.payload?.message || "Error al registrar el usuario.";
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null; // Resetea el error al iniciar el login
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload; // Almacena el usuario en el estado
        state.isAuthenticated = true; // Marca el estado como autenticado
        state.loading = false; // Finaliza el estado de carga
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error =
          action.payload?.message || "Usuario o contraseña incorrectos";
        state.loading = false;
      });
  },
});

// Exportar la acción de logout
export const { logout } = authSlice.actions;

// Exportar el reducer
export default authSlice.reducer;
