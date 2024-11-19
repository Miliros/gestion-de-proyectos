import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectsByUser } from "../../redux/slices/projectSlice";
import styles from "../Projects/Projects.module.css"; // Asegúrate de tener estilos si es necesario
import Table from "react-bootstrap/Table";

const UserTareas = () => {
  const userProjects = useSelector((state) => state.projects.projects); // Accede a los proyectos
  const loading = useSelector((state) => state.projects.loading); // Accede al estado de carga
  const id = useSelector((state) =>
    state.auth.user ? state.auth.user.id : null
  ); // Verificación para evitar error
  const dispatch = useDispatch();
  console.log(userProjects);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectsByUser(id));
    }
  }, [dispatch, id]);

  return (
    <section className={styles.cntnProject}>
      <h2 className={styles.title}>Tus Proyectos activos</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className={`${styles.cntnTable} table-responsive`}>
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
