import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import SearchBar from '../components/SearchBar';
import ScoreBadge from '../components/ScoreBadge';
import { AlertTriangle, Calendar, MessageSquare, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  const [numero, setNumero] = useState('');
  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleBuscar = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/telefones/consulta?numero=${numero}`);
      setResultado(response.data);
      setHasSearched(true);
    } catch (error) {
      console.error("Erro ao consultar número:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetarBusca = () => {
    setResultado(null);
    setHasSearched(false);
    setNumero('');
  };

  // verifica se o numero consultado n tem denuncias
  const numeroSemDenuncias = resultado && resultado.quantidadeDenuncias === 0;

  return (
    <div className={`w-full flex flex-col items-center min-h-[60vh] transition-all duration-300
      ${hasSearched ? 'justify-start pt-12' : 'justify-center'}`}
    >
      
      {/* titulo principal */}
      {!hasSearched && (
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-8 text-primaria tracking-tight text-center"
        >
          Consulte um número suspeito
        </motion.h1>
      )}

      {/* mecanismo de busca */}
      <SearchBar 
        numero={numero}
        setNumero={setNumero}
        onSearch={handleBuscar}
        isLoading={isLoading}
        hasSearched={hasSearched}
        onClose={resetarBusca}
      />

      {/* card de resultado completo (efeito fadeIn) */}
      <AnimatePresence mode="wait">
        {hasSearched && resultado && (
          numeroSemDenuncias ? (
            /* 1º cenario: tela p/ numeros sem denuncias */
            <motion.div
              key="limpo"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl mt-12 bg-white border border-gray-200 shadow-2xl rounded-3xl p-10 text-center flex flex-col items-center justify-center relative overflow-hidden"
            >
              {/* efeito decorativo sutil de fundo do card */}
              <div className="absolute -left-16 -top-16 w-48 h-48 bg-riscoBaixo/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="p-4 bg-emerald-50 rounded-full text-riscoBaixo mb-6 border border-emerald-100">
                <ShieldCheck size={56} className="animate-pulse" />
              </div>

              <h2 className="text-3xl font-black text-primaria tracking-tight mb-2">
                {resultado.numero}
              </h2>
              
              <div className="text-md font-bold text-riscoBaixo uppercase tracking-wider bg-emerald-50 px-4 py-1.5 rounded-full mb-4 border border-emerald-100">
                Livre de Riscos
              </div>

              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
                {resultado.mensagem || "Não existem denúncias ou atividades suspeitas registradas para este número em nosso banco de dados."}
              </p>
            
              {/* <button
                onClick={resetarBusca}
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-primaria px-6 py-3 rounded-2xl hover:bg-opacity-90 transition-all shadow-md"
              >
                Nova Consulta <ArrowRight size={16} />
              </button> */}
            </motion.div>
          ) : (
            /* 2º cenario: mostra numeros com denuncias */
            <motion.div
              key="suspeito"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-3xl mt-8 bg-primaria rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-neonCiano/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/10 pb-6 mb-6">
                <ScoreBadge score={resultado.scoreRisco} />
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold tracking-tight mb-1 text-white">{resultado.numero}</h2>
                  <p className="text-sm text-gray-400 mb-3">
                    Denúncias registradas: <span className="text-white font-semibold">{resultado.quantidadeDenuncias}</span>
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10">
                    <AlertTriangle size={16} className="text-neonRosa" />
                    <span className="text-xs font-medium text-gray-300">
                      Golpe predominante: <strong className="text-neonRosa font-bold">{resultado.tipoGolpePredominante}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* feed de alertas ativos relacionados ao numero */}
                {resultado.alertasAtivos?.length > 0 && (
                    <div className="mb-6 flex flex-col gap-2">
                        {resultado.alertasAtivos?.map((alerta, idx) => (
                            <div key={idx} className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {alerta}
                            </div>
                        ))}
                    </div>
                )}

              {/* historico recente */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                        <MessageSquare size={16} className="text-neonCiano" /> Alertas Recentes
                    </h3>

                    {resultado.historicoRecente?.length === 0 ? (
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                            <ShieldCheck size={18} className="text-riscoBaixo" /> Nenhum alerta encontrado!
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {resultado.historicoRecente?.map((denuncia, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-5 transition-colors">                                       
                                    <p className="text-sm font-medium text-gray-200 leading-relaxed mb-3">"{denuncia.descricao}"</p>
                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                                        <Calendar size={13} />
                                        Ocorrência: {new Date(denuncia.criado_em).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>               
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}