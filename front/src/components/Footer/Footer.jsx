import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.cntnFooter}>
      <div className={styles.divFotter}>
        <p className={styles.pCopy}>
          &copy; {new Date().getFullYear()} Gestion de Proyectos. Site Credit.
        </p>
      </div>
    </div>
  );
};

export default Footer;
