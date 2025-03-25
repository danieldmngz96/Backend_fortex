const express = require("express");
const { verifyToken, isAdmin, isUser } = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require("../controllers/property.controller");

// Ruta para crear una propiedad
router.post("/", createProperty);

// Obtener todas las propiedades
router.get("/", getAllProperties);

// Obtener una propiedad por ID
router.get("/:id", getPropertyById);

// Actualizar una propiedad por ID
router.put("/:id", updateProperty);

// Eliminar una propiedad por ID
router.delete("/:id", deleteProperty);



// Rutas accesibles solo por admins
router.post("/crear", verifyToken, isAdmin, (req, res) => {
    res.json({ message: "Token admin creado exitosamente" });
});

router.put("/editar/:id", verifyToken, isAdmin, (req, res) => {
    res.json({ message: `Propiedad con ID ${req.params.id} editada` });
});

router.delete("/eliminar/:id", verifyToken, isAdmin, (req, res) => {
    res.json({ message: `Propiedad con ID ${req.params.id} eliminada` });
});

// Ruta accesible para admin y user (lectura)
router.get("/listar", verifyToken, isUser, (req, res) => {
    res.json({ message: "Lista de propiedades" });
});

module.exports = router;
