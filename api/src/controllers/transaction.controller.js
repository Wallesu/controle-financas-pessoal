import {
    createTransaction,
    getAccountTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionsByPeriod
} from '../services/transaction.service.js';
import AppError from '../utils/appError.js';

export const createTransactionHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID;
        
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError('Request body is required', 400);
        }

        const { value, type, categoryId, date, description } = req.body;
        
        if (!value || typeof value !== 'number') {
            throw new AppError('value must be a valid number', 400);
        }
        if (!type || !['income', 'expense'].includes(type)) {
            throw new AppError('type must be either "income" or "expense"', 400);
        }

        const transactionData = {
            accountId: req.accountId,
            value: parseFloat(value),
            type,
            categoryId: categoryId ? parseInt(categoryId) : undefined,
            date: date ? new Date(date) : new Date(),
            description: description || ''
        };

        const transaction = await createTransaction(userId, transactionData);
        res.status(201).json({
            status: 'sucesso',
            data: transaction
        });
    } catch (error) {
        next(error);
    }
};

export const getAccountTransactionsHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID;
        const accountId = req.accountId;
        
        const transactions = await getAccountTransactions(accountId, userId);
        res.status(200).json({
            status: 'sucesso',
            data: transactions
        });
    } catch (error) {
        next(error);
    }
};

export const getTransactionByIdHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID;
        const transactionId = parseInt(req.params.id);
        
        if (isNaN(transactionId)) {
            throw new AppError('ID da transação inválido.', 400);
        }

        const transaction = await getTransactionById(transactionId, userId);
        res.status(200).json({
            status: 'sucesso',
            data: transaction
        });
    } catch (error) {
        next(error);
    }
};

export const updateTransactionHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID;
        const transactionId = parseInt(req.params.id);
        
        if (isNaN(transactionId)) {
            throw new AppError('ID da transação inválido.', 400);
        }

        const transaction = await updateTransaction(transactionId, userId, req.body);
        res.status(200).json({
            status: 'sucesso',
            data: transaction
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTransactionHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID;
        const transactionId = parseInt(req.params.id);
        
        if (isNaN(transactionId)) {
            throw new AppError('ID da transação inválido.', 400);
        }

        await deleteTransaction(transactionId, userId);
        res.status(204).json({
            status: 'sucesso',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

export const getTransactionsByPeriodHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID;
        const accountId = req.accountId;
        const { startDate, endDate } = req.query;
        
        const transactions = await getTransactionsByPeriod(accountId, userId, startDate, endDate);
        res.status(200).json({
            status: 'sucesso',
            data: transactions
        });
    } catch (error) {
        next(error);
    }
}; 