const pool = require('../../config/db')

class AnalyticsRepository {
    // 1º telefones mais denunciados
    async obterTelefonesMaisDenunciados() {
        const query = `
            SELECT t.numero, COUNT(d.id) AS total_denuncias, t.score_risco
            FROM telefones t
            JOIN denuncias d ON t.id = d.telefone_id
            GROUP BY t.id
            ORDER BY total_denuncias DESC
            LIMIT 5;
        `;
        const [rows] = await pool.query(query);
        return rows;
    }

    // 2º golpes mais comuns
    async obterGolpesMaisComuns() {
        const query = `
            SELECT tg.nome AS tipo_golpe, COUNT(d.id) AS total_ocorrencias
            FROM denuncias d
            JOIN tipos_golpe tg ON d.tipo_golpe_id = tg.id
            GROUP BY tg.id
            ORDER BY total_ocorrencias DESC;
        `;
        const [rows] = await pool.query(query);
        return rows;
    }

    // 3º horarios criticos (agrupado pela hr do dia da ocorrencia)
    async obterHorariosCriticos() {
        const query = `
            SELECT HOUR(data_ocorrencia) AS hora_do_dia, COUNT(id) AS total_denuncias
            FROM denuncias
            GROUP BY hora_do_dia
            ORDER BY total_denuncias DESC;
        `;
        const [rows] = await pool.query(query);
        return rows;
    }

    // 4º evolucao das denuncias (agrupado por data simples)
    async obterEvolucaoDenuncias() {
        const query = `
            SELECT DATE(data_ocorrencia) AS data_registro, COUNT(id) AS total_denuncias
            FROM denuncias
            GROUP BY data_registro
            ORDER BY data_registro ASC
            LIMIT 10;
        `;
        const [rows] = await pool.query(query);
        return rows;
    }
    
    // 5º alertas ativos no momento
    async obterAlertasAtivos() {
        const query = `
            SELECT a.descricao, t.numero, a.criado_em
            FROM alertas a
            JOIN telefones t ON a.telefone_id = t.id
            WHERE a.ativo = 1
            ORDER BY a.criado_em DESC;
        `;
        const [rows] = await pool.query(query);
        return rows;
    }
}

module.exports = new AnalyticsRepository();