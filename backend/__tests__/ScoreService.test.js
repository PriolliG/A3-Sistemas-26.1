jest.mock('../src/repositories/ReputacaoRepository', () => {
    return {
        buscarDenunciasParaAnalise: jest.fn(),
        atualizarScore: jest.fn()
    };
});

const ScoreService = require('../src/services/ScoreService');
const ReputacaoRepository = require('../src/repositories/ReputacaoRepository');

describe('Testes - ScoreService (Sistema de reputacao dos numeros)', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Deve retornar score 0 se o numero n possuir nenhuma denuncia', async () => {
        // simula um array vazio do database
        ReputacaoRepository.buscarDenunciasParaAnalise.mockResolvedValue([]);

        const score = await ScoreService.calcularEAtualizarScore(1);

        expect(score).toBe(0);
        expect(ReputacaoRepository.atualizarScore).toHaveBeenCalledWith(1, 0);
    });

    test('Deve calcular o score corretamente baseado em denuncias recentes e palavras criticas', async () => {
        // simula uma denuncia altamente perigosa criado agr
        const denunciasFicticias = [
            {
                descricao: 'URGENTE: Clonaram meu whatsapp e pediram PIX',
                criado_em: new Date(),
                tipo_golpe: 'Clonagem de WhatsApp'
            }
        ];

        ReputacaoRepository.buscarDenunciasParaAnalise.mockResolvedValue(denunciasFicticias);

        const score = await ScoreService.calcularEAtualizarScore(1);

        // O calculo esperado:
        // +15 (uma denuncia)
        // +20 (criadas nas ultimas 24h)
        // +20 (duas palavras criticas unicas)
        // Total esperado = 55 (risco mediano)
        expect(score).toBe(55);
        expect(ReputacaoRepository.atualizarScore).toHaveBeenCalledWith(1, 55);
    });

    test('Deve limitar o score max em 100 mesmo com multiplos gatilhos', async () => {
        // simula um cenario com dezenas de denuncias perigosas
        const muitasDenuncias = Array(10).fill({
            descricao: 'URGENTE BANCO CENTRAL PIX SENHA BLOQUEIO TRANSFERENCIA',
            criado_em: new Date(),
            tipo_golpe: 'Falsa Central de Banco'
        });

        ReputacaoRepository.buscarDenunciasParaAnalise.mockResolvedValue(muitasDenuncias);

        const score = await ScoreService.calcularEAtualizarScore(99);

        // deve travar no teto max (100)
        expect(score).toBe(100);
        expect(ReputacaoRepository.atualizarScore).toHaveBeenCalledWith(99, 100);
    });
});