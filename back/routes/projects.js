import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByUserId,
} from "../controllers/projectController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // Asegúrate de importar el middleware

const router = express.Router();

// Usar el middleware para proteger las rutas
router.use(authMiddleware);

// Rutas para proyectos
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.get("/usuario/:userId", getProjectsByUserId);

router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
