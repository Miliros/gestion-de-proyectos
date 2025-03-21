import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "./logo.png";

const CustomNavbar = () => {
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [navResponsive, setNavResponsive] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const user = useSelector((state) => state.auth.user);
  const userInitials = user?.nombre
    ? user.nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const proyectosPath = user?.rol === "admin" ? "/projects" : "/userTareas";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      fixed="top"
      className={`${styles.nav} ${isScrolled ? styles.scrolled : ""}`}
    >
      <Container fluid>
        <Navbar.Brand href="#" className={styles.brand}>
          <img className={styles.logo} src={logo} />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          className={styles.buttonResponsive}
          onClick={() => setNavResponsive(!navResponsive)}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
            <Link to="/dashboard" className={`nav-link ${styles.p}`}>
              Home
            </Link>
            <Link to="/tasks" className={`nav-link ${styles.p}`}>
              Tareas
            </Link>
            <Link to="/users" className={`nav-link ${styles.p}`}>
              Usuarios
            </Link>
            <Link to={proyectosPath} className={`nav-link ${styles.p}`}>
              Proyectos
            </Link>
          </Nav>

          <Nav className="ms-auto d-flex align-items-center justify-content-center">
            <Dropdown>
              <Dropdown.Toggle as="div" className={styles.customDropdownToggle}>
                <div className={styles.dropdownContainer}>
                  <span className={styles.dropdownArrow}>▼</span>
                  <div className={styles.dropdownCircle}>
                    <p className={styles.dropdownInitials}>{userInitials}</p>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles.customDropdownMenu}>
                <Dropdown.Item as="div" className={styles.nameUser}>
                  {user.nombre}
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item href="#/action-2">Perfil</Dropdown.Item>
                <Dropdown.Item href="#/action-1" onClick={handleLogout}>
                  Cerrar Sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
