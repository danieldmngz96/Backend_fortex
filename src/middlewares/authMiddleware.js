const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // Asegúrate de que la ruta sea correcta

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    
    console.log("Token recibido:", token); // ✅ Verifica el token que llega

    if (!token) {
        return res.status(403).json({ message: "Token requerido" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || "secreto");
        req.user = decoded;
        console.log("Usuario autenticado:", req.user); // ✅ Verifica el usuario decodificado
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

const isAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
    }

    try {
        // Obtener todos los roles del usuario desde la BD
        const [rows] = await pool.query("SELECT role FROM users WHERE email = ?", [req.user.email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const userRoles = rows.map(row => row.role); // Obtener una lista de roles
        console.log("Roles del usuario desde la BD:", userRoles);

        if (!userRoles.includes("admin")) {
            return res.status(403).json({ message: "Acceso denegado: Solo administradores" });
        }

        next(); // ✅ Permitir acceso si es admin
    } catch (error) {
        console.error("Error en isAdmin:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const isUser = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
    }

    try {
        // Obtener todos los roles del usuario desde la BD
        const [rows] = await pool.query("SELECT role FROM users WHERE email = ?", [req.user.email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const userRoles = rows.map(row => row.role); // Obtener una lista de roles
        console.log("Roles del usuario desde la BD:", userRoles);

        if (!userRoles.includes("user") && !userRoles.includes("admin")) {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        next(); // ✅ Permitir acceso si es user o admin
    } catch (error) {
        console.error("Error en isUser:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

module.exports = { verifyToken, isAdmin, isUser };
