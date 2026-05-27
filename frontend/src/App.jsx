import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import DenunciaForm from './pages/DenunciaForm';

export default function App() {
  const [telaAtiva, setTelaAtiva] = useState('home');

  // funcao auxiliar p/ renderizar a tela selecionada temporariamente
  const renderizarTela = () => {
    switch (telaAtiva) {
      case 'home':
        return <Home />; // renderiza home dinamica
      case 'denuncia':
        return <DenunciaForm />;
      case 'dashboard':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Painel Analytics</h2>
            <p className="text-gray-500">WIP</p>
          </div>
        );
      default:
        return <h2 className="text-xl font-bold">Tela não encontrada</h2>;
    }
  };

  return (
    <Layout telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva}>
      {renderizarTela()}
    </Layout>
  );
}