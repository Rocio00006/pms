import React, { useState } from 'react';
// Asumiendo que tus archivos están en la misma carpeta
import SQLJunior from './components/SQLJunior';
import SQLIntermediate from './components/SQLIntermediate';

const App = () => {
  // El estado 'view' nos dirá qué componente mostrar
  const [view, setView] = useState('home');

  // Estilos rápidos en objetos para no usar CSS externo
  const styles = {
    container: { fontFamily: 'sans-serif', textAlign: 'center', padding: '50px' },
    button: { margin: '10px', padding: '15px 30px', fontSize: '16px', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: '#007bff', color: 'white' },
    backBtn: { marginTop: '20px', padding: '10px', cursor: 'pointer', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }
  };

  // Lógica de renderizado condicional
  if (view === 'junior') {
    return (
      <div style={styles.container}>
        <SQLJunior />
        <button style={styles.backBtn} onClick={() => setView('home')}>Volver al Menú</button>
      </div>
    );
  }

  if (view === 'intermediate') {
    return (
      <div style={styles.container}>
        <SQLIntermediate />
        <button style={styles.backBtn} onClick={() => setView('home')}>Volver al Menú</button>
      </div>
    );
  }

  // Vista de Landing Page (Home)
  return (
    <div style={styles.container}>
      <h1>Options</h1>
      
      <div style={{ marginTop: '30px' }}>
        <button style={styles.button} onClick={() => setView('junior')}>
          Ir a SQL Junior
        </button>
        
        <button style={{ ...styles.button, backgroundColor: '#28a745' }} onClick={() => setView('intermediate')}>
          Ir a SQL Intermediate
        </button>
      </div>
    </div>
  );
};

export default App;