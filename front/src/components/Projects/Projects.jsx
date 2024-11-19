import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjects,
  createProject,
  deleteProject,
  updateProject,
} from "../../redux/slices/projectSlice";
import { fetchUsers } from "../../redux/slices/userSlice";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import styles from "./Projects.module.css";
import Table from "react-bootstrap/Table";
import { Modal, Button } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import NewProjectForm from "./NewProjectForm";

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const users = useSelector((state) => state.users.users);
  const currentUser = useSelector((state) => state.auth.user);

  const loading = useSelector((state) => state.projects.loading);
  console.log(projects);
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

  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  }, [dispatch]);

  const updateLocalStorage = (projects, users) => {
    const updatedProjects = projects.map((project) => {
      const user = users.find((user) => user.id === project.usuario_id);
      return { ...project, usuario_nombre: user?.nombre || "No asignado" };
    });
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const handleAddProject = (e) => {
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
        dispatch(fetchProjects()).then(() => {
          updateLocalStorage(projects, users); // actualizo el localStorage con usuario_nombre
        });
        setNewProject({
          nombre: "",
          descripcion: "",
          fecha_inicio: "",
          fecha_finalizacion: "",
          usuario_id: "",
        });
        setShow(false);
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
    setShowEditModal(true);
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
        setShowEditModal(false);
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

  const handleShowDeleteModal = (id) => {
    setProjectToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteProject = () => {
    if (projectToDelete) {
      dispatch(deleteProject(projectToDelete)).then(() => {
        dispatch(fetchProjects());
        setShowDeleteModal(false);
      });
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingProjectId(null);
  };
  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  return (
    <section className={styles.cntnProject}>
      <h2 className={styles.title}>Proyectos activos</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className={`${styles.cntnTable} table-responsive`}>
          <Table bordered hover>
            <thead>
              <tr>
                <th className={styles.tableHeader}></th>
                <th className={styles.tableHeader}>Nombre</th>
                <th className={styles.tableHeader}>Descripción</th>
                <th className={styles.tableHeader}>Responsable</th>
                <th className={styles.tableHeader}>Inicio</th>
                <th className={styles.tableHeader}>Finalización</th>
                {currentUser?.rol === "admin" && (
                  <th className={styles.tableHeader}>Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      {users === "admin" && (
                        <input
                          className={`${styles.inputCheck} form-check-input`}
                          type="checkbox"
                          id={`checkbox-${project.id}`}
                          value={project.id}
                          aria-label="..."
                        />
                      )}
                    </td>
                    <td className={styles.td}>{project.nombre}</td>
                    <td className={styles.td}>{project.descripcion}</td>
                    <td className={styles.td}>
                      {project.usuario_nombre || "No asignado"}
                    </td>
                    <td>
                      {new Date(project.fecha_inicio).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(
                        project.fecha_finalizacion
                      ).toLocaleDateString()}
                    </td>
                    {currentUser?.rol === "admin" && (
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-edit-${project.id}`}>
                              Editar
                            </Tooltip>
                          }
                        >
                          <span>
                            <FiEdit
                              size={15}
                              onClick={() => handleEditProject(project)}
                              style={{ cursor: "pointer" }}
                            />
                          </span>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-delete-${project.id}`}>
                              Eliminar
                            </Tooltip>
                          }
                        >
                          <span>
                            <MdOutlineDelete
                              size={17}
                              color="red"
                              onClick={() => handleShowDeleteModal(project.id)}
                              style={{ cursor: "pointer", marginLeft: 8 }}
                            />
                          </span>
                        </OverlayTrigger>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>No hay proyectos para mostrar</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
      {(currentUser?.rol === "admin") === "admin" && (
        <Button
          className={`${styles.customButton} btn  btn-sm rounded-pill`}
          onClick={handleShow}
        >
          Crear proyecto
        </Button>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.titleModal}>
            Nuevo Proyecto
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.bodyModal}>
          <NewProjectForm
            newProject={newProject}
            users={users}
            handleChange={handleChange}
            handleSubmit={handleAddProject}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={handleCloseEdit}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewProjectForm
            newProject={editingProject}
            users={users}
            handleChange={handleEditChange}
            handleSubmit={handleUpdateProject}
            isEditing={true}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={handleCloseDelete}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas eliminar este proyecto?
          <Button
            className={`${styles.customButtonDeleteConfirm} btn  btn-sm rounded-pill`}
            onClick={handleDeleteProject}
          >
            Eliminar
          </Button>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Projects;
