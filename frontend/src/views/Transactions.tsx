import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { transactionService, categoryService } from '../services/api';
import TopBar from '../components/TopBar';

interface Transaction {
  ID: number;
  AccountID: number;
  CategoryID?: number;
  Value: number;
  Type: 'income' | 'expense';
  Date: string;
  Description?: string;
  Category?: {
    ID: number;
    Name: string;
  };
}

interface Category {
  ID: number;
  Name: string;
  UserId?: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dateString;
  }
};

const Transactions = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [value, setValue] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const clearFields = () => {
    setValue('');
    setType('income');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setDescription('');
    setSelectedCategory('');
    setError('');
  };

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAll(Number(accountId));
      setTransactions(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err: any) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, [accountId]);

  const handleCreateTransaction = async () => {
    try {
      await transactionService.create({
        accountId: Number(accountId),
        value: Number(value),
        type,
        date: new Date(date),
        description,
        categoryId: selectedCategory || undefined,
      });
      
      await loadTransactions();
      
      setOpenDialog(false);
      clearFields();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar transação');
    }
  };

  const handleEditTransaction = async () => {
    if (!editingTransaction) return;

    try {
      await transactionService.update(editingTransaction.ID, {
        value: Number(value),
        type,
        date: new Date(date),
        description,
        categoryId: selectedCategory || undefined,
        accountId: Number(accountId),
      });
      
      await loadTransactions();
      
      setOpenEditDialog(false);
      setEditingTransaction(null);
      clearFields();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar transação');
    }
  };

  const handleDeleteTransaction = async (id: number, accountId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await transactionService.delete(id, accountId);
        setTransactions(transactions.filter(transaction => transaction.ID !== id));
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao excluir transação');
      }
    }
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setValue(transaction.Value.toString());
    setType(transaction.Type);
    setDate(format(parseISO(transaction.Date), 'yyyy-MM-dd'));
    setDescription(transaction.Description || '');
    setSelectedCategory(transaction.CategoryID || '');
    setOpenEditDialog(true);
  };

  const groupTransactionsByMonth = (transactions: Transaction[]) => {
    const grouped = transactions.reduce((acc: { [key: string]: Transaction[] }, transaction) => {
      const month = format(parseISO(transaction.Date), 'MMMM yyyy', { locale: ptBR });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(transaction);
      return acc;
    }, {});

    return Object.entries(grouped).sort(([a], [b]) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setType(event.target.value as 'income' | 'expense');
  };

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    setSelectedCategory(Number(event.target.value));
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Transações
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Nova Transação
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {groupTransactionsByMonth(transactions).map(([month, monthTransactions]) => (
              <Box key={month} mb={3}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                    {month}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {monthTransactions.map((transaction) => (
                  <Card key={transaction.ID} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" color={transaction.Type === 'income' ? 'success.main' : 'error.main'}>
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(Number(transaction.Value))}
                          </Typography>
                          <Typography color="textSecondary">
                            {format(parseISO(transaction.Date), 'dd/MM/yyyy')}
                          </Typography>
                          <Typography>{transaction.Description}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {categories.find(cat => cat.ID === transaction.CategoryID)?.Name || 'Sem categoria'}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton
                            color="primary"
                            onClick={() => openEditModal(transaction)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteTransaction(transaction.ID, Number(accountId))}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ))}
          </Box>
        )}

        <Dialog open={openDialog} onClose={() => {
          setOpenDialog(false);
          clearFields();
        }}>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Valor"
              type="number"
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                fullWidth
                value={type}
                onChange={handleTypeChange}
              >
                <MenuItem value="income">Receita</MenuItem>
                <MenuItem value="expense">Despesa</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={selectedCategory}
                label="Categoria"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">
                  <em>Nenhuma</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.ID} value={category.ID}>
                    {category.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Data"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              label="Descrição"
              type="text"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateTransaction} variant="contained">
              Criar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditDialog} onClose={() => {
          setOpenEditDialog(false);
          setEditingTransaction(null);
          clearFields();
        }}>
          <DialogTitle>Editar Transação</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Valor"
              type="number"
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                fullWidth
                value={type}
                onChange={handleTypeChange}
              >
                <MenuItem value="income">Receita</MenuItem>
                <MenuItem value="expense">Despesa</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={selectedCategory}
                label="Categoria"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">
                  <em>Nenhuma</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.ID} value={category.ID}>
                    {category.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Data"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              label="Descrição"
              type="text"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
            <Button onClick={handleEditTransaction} variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Transactions; 