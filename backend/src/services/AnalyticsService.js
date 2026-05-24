const AnalyticsRepository = require('../repositories/AnalyticsRepository');

class AnalyticsService {
    async gerarDashboard() {
        // executa todas as consultas de forma assincrona e simultanea
        const [
            telefonesMaisDenunciados,
            golpesMaisComuns,
            horariosCriticos,
            evolucaoDenuncias,
            alertasAtivos
        ] = await Promise.all([
            AnalyticsRepository.obterTelefonesMaisDenunciados(),
            AnalyticsRepository.obterGolpesMaisComuns(),
            AnalyticsRepository.obterHorariosCriticos(),
            AnalyticsRepository.obterEvolucaoDenuncias(),
            AnalyticsRepository.obterAlertasAtivos()
        ]);

        return {
            dadosGerais: {
                telefonesMaisDenunciados,
                golpesMaisComuns,
                horariosCriticos,
                evolucaoDenuncias
            },
            alertasAtivos
        };
    }
}

module.exports = new AnalyticsService();