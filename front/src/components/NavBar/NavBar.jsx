import React from "react";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import styles from "./NavBar.module.css";

const Navbar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={styles.cntnNav}>
      <nav class="navbar navbar-expand-lg bg-body-tertiary ">
        <div class="container-fluid ">
          <a class="navbar-brand" href="#">
            GESTION DE PROYECTOS
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/tasks">
                  Tasks
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Users
                </a>
              </li>

              {/* <li class="nav-item">
              <a class="nav-link disabled" aria-disabled="true">
                Disabled
              </a>
            </li> */}
            </ul>
            <form class="d-flex" role="search">
              <button
                type="submit"
                onClick={handleLogout}
                className={styles.buttonLog}
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
