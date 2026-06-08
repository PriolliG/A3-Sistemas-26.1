import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, Trash2, ShieldCheck, Database, FileText, ClipboardList, PlusCircle } from 'lucide-react';
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
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white border border-gray-200 shadow-2xl rounded-3xl p-8 text-center"
            >
                <div className="w-14 h-14 bg-primaria text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Lock size={24} className="text-neonCiano" />
                </div>
                <h2 className="text-2xl font-black text-primaria mb-1">Página Restrita</h2>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-6">Ambiente de Controle</p>

                <form onSubmit={handleVerificarChave} className="flex flex-col gap-4">
                    <input
                        type="password"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder="Insira o token de admin"
                        className="w-full bg-background border border-gray-200 rounded-2xl px-5 py-3.5 text-center focus:outline-none focus:border-neonRosa font-bold tracking-widest"
                        required
                    />
                    {erro && <span className="text-xs text-red-500 font-bold">{erro}</span>}
                    <button type="submit" className="w-full bg-primaria text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide hover:bg-opacity-90 transition-all">
                        Validar Credencial
                    </button>
                </form>
            </motion.div>
        );
    }

    // painel de controle liberado
    return (
        <div className="w-full flex flex-col gap-6 bg-white border border-gray-200 rounded-3xl p-8 mt-6 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-primaria tracking-tight flex items-center gap-2">
                        <Database size={24} className="text-neonRosa" /> Painel de Auditoria
                    </h2>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Gerenciamento do Sistema</p>
                </div>
                <button
                    onClick={() => { sessionStorage.removeItem('admin_token'); setTokenValido(''); setTokenInput(''); }}
                    className="text-xs font-bold text-red-500 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
                >
                    Encerrar Sessão
                </button>
            </div>

            {/* menu de abas internas */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2 bg-background p-1.5 rounded-2xl w-max">
                    <button onClick={() => setAbaInterna('denuncias')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${abaInterna === 'denuncias' ? 'bg-primaria text-white shadow' : 'text-gray-500 hover:text-primaria'}`}>Denúncias</button>
                    <button onClick={() => setAbaInterna('telefones')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${abaInterna === 'telefones' ? 'bg-primaria text-white shadow' : 'text-gray-500 hover:text-primaria'}`}>Números</button>
                    <button onClick={() => setAbaInterna('alertas')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${abaInterna === 'alertas' ? 'bg-primaria text-white shadow' : 'text-gray-500 hover:text-primaria'}`}>Alertas</button>
                    <button onClick={() => setAbaInterna('novo-golpe')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${abaInterna === 'novo-golpe' ? 'bg-primaria text-white shadow' : 'text-gray-500 hover:text-primaria'}`}>Tipo Golpe</button>
                    <button onClick={() => setAbaInterna('logs')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${abaInterna === 'logs' ? 'bg-primaria text-white shadow' : 'text-gray-500 hover:text-primaria'}`}>Logs de Busca</button>
                </div>

                {abaInterna === 'logs' && dadosAdmin?.logs.length > 0 && (
                    <button
                        onClick={handleDeletarTodosLogs}
                        className="text-xs font-bold text-white bg-red-500 px-4 py-2.5 rounded-xl hover:bg-red-600 transition-colors shadow-sm"
                    >
                        Apagar Histórico de Logs
                    </button>
                )}
            </div>

            {/* tabela dinamica com base na aba ativa */}
            <div className="overflow-x-auto min-h-75">
                {abaInterna === 'denuncias' && (
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="broder-b border-gray-100 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                                <th className="pb-3">Telefone</th>
                                <th className="pb-3">Tipo de Golpe</th>
                                <th className="pb-3">Data de Entrada</th>
                                <th className="pb-3">Relato do Usuário</th>
                                <th className="pb-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                            {(dadosAdmin?.denuncias || []).map((den) => (
                                <tr key={den.id} className="hover:bg-gray-50/50">
                                    <td className="py-4 font-bold text-primaria">{formatarTelefone(den.numero)}</td>
                                    <td className="py-4 text-xs"><span className="bg-gray-100 px-2 py-1 rounded-md font-bold">{den.tipo_golpe}</span></td>
                                    <td className="py-4 text-xs text-gray-400">{new Date(den.criado_em).toLocaleString('pt-BR')}</td>
                                    <td className="py-4 text-xs text-gray-500 max-w-xs">"{den.descricao}"</td>
                                    <td className="py-4 text-right">
                                        <button onClick={() => handleDeletarDenuncia(den.id, den.telefone_id)} className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {abaInterna === 'telefones' && (
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                                <th className="pb-3">Número Cadastrado</th>
                                <th className="pb-3">Score Atualizado</th>
                                <th className="pb-3">Data de Entrada</th>
                                <th className="pb-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                            {(dadosAdmin?.telefones || []).map((tel) => (
                                <tr key={tel.id}>
                                    <td className="py-4 font-bold text-primaria">{formatarTelefone(tel.numero)}</td>
                                    <td className="py-4 font-black" style={{ color: tel.score_risco > 70 ? '#FF1744' : tel.score_risco > 30 ? '#FFD600' : '#00E676' }}>{tel.score_risco}</td>
                                    <td className="py-4 text-xs text-gray-400">{new Date(tel.criado_em).toLocaleString('pt-BR')}</td>
                                    <td className="py-4 text-right">
                                        <button onClick={() => handleDeletarTelefone(tel.id)} className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {abaInterna === 'alertas' && (
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                                <th className="pb-3">Telefone Vinculado</th>
                                <th className="pb-3">Gatilho</th>
                                <th className="pb-3">Data de Emissão</th>
                                <th className="pb-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                            {(dadosAdmin?.alertas || []).length === 0 ? (
                                <tr><td colSpan="4" className="py-8 text-center text-gray-400 text-xs">Nenhum alerta ativo encontrado.</td></tr>
                            ) : (
                                (dadosAdmin?.alertas || []).map((alerta) => (
                                    <tr key={alerta.id}>
                                        <td className="py-4 font-bold">{formatarTelefone(alerta.numero)}</td>
                                        <td className="py-4 text-xs text-red-600 font-semibold  rounded-lg px-2">{alerta.descricao}</td>
                                        <td className="py-4 text-xs text-gray-400">{new Date(alerta.criado_em).toLocaleString('pt-BR')}</td>
                                        <td className="py-4 text-right">
                                            <button onClick={() => handleDeletarAlerta(alerta.id)} className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {abaInterna === 'logs' && (
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                                <th className="pb-3">ID do Log</th>
                                <th className="pb-3">Número Consultado</th>
                                <th className="pb-3">Data da Consulta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium text-gray-600">
                            {dadosAdmin?.logs.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-8 text-center text-gray-400 font-medium text-xs">Nenhum registro de log de busca no sistema.</td>
                                </tr>
                            ) : (
                                (dadosAdmin?.logs || []).map((log) => (
                                    <tr key={log.id}>
                                        <td className="py-3 text-xs text-gray-400">#{log.id}</td>
                                        <td className="py-3 font-semibold text-primaria">{log.numero_buscado}</td>
                                        <td className="py-3 text-xs">{new Date(log.data_consulta).toLocaleString('pt-BR')}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {abaInterna === 'novo-golpe' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-2">

                        {/* lado esquerdo: formulario novo golpe */}
                        <div className="max-w-md bg-background p-6 rounded-2xl border border-gray-100 mt-2">
                            <h3 className="text-md font-bold mb-1 flex items-center gap-2">
                                <PlusCircle size={18} className="text-neonCiano" /> Registrar Nova Categoria de Golpe
                            </h3>
                            <p className="text-xs text-gray-400 mb-4 font-medium">Esta categoria ficará disponível imediatamente nas opções do formulário público de denúncias.</p>

                            <form onSubmit={handleCadastrarGolpe} className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    value={novoGolpe}
                                    onChange={(e) => setNovoGolpe(e.target.value)}
                                    placeholder="Ex: Golpe do Falso Emprego"
                                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neonCiano font-medium text-primaria"
                                    required
                                />
                                {msgSucessoGolpe && <span className="text-xs text-emerald-600 font-bold">{msgSucessoGolpe}</span>}
                                <button type="submit" className="bg-primaria text-white text-xs font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all shadow-md">
                                    Salvar Categoria
                                </button>
                            </form>
                        </div>

                        {/* lado direito: lista de golpes */}
                        <div className="bg-background p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
                            <div>
                                <h3 className="text-md font-bold mb-1 text-primaria">
                                    Golpes Cadastrados
                                </h3>
                                <p className="text-xs text-gray-400 font-medium">
                                    Visualize e remova golpes obsoletos ou criados por engano.
                                </p>
                            </div>

                            <div className="max-h-[250px] overflow-y-auto pr-2 flex flex-col gap-2 divide-y divide-gray-100">
                                {dadosAdmin?.tipoGolpes?.length === 0 ? (
                                    <p className="text-xs text-gray-400 font-medium py-4 text-center">Nenhum tipo de golpe encontrado.</p>
                                ) : (
                                    dadosAdmin?.tipoGolpes?.map((tipo) => (
                                        <div key={tipo.id} className="flex justify-between items-center pt-2.5 first:pt-0 group">
                                            <span className="text-xs font-bold text-gray-700 group-hover:text-primaria transition-colors">
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
                                                className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors"
                                                title="Excluir categoria"
                                            >
                                                <Trash2 size={14} />
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