import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function BannerAds() {
    const [indiceAtual, setIndiceAtual] = useState(0);

    const banners = [
        {
            id: 1,
            //texto: "Proteja seus dados com o GolpeZero Premium",
            // bgClass: "bg-gradient-to-br from-primaria to-blue-900",
            clicavel: false,
            imagem: "/assets/banner1.jpeg",
        },
        {
            id: 2,
            //texto: "Conheça nosso parceiro de Segurança Digital",
            // bgClass: "bg-gradient-to-br from-primaria to-neonRosa",
            clicavel: true,
            link: "https://estagiobradesco2026.eureca.me",
            imagem: "/assets/banner2.jpeg",
        },
        {
            id: 3,
            // texto: "Baixe a cartilha de prevenção contra fraudes",
            // bgClass: "bg-gradient-to-br from-primaria to-neonCiano",
            clicavel: false,
            imagem: "/assets/banner3.jpeg",
        }
    ];

    // efeito de loop
    useEffect(() => {
        const timer = setInterval(() => {
            setIndiceAtual((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 15000); // 15seg
        
        return () => clearInterval(timer);
    }, [banners.length]);

    const bannerAtivo = banners[indiceAtual];

    // estrutura interna do banner
    const ConteudoBanner = () => (
        <div className={`w-50 h-141.5 rounded-3xl p-6 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden group ${bannerAtivo.bgClass}`}>
            
            <img src={bannerAtivo.imagem} alt="Anúncio" className="absolute inset-0 w-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-500 " />
            <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest bg-black/30 w-max px-2 py-1 rounded-md z-10">
                Publicidade
            </span>

            {/* remover ao adicionar as imagens */}
            {/*<div className="relative z-10">
                <h4 className="font-bold text-lg leading-tight mb-2">{bannerAtivo.texto}</h4>
                {bannerAtivo.clicavel && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-white text-primaria px-3 py-1.5 rounded-lg mt-2 group-hover:scale-105 transition-transform">
                        Saiba Mais <ExternalLink size={12} />
                    </span>
                )}
            </div> */}
        </div>
    );

    return (
        <div className="w-50 h-141.5 relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={bannerAtivo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1}}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    {bannerAtivo.clicavel ? (
                        <a href={bannerAtivo.link} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                            <ConteudoBanner />
                        </a>
                    ) : (
                        <div>
                            <ConteudoBanner />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}