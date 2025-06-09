import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await authService.login(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/accounts');
      }, 1000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ocorreu um erro ao fazer login');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,rgb(8, 14, 26) 0%,rgb(22, 37, 58) 30%,rgb(43, 59, 75) 50%,rgb(16, 33, 54) 75%,rgb(11, 19, 36) 100%)',
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          bgcolor: 'white',
          width: '100%',
          maxWidth: '384px',
          borderRadius: '12px',
          p: 4,
          border: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="h4" sx={{ color: '#1f2937', mb: 1, fontWeight: 'bold' }}>
          Login
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
          Digite o e-mail e senha nos campos abaixo.
        </Typography>

        {error && (
          <Typography sx={{ color: '#ef4444', mb: 2, fontSize: '0.875rem' }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography sx={{ color: '#16a34a', mb: 2, fontSize: '0.875rem' }}>
            Login realizado com sucesso!
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography component="label" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
              E-mail
            </Typography>
            <TextField
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#9ca3af',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                  },
                },
              }}
            />
          </Box>

          <Box>
            <Typography component="label" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
              Senha
            </Typography>
            <TextField
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#9ca3af',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                  },
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#2563eb',
              '&:hover': {
                bgcolor: '#1d4ed8',
              },
              borderRadius: '9999px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
            }}
          >
            Acessar
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              onClick={() => navigate('/register')}
              sx={{
                color: '#2563eb',
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Criar conta
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 