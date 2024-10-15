import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import Projects from "../Projects/Projects";
import UserTareas from "../UserTareas/UserTareas";
import styles from "./Home.module.css";
import Navbar from "../NavBar/NavBar";

const Home = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className={styles.cntnHome}>
      <Navbar />
      {isAuthenticated ? (
        <div className={styles.cntn}>
          <div className={styles.Title}>Bienvenido, {user?.nombre}</div>

          {user?.rol === "admin" ? <Projects /> : <UserTareas />}
        </div>
      ) : (
        <div>
          <h1>Por favor, inicia sesión</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
