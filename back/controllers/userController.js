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
//OBTENER TODOS LOS USUARIOS
export const getAllUsuarios = async (req, res) => {
  let page = parseInt(req.query.page, 10) || 1; // Página por defecto = 1
  const limit = 6; // Número de usuarios por página
  const search = req.query.search || ""; // Parámetro de búsqueda (por nombre)

  // Asegurarse de que la página solicitada no sea menor que 1
  if (page < 1) {
    return res
      .status(400)
      .json({ error: "La página debe ser mayor o igual a 1" });
  }

  const offset = (page - 1) * limit;

  try {
    // Contamos los usuarios que coinciden con la búsqueda
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM usuarios WHERE nombre ILIKE $1`,
      [`%${search}%`] // Filtramos por nombre (case-insensitive)
    );
    const totalUsuarios = parseInt(totalResult.rows[0].count, 10); // Total de usuarios filtrados

    const totalPages = Math.ceil(totalUsuarios / limit);

    if (totalPages === 0) {
      return res.status(200).json({
        usuarios: [], // No hay usuarios, se devuelve un array vacío
        totalUsuarios, // Total de usuarios filtrados
        totalPages, // Total de páginas disponibles
        currentPage: page, // Página actual
        message: "No se encontraron usuarios.",
      });
    }

    if (page > totalPages) {
      return res
        .status(400)
        .json({ error: "No hay más resultados para esta búsqueda" });
    }

    // Consultamos los usuarios filtrados por nombre
    const result = await pool.query(
      `SELECT * FROM usuarios WHERE nombre ILIKE $1 LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    // Respondemos con los usuarios encontrados
    res.json({
      usuarios: result.rows,
      totalUsuarios, // Total de usuarios filtrados
      totalPages, // Total de páginas disponibles
      currentPage: page, // Página actual
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado", usuario: result.rows[0] });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
