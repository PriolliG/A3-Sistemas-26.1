import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert, Calendar, Type, FileEdit } from 'lucide-react';
import api from '../services/api';

export default function DenunciaForm() {
    const [passo, setPasso] = useState(1);
    const [tiposGolpe, setTiposGolpe] = useState([]);
    const [sucesso, setSucesso] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // estados dos campos do formulario de denuncia
    const [numero, setNumero] = useState('');
    const [dataOcorrencia, setDataOcorrencia] = useState('');
    const [tipoGolpeId, setTipoGolpeId] = useState('');
    const [descricao, setDescricao] = useState('');

    // carrega as categorias de golpe do banco de dados ao montar a tela
    useEffect(() => {
        async function carregarTipos() {
            try {
                const response = await api.get('/tipos-golpe');
                setTiposGolpe(response.data);
            } catch (error) {
                console.error("Erro ao buscar tipos de golpe:", error);
            }
        }
        carregarTipos();
    }, []);

    // mascara automatica de telefone para o formato (XX) XXXXX-XXXX
    const aplicarMascaraTelefone = (valor) => {
        const apenasNumeros = valor.replace(/\D/g, '');
        if (apenasNumeros.length <= 2) return apenasNumeros;
        if (apenasNumeros.length <= 7) return `(${apenasNumeros.substring(0, 2)}) ${apenasNumeros.substring(2)}`;
        return `(${apenasNumeros.substring(0, 2)}) ${apenasNumeros.substring(2, 7)}-${apenasNumeros.substring(7, 11)}`;
    };

    const handleNumeroChange = (e) => {
        setNumero(aplicarMascaraTelefone(e.target.value));
    };

    const handleAvancar = () => {
        if (numero && dataOcorrencia) setPasso(2);
    };

    const handleVoltar = () => {
        setPasso(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tipoGolpeId || !descricao) return;

        setIsLoading(true);
        // remove a mascara antes de enviar o numero puro para a api do backend
        const numeroPuro = numero.replace(/\D/g, '');

        try {
            await api.post('/denuncias', {
                numero: numeroPuro,
                tipoGolpeId: parseInt(tipoGolpeId),
                descricao,
                dataOcorrencia
            });
            setSucesso(true);
        } catch (error) {
            console.error("Erro ao enviar a denúncia:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // variantes de animacao p/ o efeito de slide do forms denuncia
    const variantesSlide = {
        entrada: (direcao) => ({
            x: direcao > 0 ? 300 : -300,
            opacity: 0
        }),
        centro: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.3 }
        },
        saida: (direcao) => ({
            x: direcao > 0 ? -300 : 300,
            opacity: 0,
            transition: { duration: 0.3 }
        })
    };

    // tela feedback de sucesso denuncia
    if (sucesso) {
        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-white border border-gray-200 shadow-xl roundex-3xl p-8 text-center flex flex-col items-center justify-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                >
                    <CheckCircle2 size={72} className="text-riscoBaixo mb-4" />
                </motion.div>
                <h2 className="text-2xl font-black text-primaria mb-2">Denúncia Enviada!</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Obrigado pela sua denúncia. Suas informações foram processadas e integradas à nossa rede de inteligência antifraude.
                </p>
                <button
                    onClick={() => { setSucesso(false); setPasso(1); setNumero(''); setDescricao(''); setTipoGolpeId(''); setDataOcorrencia(''); }}
                    className="w-full bg-primaria text-white py-3.5 rounded-2xl font-bold tracking-wide hover:bg-opacity-90 transition-all"
                >
                    Registrar outra ocorrência
                </button>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-white border border-dray-200 shadow-xl rounded-3xl p-8 text-primaria relative overflow-hidden">

            {/* cabecalho do forms e barra de progresso sutil */}
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold tracking-tight">Registrar denúncia</h2>
                <p className="text-xs text-gray-400 mt-1 uppercase font-semibold tracking-wider">Passo {passo} de 2</p>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                    <motion.div
                        className="h-full borda-neon-gradiente"
                        animate={{ width: passo === 1 ? '50%' : '100%' }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="min-h-55 relative overflow-hidden flex items-center">
                    <AnimatePresence mode="wait" custom={passo}>
                        {passo === 1 ? (
                            /* ==========================================
                                PASSO 1: TELEFONE E DATA
                               ========================================== */
                            <motion.div
                               key="passo1"
                               custom={1}
                               variants={variantesSlide}
                               initial="entrada"
                               animate="centro"
                               exit="saida"
                               className="w-full flex flex-col gap-5"
                            >
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                        <ShieldAlert size={14} /> Número Telefônico Suspeito
                                    </label>
                                    <input
                                        type="text"
                                        value={numero}
                                        onChange={handleNumeroChange}
                                        placeholder="(11) 98888-7777"
                                        maxLength={15}
                                        className="w-full bg-backgroud border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-neonCiano font-medium tracking-wide transition-colors"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                       <Calendar size={14} /> Data da Ocorrência 
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={dataOcorrencia}
                                        onChange={(e) => setDataOcorrencia(e.target.value)}
                                        className="w-full bg-background border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-neonCiano font-medium transition-colors"
                                        required
                                    />
                                </div>
                            </motion.div>
                        ) : (
                           /* ==========================================
                              PASSO 2: CATEGORIA E DESCRIÇÃO
                              ========================================== */
                            <motion.div
                                key="passo2"
                                custom={-1}
                                variants={variantesSlide}
                                initial="entrada"
                                animate="centro"
                                exit="saida"
                                className="w-full flex flex-col gap-5"
                            >
                               <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                        <Type size={14} /> Tipo de Golpe Aplicado
                                    </label>
                                    <select
                                        value={tipoGolpeId}
                                        onChange={(e) => setTipoGolpeId(e.target.value)}
                                        className="w-full bg-background border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-neonRosa font-medium transition-colors appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">Selecione o tipo de golpe</option>
                                        {tiposGolpe.map((tipo) => (
                                            <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                        ))}
                                    </select>
                                </div> 

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                        <FileEdit size={14} /> Descrição Detalhada da Ocorrência
                                    </label>
                                    <textarea
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        placeholder="Conte detalhadamente o ocorrido."
                                        rows={3}
                                        className="w-full bg-background border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-neonRosa font-medium text-sm leading relaxed transition-colors resize-none"
                                        required
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* botoes de acao inferiores */}
                <div className="flex items-center gap-3 mt-8 border-t border-gray-100 pt-5">
                    {passo === 2 && (
                        <button
                            type="button"
                            onClick={handleVoltar}
                            className="px-5 py-3.5 bg-gray-100 rounded-2xl text-gray-600 font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft size={16} /> Voltar
                        </button>
                    )}

                    {passo === 1 ? (
                        <button
                            type="button"
                            onClick={handleAvancar}
                            disabled={!numero || !dataOcorrencia}
                            className="flex-1 bg-primaria text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-opacity-90 disabled:opacity-50 transition-all"
                        >
                            Avançar Próxima Etapa <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isLoading || !tipoGolpeId || !descricao}
                            className="flex-1 bg-linear-to-r from-neonCiano to-neonRosa text-primaria py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 shadow-lg transition-all"
                        >
                            {isLoading ? 'Registrando denúncia...' : 'Concluir e enviar denúncia'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}