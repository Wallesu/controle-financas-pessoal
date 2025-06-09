import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

console.log('index.tsx is executing'); // Debug log

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement); // Debug log

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
console.log('React root created'); // Debug log

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals(); 