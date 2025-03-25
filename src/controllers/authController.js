const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Clave secreta para firmar los tokens
const SECRET_KEY = process.env.JWT_SECRET || "clave_secreta_super_segura";

// 📌 REGISTRO DE USUARIO
exports.register = async (req, res) => {
  try {
    console.log("Cuerpo recibido:", req.body);

    const { nombre, email, password } = req.body; // ✅ Mantener "nombre" en la desestructuración

    // Validar campos
    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Corregir nombre de la columna a "name"
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [nombre, email, hashedPassword]
    );

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};




// 📌 INICIO DE SESIÓN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Correo y contraseña son obligatorios" });
    }

    // Verificar si el usuario existe
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseña
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user[0].id, email: user[0].email },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
