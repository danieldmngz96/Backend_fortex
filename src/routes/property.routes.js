const express = require("express");
const { verifyToken, isAdmin, isUser } = require("../middlewares/authMiddleware");
const router = express.Router();

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
