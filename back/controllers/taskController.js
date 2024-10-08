import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Crear una nueva tarea
export const createTask = async (req, res) => {
  const { nombre, descripcion, estado, proyecto_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tareas (nombre, descripcion, estado, proyecto_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, descripcion, estado, proyecto_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ error: "Error al crear tarea" });
  }
};

// Actualizar el estado de una tarea
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tareas SET estado = $1 WHERE id = $2 RETURNING *",
      [estado, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
};

// Obtener tareas filtradas por proyecto
export const getTasksByProject = async (req, res) => {
  const { project_id } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM tareas WHERE proyecto_id = $1",
      [project_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
};
