// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import userReducer from "./slices/userSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    users: userReducer, // Agregar el reducer de usuarios
  },
});

export default store;
