const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const authMiddleware = require('../middlewares/authMiddleware');

// rota de teste da chave (se passar pelo middleware, retorna sucesso)
router.post('/admin/login', authMiddleware, AdminController.login);

// rotas de dados protegidas pelo token
router.get('/admin/dados', authMiddleware, AdminController.painelGeral); // pega todos os dados
router.delete('/admin/denuncia', authMiddleware, AdminController.removerDenuncia); // deleta a denuncia
router.delete('/admin/telefone', authMiddleware, AdminController.removerTelefone); // deleta numero
router.delete('/admin/logs/limpar', authMiddleware, AdminController.removerLogsGerais); // deleta todos os logs

module.exports = router;