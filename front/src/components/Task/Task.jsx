import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";
import {
  createTask,
  updateTask,
  fetchTasksByProject,
} from "../../redux/slices/taskSlice";
import { fetchProjects } from "../../redux/slices/projectSlice";
import TaskItem from "../TaskItem/TaskItem";
import styles from "./Task.module.css";

const Task = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
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
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState({
    name: "",
    status: "pendiente",
    description: "",
    usuario_id: "",
    project_id: "",
  });

  // State to track the selected project
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // useEffect para cargar usuarios y proyectos
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProjects());
  }, [dispatch]);

  // useEffect para sincronizar tareas desde Redux
  useEffect(() => {
    setTasks(tasksa); // Sincroniza el estado local con las tareas de Redux
  }, [tasksa]);

  // Fetch tasks by project when the selected project changes
  useEffect(() => {
    if (selectedProjectId) {
      dispatch(fetchTasksByProject(selectedProjectId)); // Fetch tasks for the selected project
    }
  }, [dispatch, selectedProjectId]);

  const handleAddTask = () => {
    if (newTask.name.trim()) {
      const addedTask = {
        nombre: newTask.name,
        descripcion: newTask.description,
        estado: newTask.status,
        proyecto_id: Number(newTask.project_id),
        asignada_a: Number(newTask.usuario_id),
      };

      console.log("Enviando al backend:", addedTask);
      dispatch(createTask(addedTask))
        .then((response) => {
          // Manejo del éxito
          setTasks([...tasks, response.payload]); // Asegúrate de que response.payload sea una tarea válida
          setNewTask({
            name: "",
            status: "pendiente",
            description: "",
            usuario_id: "",
            project_id: "",
          });
          alert("Tarea agregada correctamente");
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
          // Actualiza la lista de tareas
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
    <section className="vh-30">
      <div className="container py-5 h-10">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-lg-8 col-xl-6">
            <div className="card rounded-3">
              <div className="card-body p-4">
                <h2 className={styles.taskTitle}>Nueva tarea</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Tarea a realizar"
                    value={editingTaskId ? editingTask.name : newTask.name}
                    onChange={(e) =>
                      editingTaskId
                        ? setEditingTask({
                            ...editingTask,
                            name: e.target.value,
                          })
                        : setNewTask({ ...newTask, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Descripción"
                    value={
                      editingTaskId
                        ? editingTask.description
                        : newTask.description
                    }
                    onChange={(e) =>
                      editingTaskId
                        ? setEditingTask({
                            ...editingTask,
                            description: e.target.value,
                          })
                        : setNewTask({
                            ...newTask,
                            description: e.target.value,
                          })
                    }
                  />
                  <select
                    className="form-control mb-2"
                    value={
                      editingTaskId
                        ? editingTask.usuario_id
                        : newTask.usuario_id
                    }
                    onChange={(e) =>
                      editingTaskId
                        ? setEditingTask({
                            ...editingTask,
                            usuario_id: e.target.value,
                          })
                        : setNewTask({ ...newTask, usuario_id: e.target.value })
                    }
                  >
                    <option value="">Selecciona un usuario</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.nombre}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={
                      editingTaskId
                        ? editingTask.project_id
                        : newTask.project_id
                    }
                    onChange={(e) => {
                      if (editingTaskId) {
                        setEditingTask({
                          ...editingTask,
                          project_id: e.target.value,
                        });
                      } else {
                        setNewTask({ ...newTask, project_id: e.target.value });
                        setSelectedProjectId(e.target.value); // Update selected project ID
                      }
                    }}
                  >
                    <option value="">Selecciona un proyecto</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.nombre}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={editingTaskId ? editingTask.status : newTask.status}
                    onChange={(e) =>
                      editingTaskId
                        ? setEditingTask({
                            ...editingTask,
                            status: e.target.value,
                          })
                        : setNewTask({ ...newTask, status: e.target.value })
                    }
                    required
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="completada">Completada</option>
                  </select>

                  <button type="submit" className={styles.buttonAdd}>
                    {editingTaskId ? "Actualizar" : "Crear"}
                  </button>
                </form>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Task;
