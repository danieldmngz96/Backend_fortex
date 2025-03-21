require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/types", require("./routes/type.routes"));
app.use("/api/properties", require("./routes/property.routes"));

// Iniciar Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
  try {
    await db.authenticate();
    console.log("✅ Conexión a la base de datos establecida");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
  }
}); 