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
      dispatch(fetchTasksByUserId(curretUser.id)); // x id
    }
  }, [dispatch, curretUser]);

  useEffect(() => {
    setTasks(tasksa);
  }, [tasksa]);

  const handleAddTask = () => {
    const { name, description, usuario_id, project_id } = newTask;

    // Validar que todos los campos requeridos estén llenos
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
        handleClose(); // Cierra el modal aquí
      })
      .catch((error) => {
        console.error("Error al agregar la tarea:", error);
        alert("Error al agregar la tarea");
      });
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

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId))
      .then(() => {
        // Aquí puedes agregar cualquier lógica adicional después de eliminar
      })
      .catch((error) => {
        console.error("Error eliminando tarea:", error);
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

  const toggleCheckStatus = (id, currentStatus) => {
    let newStatus;
    if (currentStatus === "pendiente") {
      newStatus = "completada";
    } else if (currentStatus === "completada") {
      newStatus = "pendiente";
    } else if (currentStatus === "en progreso") {
      newStatus = "completada";
    }

    const taskToUpdate = tasks.find((task) => task.id === id);

    const updatedTask = {
      ...taskToUpdate,
      estado: newStatus,
    };

    dispatch(updateTask({ id, updatedTask }))
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, estado: newStatus } : task
          )
        );
        alert("Estado de la tarea cambiado correctamente");
      })
      .catch((error) => {
        console.error("Error al cambiar el estado de la tarea:", error);
        alert("Hubo un error al cambiar el estado de la tarea");
      });
  };

  const toggleProcessStatus = (id, currentStatus) => {
    let newStatus;
    if (currentStatus === "pendiente" || currentStatus === "completada") {
      newStatus = "en progreso";
    } else if (currentStatus === "en progreso") {
      newStatus = "en progreso";
    }

    const taskToUpdate = tasks.find((task) => task.id === id);

    const updatedTask = {
      ...taskToUpdate,
      estado: newStatus,
    };

    dispatch(updateTask({ id, updatedTask }))
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, estado: newStatus } : task
          )
        );
        alert("Estado de la tarea cambiado correctamente");
      })
      .catch((error) => {
        console.error("Error al cambiar el estado de la tarea:", error);
        alert("Hubo un error al cambiar el estado de la tarea");
      });
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
                        toggleTaskStatus={() =>
                          toggleCheckStatus(task.id, task.estado)
                        } // Cambiar estado con check
                        toggleProcessStatus={() =>
                          toggleProcessStatus(task.id, task.estado)
                        } // Cambiar estado con relojito
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
