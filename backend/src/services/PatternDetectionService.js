const PatternRepository = require('../repositories/PatternRepository');

class PatternDetectionService {
    async verificarSuspeitos(telefoneId, numero) {
        // regra 1: pico de denuncias em curto periodo (mais de 2 denuncias em 24h)
        const totalDenuncias24h = await PatternRepository.contarDenunciasRecentes(telefoneId);
        if (totalDenuncias24h > 2) {
            const descAlerta = 'Pico de denúncias detectado nas últimas 24h.';
            const jaExiste = await PatternRepository.alertaJaExiste(telefoneId, descAlerta);

            if (!jaExiste) {
                await PatternRepository.criarAlerta(telefoneId, descAlerta);
                console.log(`ALERTA: Número ${numero} gerou pico de denúncias!`);
            }
        }

        // regra 2: numeros excessivamente consultados (mais de 4 buscas em 1h)
        const totalConsultas1h = await PatternRepository.contarConsultasRecentes(numero);
        if (totalConsultas1h > 4) {
            const descAlerta = 'Número excessivamente consultado (Possível campanha de fraude ativa).';
            const jaExiste = await PatternRepository.alertaJaExiste(telefoneId, descAlerta);

            if (!jaExiste) {
                await PatternRepository.criarAlerta(telefoneId, descAlerta);
                console.log(`ALERTA: Número ${numero} está sendo excessivamente buscado!`);
            }
        }
    }
}

module.exports = new PatternDetectionService();