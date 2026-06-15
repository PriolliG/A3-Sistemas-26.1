import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Trash2, ShieldCheck, Database, FileText, ClipboardList, PlusCircle, LogOut, Lock, Terminal } from 'lucide-react';
import api from '../services/api';

export default function AdminPortal() {
    const [tokenInput, setTokenInput] = useState('');
    const [tokenValido, setTokenValido] = useState(sessionStorage.getItem('admin_token') || '');
    const [erro, setErro] = useState('');
    const [dadosAdmin, setDadosAdmin] = useState(null);
    const [abaInterna, setAbaInterna] = useState('denuncias');
    const [novoGolpe, setNovoGolpe] = useState('');
    const [msgSucessoGolpe, setMsgSucessoGolpe] = useState('');

    // tenta autenticar a chave digitada com o backend
    const handleVerificarChave = async (e) => {
        e.preventDefault();
        setErro('');
        try {
            await api.post('/admin/login', {}, {
                headers: { 'Authorization': tokenInput }
            });
            sessionStorage.setItem('admin_token', tokenInput);
            setTokenValido(tokenInput);
            carregarDadosAdmin(tokenInput);
        } catch (err) {
            setErro('Chave de autenticação inválida!');
        }
    };

    // coleta todas as tabelas brutas do sistema p/ gerencia
    const carregarDadosAdmin = async (token) => {
        try {
            const response = await api.get('/admin/dados', {
                headers: { 'Authorization': token }
            });
            setDadosAdmin(response.data);
        } catch (err) {
            // se der erro de autorizacao antiga, limpara o token
            setTokenValido('');
            sessionStorage.removeItem('admin_token');
        }
    };

    // limpa o token quando sair da tela de admin
    useEffect(() => {
        if (tokenValido) {
            carregarDadosAdmin(tokenValido);
        }
        return () => {
            sessionStorage.removeItem('admin_token');
        };
    }, [tokenValido]);

    const handleDeletarDenuncia = async (id, telefoneId) => {
        if (!window.confirm("Tem certeza que deseja remover esta denúncia? O score do telefone será recalculado.")) return;
        try {
            await api.delete('/admin/denuncia', {
                headers: { 'Authorization': tokenValido },
                data: { id, telefoneId }
            });
            carregarDadosAdmin(tokenValido); // recarrega as tabelas atualizadas
        } catch (err) {
            alert("Erro ao remover o registro.");
        }
    };

    const handleDeletarTelefone = async (id) => {
        if (!window.confirm("Tem certeza que deseja remover este número? Todas as denúncias e alertas vinculados a ele tambêm serão removidass.")) return;
        try {
            await api.delete('/admin/telefone', {
                headers: { 'Authorization': tokenValido },
                data: { id }
            });
            carregarDadosAdmin(tokenValido);
        } catch (err) {
            alert("Erro ao remover o número.");
        }
    };

    const handleDeletarTodosLogs = async () => {
        if (!window.confirm("Tem certeza que deseja apagar todos os logs de busca do sistema? Isso reiniciará o histórico de contagem do detector de padrões.")) return;
        try {
            await api.delete('/admin/logs/limpar', {
                headers: { 'Authorization': tokenValido }
            });
            carregarDadosAdmin(tokenValido);
        } catch (err) {
            alert("Erro ao remover os logs.");
        }
    };

    const handleDeletarAlerta = async (id) => {
        if (!window.confirm("Tem certeza que deseja remover este alerta ativo do sistema?")) return;
        try {
            await api.delete('/admin/alerta', {
                headers: { 'Authorization': tokenValido },
                data: { id }
            });
            carregarDadosAdmin(tokenValido);
        } catch (err) {
            alert("Erro ao remover alerta.");
        }
    };

    const handleCadastrarGolpe = async (e) => {
        e.preventDefault();
        setMsgSucessoGolpe('');
        if (!novoGolpe.trim()) return;
        try {
            await api.post('/admin/tipo-golpe', { nome: novoGolpe }, {
                headers: { 'Authorization': tokenValido }
            });
            setMsgSucessoGolpe(`"${novoGolpe}" cadastrado com sucesso!`);
            setNovoGolpe('');
            carregarDadosAdmin(tokenValido); // atualiza os dados
        } catch (err) {
            alert("Erro ao cadastrar categoria.");
        }
    };

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

    // tela de bloqueio: pede a chave de autenticacao
    if (!tokenValido) {
        return (
            <div className="w-full max-w-md bg-[#121824] border border-gray-800 shadow-2xl rounded-3xl p-8 text-center text-gray-100 mx-auto mt-12">
                <div className="w-14 h-14 bg-[#1F293D] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                    <Lock size={24} className="text-neonCiano" />
                </div>
                <h2 className="text-xl font-black tracking-tight mb-1">Página Restrita</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">Ambiente de Controle</p>

                <form onSubmit={handleVerificarChave} className="flex flex-col gap-4">
                    <input
                        type="password"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder="Insira o token de admin"
                        className="w-full bg-[#0B0F19] border border-gray-800 rounded-2xl px-5 py-3.5 text-center focus:outline-none focus:border-neonRosa font-bold tracking-widest text-white transition-colors"
                        required
                    />
                    {erro && <span className="text-xs text-red-400 font-bold">{erro}</span>}
                    <button type="submit" className="w-full bg-linear-to-r from-neonCiano to-neonRosa text-[#0B0F19] py-3.5 rounded-2xl font-black text-sm tracking-wide hover:bg-opacity-90 transition-all shadow-lg">
                        Validar Credencial
                    </button>
                </form>
            </div>
        );
    }

    // painel de controle liberado
    return (
        <div className="w-full bg-[#121824] border border-gray-800 rounded-3xl p-8 shadow-2xl text-gray-100">
            <div className="flex justify-between items-center border-b border-gray-800  pb-5 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1F293D] rounded-xl border border-gray-700 text-neonCiano">
                        <Terminal size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                            Painel de Auditoria
                        </h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Gerenciamento do Sistema</p>
                    </div>
                </div>
                <button
                    onClick={() => { sessionStorage.removeItem('admin_token'); setTokenValido(''); setTokenInput(''); }}
                    className="text-xs font-bold text-red-400 bg-red-950/30 border border-red-900/30 px-4 py-2.5 rounded-xl hover:bg-red-900/20 transition all flex items-center gap-2"
                >
                    <LogOut size={14} /> Encerrar Sessão
                </button>
            </div>
            {/* menu de abas internas */}
            <div className="flex flex-wrap gap-2 bg-[#0b0F19] p-1.5 rounded-2xl w-max border border-gray-800/60 mb-6"> 
                <button onClick={() => setAbaInterna('denuncias')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${abaInterna === 'denuncias' ? 'bg-[#1F293D] text-neonCiano border border-gray-700 shadow' : 'text-gray-500 hover:text-gray-300'}`}>Denúncias</button>
                <button onClick={() => setAbaInterna('telefones')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${abaInterna === 'telefones' ? 'bg-[#1F293D] text-neonCiano border border-gray-700 shadow' : 'text-gray-500 hover:text-gray-300'}`}>Números</button>
                <button onClick={() => setAbaInterna('alertas')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${abaInterna === 'alertas' ? 'bg-[#1F293D] text-neonCiano border border-gray-700 shadow' : 'text-gray-500 hover:text-gray-300'}`}>Alertas</button>
                <button onClick={() => setAbaInterna('novo-golpe')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${abaInterna === 'novo-golpe' ? 'bg-[#1F293D] text-neonCiano border border-gray-700 shadow' : 'text-gray-500 hover:text-gray-300'}`}>Tipo Golpe</button>
                <button onClick={() => setAbaInterna('logs')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${abaInterna === 'logs' ? 'bg-[#1F293D] text-neonCiano border border-gray-700 shadow' : 'text-gray-500 hover:text-gray-300'}`}>Logs de Busca</button>
            </div>

            {abaInterna === 'logs' && dadosAdmin?.logs.length > 0 && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleDeletarTodosLogs}
                        className="text-xs font-bold text-white bg-red-600/80 border border-red-700 px-4 py-2.5 rounded-xl hover:bg-red-600 transition-colors"
                    >
                        Apagar Histórico de Logs
                    </button>
                </div>
            )}

            {/* tabela de dados em modo escuro */}
            <div className="overflow-x-auto min-h-75">
                {abaInterna === 'denuncias' && (
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead>
                            <tr className="broder-b border-gray-800 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                                <th className="pb-3">Telefone</th>
                                <th className="pb-3">Tipo de Golpe</th>
                                <th className="pb-3">Data de Entrada</th>
                                <th className="pb-3">Relato do Usuário</th>
                                <th className="pb-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 font-medium">
                            {(dadosAdmin?.denuncias || []).map((den) => (
                                <tr key={den.id} className="hover:bg-gray-800/20">
                                    <td className="py-4 font-bold text-white">{formatarTelefone(den.numero)}</td>
                                    <td className="py-4 text-xs"><span className="bg-[#1F293D] border border-gray-700 text-gray-300 px-2 py-1 rounded-md font-semibold">{den.tipo_golpe}</span></td>
                                    <td className="py-4 text-xs text-gray-500">{new Date(den.criado_em).toLocaleString('pt-BR')}</td>
                                    <td className="py-4 text-xs text-gray-400 max-w-xs truncate">"{den.descricao}"</td>
                                    <td className="py-4 text-right">
                                        <button onClick={() => handleDeletarDenuncia(den.id, den.telefone_id)} className="text-gray-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-950/20 transition-all">
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {abaInterna === 'telefones' && (
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead>
                            <tr className="border-b border-gray-800 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                                <th className="pb-3">Número Cadastrado</th>
                                <th className="pb-3">Score Atualizado</th>
                                <th className="pb-3">Data de Entrada</th>
                                <th className="pb-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 font-medium">
                            {(dadosAdmin?.telefones || []).map((tel) => (
                                <tr key={tel.id} className="hover:bg-gray-800/20">
                                    <td className="py-4 font-bold text-white">{formatarTelefone(tel.numero)}</td>
                                    <td className="py-4 font-black text-sm" style={{ color: tel.score_risco > 70 ? '#FF1744' : tel.score_risco > 30 ? '#FFD600' : '#00E676' }}>{tel.score_risco}</td>
                                    <td className="py-4 text-xs text-gray-500">{new Date(tel.criado_em).toLocaleString('pt-BR')}</td>
                                    <td className="py-4 text-right">
                                        <button onClick={() => handleDeletarTelefone(tel.id)} className="text-gray-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-950/20 transition-all">
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {abaInterna === 'alertas' && (
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead>
                            <tr className="border-b border-gray-800 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                                <th className="pb-3">Telefone Vinculado</th>
                                <th className="pb-3">Gatilho</th>
                                <th className="pb-3">Data de Emissão</th>
                                <th className="pb-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 font-medium">
                            {(dadosAdmin?.alertas || []).length === 0 ? (
                                <tr><td colSpan="4" className="py-8 text-center text-gray-500 text-xs">Nenhum alerta ativo encontrado.</td></tr>
                            ) : (
                                (dadosAdmin?.alertas || []).map((alerta) => (
                                    <tr key={alerta.id} className="hover:bg-gray-800/20">
                                        <td className="py-4 font-bold text-white">{formatarTelefone(alerta.numero)}</td>
                                        <td className="py-4 text-xs text-red-400 font-semibold ">{alerta.descricao}</td>
                                        <td className="py-4 text-xs text-gray-500">{new Date(alerta.criado_em).toLocaleString('pt-BR')}</td>
                                        <td className="py-4 text-right">
                                            <button onClick={() => handleDeletarAlerta(alerta.id)} className="text-gray-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-950/20 transtion-all">
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {abaInterna === 'logs' && (
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead>
                            <tr className="border-b border-gray-800 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                                <th className="pb-3">ID do Log</th>
                                <th className="pb-3">Número Consultado</th>
                                <th className="pb-3">Data da Consulta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 font-medium">
                            {dadosAdmin?.logs.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-8 text-center text-gray-500 font-medium text-xs">Nenhum registro de log de busca no sistema.</td>
                                </tr>
                            ) : (
                                (dadosAdmin?.logs || []).map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-800/10">
                                        <td className="py-3 text-xs text-gray-600">#{log.id}</td>
                                        <td className="py-3 font-semibold text-gray-300">{log.numero_buscado}</td>
                                        <td className="py-3 text-xs text-gray-500">{new Date(log.data_consulta).toLocaleString('pt-BR')}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {abaInterna === 'novo-golpe' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-2">

                        {/* lado esquerdo: formulario novo golpe */}
                        <div className="bg-[#0B0F19] p-6 rounded-2xl broder border-gray-800">
                            <h3 className="text-sm font-bold mb-1 flex items-center gap-2 text-white">
                                <PlusCircle size={16} className="text-neonCiano" /> Registrar Nova Categoria de Golpe
                            </h3>
                            <p className="text-xs text-gray-500 mb-4 font-medium">Esta categoria ficará disponível imediatamente nas opções do formulário público de denúncias.</p>

                            <form onSubmit={handleCadastrarGolpe} className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    value={novoGolpe}
                                    onChange={(e) => setNovoGolpe(e.target.value)}
                                    placeholder="Ex: Golpe do Falso Emprego"
                                    className="w-full border border-gray-800 bg-[#121824] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-neonCiano font-medium text-white"
                                    required
                                />
                                {msgSucessoGolpe && <span className="text-xs text-emerald-400 font-bold">{msgSucessoGolpe}</span>}
                                <button type="submit" className="bg-[#1F293D] border border-gray-700 text-white text-xs font-bold py-3 rounded-xl hover:bg-gray-700 transition-all shadow-md">
                                    Salvar Categoria
                                </button>
                            </form>
                        </div>

                        {/* lado direito: lista de golpes */}
                        <div className="bg-[#0B0F19] p-6 rounded-2xl border border-gray-800 flex flex-col gap-4">
                            <div>
                                <h3 className="text-xs font-bold mb-1 text-white">
                                    Golpes Cadastrados
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">
                                    Visualize e remova golpes obsoletos ou criados por engano.
                                </p>
                            </div>

                            <div className="max-h-62.5 overflow-y-auto pr-2 flex flex-col gap-2 divide-y divide-gray-800">
                                {dadosAdmin?.tipoGolpes?.length === 0 ? (
                                    <p className="text-xs text-gray-500 font-medium py-4 text-center">Nenhum tipo de golpe encontrado.</p>
                                ) : (
                                    dadosAdmin?.tipoGolpes?.map((tipo) => (
                                        <div key={tipo.id} className="flex justify-between items-center pt-2.5 first:pt-0">
                                            <span className="text-xs font-semibold text-gray-300">
                                                {tipo.nome}
                                            </span>
                                            <button
                                                onClick={async () => {
                                                    if (!window.confirm(`Tem certeza que deseja mesmo deletar a categoria "${tipo.nome}"?`)) return;
                                                    try {
                                                        await api.delete('/admin/tipo-golpe', {
                                                            headers: { 'Authorization': tokenValido },
                                                            data: { id: tipo.id }
                                                        });
                                                        carregarDadosAdmin(tokenValido); // atualiza o estado global das listas
                                                    } catch (err) {
                                                        alert(err.response?.data?.erro || "Erro ao remover a categoria.");
                                                    }
                                                }}
                                                className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg transition-all"
                                                title="Excluir categoria"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}