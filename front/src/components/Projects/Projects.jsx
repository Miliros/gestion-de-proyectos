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
import NewProjectForm from "./NewProjectForm";
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

  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

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
    setShowEditModal(true); // Abre el modal de edición
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
        setShowEditModal(false); // Cierra el modal de edición
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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddProject();
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
      {/* <div>
        <div>Proyectos Activos</div>
      </div>
      <Button variant="outline-dark" onClick={handleShow}>
        Crear Proyecto <i className="fas fa-download ms-1"></i>
      </Button> */}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className={`${styles.cntnTable} table-responsive`}>
          <div className={styles.tableTitle}>
            <div className={`row ${styles.rowCentered}`}>
              <div className={`col-sm-6 ${styles.colCentered}`}>
                <h5>Proyectos activos</h5>
              </div>
              <Button
                className={`${styles.customButton} btn  btn-sm rounded-pill`}
                onClick={handleShow}
              >
                Crear proyecto
              </Button>
            </div>
          </div>

          <Table bordered hover>
            <thead>
              <tr>
                <th className={styles.tableHeader}></th>
                <th className={styles.tableHeader}>Nombre</th>
                <th className={styles.tableHeader}>Descripción</th>
                <th className={styles.tableHeader}>Responsable</th>
                <th className={styles.tableHeader}>Inicio</th>
                <th className={styles.tableHeader}>Finalización</th>
                <th className={styles.tableHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <input
                      className={`${styles.inputCheck} form-check-input`}
                      type="checkbox"
                      id={`checkbox-${project.id}`}
                      value={project.id}
                      aria-label="..."
                    />
                  </td>
                  <td>{project.nombre}</td>
                  <td>{project.descripcion}</td>
                  <td>{project.usuario_nombre}</td>
                  <td>{new Date(project.fecha_inicio).toLocaleDateString()}</td>
                  <td>
                    {new Date(project.fecha_finalizacion).toLocaleDateString()}
                  </td>
                  <td>
                    <FiEdit
                      size={15}
                      onClick={() => handleEditProject(project)} // Abre el modal de edición
                      style={{ cursor: "pointer" }}
                    />
                    <MdOutlineDelete
                      size={17}
                      color="red"
                      onClick={() => handleShowDeleteModal(project.id)}
                      style={{ cursor: "pointer", marginLeft: 8 }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {/* <Task /> */}
      {/* Modal para crear proyecto */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className={styles.cntnModal}>
          <Modal.Title>CREA UN NUEVO PROYECTO</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.bodyModal}>
          <NewProjectForm
            newProject={newProject}
            users={users}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </Modal.Body>
      </Modal>

      {/* Modal para editar proyecto */}
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
            newProject={editingProject} // Se pasa el proyecto en edición
            users={users}
            handleChange={handleEditChange}
            handleSubmit={(e) => {
              e.preventDefault();
              handleUpdateProject();
            }}
            isEditing={true}
          />
        </Modal.Body>
      </Modal>

      {/* Modal de cofirm  para eliminar proyecto */}
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
        </Modal.Body>
        <Modal.Footer>
          <button className={styles.buttonDelete} onClick={handleDeleteProject}>
            Eliminar
          </button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Projects;
