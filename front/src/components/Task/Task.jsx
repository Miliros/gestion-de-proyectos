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
import { Modal, Button } from "react-bootstrap";
// import TaskItem from "../TaskItem/TaskItem";
import styles from "./Task.module.css";
import { NewTaskForm } from "./NewTaskForm";
import Table from "react-bootstrap/Table";
import { MdOutlineDelete } from "react-icons/md";
import { RiProgress2Line } from "react-icons/ri";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const Task = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const currentUser = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.projects.projects);
  const tasksFromStore = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.projects.loading);

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  useEffect(() => {
    dispatch(fetchUsers());

    if (currentUser?.rol === "admin") {
      dispatch(fetchAllTasks());
    } else {
      dispatch(fetchTasksByUserId(currentUser.id));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    setTasks(tasksFromStore);
  }, [tasksFromStore]);

  const handleAddTask = () => {
    const { name, description, usuario_id, project_id } = newTask;

    if (!name.trim() || !description.trim() || !usuario_id || !project_id) {
      alert("Por favor, completa todos los campos.");
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
      })
      .catch((error) => {
        console.error("Error al agregar la tarea:", error);
        alert("Error al agregar la tarea");
      });
  };

  // const handleEditTask = (task) => {
  //   setEditingTaskId(task.id);
  //   setEditingTask({
  //     name: task.nombre,
  //     status: task.estado,
  //     description: task.descripcion,
  //     usuario_id: task.asignada_a,
  //     project_id: task.proyecto_id,
  //   });
  // };

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
          alert("Tarea actualizada correctamente");
        })
        .catch((error) => {
          console.error("Error al actualizar la tarea:", error);
          alert("Error al actualizar la tarea");
        });
    } else {
      alert("Por favor ingrese un nombre para la tarea");
    }
  };
  const handleShowDeleteModal = (id) => {
    setTaskToDelete(id); // Configura la tarea seleccionada
    setShowDeleteModal(true); // Abre el modal
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) {
      return; // Si no se ha asignado correctamente el ID, no hacer nada
    }

    dispatch(deleteTask(taskToDelete))
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskToDelete));
        alert("Tarea eliminada correctamente");
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.error("Error eliminando tarea:", error);
        alert("Error al eliminar la tarea");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTaskId) {
      handleUpdateTask();
    } else {
      handleAddTask();
    }
  };

  const handleCheckboxChange = (task) => {
    const newStatus = task.estado === "pendiente" ? "completada" : "pendiente";

    // Busco  el ID del usuario correspondiente al nombre asignado
    const assignedUser = users.find(
      (user) => user.nombre === task.usuario_nombre
    );
    const assignedUserId = assignedUser ? assignedUser.id : null;

    if (!assignedUserId) {
      alert("Usuario asignado no encontrado");
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
        alert("Estado de la tarea cambiado correctamente");
      })
      .catch((error) => {
        console.error("Error al cambiar el estado de la tarea:", error);
        alert("Hubo un error al cambiar el estado de la tarea");
      });
  };

  const handleSetInProgress = (task) => {
    // Busco el ID del usuario correspondiente al nombre asignado
    const assignedUser = users.find(
      (user) => user.nombre === task.usuario_nombre
    );
    const assignedUserId = assignedUser ? assignedUser.id : null;

    if (!assignedUserId) {
      alert("Usuario asignado no encontrado");
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
        alert("Tarea marcada como 'en progreso'");
      })
      .catch((error) => {
        console.error("Error al actualizar tarea:", error);
        alert("Error al actualizar tarea");
      });
  };

  return (
    <section className={styles.cntnTask}>
      <h2 className={styles.title}>
        {currentUser?.rol === "admin" ? "Todas las Tareas" : "Tus tareas"}
      </h2>

      <div className={`${styles.cntnTable} table-responsive`}>
        <Table bordered hover>
          <thead>
            <tr>
              <th className={styles.tableHeader}></th>
              <th className={styles.tableHeader}>Nombre</th>
              <th className={styles.tableHeader}>Estado</th>
              {currentUser === "admin" && (
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
                  {users === "admin" && (
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
                        {" "}
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
                        <Tooltip id={`tooltip-${task.id}`}>Eliminar</Tooltip>
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
      </div>
      {currentUser?.rol === "admin" && (
        <Button
          className={`${styles.customButton} btn  btn-sm rounded-pill`}
          onClick={handleShow}
        >
          Crear Tarea
        </Button>
      )}

      <Modal show={show} onHide={handleClose}>
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
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas eliminar esta Tarea?
          <Button
            className={`${styles.customButtonDeleteConfirm} btn  btn-sm rounded-pill`}
            onClick={handleDeleteTask}
          >
            Eliminar
          </Button>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Task;
