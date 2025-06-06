import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Controle de Finanças Pessoais</h1>
      <nav>
        <Link to="/dashboard">Ir para Dashboard</Link>
      </nav>
    </div>
  );
}

export default Home; 