import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slices/authSlice";
import { FloatingLabel, Form } from "react-bootstrap"; // Importar FloatingLabel y Form de react-bootstrap
import styles from "./LoginForm.module.css";

import log from "../Login/log.jpg";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth); // Estado del authSlice

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.type === "auth/loginUser/fulfilled") {
      navigate("/dashboard"); // Redirige si el login es exitoso
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageSection}>
          <img src={log} alt="Login" className={styles.image} />
        </div>
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.title}>Iniciar Sesión</h1>

            {error && <p className={styles.error}>{error}</p>}

            {/* Campo de correo con FloatingLabel */}
            <FloatingLabel
              controlId="floatingEmail"
              label="Correo Electrónico"
              className="mb-3"
            >
              <Form.Control
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FloatingLabel>

            {/* Campo de contraseña con FloatingLabel */}
            <FloatingLabel
              controlId="floatingPassword"
              label="Contraseña"
              className="mb-3"
            >
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FloatingLabel>

            {/* Botón de login */}
            <button
              type="submit"
              className={styles.buttonLog}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Ingresar"}
            </button>

            {/* Enlaces */}
            <p className={styles.link}>
              ¿No tienes cuenta?{" "}
              <a href="#!" className={styles.register}>
                Regístrate
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
