import express from "express";
import {
  getAllUsuarios,
  deleteUsuario,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsuarios);
router.delete("/:id", deleteUsuario);

export default router;
