jest.mock('../src/repositories/AnalyticsRepository', () => {
    return {
        obterTelefonesMaisDenunciados: jest.fn(),
        obterGolpesMaisComuns: jest.fn(),
        obterHorariosCriticos: jest.fn(),
        obterEvolucaoDenuncias: jest.fn(),
        obterAlertasAtivos: jest.fn()
    };
});

const AnalyticsService = require('../src/services/AnalyticsService');
const AnalyticsRepository = require('../src/repositories/AnalyticsRepository');

describe('Testes - AnalyticsService (Executa todas as consultas de forma conjunta sem quebrar caso alguma falhe)', () => {

    test('Deve estruturar e consolidar todos os relatorios em um unico objeto de dashboard', async () => {
        // simula o retorno de cada query do database
        const mockTelefones = [{ numero: '11933333333', total_denuncias: 5, score_risco: 95 }];
        const mockGolpes = [{ tipo_golpe: 'Falsa Central', total_ocorrencias: 12 }];
        const mockHorarios = [{ hora_do_dia: 14, total_denuncias: 8 }];
        const mockEvolucao = [{ data_registro: '2026-06-05', total_denuncias: 4 }];
        const mockAlertas = [{ descricao: 'Campanha Ativa', numero: '11933333333' }];

        AnalyticsRepository.obterTelefonesMaisDenunciados.mockResolvedValue(mockTelefones);
        AnalyticsRepository.obterGolpesMaisComuns.mockResolvedValue(mockGolpes);
        AnalyticsRepository.obterHorariosCriticos.mockResolvedValue(mockHorarios);
        AnalyticsRepository.obterEvolucaoDenuncias.mockResolvedValue(mockEvolucao);
        AnalyticsRepository.obterAlertasAtivos.mockResolvedValue(mockAlertas);

        const dashboard = await AnalyticsService.gerarDashboard();

        // verifica se a estrutura de chaves bate perfeitamente com o esperado pelo recharts no frontend
        expect(dashboard).toHaveProperty('dadosGerais');
        expect(dashboard).toHaveProperty('alertasAtivos');

        // verifica se todos os dados voltaram iguais
        expect(dashboard.dadosGerais.telefonesMaisDenunciados).toEqual(mockTelefones);
        expect(dashboard.dadosGerais.golpesMaisComuns).toEqual(mockGolpes);
        expect(dashboard.dadosGerais.horariosCriticos).toEqual(mockHorarios);
        expect(dashboard.dadosGerais.evolucaoDenuncias).toEqual(mockEvolucao);

        expect(dashboard.alertasAtivos).toEqual(mockAlertas);
    });
});