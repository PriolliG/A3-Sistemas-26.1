import React, { useState } from 'react';
import Layout from './components/Layout';

export default function App() {
  const [telaAtiva, setTelaAtiva] = useState('home');

  // funcao auxiliar p/ renderizar a tela selecionada temporariamente
  const renderizarTela = () => {
    switch (telaAtiva) {
      case 'home':
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-primaria">Consulte um número suspeito</h1>
            <p className="text-gray-500">Módulo de consulta pública e scores em construção...</p>
          </div>
        );
      case 'denuncia':
        return <h2 className="text-xl font-bold">Módulo de Envio de Dénuncias em etapas</h2>;
      case 'dashboard':
        return <h2 className="text-xl font-bold">Módulo do Dashboard Analítico de Padrões</h2>;
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