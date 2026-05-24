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
}

module.exports = new DenunciaRepository();