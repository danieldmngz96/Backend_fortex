const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Importa el controlador

console.log("authController:", authController); // Depuración

router.post('/register', authController.register);

router.post("/login", authController.login);

module.exports = router;
