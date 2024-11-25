import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useLocation, Link, NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

const CustomNavbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [navResponsive, setNavResponsive] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      fixed="top"
      className={navResponsive ? styles.navOne : styles.nav}
    >
      <Container fluid>
        <Navbar.Brand href="#" className={styles.brand}>
          GESTION DE PROYECTOS
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          className={styles.buttonResponsive}
          onClick={() => setNavResponsive(!navResponsive)}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
            <Link to="/tasks" className={`nav-link ${styles.p}`}>
              Tareas
            </Link>
            <Link to="/users" className={`nav-link ${styles.p}`}>
              Usuarios
            </Link>
            {location.pathname !== "/dashboard" && (
              <Link to="/dashboard" className={`nav-link ${styles.p}`}>
                Proyectos
              </Link>
            )}
          </Nav>

          <Nav className="ms-auto d-flex align-items-center justify-content-center">
            <Button
              type="button"
              onClick={handleLogout}
              className={`${styles.buttonLog} btn btn-sm rounded-pill `}
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
