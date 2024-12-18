import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/usuarios";

// Función para obtener el token del localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Función para manejar la redirección a login
const redirectToLogin = (history) => {
  history.push("/login");
};

// Función para obtener los usuarios con paginación y búsqueda
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page = 1, search = "" }, { rejectWithValue, getState }) => {
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

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId) => {
    const response = await axios.delete(
      `http://localhost:5000/api/usuarios/${userId}`
    );
    return userId;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    search: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectUsers = (state) => state.users.users;
export const selectLoading = (state) => state.users.loading;
export const selectError = (state) => state.users.error;

export const selectUserById = (state, userId) =>
  state.users.users.find((user) => user.id === userId);

export default userSlice.reducer;
