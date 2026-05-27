const express = require('express');
const router = express.Router();
const DenunciaController = require('../controllers/DenunciaController');

// rota POST p/ registrar as denuncias
router.post('/denuncias', DenunciaController.criar);

// rota GET p/ a consulta publica de telefones
router.get('/telefones/consulta', DenunciaController.consultar);

// rota GET p/ os tipos de golpes
router.get('/tipos-golpe', DenunciaController.listarTipos);

module.exports = router;