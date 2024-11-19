import React from "react";
import { FloatingLabel, Form, Button } from "react-bootstrap";
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
      {/* Campo de nombre de tarea */}
      <FloatingLabel
        controlId="floatingTaskName"
        label="Tarea a realizar"
        className="mb-2"
      >
        <Form.Control
          type="text"
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
      </FloatingLabel>

      {/* Campo de descripción */}
      <FloatingLabel
        controlId="floatingTaskDescription"
        label="Descripción"
        className="mb-2"
      >
        <Form.Control
          type="text"
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
      </FloatingLabel>

      {/* Selección de usuario */}
      <FloatingLabel
        controlId="floatingTaskUser"
        label="Selecciona un usuario"
        className="mb-2"
      >
        <Form.Select
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
        </Form.Select>
      </FloatingLabel>

      {/* Selección de proyecto */}
      <FloatingLabel
        controlId="floatingTaskProject"
        label="Selecciona un proyecto"
        className="mb-3"
      >
        <Form.Select
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
        </Form.Select>
      </FloatingLabel>

      {/* Botón de submit */}

      <Button
        type="submit"
        className={`${styles.customButtonForm} btn  btn-sm rounded-pill`}
      >
        Crear Tarea
      </Button>
    </form>
  );
};
