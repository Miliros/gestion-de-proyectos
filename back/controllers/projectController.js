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

export const getAllProjects = async (req, res) => {
  let page = parseInt(req.query.page, 10) || 1;
  const limit = 6;
  const search = req.query.search || "";

  if (isNaN(page) || page < 1) {
    return res.status(400).json({
      error: "El parámetro 'page' debe ser un número mayor o igual a 1",
    });
  }

  const offset = (page - 1) * limit;

  try {
    // Contamos los proyectos que coinciden con la búsqueda
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM proyectos WHERE nombre ILIKE $1`,
      [`%${search}%`]
    );

    const totalProjects = parseInt(totalResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalProjects / limit);

    if (totalPages === 0) {
      return res.status(200).json({
        projects: [],
        totalProjects: 0,
        totalPages: 0,
        currentPage: 0,
        message: "No se encontraron proyectos.",
      });
    }

    if (page > totalPages) {
      return res
        .status(400)
        .json({ error: "No hay más resultados para esta búsqueda" });
    }

    // Consultamos los proyectos filtrados por nombre
    const result = await pool.query(
      `SELECT 
        p.id, 
        p.nombre, 
        p.descripcion, 
        p.fecha_inicio, 
        p.fecha_finalizacion, 
        u.nombre AS usuario_nombre
      FROM proyectos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.nombre ILIKE $1
      LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    res.json({
      projects: result.rows,
      totalProjects,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error al obtener proyectos filtrados:", error);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
};

// Obtener un proyecto por ID
export const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM proyectos WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener proyecto:", error);
    res.status(500).json({ error: "Error al obtener proyecto" });
  }
};

// Crear un nuevo proyecto

export const createProject = async (req, res) => {
  const { nombre, descripcion, fecha_inicio, fecha_finalizacion, usuario_id } =
    req.body;

  try {
    console.log("Datos a insertar:", {
      nombre,
      descripcion,
      fecha_inicio,
      fecha_finalizacion,
      usuario_id,
    });

    const result = await pool.query(
      `INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_finalizacion, usuario_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [nombre, descripcion, fecha_inicio, fecha_finalizacion, usuario_id]
    );

    res.status(201).json({
      id: result.rows[0].id,
      nombre,
      descripcion,
      fecha_inicio,
      fecha_finalizacion,
      usuario_id,
    });
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
};

// Actualizar un proyecto
// Actualizar un proyecto
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, fecha_inicio, fecha_finalizacion, usuario_id } =
    req.body; // Agregar los campos de fecha y usuario

  try {
    const result = await pool.query(
      `UPDATE proyectos 
       SET nombre = $1, descripcion = $2, fecha_inicio = $3, fecha_finalizacion = $4, usuario_id = $5 
       WHERE id = $6 
       RETURNING *`,
      [nombre, descripcion, fecha_inicio, fecha_finalizacion, usuario_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar proyecto:", error);
    res.status(500).json({ error: "Error al actualizar proyecto" });
  }
};
// Obtener proyectos asignados a un usuario por su ID con buscador y paginado
export const getProjectsByUserId = async (req, res) => {
  const { userId } = req.params;
  let page = parseInt(req.query.page, 10) || 1;
  const limit = 6;
  const search = req.query.search || "";

  if (isNaN(page) || page < 1) {
    return res.status(400).json({
      error: "El parámetro 'page' debe ser un número mayor o igual a 1",
    });
  }

  const offset = (page - 1) * limit;

  try {
    // Contar proyectos para el usuario con filtro de búsqueda
    const totalResult = await pool.query(
      `SELECT COUNT(*) 
       FROM proyectos 
       WHERE usuario_id = $1 AND nombre ILIKE $2`,
      [userId, `%${search}%`]
    );

    const totalProjects = parseInt(totalResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalProjects / limit);

    if (totalPages === 0) {
      return res.status(200).json({
        projects: [],
        totalProjects: 0,
        totalPages: 0,
        currentPage: 0,
        message: "No se encontraron proyectos.",
      });
    }

    if (page > totalPages) {
      return res
        .status(400)
        .json({ error: "No hay más resultados para esta búsqueda" });
    }

    // Obtener proyectos del usuario con paginado y filtro
    const result = await pool.query(
      `
      SELECT 
        p.id, 
        p.nombre, 
        p.descripcion, 
        p.fecha_inicio, 
        p.fecha_finalizacion
      FROM proyectos p
      WHERE p.usuario_id = $1 AND p.nombre ILIKE $2
      LIMIT $3 OFFSET $4
    `,
      [userId, `%${search}%`, limit, offset]
    );

    res.json({
      projects: result.rows,
      totalProjects,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error al obtener proyectos por usuario:", error);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
};

// Eliminar un proyecto
export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM proyectos WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar proyecto:", error);
    res.status(500).json({ error: "Error al eliminar proyecto" });
  }
};
