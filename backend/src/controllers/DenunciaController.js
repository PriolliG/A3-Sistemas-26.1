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

    async consultar(req, res) {
        try {
            const { numero } = req.query;

            if (!numero) {
                return res.status(400).json({ erro: 'O parâmetro "número" é obrigatório na URL.' });
            }

            const resultado = await DenunciaService.consultar(numero);
            return res.status(200).json(resultado);
        } catch (error) {
            console.error('Erro no DenunciarController ao consultar:', error);
            return res.status(500).json({ erro: 'Erro interno ao consultar o número.' });
        }
    }

    async listarTipos(req, res) {
        try {
            const DenunciaRepository = require('../repositories/DenunciaRepository');
            const tipos = await DenunciaRepository.listarTiposGolpe();
            return res.status(200).json(tipos);
        } catch (error) {
            console.error('Erro ao listar tipos de golpe:', error);
            return res.status(500).json({ erro: 'Erro interno ao listar categorias.' });
        }
    }
}

module.exports = new DenunciaController();