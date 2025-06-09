import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

// Criando uma instância do axios com configurações base
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Serviço de autenticação
export const authService = {
    async login(email: string, password: string) {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        return user;
    },

    async register(name: string, email: string, password: string) {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data.data.user;
    },

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};

// Serviço de contas
export const accountService = {
    async getAll() {
        const response = await api.get('/accounts');
        return response.data.data;
    },

    async getById(id: number) {
        const response = await api.get(`/accounts/${id}`);
        return response.data.data;
    },

    async create(data: { accountName: string; initialAmount: number }) {
        const response = await api.post('/accounts', data);
        return response.data.data;
    },

    async update(id: number, data: { accountName?: string; initialAmount?: number }) {
        const response = await api.patch(`/accounts/${id}`, data);
        return response.data.data;
    },

    async delete(id: number) {
        await api.delete(`/accounts/${id}`);
    },

    async getBalance(id: number) {
        const response = await api.get(`/accounts/${id}/balance`);
        return response.data.data;
    }
};

// Serviço de transações
export const transactionService = {
    async getAll(accountId: number) {
        const response = await api.get(`/accounts/${accountId}/transactions`);
        return response.data.data;
    },

    async getById(id: number) {
        const response = await api.get(`/transactions/${id}`);
        return response.data.data;
    },

    async create(data: {
        accountId: number;
        categoryId?: number;
        value: number;
        type: 'income' | 'expense';
        date: Date;
        description?: string;
    }) {
        const response = await api.post(`/accounts/${data.accountId}/transactions`, data);
        return response.data.data;
    },

    async update(id: number, data: {
        value?: number;
        type?: 'income' | 'expense';
        categoryId?: number;
        date?: Date;
        description?: string;
        accountId: number;
    }) {
        const response = await api.patch(`/accounts/${data.accountId}/transactions/${id}`, { ...data, accountId: undefined });
        return response.data.data;
    },

    async delete(id: number, accountId: number) {
        await api.delete(`/accounts/${accountId}/transactions/${id}`);
    },

    async getByPeriod(accountId: number, startDate: Date, endDate: Date) {
        const response = await api.get(`/accounts/${accountId}/transactions/period`, {
            params: { startDate, endDate }
        });
        return response.data.data;
    }
};

// Serviço de categorias
export const categoryService = {
    async getAll() {
        const response = await api.get('/categories');
        return response.data.data;
    },

    async getById(id: number) {
        const response = await api.get(`/categories/${id}`);
        return response.data.data;
    },

    async create(data: { name: string }) {
        const response = await api.post('/categories', data);
        return response.data.data;
    },

    async update(id: number, data: { name: string }) {
        const response = await api.patch(`/categories/${id}`, data);
        return response.data.data;
    },

    async delete(id: number) {
        await api.delete(`/categories/${id}`);
    }
};

interface TransactionInput {
  accountId: number;
  value: number;
  type: 'income' | 'expense';
  date: string;
  description?: string;
  categoryId?: number;
}