import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setUpInterceptors } from "../axiosConfig";

import LoginForm from "./components/Login/LoginForm";
import Home from "./components/Home/Home";
import Projects from "./components/Projects/Projects";
import Task from "./components/Task/Task";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/NavBar/NavBar";
import User from "./components/Users/Users";
import UserTareas from "./components/UserTareas/UserTareas";
import { jwtDecode } from "jwt-decode";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer/Footer";

function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "89px" }}>{children}</div>
      <Footer />
    </>
  );
}

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiration = decodedToken.exp - currentTime;

      if (timeUntilExpiration <= 0) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      } else {
        const timeout = setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }, timeUntilExpiration * 1000);

        return () => clearTimeout(timeout);
      }
    }
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />

        {/* Rutas protegidas que incluyen el DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Projects />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Task />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <User />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/userTareas"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <UserTareas />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
