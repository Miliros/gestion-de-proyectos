import axios from "axios";
import { toast } from "react-toastify";
import { logout } from "./src/redux/slices/authSlice";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

let navigate;

export const setUpInterceptors = (navigation, store) => {
  navigate = navigation; // Asigna navigate para usarlo más adelante

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        store.dispatch(logout());
        toast.error("Tu sesión ha expirado, inicia sesión nuevamente");
        navigate("/");
      }
      return Promise.reject(error);
    }
  );
};

export default api;
