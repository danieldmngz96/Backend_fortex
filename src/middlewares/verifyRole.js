const pool = require("../config/db"); // Conexión a la BD

const verifyRole = (requiredRoles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "No autenticado" });
        }

        try {
            // Obtener el rol del usuario desde la base de datos
            const [rows] = await pool.query("SELECT role FROM users WHERE email = ?", [req.user.email]);

            if (rows.length === 0) {
                return res.status(401).json({ message: "Usuario no encontrado" });
            }

            const userRoles = rows.map(row => row.role); // Extraer todos los roles del usuario
            console.log("Roles del usuario desde la BD:", userRoles);

            // Verificar si el usuario tiene al menos uno de los roles requeridos
            const hasRequiredRole = userRoles.some(role => requiredRoles.includes(role));

            if (!hasRequiredRole) {
                return res.status(403).json({ message: "Acceso denegado: No tienes permisos suficientes" });
            }

            next(); // ✅ Usuario autorizado, continuar con el siguiente middleware o controlador
        } catch (error) {
            console.error("Error en verifyRole:", error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    };
};

module.exports = verifyRole;
