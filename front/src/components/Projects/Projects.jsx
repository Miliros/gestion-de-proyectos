import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjects,
  createProject,
  deleteProject,
  updateProject,
} from "../../redux/slices/projectSlice";
import { fetchUsers } from "../../redux/slices/userSlice";
import styles from "./Projects.module.css";
import Task from "../Task/Task";

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.projects.loading);

  const [newProject, setNewProject] = useState({
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_finalizacion: "",
    usuario_id: "",
  });

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProject, setEditingProject] = useState({
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_finalizacion: "",
    usuario_id: "",
  });

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddProject = () => {
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
      dispatch(createProject(newProject)).then(() => {
        dispatch(fetchProjects());
        setNewProject({
          nombre: "",
          descripcion: "",
          fecha_inicio: "",
          fecha_finalizacion: "",
          usuario_id: "",
        });
      });
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleChange = (e) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setEditingProject({
      nombre: project.nombre,
      descripcion: project.descripcion,
      fecha_inicio: project.fecha_inicio,
      fecha_finalizacion: project.fecha_finalizacion,
      usuario_id: project.usuario_id,
    });
  };

  const handleUpdateProject = () => {
    if (
      editingProject.nombre.trim() &&
      editingProject.descripcion.trim() &&
      editingProject.fecha_inicio &&
      editingProject.fecha_finalizacion &&
      editingProject.usuario_id
    ) {
      dispatch(
        updateProject({
          id: editingProjectId,
          updatedProject: editingProject,
        })
      ).then(() => {
        dispatch(fetchProjects());
        setEditingProjectId(null);
        setEditingProject({
          nombre: "",
          descripcion: "",
          fecha_inicio: "",
          fecha_finalizacion: "",
          usuario_id: "",
        });
      });
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleEditChange = (e) => {
    setEditingProject({
      ...editingProject,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteProject = (id) => {
    dispatch(deleteProject(id)).then(() => {
      dispatch(fetchProjects());
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddProject();
  };
  console.log(projects);
  return (
    <section>
      <h2>Proyectos Activos</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {projects.map((project) => (
            <div key={project.id} className="col-md-4 mb-4">
              <div className="card text-center">
                <div className="card-header">{project.nombre}</div>
                <div className="card-body">
                  {editingProjectId === project.id ? (
                    <>
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="nombre"
                        value={editingProject.nombre}
                        onChange={handleEditChange}
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="descripcion"
                        value={editingProject.descripcion}
                        onChange={handleEditChange}
                      />
                      <select
                        className="form-control mb-2"
                        name="usuario_id"
                        value={editingProject.usuario_id}
                        onChange={handleEditChange}
                      >
                        <option value="">Selecciona un usuario</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.nombre}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        className="form-control mb-2"
                        name="fecha_inicio"
                        value={editingProject.fecha_inicio}
                        onChange={handleEditChange}
                      />
                      <input
                        type="date"
                        className="form-control mb-2"
                        name="fecha_finalizacion"
                        value={editingProject.fecha_finalizacion}
                        onChange={handleEditChange}
                      />
                    </>
                  ) : (
                    <>
                      <p className="card-text">{project.descripcion}</p>
                      <p>Responsable: {project.usuario_nombre}</p>
                      <p>
                        Inicio:{" "}
                        {new Date(project.fecha_inicio).toLocaleDateString()} -
                        Fin:{" "}
                        {new Date(
                          project.fecha_finalizacion
                        ).toLocaleDateString()}
                      </p>
                    </>
                  )}
                  <div className="d-flex justify-content-center">
                    {editingProjectId === project.id ? (
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={handleUpdateProject}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-secondary btn-sm me-2"
                          onClick={() => handleEditProject(project)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="my-4" />
      <h2>Crear un nuevo proyecto</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column">
            <input
              type="text"
              className="form-control mb-2"
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
              Añadir Proyecto
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Projects;
