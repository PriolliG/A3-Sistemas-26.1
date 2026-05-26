import React from 'react';

export default function ScoreBadge({ score }) {
    // define os estados do score de risco  de acordo com a regra definida
    let cor = '#00E676'; // verde neon (risco baixo)
    let texto = 'Risco Baixo';

    if (score >= 31 && score <= 70) {
        cor = '#FFD600'; // amarelo (risco medio)
        texto = 'Risco Mediano';
    } else if (score > 70) {
        cor = '#FF1744' // vermelho (risco alto)
        texto = 'Risco Alto';
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 text-white min-w-35">
            <span className="text-sm text-gray-400 font-medium tracking-wide uppercase mb-1">Score</span>
            <span className="text-5xl font-black mb-2 transition-all duration-500" style={{ color: cor }}>
                {score}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10" style={{ color: cor }}>
                {texto}
            </span>
        </div>
    );
}