import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <nav>
        <Link to="/">Voltar para Home</Link>
      </nav>
      <div className="dashboard-content">
        <h2>Resumo Financeiro</h2>
        {/* Aqui você pode adicionar mais componentes conforme necessário */}
      </div>
    </div>
  );
}

export default Dashboard; 