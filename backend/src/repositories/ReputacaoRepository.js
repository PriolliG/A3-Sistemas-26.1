const pool = require('../../config/db');

class ReputacaoRepository {
    // busca todas as denuncias de um telefone especifico p/ analise de texto e frequencia
    async buscarDenunciasParaAnalise(telefoneId) {
        const query = `
            SELECT d.descricao, d.criado_em, tg.nome as tipo_golpe
            FROM denuncias d
            JOIN tipos_golpe tg ON d.tipo_golpe_id = tg.id
            WHERE d.telefone_id = ?;
        `;
        const [rows] = await pool.query(query, [telefoneId]);
        return rows;
    }

    // atualiza o socre final calculado na tabela de telefones
    async atualizarScore(telefoneId, novoScore) {
        // garante que o score nunca passe de 100 nem seja menor que 0
        const scoreFinal = Math.max(0, Math.min(100, novoScore));
        await pool.query('UPDATE telefones SET score_risco = ? WHERE id = ?', [scoreFinal, telefoneId]);
    }
}

module.exports = new ReputacaoRepository();