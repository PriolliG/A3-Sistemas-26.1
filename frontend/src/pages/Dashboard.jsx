import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, LabelList } from 'recharts';
import { ShieldAlert, TrendingUp, Clock, PieChart as PieIcon, ListOrdered, BellRing } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
    const [dados, setDados] = useState(null);
    const [alertas, setAlertas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // mapeamento das cores para os graficos
    const CORES_NEON = ['#00F2FE', '#F355DA', '#FFD600', '#FF1744', '00E676']; //#7C11CF

    // formatacao para os numeros telefone
    const formatarTelefone = (num) => {
        const limpo = String(num).replace(/\D/g, '');
        if (limpo.length === 11) {
            return `(${limpo.substring(0, 2)}) ${limpo.substring(2, 7)}-${limpo.substring(7)}`;
        } else if (limpo.length === 10) {
            return `(${limpo.substring(0, 2)}) ${limpo.substring(2, 6)}-${limpo.substring(6)}`;
        }
        return num;
    };

    useEffect(() => {
        async function carregarIndicadores() {
            try {
                const response = await api.get('/analytics/dashboard');
                setDados(response.data.dadosGerais);
                setAlertas(response.data.alertasAtivos);
            } catch (error) {
                console.error("Erro ao coleta dados analíticos:", error);
            } finally {
                setIsLoading(false);
            }
        }
        carregarIndicadores();
    }, []);

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-t-neonCiano border-primaria rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Processando inteligência antifraude...</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-8">

            {/* 5. feed de alertas ativos (notificacoes em tempo real */}
            {alertas.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 20 }}
                    className="w-full bg-white border border-red-100 rounded-3xl p-6 shadow-sm"
                >
                    <h3 className="text-sm font-black text-red-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                        <BellRing size={18} className="animate-bounce" /> Campanhas de Fraude Ativas Detectadas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {alertas.map((alerta, idx) => (
                            <div key={idx} className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col gap-1">
                                <span className="text-xs font-black text-red-600 uppercase tracking-wide">Alerta de Padrão Suspeito</span>
                                <p className="text-sm text-primaria font-semibold">Alvo: {formatarTelefone(alerta.numero)}</p>
                                <p className="text-xs text-gray-600 leading-relaxed">"{alerta.descricao}"</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* grid de graficos e paineis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 select-none **:focus:outline-none **:outline-none">

                {/* 1º top 5 numeros mais denunciados */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-md font-bold tracking-tight mb-4 text-primaria flex items-center gap-2">
                            <ListOrdered size={20} className="text-primaria" /> Top 5 Números Mais Denunciados
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        <th className="pb-3">Telefone</th>
                                        <th className="pb-3 text-center">Denúncias</th>
                                        <th className="pb-3 text-right">Score Atual</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-sm font-medium">
                                    {dados.telefonesMaisDenunciados.map((tel, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3.5 text-primaria font-semibold">{formatarTelefone(tel.numero)}</td>
                                            <td className="py-3.5 text-center font-bold text-gray-500">{tel.total_denuncias}</td>
                                            <td className="py-3.5 text-right font-black" style={{ color: tel.score_risco > 70 ? '#FF1744' : tel.score_risco > 30 ? '#FFD600' : '#00E676' }}>
                                                {tel.score_risco}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 2º grafico de pizza: tipos de golpes mais comuns */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm min-h-75">
                    <h3 className="text-md font-bold tracking-tight mb-4 text-primaria flex items-center gap-2">
                        <PieIcon size={20} className="text-neonRosa" /> Tipos de Golpes Mais Comuns
                    </h3>
                    <div className="w-full h-56 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie                                
                                    data={dados?.golpesMaisComuns}
                                    dataKey={"total_ocorrencias"}
                                    nameKey="tipo_golpe"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >   
                                    {dados?.golpesMaisComuns.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CORES_NEON[index % CORES_NEON.length]} />
                                    ))}
                                    <LabelList dataKey="total_ocorrencias" position="inside" style={{ fill: '#11224D', fontSize: 11, fontWeight: 600 }}/>
                                </Pie>
                                <Tooltip contentStyle={{ background: '#11224D', color: '#fff', borderRadius: '12px', border: 'none' }} />
                                <Legend iconType='circle' wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3º grafico de barras: horarios criticos (picos de atividade golpista) */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm min-h-75">
                    <h3 className="text-md font-bold tracking-tight mb-4 text-primaria flex items-center gap-2">
                        <Clock size={20} className="text-neonCiano" /> Horários Críticos de Atividade Suspeita (Picos por Hora)
                    </h3>
                    <div className="w-full h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dados?.horariosCriticos}>
                                <XAxis dataKey="hora_do_dia" tickFormatter={(v) => `${v}h`} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                                {/*<Tooltip formatter={(value) => [`${value} denuncias`, 'Volume']} contentStyle={{ background: '#11224D', color: '#fff', borderRadius: '12px', border: 'none' }} /> */}
                                <Bar dataKey="total_denuncias" fill="#11224D" radius={[6, 6, 0, 0]}>
                                    <LabelList dataKey="total_denuncias" position="inside" style={{ fill: '#F4F4F4', fontSize: 11, fontWeight: 600 }}/>
                                    {dados?.horariosCriticos.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#F355DA' : '#11224D'} /> // horarios mais perigoso em rosa
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4º grafico de linhas: evolucao cronologica de denuncias */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm min-h-75">
                    <h3 className="text-md font-bold tracking-tight mb-4 text-primaria flex items-center gap-2">
                        <TrendingUp size={20} className="text-riscoBaixo" /> Evolução Cronológica de Ocorrências
                    </h3>
                    <div className="w-full h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dados?.evolucaoDenuncias}>
                                <XAxis dataKey="data_registro" tickFormatter={(v) => new Date(v).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} tick={{ fill: '#9CA3AF', fontSize: '11', fontWeight: '600' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip 
                                    labelFormatter={(label) => `Data: ${new Date(String(label).replace(' ', 'T')).toLocaleDateString('pt-BR')}`}
                                    contentStyle={{ background: '#11224D', color: '#fff', borderRadius: '12px', border: 'none' }} 
                                />
                                <Line type="monotone" dataKey="total_denuncias" name="Denúncias" stroke="#00F2FE" strokeWidth={3} dot={{ r: 4, stroke: '#00F2FE', strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}