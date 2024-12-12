import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";
import {
  createTask,
  updateTask,
  fetchTasksByUserId,
  fetchAllTasks,
  deleteTask,
} from "../../redux/slices/taskSlice";
import { Modal, Button, Pagination } from "react-bootstrap";
import styles from "./Task.module.css";
import { NewTaskForm } from "./NewTaskForm";
import Table from "react-bootstrap/Table";
import { MdOutlineDelete } from "react-icons/md";
import { RiProgress2Line } from "react-icons/ri";
import { toast } from "react-toastify";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import Title from "../Title/Title";

const Task = () => {
  const dispatch = useDispatch();
  //REDUX
  const users = useSelector((state) => state.users.users);
  const currentUser = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.projects.projects);
  const tasksFromStore = useSelector((state) => state.tasks.tasks);
  const currentPage = useSelector((state) => state.tasks.currentPage);
  const totalPages = useSelector((state) => state.tasks.totalPages);

  const loading = useSelector((state) => state.projects.loading);

  //ESTADOS
  const [tasks, setTasks] = useState([]);
  console.log(tasks);
  const [newTask, setNewTask] = useState({
    name: "",
    status: "pendiente",
    description: "",
    usuario_id: "",
    project_id: "",
  });
  const [show, setShow] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState({
    name: "",
    status: "pendiente",
    description: "",
    usuario_id: "",
    project_id: "",
  });
  //MODALS
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [search, setSearch] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //

  //PAGINADO

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(fetchAllTasks({ page }));
      // Asegúrate de actualizar el estado local de la página
    }
  };

  //

  useEffect(() => {
    dispatch(fetchUsers());

    if (currentUser?.rol === "admin") {
      dispatch(fetchAllTasks({ page: currentPage }));
    } else {
      dispatch(fetchTasksByUserId(currentUser.id));
    }
  }, [dispatch, currentUser, currentPage]);

  useEffect(() => {
    console.log("Tareas desde la store", tasksFromStore); // Verifica si las tareas llegan
    setTasks(tasksFromStore);
  }, [tasksFromStore]);

  // AGREGAR TAREA

  const handleAddTask = () => {
    const { name, description, usuario_id, project_id } = newTask;

    if (!name.trim() || !description.trim() || !usuario_id || !project_id) {
      toast.warning("Por favor, completa todos los campos.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const addedTask = {
      nombre: name,
      descripcion: description,
      estado: newTask.status,
      proyecto_id: Number(project_id),
      asignada_a: Number(usuario_id),
    };

    dispatch(createTask(addedTask))
      .then((response) => {
        setTasks([...tasks, response.payload]);
        setNewTask({
          name: "",
          status: "pendiente",
          description: "",
          usuario_id: "",
          project_id: "",
        });
        handleClose();
        toast.success("Tarea añadida con éxito.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("Error al agregar la tarea:", error);
        toast.error("Error al agregar la tarea.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      });
  };

  //EDITAR TAREA
  const handleUpdateTask = () => {
    if (editingTask.name.trim()) {
      const updatedTask = {
        nombre: editingTask.name,
        estado: editingTask.status,
        asignada_a: Number(editingTask.proyecto_id),
      };

      dispatch(updateTask({ id: editingTaskId, updatedTask }))
        .then(() => {
          setTasks(
            tasks.map((task) =>
              task.id === editingTaskId ? { ...task, ...updatedTask } : task
            )
          );

          setEditingTaskId(null);
          setEditingTask({
            name: "",
            status: "pendiente",
            description: "",
            usuario_id: "",
            project_id: "",
          });
        })
        .catch((error) => {
          alert("Error al actualizar la tarea");
        });
    } else {
      alert("Por favor ingrese un nombre para la tarea");
    }
  };
  const handleShowDeleteModal = (id) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  //ELIMINAR TAREA
  const handleDeleteTask = () => {
    if (!taskToDelete) {
      return;
    }

    dispatch(deleteTask(taskToDelete))
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskToDelete));
        toast.error("Tarea eliminada correctamente", {
          position: "bottom-right",
          autoClose: 3000,
        });
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.error("Error eliminando tarea:", error);
        alert("Error al eliminar la tarea");
      });
  };
  //CREAR TAREA
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTaskId) {
      handleUpdateTask();
    } else {
      handleAddTask();
    }
  };
  /// PASAR DE PENDIENTE A COMPLETADA O COMPLETADA PENDIENTE

  const handleCheckboxChange = (task) => {
    const newStatus = task.estado === "pendiente" ? "completada" : "pendiente";

    const assignedUser = users.find(
      (user) => user.nombre === task.usuario_nombre
    );
    const assignedUserId = assignedUser ? assignedUser.id : null;

    if (!assignedUserId) {
      toast.warning("Usuario asignado no encontrado", {
        position: "bottom-right",
        autoClose: 3000,
      });
      toast.warning("El estado de su tarea ha cambiado", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const updatedTask = {
      estado: newStatus,
      asignada_a: assignedUserId,
    };

    dispatch(updateTask({ id: task.id, updatedTask }))
      .then((response) => {
        const updatedTaskFromResponse = response.payload;
        setTasks(
          tasks.map((t) =>
            t.id === task.id ? { ...t, ...updatedTaskFromResponse } : t
          )
        );
        toast.warning("El estado de su tarea ha cambiado", {
          position: "bottom-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("Error al cambiar el estado de la tarea:", error);
        toast.error("hubo un error al cambiar el estado de su tarea ", {
          position: "bottom-right",
          autoClose: 3000,
        });
      });
  };
  //PASARLA A EN PROGRESO
  const handleSetInProgress = (task) => {
    const assignedUser = users.find(
      (user) => user.nombre === task.usuario_nombre
    );
    const assignedUserId = assignedUser ? assignedUser.id : null;

    if (!assignedUserId) {
      toast.warning("Usuario  no encontrado", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const updatedTask = {
      estado: "en progreso",
      asignada_a: assignedUserId,
    };

    dispatch(updateTask({ id: task.id, updatedTask }))
      .then((response) => {
        const updatedTaskFromResponse = response.payload;
        setTasks(
          tasks.map((t) =>
            t.id === task.id ? { ...t, ...updatedTaskFromResponse } : t
          )
        );
        toast.warning("Tarea marcada en progreso", {
          position: "bottom-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("Error al actualizar tarea:", error);
        toast.error("Error al actualizar tarea", {
          position: "bottom-right",
          autoClose: 3000,
        });
      });
  };

  return (
    <div className={styles.cntnTask}>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <Title text="tareas" />
          <div className={`${styles.cntnTable} table-responsive`}>
            <div className={styles.titleAndButton}>
              <p className={styles.title}>
                {currentUser?.rol === "admin"
                  ? "Todas las Tareas"
                  : "Tus tareas"}
              </p>

              <div className={styles.inputs}>
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar tarea..."
                  value={search}
                  onChange={(e) => {
                    e.preventDefault();
                    const searchTerm = e.target.value.trim();
                    setSearch(searchTerm);

                    if (searchTerm === "") {
                      // Si el input está vacío, carga todos los proyectos normales
                      dispatch(fetchAllTasks({ page: 1 }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();

                      const searchTerm = search.trim();
                      if (searchTerm) {
                        // Busco con el término ingresado
                        dispatch(
                          fetchAllTasks({ page: 1, search: searchTerm })
                        );
                      } else {
                        // Si no hay término, recarga los proyectos normales
                        dispatch(fetchAllTasks({ page: 1 }));
                      }
                    }
                  }}
                />
              </div>

              {currentUser?.rol === "admin" && (
                <Button
                  className={`${styles.customButton} btn  btn-sm rounded-pill`}
                  onClick={handleShow}
                >
                  + Nueva
                </Button>
              )}
            </div>
            <Table bordered hover>
              <thead>
                <tr>
                  <th className={styles.tableHeader}></th>
                  <th className={styles.tableHeader}>Nombre</th>
                  <th className={styles.tableHeader}>Estado</th>
                  {currentUser.rol === "admin" && (
                    <th className={styles.tableHeader}>Responsable</th>
                  )}

                  <th className={styles.tableHeader}>Proyecto</th>
                  <th className={styles.tableHeader}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-in-progress-${task.id}`}>
                              Completada
                            </Tooltip>
                          }
                        >
                          <input
                            className={`${styles.inputCheck} form-check-input me-3`}
                            type="checkbox"
                            checked={task.estado === "completada"}
                            onChange={() => handleCheckboxChange(task)}
                            aria-label="..."
                          />
                        </OverlayTrigger>
                      </td>
                      <td className={styles.td}>{task.nombre}</td>
                      <td className={styles.td}>
                        {task.estado === "completada" ? (
                          <span className="text-danger me-3">Completada</span>
                        ) : task.estado === "en progreso" ? (
                          <span className="text-primary me-3">En progreso</span>
                        ) : (
                          <span className="text-success me-3">Pendiente</span>
                        )}
                      </td>
                      {currentUser.rol === "admin" && (
                        <td className={styles.td}>{task.usuario_nombre}</td>
                      )}
                      <td className={styles.td}>{task.proyecto_nombre}</td>
                      <td className={styles.td}>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-in-progress-${task.id}`}>
                              En proceso
                            </Tooltip>
                          }
                        >
                          <span>
                            <RiProgress2Line
                              onClick={() => handleSetInProgress(task)}
                              size={16}
                              color="blue"
                              style={{ marginRight: "4px", cursor: "pointer" }}
                            />
                          </span>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-${task.id}`}>
                              Eliminar
                            </Tooltip>
                          }
                        >
                          <span>
                            {currentUser?.rol === "admin" && (
                              <MdOutlineDelete
                                onClick={() => handleShowDeleteModal(task.id)}
                                size={16}
                                color="red"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay tareas disponibles.
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

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className={styles.headerModal}>
          <Modal.Title>Nueva Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewTaskForm
            newTask={newTask}
            setNewTask={setNewTask}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            editingTaskId={editingTaskId}
            handleSubmit={handleSubmit}
            users={users}
            projects={projects}
            setSelectedProjectId={setSelectedProjectId}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={showDeleteModal}
        onHide={handleCloseDelete}
        backdrop="static"
        keyboard={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            className={`${styles.customButtonDeleteConfirm2} btn  btn-sm rounded-pill`}
            onClick={handleDeleteTask}
          >
            Cancelar
          </Button>
          <Button
            className={`${styles.customButtonDeleteConfirm} btn  btn-sm rounded-pill`}
            onClick={handleDeleteTask}
          >
            Eliminar
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Task;
