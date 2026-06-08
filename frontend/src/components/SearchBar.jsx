import React from 'react';
import { Search, PhoneOff, Delete } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar({ numero, setNumero, onSearch, isLoading, hasSearched, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (numero.trim() && !isLoading) {
      // remove a mascara p/ enviar o numero a api
      const numeroLimpo = numero.replace(/\D/g, '');
      onSearch(numeroLimpo);
    }
  };

  const handleClearAndClose = () => {
  setNumero('');
    if (onClose) {
      onClose();
    }
  };

  // mascara ao escrever o numero
  const formatarTelefone = (num) => {
    const limpo = String(num).replace(/\D/g, '');
    const apenasNumeros = limpo.substring(0, 11);
    if (apenasNumeros.length === 0 ) return '';
    if (apenasNumeros.length <= 2) {
      return `(${apenasNumeros}`;
    }
    if (apenasNumeros.length <= 6) {
      return `(${apenasNumeros.substring(0, 2)}) ${apenasNumeros.substring(2)}`;
    }
    if (apenasNumeros.length <= 10) {
      return `(${apenasNumeros.substring(0, 2)}) ${apenasNumeros.substring(2, 6)}-${apenasNumeros.substring(6)}`;
    }
    return `(${apenasNumeros.substring(0, 2)}) ${apenasNumeros.substring(2, 7)}-${apenasNumeros.substring(7)}`;
  };

  // detecta a digitacao
  const handleInputChange = (e) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setNumero(valorFormatado)
  };

  return (
    <motion.div
      // se ja pesquisou a barra deslizara para cima (slideIn)
      animate={{ y: hasSearched ? -20 : 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative p-0.75 rounded-full overflow-hidden group">
        
        {/* gradiente neon de fundo da borda */}
        <div className={`absolute inset-0 borda-neon-gradiente transition-all duration-300 group-hover:opacity-100 opacity-90
          ${isLoading ? 'animate-spin duration-1000' : ''}`} 
          style={isLoading ? { transformOrigin: 'center center', scale: '2' } : {}}
        />

        {/* caixa interna em azul marinho */}
        <div className="bg-primaria rounded-full flex items-center px-6 py-4 relative z-10">
          <Search className="text-neonCiano mr-4 shrink-0" size={22} />
          
          <input
            type="text"
            value={numero}
            onChange={handleInputChange}
            placeholder="Digite o número de telefone (ex: 11999998888)"
            disabled={isLoading}
            className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full font-medium tracking-wide text-lg"
          />

          {numero && (
            <motion.button
              type="button"
              onClick={handleClearAndClose}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="text-neonRosa mr-2 shrink-0 focus:outline-none hover:brightness-125 transition-all"
            >
              <Delete size={22} />
            </motion.button>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading || !numero.trim()}
            className="bg-linear-to-r from-neonCiano to-neonRosa text-primaria font-bold px-6 py-2 rounded-full text-sm ml-2 tracking-wide shadow-lg disabled:opacity-50"
          >
            {isLoading ? 'Buscando...' : 'Consultar'}
          </motion.button>
          
         {/* <PhoneOff className="text-neonRosa ml-4 opacity-40 shrink-0" size={20} /> */}
        </div>
      </form>
    </motion.div>
  );
}