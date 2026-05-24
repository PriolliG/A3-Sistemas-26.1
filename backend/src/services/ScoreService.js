const ReputacaoRepository = require('../repositories/ReputacaoRepository');

class ScoreService {
    async calcularEAtualizarScore(telefoneId) {
        const denuncias = await ReputacaoRepository.buscarDenunciasParaAnalise(telefoneId);

        if (denuncias.length === 0) {
            await ReputacaoRepository.atualizarScore(telefoneId, 0);
            return 0;
        }

        let score = 0;

        // 1º criterio: quantidade de denuncias (cada denuncia adiciona 15 pontos)
        score += denuncias.length * 15;

        // 2º criterio: presenca de palavras criticas nas descricoes (+10 pontos por palavra critica encontrada)
        const palavrasCriticas = ['pix', 'urgente', 'senha', 'bloqueio', 'transferência', 'gerente', 'central', 'banco'];
        let palavrasEncontradas = new Set();

        denuncias.forEach(d => {
            const texto = d.descricao.toLowerCase();
            palavrasCriticas.forEach(palavra => {
                if (texto.includes(palavra)) {
                    palavrasEncontradas.add(palavra);
                }
            });
        });
        score += palavrasEncontradas.size * 10;

        // 3º criterio: frequencia de denuncia (+20 pontos se houver denuncia nas ultimas 24hrs)
        const agora = new Date();
        const umDiaAtras = new Date(agora -24 * 60 * 60 * 1000);
        const temDenunciaRecente = denuncias.some(d => new Date(d.criado_em) >= umDiaAtras);

        if (temDenunciaRecente) {
            score += 20;
        }

        // 4º criterio: repeticao de padroes (+15 pontos se o mesmo numero aplicar mais de um tipo de golpe diferente)
        const tiposDiferentes = new Set(denuncias.map(d => d.tipo_golpe));
        if (tiposDiferentes.size > 1) {
            score += 15;
        }

        // aplica o limite (0-100) e salva no database
        await ReputacaoRepository.atualizarScore(telefoneId, score);

        return Math.min(100, score);
    }
}

module.exports = new ScoreService();