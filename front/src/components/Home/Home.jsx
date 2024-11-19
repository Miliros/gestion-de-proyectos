// Home.js
import React from "react";
import { useSelector } from "react-redux";
import Projects from "../Projects/Projects";
import UserTareas from "../UserTareas/UserTareas";
import styles from "./Home.module.css";

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className={styles.cntnHome}>
      <div className={styles.cntn}>
        {/* <div className={styles.Title}>Bienvenido/a, {user?.nombre}</div> */}
        {user?.rol === "admin" ? <Projects /> : <UserTareas />}
      </div>
    </div>
  );
};

export default Home;
