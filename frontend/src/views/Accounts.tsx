import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { accountService } from '../services/api';
import TopBar from '../components/TopBar';

interface Account {
  ID: number;
  UserId: number;
  Account_Name: string;
  Initial_Amount: string;
  CreatedAt: string;
  UpdatedAt: string;
}

const formatCurrency = (value: string | undefined) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value) || 0);
};

const Accounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [initialAmount, setInitialAmount] = useState('');

  const loadAccounts = async () => {
    try {
      const data = await accountService.getAll();
      setAccounts(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar contas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreateAccount = async () => {
    try {
      const newAccount = await accountService.create({
        accountName,
        initialAmount: Number(initialAmount) || 0,
      });
      setAccounts([...accounts, newAccount]);
      setOpenDialog(false);
      setAccountName('');
      setInitialAmount('');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
      try {
        await accountService.delete(id);
        setAccounts(accounts.filter(account => account.ID !== id));
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao excluir conta');
      }
    }
  };

  const handleAccountClick = (accountId: number) => {
    navigate(`/accounts/${accountId}/transactions`);
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <Container>
          <Typography>Carregando...</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Minhas Contas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Nova Conta
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {accounts?.length === 0 ? (
          <Card>
            <CardContent>
              <Typography align="center" color="textSecondary">
                Você ainda não tem nenhuma conta. Clique em "Nova Conta" para começar.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {accounts?.map((account) => (
              <Card 
                key={account.ID}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleAccountClick(account.ID)}
              >
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {account.Account_Name}
                  </Typography>
                  <Typography color="textSecondary">
                    Saldo Inicial: {formatCurrency(account.Initial_Amount)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAccount(account.ID);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Nova Conta</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome da Conta"
              type="text"
              fullWidth
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Saldo Inicial"
              type="number"
              fullWidth
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateAccount} variant="contained">
              Criar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Accounts; 