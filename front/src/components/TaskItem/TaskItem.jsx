import React from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../../redux/slices/taskSlice";
import { MdOutlineDelete } from "react-icons/md";
import { RiProgress2Line } from "react-icons/ri";
import styles from "./TaskItem.module.css";

const TaskItem = ({
  task,
  handleDeleteTask,
  toggleTaskStatus,
  toggleProcessStatus,
}) => {
  const dispatch = useDispatch();

  const handleCheckboxChange = (e) => {
    // Cambiar el estado según si está marcado o no
    const newStatus = e.target.checked ? "completada" : "pendiente";

    const updatedTask = {
      estado: newStatus,
      asignada_a: task.asignada_a,
    };

    dispatch(updateTask({ id: task.id, updatedTask }))
      .then(() => {
        toggleTaskStatus(task.id); // Actualiza el estado en la UI
      })
      .catch((error) => {
        console.error("Error actualizando tarea:", error);
      });
  };

  const handleSetInProgress = () => {
    const updatedTask = {
      estado: "en progreso",
      asignada_a: task.asignada_a,
    };

    dispatch(updateTask({ id: task.id, updatedTask }))
      .then(() => {
        toggleProcessStatus(task.id); // Actualiza el estado en la UI
      })
      .catch((error) => {
        console.error("Error actualizando tarea:", error);
      });
  };

  return (
    <li className="list-group-item border-0 d-flex align-items-center ps-0">
      <input
        className="form-check-input me-3"
        type="checkbox"
        checked={task.estado === "completada"}
        onChange={handleCheckboxChange}
        aria-label="..."
      />
      {task.estado === "completada" ? (
        <span className="text-danger">{task.nombre} - Completada</span>
      ) : task.estado === "en progreso" ? (
        <span className="text-primary">{task.nombre} - En Progreso</span>
      ) : (
        <span className="text-success">{task.nombre} - Pendiente</span>
      )}

      <strong className={styles.username}>{task.usuario_nombre}</strong>
      <div className="ms-auto d-flex align-items-center">
        <div>
          <RiProgress2Line
            onClick={() => handleSetInProgress(task.id)}
            size={16}
            color="blue"
            style={{ margin: "4px", cursor: "pointer" }}
          />
          <MdOutlineDelete
            onClick={() => handleDeleteTask(task.id)}
            size={16}
            color="red"
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
