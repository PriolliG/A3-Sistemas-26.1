const pool = require('../../config/db');

class PatternRepository {
    // conta denuncias recentes p/ capturar picos em curto periodo
    async contarDenunciasRecentes(telefoneId) {
        const query = `
            SELECT COUNT(id) AS total
            FROM denuncias
            WHERE telefone_id = ? AND criado_em >= NOW() - INTERVAL 1 DAY;
        `;
        const [rows] = await pool.query(query, [telefoneId]);
        return rows[0].total;
    }

    // conta quantas buscas foram feitas p/ um numero nos logs recentes
    async contarConsultasRecentes(numero) {
        const query = `
            SELECT COUNT(id) AS total
            FROM logs_consulta
            WHERE numero_buscado = ? AND data_consulta >= NOW() - INTERVAL 1 HOUR;
        `;
        const [rows] = await pool.query(query, [numero]);
        return rows[0].total;
    }

    // verifica se ja existe um alerta ativo igual p/ evitar duplicidade
    async alertaJaExiste(telefoneId, descricao) {
        const query = `
            SELECT id FROM alertas
            WHERE telefone_id = ? AND descricao = ? AND ativo = 1;
        `;
        const [rows] = await pool.query(query, [telefoneId, descricao]);
        return rows.length > 0;
    }

    // insere o alerta automatico no banco
    async criarAlerta(telefoneId, descricao) {
        const query = `
            INSERT INTO alertas (telefone_id, descricao, ativo) VALUES (?, ?, 1);
        `;
        await pool.query(query, [telefoneId, descricao]);
    }
}

module.exports = new PatternRepository();