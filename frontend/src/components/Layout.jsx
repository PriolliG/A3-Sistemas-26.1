import React from 'react';
import Sidebar from './Sidebar';
import BannerAds from './BannerAds';
import { motion, AnimatePresence } from 'framer-motion';
import { FingerprintPattern } from 'lucide-react';

export default function Layout({ children, telaAtiva, setTelaAtiva }) {
    const isAdminRoute = telaAtiva === 'admin';

    return (
        <div className={`min-h-screen flex transition-colors duration-300 relative ${isAdminRoute ? 'bg-[#0B0F19]' : 'bg-[#F4F4F4]'}`}>
            {!isAdminRoute && (
            /* menu lateral fixo */
                <Sidebar telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
            )}
            
            {/* conteudo principal dinamico a direita */}
            <main className={`flex-1 min-h-screen relative flex flex-col  justify-center items-center px-6 md:px-12 ${isAdminRoute ? 'pl-0' : 'pl-24'}`}>

                {/* logotipo no canto superior direito */}
                {!isAdminRoute && (
                    <header className="absolute top-8 right-12 flex flex-col items-end z-10">
                        <div className="flex items-center gap-2">

                            <FingerprintPattern size={24} className="text-neonRosa" />                       

                            <span className="text-2xl font-bold tracking-tight text-primaria">
                                Golpe<span className="text-transparent bg-clip-text bg-linear-to-r from-neonCiano to-neonRosa">Zero</span>
                            </span>
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                            Toda denúncia conta
                            {/*Plataforma Inteligente de Detecção de Golpes */}
                        </span>
                    </header>
                )}

                {/* animacao suave de troca de tela com desfoque e opacidade */}
                <div className={`w-full ${isAdminRoute ? 'max-w-7xl py-8' : 'max-w-5xl py-16'}`}>
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

            {/* container dos anuncios */}
            {(!isAdminRoute && telaAtiva !== 'dashboard') &&(
                <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
                    <BannerAds />
                </div>
            )}
        </div>
    );
}