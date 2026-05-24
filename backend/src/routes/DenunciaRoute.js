const express = require('express');
const router = express.Router();
const DenunciaController = require('../controllers/DenunciaController');

// rota POST p/ registrar as denuncias
router.post('/denuncias', DenunciaController.criar);

module.exports = router;