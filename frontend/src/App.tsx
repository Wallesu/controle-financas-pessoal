import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from './views/Login';
import Register from './views/Register';
import { PrivateRoute } from './components/PrivateRoute';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Accounts from './views/Accounts';
import Transactions from './views/Transactions';

console.log('App component rendering'); // Debug log

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  console.log('App component mounted'); // Debug log

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/:accountId/transactions" element={<Transactions />} />
            <Route path="/accounts/:accountId/dashboard" element={<Dashboard />} />
          </Route>

          {/* Redirecionamento padrão */}
          <Route path="/" element={<Navigate to="/accounts" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 