jest.mock('../src/repositories/PatternRepository', () => {
    return {
        contarDenunciasRecentes: jest.fn(),
        contarConsultasRecentes: jest.fn(),
        alertaJaExiste: jest.fn(),
        criarAlerta: jest.fn()
    };
});

const PatternDetectionService = require('../src/services/PatternDetectionService');
const PatternRepostitory = require('../src/repositories/PatternRepository');

describe('Testes - PatterDetectionService (Criação de alertas)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Deve criar alerta de consultas em massa se o numero for buscado excessivamente', async () => {
        // 0 denuncias, mas 6 consultas na ultima hr
        PatternRepostitory.contarDenunciasRecentes.mockResolvedValue(0);
        PatternRepostitory.contarConsultasRecentes.mockResolvedValue(6);
        PatternRepostitory.alertaJaExiste.mockResolvedValue(false);

        await PatternDetectionService.verificarSuspeitos(2, '11977776666');

        // deve alertar sobre a possivel campanha de fraude ativa devido as buscas
        expect(PatternRepostitory.criarAlerta).toHaveBeenCalledWith(
            2,
            'Número excessivamente consultado (Possível campanha de fraude ativa).'
        );
    });

    test('Deve criar alerta de pico de denuncias se houver mais de 2 dentro de 24h', async () => {
        // 0 consultas, mas 3 denuncias dentro de 24h
        PatternRepostitory.contarDenunciasRecentes.mockResolvedValue(3);
        PatternRepostitory.contarConsultasRecentes.mockResolvedValue(0);
        PatternRepostitory.alertaJaExiste.mockResolvedValue(false);

        await PatternDetectionService.verificarSuspeitos(3, '11955554444');

        // deve alertar sobre pico de denuncias nas ultimas 24h
        expect(PatternRepostitory.criarAlerta).toHaveBeenCalledWith(
            3,
            'Pico de denúncias detectado nas últimas 24h.'
        );
    });

    test('Nao deve duplicar alertas se um aviso identico ja estiver no banco', async () => {
        // simula que o sistema ja identificou este padrao e o alerta esta ativo
        PatternRepostitory.contarDenunciasRecentes.mockResolvedValue(5);
        PatternRepostitory.contarConsultasRecentes.mockResolvedValue(0);
        PatternRepostitory.alertaJaExiste.mockResolvedValue(true);

        await PatternDetectionService.verificarSuspeitos(1, '11999998888');

        // n deve criar um novo registro duplicado
        expect(PatternRepostitory.criarAlerta).not.toHaveBeenCalled();
    });
});