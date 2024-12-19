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

  const handlePageChange = (page) => {
    dispatch(fetchProjectsByUser({ userId: id, page, search }));
  };

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
            <p className={styles.title}>Tus proyectos</p>
            <div className={styles.inputs}>
              <i className="fa fa-search"></i>
              <input
                type="text"
                placeholder="Buscar proyecto..."
                value={search}
                onChange={(e) => {
                  const searchTerm = e.target.value.trim();
                  setSearch(searchTerm); // Actualiza el valor del estado

                  // Si el término de búsqueda está vacío, se cargan todos los proyectos
                  if (searchTerm === "") {
                    dispatch(fetchProjectsByUser({ userId: id, page: 1 }));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const searchTerm = search.trim();
                    // Solo ejecuta la búsqueda si hay algo en el campo de búsqueda
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
              {userProjects.length > 0 ? (
                userProjects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.nombre}</td>
                    <td>{project.descripcion}</td>
                    <td>
                      {new Date(project.fecha_inicio).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(
                        project.fecha_finalizacion
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    No se encontraron proyectos con ese término de búsqueda
                  </td>
                </tr>
              )}
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
