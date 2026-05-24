const DenunciaService = require('../services/DenunciaService');

class DenunciaController {
    async criar(req, res) {
        try {
            const { numero, tipoGolpeId, descricao, dataOcorrencia } = req.body;
            
            // validação dos dados obrigatorios p/ a denuncia
            if (!numero || !tipoGolpeId || !descricao || !dataOcorrencia) {
                return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
            }

            const resultado = await DenunciaService.registrar({
                numero, tipoGolpeId, descricao, dataOcorrencia
            });

            return res.status(201).json(resultado);
        } catch (error) {
            console.error('Erro no DenunciaController:', error);
            return res.status(500).json({ erro: 'Erro interno ao processar a denúncia.' });
        }
    }
}

module.exports = new DenunciaController();