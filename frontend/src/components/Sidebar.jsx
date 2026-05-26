import React from 'react';
import { ShieldAlert, FileText, BarChart3, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar({ telaAtiva, setTelaAtiva }) {
    const itensMenu = [
        { id: 'home', rotulo: 'Scores', icone: ShieldAlert },
        { id: 'denuncia', rotulo: 'Denúncias', icone: FileText },
        { id: 'dashboard', rotulo: 'Padrões', icone: BarChart3 }
    ];

    return (
        <aside className="w-24 min-h-screen bg-primaria flex flex-col items-center py-8 text-white fixed left-0 top-0 z-50">
            <div className="mb-12 cursor-pointer">
                <Menu size={28} className="text-gray-400 hover:text-white transition-colors" />
            </div>

            <nav className="flex-1 flex flex-col gap-8 w-full px-2">
                {itensMenu.map((item) => {
                    const IconeComponente = item.icone;
                    const isActive = telaAtiva === item.id;

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => setTelaAtiva(item.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 relative group w-full
                                ${isActive ? 'text-neonCiano bg-white/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            <IconeComponente size={24} />
                            <span className="text-[10px] mt-1 font-medium tracking-wide">{item.rotulo}</span>

                            {/* Brilho na lateral esquerda para item ativo */}
                            {isActive && (
                                <motion.div
                                    layoutId="indicadorAtivo"
                                    className="absolute left-0 w-1 h-8 bg-neonCiano rounded-r-full"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </nav>
        </aside>
    );
}