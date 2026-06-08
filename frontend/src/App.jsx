import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import DenunciaForm from './pages/DenunciaForm';
import Dashboard from './pages/Dashboard';
import AdminPortal from './pages/AdminPortal';

export default function App() {
  // define a tela inicial checando se o usuario tentou acessar pela url /admin
  const [telaAtiva, setTelaAtiva] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'home';
  });

  useEffect(() => {
    const checarUrl = () => {
      const isAdminRoute = window.location.pathname === '/admin';
      if (isAdminRoute) {
        setTelaAtiva('admin');
      } else {
        // se sair da tela de admin, fecha a sessao
        sessionStorage.removeItem('admin_token');
        if (telaAtiva === 'admin') setTelaAtiva('home');
      }
    };

    // monitora o evento de clique em voltar/avançar no navegador
    window.addEventListener('popstate', checarUrl);
    // roda verific inicial
    checarUrl();

    return () => window.removeEventListener('popstate', checarUrl);
  }, [telaAtiva]);

  // funcao auxiliar p/ renderizar a tela selecionada temporariamente
  const renderizarTela = () => {
    switch (telaAtiva) {
      case 'home':
        return <Home />; // renderiza home dinamica
      case 'denuncia':
        return <DenunciaForm />;
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        return <AdminPortal />;
      case 'config':
        return <h2 className="text-xl font-bold">Tela em desenvolvimento</h2>
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