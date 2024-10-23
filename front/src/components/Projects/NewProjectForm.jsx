import React from "react";
import styles from "./Projects.module.css";

const NewProjectForm = ({
  newProject,
  users,
  handleChange,
  handleSubmit,
  isEditing,
}) => {
  return (
    <section className={styles.cntnNew}>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            className="form-control mb-1"
            placeholder="Nombre del Proyecto"
            name="nombre"
            value={newProject.nombre}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Descripción"
            name="descripcion"
            value={newProject.descripcion}
            onChange={handleChange}
          />
          <input
            type="date"
            className="form-control mb-2"
            name="fecha_inicio"
            value={newProject.fecha_inicio}
            onChange={handleChange}
          />
          <input
            type="date"
            className="form-control mb-2"
            name="fecha_finalizacion"
            value={newProject.fecha_finalizacion}
            onChange={handleChange}
          />
          <select
            className="form-control mb-2"
            name="usuario_id"
            value={newProject.usuario_id}
            onChange={handleChange}
          >
            <option value="">Selecciona un usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nombre}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.buttonAdd}>
            {isEditing === true ? "Crear Proyecto" : "Editar proyecto"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default NewProjectForm;
