import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Si el error es por expiración del token
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired" });
      }

      return res.status(403).json({ error: "Failed to authenticate token" });
    }

    req.userId = decoded.userId;
    next();
  });
};
