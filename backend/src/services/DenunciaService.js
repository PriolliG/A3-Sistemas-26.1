const DenunciaRepository = require('../repositories/DenunciaRepository');

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

        // retorna um resumo do q foi criado
        return {
            mensagem: "Denúncia registrada com sucesso!",
            denunciaId, telefoneId
        };
    }
}

module.exports = new DenunciaService();