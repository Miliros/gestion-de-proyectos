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
import { Modal, Button, Pagination } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { GoProjectRoadmap } from "react-icons/go";

import NewProjectForm from "./NewProjectForm";
import Title from "../Title/Title";

import { toast } from "react-toastify";
import _ from "lodash";
import DeleteModal from "../Delete/DeleteModal";
import CustomModal from "../CustomModal/CustomModal";

const Projects = () => {
  const dispatch = useDispatch();

  //redux
  const projects = useSelector((state) => state.projects.projects);

  const users = useSelector((state) => state.users.users);
  const currentUser = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.projects.loading);
  const currentPage = useSelector((state) => state.projects.currentPage);
  const totalPages = useSelector((state) => state.projects.totalPages);

  //estados
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

  //modals
  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [search, setSearch] = useState("");

  // Pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(fetchProjects({ page }));
    }
  };

  // Effects
  useEffect(() => {
    dispatch(fetchProjects({ page: currentPage, search }));
    dispatch(fetchUsers({ page: 1, search: "" }));
  }, [dispatch, currentPage]);

  //localstorage
  const updateLocalStorage = (projects, users) => {
    const updatedProjects = projects.map((project) => {
      const user = users.find((user) => user.id === project.usuario_id);
      return { ...project, usuario_nombre: user?.nombre || "No asignado" };
    });
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  // agregar proyecto
  const handleAddProject = (e) => {
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
        toast.success("Proyecto agregado con éxito.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      });
    } else {
      toast.error("Porfavor completa todos los campos", {
        position: "bottom-right",
        autoClose: 3000,
      });
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

  const handleUpdateProject = (e) => {
    e.preventDefault();

    if (
      !editingProject.nombre.trim() ||
      !editingProject.descripcion.trim() ||
      !editingProject.fecha_inicio ||
      !editingProject.fecha_finalizacion ||
      !editingProject.usuario_id
    ) {
      toast.error("Por favor completa todos los campos.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return; // no ejecuto
    }

    // Si la validacion es correcta, actualizo
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
      toast.success("Proyecto editado con éxito.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      setShowEditModal(false);
    });
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
        dispatch(fetchProjects({ page: 1 }));
        setShowDeleteModal(false);

        toast.success("Proyecto eliminado con éxito.", {
          position: "bottom-right",
          autoClose: 3000,
        });
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

  console.log(totalPages, "ACA");

  return (
    <div className={styles.cntnProject}>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <Title text=" Proyectos" subText="Proyectos activos" />
          <div className={`${styles.cntnTable} table-responsive`}>
            <div className={styles.titleAndButton}>
              <GoProjectRoadmap size={24} color="green" />
              <div className={styles.inputs}>
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar proyecto..."
                  value={search}
                  onChange={(e) => {
                    e.preventDefault();
                    const searchTerm = e.target.value.trim();
                    setSearch(searchTerm);

                    if (searchTerm === "") {
                      dispatch(fetchProjects({ page: 1 })); // Cargar todos si no hay búsqueda
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const searchTerm = search.trim();
                      if (searchTerm) {
                        dispatch(
                          fetchProjects({ page: 1, search: searchTerm })
                        );
                      } else {
                        dispatch(fetchProjects({ page: 1 }));
                      }
                    }
                  }}
                />
              </div>

              <button
                className={`${styles.customButton} btn btn-sm rounded-pill`}
                onClick={handleShow}
              >
                + Nuevo
              </button>
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
                                onClick={() =>
                                  handleShowDeleteModal(project.id)
                                }
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
                    <td colSpan={7}>
                      No se encontraron proyectos con ese término de búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className={styles.paginado}>
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.buttonPagination}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={currentPage === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={styles.buttonPagination}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.buttonPagination}
                />
              </Pagination>
            </div>
          </div>
        </>
      )}

      {/* Modales */}
      <CustomModal
        show={show}
        onHide={handleClose}
        title="Nuevo Proyecto"
        classNameHeader="modalHeader"
        classNameBody="bodyModal"
      >
        <NewProjectForm
          newProject={newProject}
          users={users}
          handleChange={handleChange}
          handleSubmit={handleAddProject}
        />
      </CustomModal>

      <CustomModal
        show={showEditModal}
        onHide={handleCloseEdit}
        title="Editar Proyecto"
      >
        <NewProjectForm
          newProject={editingProject}
          users={users}
          handleChange={handleEditChange}
          handleSubmit={handleUpdateProject}
          isEditing={true}
        />
      </CustomModal>

      <DeleteModal
        show={showDeleteModal}
        onHide={handleCloseDelete}
        onConfirm={handleDeleteProject}
        title="Eliminar Proyecto"
        description="¿Estás seguro de que deseas eliminar este Proyecto?"
        styles={styles}
      />
    </div>
  );
};

export default Projects;
