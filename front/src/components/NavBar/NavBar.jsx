import React from "react";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import styles from "./NavBar.module.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary bg-transparent">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          GESTION DE PROYECTOS
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/tasks">
                Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">
                Users
              </Link>
            </li>

            {location.pathname !== "/dashboard" && (
              <li className="nav-item">
                <Link className="nav-link" to="/projects">
                  Projects
                </Link>
              </li>
            )}
          </ul>
          <form className="d-flex" role="search">
            <button
              type="button"
              onClick={handleLogout}
              className={styles.buttonLog}
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
