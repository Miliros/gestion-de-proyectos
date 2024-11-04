import React from "react";
import styles from "./Task.module.css";

export const NewTaskForm = ({
  newTask,
  setNewTask,
  editingTask,
  setEditingTask,
  editingTaskId,
  handleSubmit,
  users,
  projects,
  setSelectedProjectId,
}) => {
  return (
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
        value={editingTaskId ? editingTask.description : newTask.description}
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
        value={editingTaskId ? editingTask.usuario_id : newTask.usuario_id}
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
        value={editingTaskId ? editingTask.project_id : newTask.project_id}
        onChange={(e) => {
          if (editingTaskId) {
            setEditingTask({
              ...editingTask,
              project_id: e.target.value,
            });
          } else {
            setNewTask({ ...newTask, project_id: e.target.value });
          }
          setSelectedProjectId(e.target.value); // Mantener proyecto seleccionado
        }}
      >
        <option value="">Selecciona un proyecto</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.nombre}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary">
        {editingTaskId ? "Actualizar Tarea" : "Crear Tarea"}
      </button>
    </form>
  );
};
