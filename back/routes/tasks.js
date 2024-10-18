import express from "express";
import {
  createTask,
  updateTask,
  getTasksByProject,
  getAllTasks,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // Asegúrate de importar el middleware

const router = express.Router();

// Usar el middleware para proteger las rutas
router.use(authMiddleware);

// Rutas para tareas
router.post("/", createTask);
router.patch("/:id", updateTask);
router.get("/", getTasksByProject);
router.get("/all", getAllTasks); // Nueva ruta para obtener todas las tareas

export default router;
