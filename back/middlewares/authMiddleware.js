import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // Obtener el token del encabezado Authorization
  const token = req.headers["authorization"]?.split(" ")[1];

  // Si no hay token en el encabezado
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // Si el token ha fallado (por ejemplo, expirado o inválido)
    if (err) {
      // Si el error es por expiración del token
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired" });
      }

      // En otros casos de error (por ejemplo, token inválido)
      return res.status(403).json({ error: "Failed to authenticate token" });
    }

    // Si el token es válido, añadir el ID del usuario a la solicitud
    req.userId = decoded.userId;
    next(); // Continuar con el siguiente middleware o ruta
  });
};
