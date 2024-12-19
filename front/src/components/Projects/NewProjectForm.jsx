import React from "react";
import { FloatingLabel, Form, Button } from "react-bootstrap";
import styles from "./Projects.module.css";

const NewProjectForm = ({
  newProject,
  users,
  handleChange,
  handleSubmit,
  isEditing,
}) => {
  console.log(users);
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <FloatingLabel
          controlId="floatingNombre"
          label="Nombre del Proyecto"
          className="mb-2 "
        >
          <Form.Control
            type="text"
            placeholder="Nombre del Proyecto"
            name="nombre"
            value={newProject.nombre}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingDescripcion"
          label="Descripción"
          className="mb-2"
        >
          <Form.Control
            type="text"
            placeholder="Descripción"
            name="descripcion"
            value={newProject.descripcion}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingFechaInicio"
          label="Fecha de Inicio"
          className="mb-2"
        >
          <Form.Control
            type="date"
            placeholder="Fecha de Inicio"
            name="fecha_inicio"
            value={newProject.fecha_inicio}
            onChange={handleChange}
          />
        </FloatingLabel>

        {/* Campo de fecha para fecha de finalización */}
        <FloatingLabel
          controlId="floatingFechaFinalizacion"
          label="Fecha de Finalización"
          className="mb-2"
        >
          <Form.Control
            type="date"
            placeholder="Fecha de Finalización"
            name="fecha_finalizacion"
            value={newProject.fecha_finalizacion}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingUsuario"
          label="Selecciona un usuario"
          className="mb-2"
        >
          <Form.Select
            name="usuario_id"
            value={newProject.usuario_id}
            onChange={handleChange}
          >
            <option value="">Selecciona un usuario</option>
            {users?.map((user) => (
              <option
                key={user.id}
                value={user.id}
                size="sm"
                className={styles.option}
              >
                {user.nombre}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <Button
          type="submit"
          className={`${styles.customButtonForm} btn  btn-sm rounded-pill`}
        >
          {isEditing ? "Editar Proyecto" : "Crear Proyecto"}
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;
