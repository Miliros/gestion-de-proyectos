import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";
import {
  createTask,
  updateTask,
  fetchTasksByUserId,
  fetchAllTasks,
} from "../../redux/slices/taskSlice";
import { Modal, Button } from "react-bootstrap";
import TaskItem from "../TaskItem/TaskItem";
import styles from "./Task.module.css";
import { NewTaskForm } from "./NewTaskForm";

const Task = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const curretUser = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.projects.projects);
  const tasksa = useSelector((state) => state.tasks.tasks);
  const [tasks, setTasks] = useState([]);
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    dispatch(fetchUsers());

    if (curretUser?.rol === "admin") {
      // Si el usuario es admin, obtener todas las tareas
      dispatch(fetchAllTasks());
    } else {
      // Si no es admin, obtener las tareas por userId
      dispatch(fetchTasksByUserId(curretUser.id)); // Cambia esto para usar fetchTasksByUserId
    }
  }, [dispatch, curretUser]);

  useEffect(() => {
    setTasks(tasksa);
  }, [tasksa]);

  const handleAddTask = () => {
    if (newTask.name.trim()) {
      const addedTask = {
        nombre: newTask.name,
        descripcion: newTask.description,
        estado: newTask.status,
        proyecto_id: Number(newTask.project_id),
        asignada_a: Number(newTask.usuario_id),
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
          handleClose(); // Cierra el modal aquí
        })
        .catch((error) => {
          console.error("Error al agregar la tarea:", error);
          alert("Error al agregar la tarea");
        });
    } else {
      alert("Por favor ingrese un nombre para la tarea");
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTask({
      name: task.nombre,
      status: task.estado,
      description: task.descripcion,
      usuario_id: task.asignada_a,
      project_id: task.proyecto_id,
    });
  };

  const handleUpdateTask = () => {
    if (editingTask.name.trim()) {
      const updatedTask = {
        nombre: editingTask.name,
        estado: editingTask.status,
        asignada_a: Number(editingTask.usuario_id),
        proyecto_id: Number(editingTask.project_id),
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

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    alert("Tarea eliminada correctamente");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTaskId) {
      handleUpdateTask(); // Actualiza la tarea si está en modo edición
    } else {
      handleAddTask(); // Agrega una nueva tarea
    }
  };

  const toggleTaskStatus = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              estado: task.estado === "pendiente" ? "completada" : "pendiente",
            }
          : task
      )
    );
    alert("Estado de la tarea cambiado");
  };

  return (
    <section className={styles.cntnTask}>
      <div className="container py-5 h-10">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-lg-8 col-xl-6">
            <div className="card rounded-3">
              <div className="card-body p-4">
                {curretUser?.rol === "admin" ? (
                  <h2 className={styles.taskTitle}>Todas las tareas</h2>
                ) : (
                  <h2 className={styles.taskTitle}>Tus Tareas</h2>
                )}

                <hr />

                {tasks.length === 0 ? (
                  <p>No hay tareas disponibles.</p>
                ) : (
                  <ul className="list-group rounded-0">
                    {tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        users={users}
                        handleEditTask={handleEditTask}
                        handleDeleteTask={handleDeleteTask}
                        toggleTaskStatus={toggleTaskStatus}
                        editingTaskId={editingTaskId}
                      />
                    ))}
                  </ul>
                )}
                <hr />
                <Button
                  className={`${styles.customButton} btn  btn-sm rounded-pill`}
                  onClick={handleShow}
                >
                  Crear Tarea
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton className={styles.cntnModal}>
            <Modal.Title>CREA UNA NUEVA TAREA</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.bodyModal}>
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
      </div>
    </section>
  );
};

export default Task;
