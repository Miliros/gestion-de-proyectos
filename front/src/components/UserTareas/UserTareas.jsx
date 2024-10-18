import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectsByUser } from "../../redux/slices/projectSlice";
import styles from "./UserTareas.module.css"; // Asegúrate de tener estilos si es necesario
import Table from "react-bootstrap/Table";

const UserTareas = () => {
  const userProjects = useSelector((state) => state.projects.projects); // Accede a los proyectos
  const loading = useSelector((state) => state.projects.loading); // Accede al estado de carga
  const id = useSelector((state) =>
    state.auth.user ? state.auth.user.id : null
  ); // Verificación para evitar error
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectsByUser(id));
    }
  }, [dispatch, id]);

  return (
    <section className={styles.cntnUserTareas}>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className={`${styles.cntnTable} table-responsive`}>
          <div className={styles.tableTitle}>
            <div className={`row ${styles.rowCentered}`}>
              <div className={`col-sm-6 ${styles.colCentered}`}>
                <h5>Tus Proyectos</h5>
              </div>
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
        </div>
      )}
    </section>
  );
};

export default UserTareas;
