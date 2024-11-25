import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../redux/slices/authSlice";
import { FloatingLabel, Form, Modal } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import styles from "./LoginForm.module.css";

import log from "../Login/log.jpg";

function LoginForm() {
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [role, setRole] = useState("user");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ email, password }));

    if (result.type === "auth/loginUser/rejected") {
      // No navegamos si el login falla
      return;
    }

    if (result.type === "auth/loginUser/fulfilled") {
      navigate("/dashboard");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const registerResult = await dispatch(
      registerUser({
        email: registerEmail,
        password: registerPassword,
        rol: role,
        nombre: registerName,
      })
    );

    if (registerResult.type === "auth/registerUser/fulfilled") {
      const loginResult = await dispatch(
        loginUser({
          email: registerEmail,
          password: registerPassword,
        })
      );

      if (loginResult.type === "auth/loginUser/fulfilled") {
        navigate("/dashboard");
      }
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageSection}>
          <img src={log} alt="Login" className={styles.image} />
        </div>
        <div className={styles.formSection}>
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            <h1 className={styles.title}>Iniciar Sesión</h1>

            {/* {error && <p className={styles.error}>{error}</p>} */}

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

            <FloatingLabel
              controlId="floatingPassword"
              label="Contraseña"
              className="mb-3"
            >
              <Form.Control
                type={showPassword ? "text" : "password"} // Cambia el tipo dinámicamente
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)} // Cambia el estado al hacer clic
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {error && <p className={styles.error}>{error}</p>}
            </FloatingLabel>

            <button
              type="submit"
              className={styles.buttonLog}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Ingresar"}
            </button>

            <p className={styles.link}>
              ¿No tienes cuenta?{" "}
              <a
                href="#!"
                className={styles.register}
                onClick={(e) => {
                  e.preventDefault();
                  handleShow();
                }}
              >
                Regístrate
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Modal de registro */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.titleModal}>REGÍSTRATE</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.bodyModal}>
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
              {/* <Form.Label className={styles.label}>Rol:</Form.Label> */}
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

            <button
              type="submit"
              className={styles.buttonLog}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Create"}
            </button>
          </form>
          <Modal.Footer className={styles.modalFooter}></Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default LoginForm;
