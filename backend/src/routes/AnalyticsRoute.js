const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/AnalyticsController');

// rota GET p/ extrair as metricas estruturadas do painel
router.get('/analytics/dashboard', AnalyticsController.obterDadosDashboard);

module.exports = router;