import React from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../../redux/slices/taskSlice";
import styles from "./TaskItem.module.css";

const TaskItem = ({ task, users, handleDeleteTask, toggleTaskStatus }) => {
  const dispatch = useDispatch();

  // Maneja el cambio del estado de la tarea
  const handleCheckboxChange = (e) => {
    const newStatus = e.target.checked ? "completada" : "pendiente"; // Cambia el estado de la tarea
    const asignada_a = task.asignada_a; // ID del usuario asignado

    const updatedTask = {
      estado: newStatus,
      asignada_a,
    };

    // Mostrar en consola el id y los datos que se van a enviar
    console.log("ID de la tarea:", task.id);
    console.log("Datos que se envían al backend:", updatedTask);

    // Actualizar la tarea en el backend
    dispatch(updateTask({ id: task.id, updatedTask }));

    // Alternar el estado localmente
    toggleTaskStatus(task.id);
  };

  return (
    <li className="list-group-item border-0 d-flex align-items-center ps-0">
      <input
        className="form-check-input me-3"
        type="checkbox"
        checked={task.estado === "completada"} // Asegúrate de que este sea el estado correcto
        onChange={handleCheckboxChange}
        aria-label="..."
      />
      {task.estado === "completada" ? (
        <span className="text-danger">{task.nombre} - Completada</span>
      ) : (
        <span className="text-success">{task.nombre} - Pendiente</span>
      )}
      <strong className={styles.username}>
        {users.find((user) => user.id === task.asignada_a)?.nombre}
      </strong>
      <div className="ms-auto">
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDeleteTask(task.id)}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
