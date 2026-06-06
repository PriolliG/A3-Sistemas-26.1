jest.mock('../src/repositories/DenunciaRepository', () => {
    return {
        buscarTelefonePorNumero: jest.fn(),
        criarTelefone: jest.fn(),
        criarDenuncia: jest.fn()
    };
});

jest.mock('../src/services/ScoreService', () => {
    return {
        calcularEAtualizarScore: jest.fn()
    };
});

jest.mock('../src/services/PatternDetectionService', () => {
    return {
        verificarSuspeitos: jest.fn()
    };
});

const DenunciaService = require('../src/services/DenunciaService');
const DenunciaRepository = require('../src/repositories/DenunciaRepository');
const ScoreService = require('../src/services/ScoreService');
const PatternDetectionService = require('../src/services/PatternDetectionService');

describe('Testes - DenunciaService (Checa/cria o numero, salva denuncia, roda calculo de score e cria alertas)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Deve cadastar um novo numero se ele nao existir e criar a denuncia', async () => {
        // simula a criacao de uma nova denuncia
        const dadosInput = {
            numero: '11999999999',
            tipoGolpeId: 1,
            descricao: 'Tentativa de golpe',
            dataOcorrencia: '2026-06-05 10:00:00'
        };

        //simula q o numero N exite no database
        DenunciaRepository.buscarTelefonePorNumero.mockResolvedValue(null);
        // simula criacao de novas denuncias com ids 10 e 100 respectivamente
        DenunciaRepository.criarTelefone.mockResolvedValue(10);
        DenunciaRepository.criarDenuncia.mockResolvedValue(100);
        // simula o retorno do calculo do score
        ScoreService.calcularEAtualizarScore.mockResolvedValue(35);

        const resultado = await DenunciaService.registrar(dadosInput);

        // validacao de fluxo
        expect(DenunciaRepository.buscarTelefonePorNumero).toHaveBeenCalledWith('11999999999');
        expect(DenunciaRepository.criarTelefone).toHaveBeenCalledWith('11999999999');
        expect(DenunciaRepository.criarDenuncia).toHaveBeenCalledWith(10, 1, 'Tentativa de golpe', '2026-06-05 10:00:00');
        expect(ScoreService.calcularEAtualizarScore).toHaveBeenCalledWith(10);
        expect(PatternDetectionService.verificarSuspeitos).toHaveBeenCalledWith(10, '11999999999');

        // valida resposta da api
        expect(resultado).toEqual({
            mensagem: "Denúncia registrada com sucesso!",
            denunciaId: 100,
            telefoneId: 10,
            scoreAtualizado: 35
        });
    });

    test('Deve usar o numero existente se ele ja estiver cadastrado no sistema', async () => {
        const dadosInput = {
            numero: '11988888888',
            tipoGolpeId: 2,
            descricao: 'Falso motoboy',
            dataOcorrencia: '2026-06-05 11:00:00'
        };

        // simula q o numero ja existe
        DenunciaRepository.buscarTelefonePorNumero.mockResolvedValue({ id: 50, numero: '11988888888', score_risco: 20 });
        DenunciaRepository.criarDenuncia.mockResolvedValue(200);
        ScoreService.calcularEAtualizarScore.mockResolvedValue(45);

        const resultado = await DenunciaService.registrar(dadosInput);

        // N pode criar um novo numero se ele ja existe
        expect(DenunciaRepository.criarTelefone).not.toHaveBeenCalled();
        // deve vincular a denuncia diretamente ao id 50 existente
        expect(DenunciaRepository.criarDenuncia).toHaveBeenCalledWith(50, 2, 'Falso motoboy', '2026-06-05 11:00:00');
        expect(resultado.telefoneId).toBe(50);
    });
});