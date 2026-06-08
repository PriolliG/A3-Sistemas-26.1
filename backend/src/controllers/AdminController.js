const AdminRepository = require('../repositories/AdminRepository');
const ScoreService = require('../services/ScoreService');

class AdminController {
    // validador simples que o front usara p/ testar se a chave digitada funciona
    async login(req, res) {
        return res.status(200).json({ sucesso: true, mensagem: "Chave validada com sucesso!" });
    }

    async painelGeral(req, res) {
        try {
            const telefones = await AdminRepository.listarTodosTelefones();
            const denuncias = await AdminRepository.listarTodasDenuncias();
            const logs = await AdminRepository.listarTodosLogs();
            const alertas = await AdminRepository.listarTodosAlertas();
            const tipoGolpes = await AdminRepository.listarTipoGolpes();

            return res.status(200).json({ telefones, denuncias, logs, alertas, tipoGolpes });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async removerDenuncia(req, res) {
        try {
            const { id, telefoneId } = req.body;
            await AdminRepository.deletarDenuncia(id);

            // recalcula o score do telefone apos a exclusao da denuncia
            if (telefoneId) {
                await ScoreService.calcularEAtualizarScore(telefoneId);
            }
            return res.status(200).json({ sucesso: true, mensagem: "Denúncia removida com sucesso." });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async removerTelefone(req, res) {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ erro: 'O ID do telefone é obrigatório.' });
            }
            await AdminRepository.deletarTelefone(id);
            return res.status(200).json({ sucesso: true, mensagem: "Telefone e seu histórico removidos com sucesso." });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async removerLogsGerais(req, res) {
        try {
            await AdminRepository.limparTodosLogs();
            return res.status(200).json({ sucesso: true, mensagem: "Todos os logs foram apagados com sucesso."});
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async adicionarTipoGolpe(req, res) {
        try {
            const { nome } = req.body;
            if (!nome || nome.trim() === '') {
                return res.status(400).json({ erro: 'O nome do tipo de golpe é obrigatório!' });
            }
            const novoId = await AdminRepository.criarTipoGolpe(nome.trim());
            return res.status(201).json({ sucesso: true, id: novoId, mensagem: 'Tipo de golpe registrado.' });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async removerAlerta(req, res) {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ erro: 'O ID do alerta é obrigatório.' });
            }
            await AdminRepository.deletarAlerta(id);
            return res.status(200).json({ sucesso: true, mensagem: 'Alerta removido com sucesso.' });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async removerTipoGolpe(req, res) {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ erro: 'O ID do tipo de golpe é obrigatório.' });
            }
            await AdminRepository.deletarTipoGolpe(id);
            return res.status(200).json({ sucesso: true, mensagem: 'Tipo de golpe removido com sucesso.' });
        } catch (error) {
            return res.status(400).json({erro: 'Não é possível deletar esta categoria pois existem denúncias vinculadas a ela.' });
        }
    }
}

module.exports = new AdminController();