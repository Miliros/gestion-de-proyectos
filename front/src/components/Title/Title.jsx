import React from "react";
import styles from "./Title.module.css";

const Title = ({ text, subText, userName }) => {
  return (
    <div className={styles.CntText}>
      {userName && <p className={styles.textUser}>Bienvenido/a, {userName}</p>}
      {text && (
        <p className={styles.text}>
          Administra, gestiona y visualiza tus
          <span className={styles.span}>{text}</span>
        </p>
      )}

      {subText && (
        <span>
          <p className={styles.text}>{subText}</p>
        </span>
      )}
    </div>
  );
};

export default Title;
