const pool = require('../../config/db'); // ../config/db
class DenunciaRepository {
    // busca um telefone pelo numero p/ ver se ele ja existe
    async buscarTelefonePorNumero(numero) {
        const [rows] = await pool.query('SELECT * FROM telefones WHERE numero = ?', [numero]);
        return rows[0];
    }

    // cria o registro do telefone caso ele seja novo
    async criarTelefone(numero) {
        const [result] = await pool.query('INSERT INTO telefones (numero, score_risco) VALUES (?, 0)', [numero]);
        return result.insertId;
    }

    // salva a denuncia na tabela 'denuncias'
    async criarDenuncia(telefoneId, tipoGolpeId, descricao, dataOcorrencia) {
       const [result] = await pool.query(
        'INSERT INTO denuncias (telefone_id, tipo_golpe_id, descricao, data_ocorrencia) VALUES (?, ?, ?, ?)',
        [telefoneId, tipoGolpeId, descricao, dataOcorrencia]
       );
       return result.insertId;
    }

    // registra o log da consulta realizada pelo usuario
    async registrarLogConsulta(numero) {
        await pool.query('INSERT INTO logs_consulta (numero_buscado) VALUES (?)', [numero]);
    }

    // busca as infos consolidadas do telefone p/ a consulta publica
    async consultarDetalhesTelefone(numero) {
        // 1º busca os dados gerais do telefone e contagem de denuncias
        const queryInfo = `
            SELECT t.id, t.numero, t.score_risco, COUNT(d.id) as total_denuncias
            FROM telefones t
            LEFT JOIN denuncias d ON t.id = d.telefone_id
            WHERE t.numero = ?
            GROUP BY t.id;
        `;
        const [telefones] = await pool.query(queryInfo, [numero]);

        if (telefones.length === 0) return null;
        const infoTelefone = telefones[0];

        // 2º busca o tipo de golpe mais frequente p/ este numero
        const queryGolpeComum = `
            SELECT tg.nome as tipo_golpe, COUNT(d.id) as quantidade
            FROM denuncias d
            JOIN tipos_golpe tg ON d.tipo_golpe_id = tg.id
            WHERE d.telefone_id = ?
            GROUP BY tg.id
            ORDER BY quantidade DESC
            LIMIT 1
        `;
        const [golpes] = await pool.query(queryGolpeComum, [infoTelefone.id]);
        const golpePredominante = golpes.length > 0 ? golpes[0].tipo_golpe : "Nenhum";

        // 3º busca o historico das 5 ultimas denuncias
        const [historico] = await pool.query(
            'SELECT descricao FROM alertas WHERE telefone_id = ? AND ativo = 1',
            [infoTelefone.id]
        );

        // 4º busca os alertas ativos atrelados ao numero
        const [alertas] = await pool.query(
            'SELECT descricao FROM alertas WHERE telefone_id = ? AND ativo = 1',
            [infoTelefone.id]
        );

        return {
            numero: infoTelefone.numero,
            scoreRisco: infoTelefone.score_risco,
            quantidadeDenuncias: infoTelefone.total_denuncias,
            tipoGolpePredominante: golpePredominante,
            historicoRecente: historico,
            alertasAtivo: alertas.map(a => a.descricao)
        };
    }
}

module.exports = new DenunciaRepository();