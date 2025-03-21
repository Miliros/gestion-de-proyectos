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
    "Información de la tarea"
  );

  try {
    // Verificar si el usuario existe antes de crear la tarea
    const userExists = await pool.query(
      `SELECT id FROM usuarios WHERE id = $1`,
      [asignada_a]
    );

    if (userExists.rows.length === 0) {
      return res.status(400).json({ error: "El usuario asignado no existe" });
    }

    const result = await pool.query(
      `INSERT INTO tareas (nombre, descripcion, estado, proyecto_id, asignada_a) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
      [nombre, descripcion, estado, proyecto_id, asignada_a]
    );

    const task = result.rows[0];

    const userResult = await pool.query(
      `SELECT nombre FROM usuarios WHERE id = $1`,
      [task.asignada_a]
    );
    const usuarioNombre = userResult.rows[0]?.nombre;

    const projectResult = await pool.query(
      `SELECT nombre FROM proyectos WHERE id = $1`,
      [task.proyecto_id]
    );
    const proyectoNombre = projectResult.rows[0]?.nombre;

    // Devolver la tarea junto con el nombre del usuario y el nombre del proyecto
    res.status(201).json({
      ...task,
      usuario_nombre: usuarioNombre,
      proyecto_nombre: proyectoNombre,
    });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ error: "Error al crear tarea" });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { estado, asignada_a } = req.body;
  console.log("datos recibidos", id, estado, asignada_a);
  try {
    const result = await pool.query(
      "UPDATE tareas SET estado = $1, asignada_a = $2 WHERE id = $3 RETURNING *",
      [estado, asignada_a, id]
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
    const projectId = parseInt(project_id, 10); // Convierte a nUmero

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
// Obtener todas las tareas con paginado y búsqueda
export const getAllTasks = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const limit = 6;
  const search = req.query.search || "";

  // Asegurarse de que la página solicitada no sea menor que 1
  if (page < 1) {
    return res
      .status(400)
      .json({ error: "La página debe ser mayor o igual a 1" });
  }

  const offset = (page - 1) * limit;

  try {
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM tareas WHERE nombre ILIKE $1`,
      [`%${search}%`]
    );
    const totalTasks = parseInt(totalResult.rows[0].count, 10);

    const totalPages = Math.ceil(totalTasks / limit);

    if (totalPages === 0) {
      return res.status(200).json({
        tasks: [],
        totalTasks,
        totalPages,
        currentPage: page,
        message: "No se encontraron tareas.",
      });
    }

    if (page > totalPages) {
      return res
        .status(400)
        .json({ error: "No hay más resultados para esta búsqueda" });
    }

    const result = await pool.query(
      `SELECT 
        t.id, 
        t.nombre, 
        t.descripcion, 
        t.estado, 
        t.proyecto_id, 
        u.nombre AS usuario_nombre,
        p.nombre AS proyecto_nombre
      FROM tareas t
      JOIN usuarios u ON t.asignada_a = u.id
      JOIN proyectos p ON t.proyecto_id = p.id
      WHERE t.nombre ILIKE $1
      LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    res.json({
      tasks: result.rows,
      totalTasks,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error al obtener tareas filtradas:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
};

// Obtener tareas por userId con paginación y búsqueda
export const getTasksByUserId = async (req, res) => {
  const { userId } = req.params;
  let page = parseInt(req.query.page) || 1;
  const limit = 6; // Número de tareas por página
  const search = req.query.search || ""; // Término de búsqueda

  // Asegurarse de que la página solicitada no sea menor que 1
  if (page < 1) {
    return res
      .status(400)
      .json({ error: "La página debe ser mayor o igual a 1" });
  }

  const offset = (page - 1) * limit;

  try {
    // Obtener el total de tareas para el usuario con el término de búsqueda
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM tareas WHERE asignada_a = $1 AND nombre ILIKE $2`,
      [userId, `%${search}%`]
    );
    const totalTasks = parseInt(totalResult.rows[0].count, 10);

    const totalPages = Math.ceil(totalTasks / limit);

    if (totalPages === 0) {
      return res.status(200).json({
        tasks: [],
        totalTasks,
        totalPages,
        currentPage: page,
        message: "No se encontraron tareas.",
      });
    }

    if (page > totalPages) {
      return res
        .status(400)
        .json({ error: "No hay más resultados para esta búsqueda" });
    }

    // Obtener las tareas para el usuario con paginación y búsqueda
    const result = await pool.query(
      `SELECT 
        t.id, 
        t.nombre, 
        t.descripcion, 
        t.estado, 
        t.proyecto_id, 
        p.nombre AS proyecto_nombre
      FROM tareas t
      JOIN proyectos p ON t.proyecto_id = p.id
      WHERE t.asignada_a = $1 AND t.nombre ILIKE $2
      LIMIT $3 OFFSET $4`,
      [userId, `%${search}%`, limit, offset]
    );

    res.json({
      tasks: result.rows,
      totalTasks,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error al obtener tareas por userId:", error);
    res.status(500).json({ error: "Error al obtener tareas por userId" });
  }
};

// Eliminar una tarea por ID
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM tareas WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
};
