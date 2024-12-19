import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectsByUser } from "../../redux/slices/projectSlice";
import { Modal, Button, Pagination } from "react-bootstrap";

import styles from "../Projects/Projects.module.css";
import Table from "react-bootstrap/Table";

const UserTareas = () => {
  const userProjects = useSelector((state) => state.projects.projects);
  const currentPage = useSelector((state) => state.projects.currentPage);
  const totalPages = useSelector((state) => state.projects.totalPages);

  const loading = useSelector((state) => state.projects.loading);

  const id = useSelector((state) =>
    state.auth.user ? state.auth.user.id : null
  );

  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  console.log(userProjects);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectsByUser({ userId: id, page: currentPage, search }));
    }
  }, [dispatch, id, currentPage]);
  //
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
              <input
                type="text"
                placeholder="Buscar proyecto..."
                value={search}
                onChange={(e) => {
                  e.preventDefault();
                  const searchTerm = e.target.value.trim();
                  setSearch(searchTerm);

                  if (searchTerm === "") {
                    dispatch(fetchProjectsByUser({ userId: id, page: 1 })); // Cargar todos si no hay búsqueda
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const searchTerm = search.trim();
                    if (searchTerm) {
                      dispatch(
                        fetchProjectsByUser({
                          userId: id,
                          page: 1,
                          search: searchTerm,
                        })
                      );
                    } else {
                      dispatch(fetchProjectsByUser({ userId: id, page: 1 }));
                    }
                  }
                }}
              />
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
              {userProjects.map((project) => (
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
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={styles.buttonPagination}
                >
                  {i + 1}
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
