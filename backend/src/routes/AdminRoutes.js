const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const authMiddleware = require('../middlewares/authMiddleware');

// rota de teste da chave (se passar pelo middleware, retorna sucesso)
router.post('/admin/login', authMiddleware, AdminController.login);

// rota de dados protegidas pelo token
router.get('/admin/dados', authMiddleware, AdminController.painelGeral);
router.delete('/admin/denuncia', authMiddleware, AdminController.removerDenuncia);

module.exports = router;