import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js"; // Importa las rutas de proyectos
import taskRoutes from "./routes/tasks.js"; // Importa las rutas de tareas

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes); // Usa las rutas de proyectos
app.use("/api/tasks", taskRoutes); // Usa las rutas de tareas

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
