import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjects,
  createProject,
  deleteProject,
  updateProject,
} from "../redux/slices/projectSlice";
import { fetchUsers } from "../redux/slices/userSlice";
import styles from "./Projects.module.css";

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
    const loadProjects = async () => {
      dispatch(fetchProjects());
    };
    loadProjects();

    const loadUsers = async () => {
      dispatch(fetchUsers());
    };
    loadUsers();
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
      dispatch(createProject(newProject));
      dispatch(fetchProjects());
      dispatch(fetchUsers());
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
    dispatch(fetchUsers());
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
      );
      dispatch(fetchProjects());

      dispatch(fetchUsers());

      setEditingProjectId(null);
      setEditingProject({
        nombre: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_finalizacion: "",
        usuario_id: "",
      });
    } else {
      alert("Por favor, completa todos los campos.");
    }
    dispatch(fetchUsers());
  };
  console.log(projects);
  const handleEditChange = (e) => {
    setEditingProject({
      ...editingProject,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteProject = (id) => {
    dispatch(deleteProject(id));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    handleAddProject();
  };

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div
              className="card"
              style={{ borderRadius: ".75rem", backgroundColor: "#eff1f2" }}
            >
              <div className="card-body py-4 px-4 px-md-5">
                <p>
                  <u>Hey Admin Crea un nuevo Proyecto</u>
                </p>

                <div className="pb-2">
                  <div className="card">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        {/* Form crear proyectos */}
                        <div className="d-flex flex-column">
                          <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Project Name"
                            name="nombre"
                            value={newProject.nombre}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Description"
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
                          <div>
                            <button
                              type="submit" // Cambiado a submit para manejar el formulario
                              className={styles.buttonAdd}
                            >
                              Add Project
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Fechas</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id}>
                          {editingProjectId === project.id ? (
                            <td>
                              <select
                                className="form-control"
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
                            </td>
                          ) : (
                            <td>
                              {project.usuario_nombre
                                ? project.usuario_nombre
                                : "loading"}
                            </td>
                          )}
                          <td>
                            {editingProjectId === project.id ? (
                              <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={editingProject.nombre}
                                onChange={handleEditChange}
                              />
                            ) : (
                              project.nombre
                            )}
                          </td>
                          <td>
                            {editingProjectId === project.id ? (
                              <input
                                type="text"
                                className="form-control"
                                name="descripcion"
                                value={editingProject.descripcion}
                                onChange={handleEditChange}
                              />
                            ) : (
                              project.descripcion
                            )}
                          </td>
                          <td>
                            {editingProjectId === project.id ? (
                              <>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="fecha_inicio"
                                  value={editingProject.fecha_inicio}
                                  onChange={handleEditChange}
                                />
                                <input
                                  type="date"
                                  className="form-control"
                                  name="fecha_finalizacion"
                                  value={editingProject.fecha_finalizacion}
                                  onChange={handleEditChange}
                                />
                              </>
                            ) : (
                              `Inicio: ${new Date(
                                project.fecha_inicio
                              ).toLocaleDateString()} - Fin: ${new Date(
                                project.fecha_finalizacion
                              ).toLocaleDateString()}`
                            )}
                          </td>
                          <td>
                            {editingProjectId === project.id ? (
                              <button
                                className="btn btn-success btn-sm"
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
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    handleDeleteProject(project.id)
                                  }
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
