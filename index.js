const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const propertyRoutes = require("./src/routes/property.routes"); // ✅ IMPORTA EL NOMBRE CORRECTO
const typeRoutes = require("./src/routes/types.routes"); // Importar las rutas
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api", typeRoutes); // 👈 Asegúrate de que "/api" esté aquí
app.use(express.json()); // Middleware para procesar JSON

app.get('/', (req, res) => {
    res.send('¡Hola, API con Express!' );
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
