import React from "react";
import styles from "./LoginForm.module.css";
import { FloatingLabel, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const NewUserRegister = ({
  registerName,
  setRegisterName,
  registerEmail,
  setRegisterEmail,
  registerPassword,
  setRegisterPassword,
  role,
  setRole,
  showPassword,
  setShowPassword,
  loading,
  handleRegisterSubmit,
}) => {
  return (
    <form onSubmit={handleRegisterSubmit} className={styles.form}>
      <FloatingLabel
        controlId="floatingRegisterName"
        label="Nombre"
        className="mb-3"
      >
        <Form.Control
          type="text"
          placeholder="Nombre"
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
          required
        />
      </FloatingLabel>
      <FloatingLabel
        controlId="floatingRegisterEmail"
        label="Correo Electrónico"
        className="mb-3"
      >
        <Form.Control
          type="email"
          placeholder="Correo Electrónico"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          required
        />
      </FloatingLabel>

      <FloatingLabel
        controlId="floatingRegisterPassword"
        label="Contraseña"
        className="mb-3"
      >
        <Form.Control
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className={styles.eyeButton}
          onClick={() => setShowPassword(!showPassword)} // Cambia el estado al hacer clic
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </FloatingLabel>

      <Form.Group controlId="floatingRole" className={styles.cntnCheck}>
        <Form.Check
          type="radio"
          label="Admin"
          name="role"
          value="admin"
          checked={role === "admin"}
          onChange={() => setRole("admin")}
          className={styles.check}
        />
        <Form.Check
          type="radio"
          label="User"
          name="role"
          value="user"
          checked={role === "user"}
          onChange={() => setRole("usuario")}
          className={styles.check}
        />
      </Form.Group>

      <button type="submit" className={styles.buttonLog} disabled={loading}>
        {loading ? "Registrando..." : "Create"}
      </button>
    </form>
  );
};
