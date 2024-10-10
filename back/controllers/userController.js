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

// Obtener todos los usuarios
export const getAllUsuarios = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM usuarios`); // Consulta para obtener todos los usuarios
    res.json(result.rows); // Devuelve los resultados como JSON
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};
