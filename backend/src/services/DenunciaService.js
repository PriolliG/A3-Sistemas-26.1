const DenunciaRepository = require('../repositories/DenunciaRepository');
const ScoreService = require('./ScoreService');

class DenunciaService {
    async registrar(dadosDenuncia) {
        const { numero, tipoGolpeId, descricao, dataOcorrencia } = dadosDenuncia;

        // 1º verifica se o telefone ja existe no sistema
        let telefone = await DenunciaRepository.buscarTelefonePorNumero(numero);
        let telefoneId;

        if (!telefone) {
            // se n exisitr, cria o telefone com score inicial 0
            telefoneId = await DenunciaRepository.criarTelefone(numero);
        } else {
            telefoneId = telefone.id;
        }

        // 2º registra a denuncia atrelada a este numero
        const denunciaId = await DenunciaRepository.criarDenuncia(
            telefoneId, tipoGolpeId, descricao, dataOcorrencia
        );

        // reputacao dinamica: executa o recalculo do score de risco logo apos salvar a denuncia
        const novoScore = await ScoreService.calcularEAtualizarScore(telefoneId);

        // retorna um resumo do q foi criado
        return {
            mensagem: "Denúncia registrada com sucesso!",
            denunciaId,
            telefoneId,
            scoreAtualizado: novoScore
        };
    }

    async consultar(numero) {
        // Sempre registra o log da consulta, independente de o numero estar cadastrado ou n
        await DenunciaRepository.registrarLogConsulta(numero);

        const dadosTelefone = await DenunciaRepository.consultarDetalhesTelefone(numero);

        if (!dadosTelefone) {
            // se o numero nunca foi cadastrado/denunciado, retorna uma resposta limpa (Risco Baixo)
            return {
                numero,
                scoreRisco: 0,
                quantidadeDenuncias: 0,
                tipoGolpePredominante: "Nenhum",
                historicoRecente: [],
                alertasAtivos: [],
                mensagem: "Este número não possui denúncias registradas."
            };
        }
        return dadosTelefone;
    }
}

module.exports = new DenunciaService();