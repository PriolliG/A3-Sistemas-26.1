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

    async deletarDenuncia(id) {
        await pool.query('DELETE FROM denuncias WHERE id = ?', [id]);
    }

    async deletarTelefone(id) {
        await pool.query('DELETE FROM telefones WHERE id = ?', [id]);
    }

    async limparTodosLogs() {
        await pool.query('DELETE FROM logs_consulta');
    }
}

module.exports = new AdminRepository();