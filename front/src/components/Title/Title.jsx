import React from "react";
import { useSelector } from "react-redux";

import styles from "./Title.module.css";

const Title = ({ text }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className={styles.CntText}>
      <p className={styles.textUser}>Bienvenido/a, {user?.nombre}</p>
      <p className={styles.text}>
        Administra, gestiona y visualiza tus
        <span className={styles.span}>{text}</span>
      </p>
    </div>
  );
};
export default Title;
