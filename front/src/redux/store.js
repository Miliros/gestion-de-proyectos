// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setUpInterceptors } from "../../axiosConfig";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import userReducer from "./slices/userSlice";
import taskSlice from "./slices/taskSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    users: userReducer,
    tasks: taskSlice,
  },
});
setUpInterceptors(store);
export default store;
