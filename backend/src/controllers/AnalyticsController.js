const AnalyticsService = require('../services/AnalyticsService');

class AnalyticsController {
    async obterDadosDashboard(req, res) {
        try {
            const DadosDashboard = await AnalyticsService.gerarDashboard();
            return res.status(200).json(DadosDashboard);
        } catch (error) {
            console.error('Erro no AnalyticsController:', error);
            return res.status(500).json({ erro: 'Erro interno ao gerar o dashboard analítico' });
        }
    }
}

module.exports = new AnalyticsController();