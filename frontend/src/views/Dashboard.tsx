import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, GridLegacy as Grid } from '@mui/material';
import type { GridProps } from '@mui/material/Grid';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import TopBar from '../components/TopBar';
import { transactionService, categoryService } from '../services/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Transaction {
  ID: number;
  AccountID: number;
  CategoryID: number;
  Value: string;
  Type: 'income' | 'expense';
  Date: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface Category {
  ID: number;
  Name: string;
  UserId: number | null;
}

interface CategoryData {
  name: string;
  value: number;
}

interface BalanceData {
  date: string;
  balance: number;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyTotals {
  [key: string]: {
    income: number;
    expense: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

const Dashboard = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [balanceData, setBalanceData] = useState<BalanceData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await categoryService.getAll();
        setCategories(categoriesData);

        const transactions = await transactionService.getAll(Number(accountId));

        const expenses = transactions.filter((t: Transaction) => t.Type === 'expense');
        const categoryTotals = expenses.reduce((acc: { [key: string]: number }, transaction: Transaction) => {
          const category = categoriesData.find((cat: Category) => cat.ID === transaction.CategoryID);
          const categoryName = category ? category.Name : 'Sem categoria';
          acc[categoryName] = (acc[categoryName] || 0) + Number(transaction.Value);
          return acc;
        }, {});

        const categoryChartData = Object.entries(categoryTotals).map(([name, value]) => ({
          name,
          value: Number(value)
        }));
        setCategoryData(categoryChartData);

        const sortedTransactions = [...transactions].sort((a, b) =>
          new Date(a.Date).getTime() - new Date(b.Date).getTime()
        );

        let balance = 0;
        const balanceChartData = sortedTransactions.map((transaction: Transaction) => {
          const value = Number(transaction.Value);
          balance += transaction.Type === 'income' ? value : -value;
          return {
            date: format(parseISO(transaction.Date), 'dd/MM/yyyy'),
            balance
          };
        });
        setBalanceData(balanceChartData);

        const monthlyTotals = transactions.reduce((acc: MonthlyTotals, transaction: Transaction) => {
          const month = format(parseISO(transaction.Date), 'MMM/yyyy', { locale: ptBR });
          if (!acc[month]) {
            acc[month] = { income: 0, expense: 0 };
          }
          const value = Number(transaction.Value);
          if (transaction.Type === 'income') {
            acc[month].income += value;
          } else {
            acc[month].expense += value;
          }
          return acc;
        }, {});

        const monthlyChartData = Object.entries(monthlyTotals)
          .map(([month, data]) => {
            const typedData = data as { income: number; expense: number };
            return {
              month,
              income: typedData.income,
              expense: typedData.expense
            };
          })
          .sort((a, b) => {
            const [aMonth, aYear] = a.month.split('/');
            const [bMonth, bYear] = b.month.split('/');
            return new Date(`${aYear}-${aMonth}`).getTime() - new Date(`${bYear}-${bMonth}`).getTime();
          });

        setMonthlyData(monthlyChartData);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      loadData();
    }
  }, [accountId]);

  if (loading) {
    return (
      <>
        <TopBar />
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" sx={{ mt: 4, px: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Grid container spacing={3}>
            {/* Gráfico de Pizza - Gastos por Categoria */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Gastos por Categoria
                </Typography>
                <Box sx={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) =>
                          new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(value)
                        }
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Gráfico de Linha - Evolução do Saldo */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Evolução do Saldo
                </Typography>
                <Box sx={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <LineChart data={balanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) =>
                          new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(value)
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#8884d8"
                        name="Saldo"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Gráfico de Barras - Receitas x Despesas por Mês */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Receitas x Despesas por Mês
            </Typography>
            <Box sx={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) =>
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(value)
                    }
                  />
                  <Legend />
                  <Bar dataKey="income" name="Receitas" fill="#00C49F" />
                  <Bar dataKey="expense" name="Despesas" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
