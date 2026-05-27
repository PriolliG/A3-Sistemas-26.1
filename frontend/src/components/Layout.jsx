import React from 'react';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { FingerprintPattern } from 'lucide-react';

export default function Layout({ children, telaAtiva, setTelaAtiva }) {
    return (
        <div className="min-h-screen bg-background flex text-primaria">
            {/* menu lateral fixo */}
            <Sidebar telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />

            {/* conteudo principal dinamico a direita */}
            <main className="flex-1 pl-24 min-h-screen relative flex flex-col justify-center items-center px-6 md:px-12">

                {/* logotipo no canto superior direito */}
                <header className="absolute top-8 right-12 flex flex-col items-end">
                    <div className="flex items-center gap-2">

                        <FingerprintPattern size={24} className="text-neonRosa" />                       

                        <span className="text-2xl font-bold tracking-tight text-primaria">
                            Golpe<span className="text-transparent bg-clip-text bg-linear-to-r from-neonCiano to-neonRosa">Zero</span>
                        </span>
                    </div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">
                        Plataforma Inteligente de Detecção de Golpes
                    </span>
                </header>

                {/* animacao suave de troca de tela com desfoque e opacidade */}
                <div className="w-full max-w-5xl py-16">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={telaAtiva}
                            initial={{ opacity: 0, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(4px)' }}
                            transition={{ duration: 0.2 }}
                            className="w-full flex justify-center items-center"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}