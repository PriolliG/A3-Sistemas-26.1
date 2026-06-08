const pool = require('../../config/db');

class AdminRepository {
    async listarTodosTelefones() {
        const [rows] = await pool.query('SELECT * FROM telefones ORDER BY criado_em DESC');
        return rows;
    }

    async listarTodasDenuncias() {
        const query = `
            SELECT d.*, t.numero, tg.nome as tipo_golpe
            FROM denuncias d
            JOIN telefones t ON d.telefone_id = t.id
            JOIN tipos_golpe tg ON d.tipo_golpe_id = tg.id
            ORDER BY d.criado_em DESC;
        `;
        const [rows] = await pool.query(query);
        return rows;
    }

    async listarTodosLogs() {
        const [rows] = await pool.query('SELECT * FROM logs_consulta ORDER BY data_consulta DESC LIMIT 100');
        return rows;
    }

    async listarTodosAlertas() {
        const query = `
            SELECT a.*, t.numero
            FROM alertas a
            JOIN telefones t ON a.telefone_id = t.id
            ORDER BY a.criado_em DESC
        `;
        const [rows] = await pool.query(query);
        return rows;
    }

    async listarTipoGolpes() {
        const [rows] = await pool.query('SELECT * FROM tipos_golpe ORDER BY nome ASC');
        return rows;
    }

    async criarTipoGolpe(nome) {
        const [result] = await pool.query('INSERT INTO tipos_golpe (nome) VALUES (?)', [nome]);
        return result.insertId;
    }

    async deletarAlerta(id) {
        await pool.query('DELETE FROM alertas WHERE id = ?', [id]);
    }

    async deletarDenuncia(id) {
        await pool.query('DELETE FROM denuncias WHERE id = ?', [id]);
    }

    async deletarTelefone(id) {
        await pool.query('DELETE FROM telefones WHERE id = ?', [id]);
    }

    async limparTodosLogs() {
        await pool.query('DELETE FROM logs_consulta');
    }

    async deletarTipoGolpe(id) {
        await pool.query('DELETE FROM tipos_golpe WHERE id = ?', [id]);
    }
}

module.exports = new AdminRepository();