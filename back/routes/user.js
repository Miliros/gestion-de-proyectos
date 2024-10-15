// routes/user.js

import express from "express";
import {
  getAllUsuarios,
  deleteUsuario,
} from "../controllers/userController.js"; // Asegúrate de ajustar la ruta

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get("/", getAllUsuarios);
//ruta para eliminar usario por id
router.delete("/:id", deleteUsuario);

export default router;
