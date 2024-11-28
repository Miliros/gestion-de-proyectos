import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectsByUser } from "../../redux/slices/projectSlice";
import { Modal, Button, Pagination } from "react-bootstrap";

import styles from "../Projects/Projects.module.css";
import Table from "react-bootstrap/Table";

const UserTareas = () => {
  const userProjects = useSelector((state) => state.projects.projects);
  const loading = useSelector((state) => state.projects.loading);
  const id = useSelector((state) =>
    state.auth.user ? state.auth.user.id : null
  );
  const dispatch = useDispatch();
  console.log(userProjects);

  const [currentPage, setCurrentPage] = useState(1);
  const projectPerPage = 4;

  const indexOfLastProject = currentPage * projectPerPage;
  const indexOfFirstProject = indexOfLastProject - projectPerPage;
  const currentProjects = userProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const totalPages = Math.ceil(userProjects.length / projectPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectsByUser(id));
    }
  }, [dispatch, id]);

  return (
    <div className={styles.cntnProject}>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className={`${styles.cntnTable} table-responsive`}>
          <div className={styles.titleAndButton}>
            <p className={styles.title}>Tus proyectos </p>

            <div className={styles.inputs}>
              <i className="fa fa-search"></i>
              <input type="text" placeholder="Buscar proyecto..." />
            </div>
          </div>

          <Table bordered hover>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Nombre</th>
                <th className={styles.tableHeader}>Descripción</th>
                <th className={styles.tableHeader}>Inicio</th>
                <th className={styles.tableHeader}>Finalización</th>
              </tr>
            </thead>
            <tbody>
              {currentProjects.map((project) => (
                <tr key={project.id}>
                  <td>{project.nombre}</td>
                  <td>{project.descripcion}</td>
                  <td>{new Date(project.fecha_inicio).toLocaleDateString()}</td>
                  <td>
                    {new Date(project.fecha_finalizacion).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className={styles.paginado}>
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.buttonPagination}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                  className={styles.buttonPagination}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.buttonPagination}
              />
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTareas;
