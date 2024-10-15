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
  const { nombre, descripcion, estado, proyecto_id, asignada_a } = req.body;
  console.log(
    nombre,
    descripcion,
    estado,
    proyecto_id,
    asignada_a,
    "jjjjjjjjjjjjjj"
  );

  try {
    // Crear la tarea
    const result = await pool.query(
      `INSERT INTO tareas (nombre, descripcion, estado, proyecto_id, asignada_a) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
      [nombre, descripcion, estado, proyecto_id, asignada_a]
    );

    // Obtener la tarea creada
    const task = result.rows[0];

    // Obtener el nombre del usuario asignado
    const userResult = await pool.query(
      `SELECT nombre FROM usuarios WHERE id = $1`,
      [task.asignada_a]
    );
    const usuarioNombre = userResult.rows[0]?.nombre;

    // Obtener el nombre del proyecto
    const projectResult = await pool.query(
      `SELECT nombre FROM proyectos WHERE id = $1`,
      [task.proyecto_id]
    );
    const proyectoNombre = projectResult.rows[0]?.nombre;

    // Devolver la tarea junto con el nombre del usuario y el nombre del proyecto
    res.status(201).json({
      ...task,
      usuario_nombre: usuarioNombre,
      proyecto_nombre: proyectoNombre, // Incluir el nombre del proyecto en la respuesta
    });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ error: "Error al crear tarea" });
  }
};

// Actualizar el estado de una tarea
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { estado, asignada_a } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tareas SET estado = $1, asignada_a = $2 WHERE id = $3 RETURNING *", // Cambiar la consulta
      [estado, asignada_a, id] // Asegúrate de que el orden de los parámetros es correcto
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

export const getTasksByProject = async (req, res) => {
  const { project_id } = req.query;

  if (!project_id) {
    return res.status(400).json({ error: "Se requiere el project_id" });
  }

  try {
    const projectId = parseInt(project_id, 10); // Convierte a número

    const result = await pool.query(
      `SELECT 
        t.id, 
        t.nombre, 
        t.descripcion, 
        t.estado, 
        t.proyecto_id, 
        u.nombre AS usuario_nombre 
       FROM tareas t
       JOIN usuarios u ON t.asignada_a = u.id 
       WHERE t.proyecto_id = $1`,
      [projectId]
    );

    // console.log("Resultado de la consulta:", result.rows); // Log para verificar el resultado de la consulta

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron tareas para este proyecto" });
    }

    res.json(result.rows); // Devuelve todas las filas
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
};
