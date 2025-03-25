const express = require("express");
const router = express.Router();
const {
  createType,
  getAllTypes,
  getTypeById,
  updateType,
  deleteType
} = require("../controllers/type.controller");

// Definir la ruta para crear un tipo
router.post("/types", createType);
router.get("/all", getAllTypes); // Nueva ruta para obtener todos los tipos
router.get("/id/:id", getTypeById); // Nueva ruta para obtener un tipo por ID
router.put("/types/:id", updateType); // Nueva ruta para actualizar
router.delete("/types/:id", deleteType);

module.exports = router;
