import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject, fetchProjects } from "../../redux/slices/projectSlice";
import styles from "./Projects.module.css";

const CreateProject = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);

  const [newProject, setNewProject] = useState({
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_finalizacion: "",
    usuario_id: "",
  });

  const handleChange = (e) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      nombre,
      descripcion,
      fecha_inicio,
      fecha_finalizacion,
      usuario_id,
    } = newProject;

    if (
      nombre.trim() &&
      descripcion.trim() &&
      fecha_inicio &&
      fecha_finalizacion &&
      usuario_id
    ) {
      dispatch(createProject(newProject));
      dispatch(fetchProjects());
      setNewProject({
        nombre: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_finalizacion: "",
        usuario_id: "",
      });
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Proyecto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={newProject.nombre}
          onChange={handleChange}
          placeholder="Nombre del proyecto"
        />
        <input
          type="text"
          name="descripcion"
          value={newProject.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
        />
        <input
          type="date"
          name="fecha_inicio"
          value={newProject.fecha_inicio}
          onChange={handleChange}
        />
        <input
          type="date"
          name="fecha_finalizacion"
          value={newProject.fecha_finalizacion}
          onChange={handleChange}
        />
        <select
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
        <button type="submit">Crear Proyecto</button>
      </form>
    </div>
  );
};

export default CreateProject;
