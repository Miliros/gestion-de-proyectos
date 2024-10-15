import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectsByUser } from "../../redux/slices/projectSlice";
import styles from "./UserTareas.module.css"; // Asegúrate de tener estilos si es necesario

const UserTareas = () => {
  const userProjects = useSelector((state) => state.projects.projects); // Accede a los proyectos
  const loading = useSelector((state) => state.projects.loading); // Accede al estado de carga
  const id = useSelector((state) => state.auth.user.id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectsByUser(id));
    }
  }, [dispatch, id]);

  return (
    <section className={styles.cntnUserTareas}>
      <h2>Tus Proyectos</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className={`row ${styles.cntnProjets}`}>
          {userProjects.map((project) => (
            <div key={project.id} className="col-md-3 mb-3.5 ">
              <div className="card text-center">
                <div className="card-header">{project.nombre}</div>
                <div className="card-body">
                  <p className="card-text">{project.descripcion}</p>
                  <p>Responsable: {project.usuario_nombre}</p>
                  <p>
                    Inicio:{" "}
                    {new Date(project.fecha_inicio).toLocaleDateString()} - Fin:{" "}
                    {new Date(project.fecha_finalizacion).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default UserTareas;
