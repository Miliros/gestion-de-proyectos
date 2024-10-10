// routes/user.js

import express from "express";
import { getAllUsuarios } from "../controllers/userController.js"; // Asegúrate de ajustar la ruta

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get("/", getAllUsuarios);

export default router;
