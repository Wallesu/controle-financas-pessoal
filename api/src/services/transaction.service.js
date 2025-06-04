import {
    createTransaction as createTransactionRepo,
    getTransactionsByAccountId,
    getTransactionById as getTransactionByIdRepo,
    updateTransaction as updateTransactionRepo,
    deleteTransaction as deleteTransactionRepo,
    getTransactionsByDateRange
} from '../repositories/transaction.repository.js';
import { getAccountById } from './account.service.js';
import AppError from '../utils/appError.js';

export const createTransaction = async (userId, transactionData) => {
    const {
        accountId,
        categoryId,
        value,
        type,
        date = new Date(),
        description = ''
    } = transactionData;

    if (!accountId) {
        throw new AppError('Account ID is required.', 400);
    }

    if (!value || typeof value !== 'number') {
        throw new AppError('Value must be a valid number.', 400);
    }

    if (!type || !['income', 'expense'].includes(type)) {
        throw new AppError('Type must be either "income" or "expense".', 400);
    }

    await getAccountById(accountId, userId);

    try {
        const transaction = await createTransactionRepo({
            accountId,
            categoryId,
            value,
            type,
            date: new Date(date),
            description
        });

        return transaction;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error creating transaction.', 500);
    }
};

export const getAccountTransactions = async (accountId, userId) => {
    await getAccountById(accountId, userId);

    try {
        return await getTransactionsByAccountId(accountId, userId);
    } catch (error) {
        throw new AppError('Error fetching transactions.', 500);
    }
};

export const getTransactionById = async (transactionId, userId) => {
    try {
        const transaction = await getTransactionByIdRepo(transactionId, userId);
        if (!transaction) {
            throw new AppError('Transaction not found.', 404);
        }
        return transaction;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error fetching transaction.', 500);
    }
};

export const updateTransaction = async (transactionId, userId, updateData = {}) => {
    if (Object.keys(updateData).length === 0) {
        throw new AppError('No update data provided.', 400);
    }

    const { value, type, categoryId, date, description } = updateData;

    const originalTransaction = await getTransactionById(transactionId, userId);
    if (!originalTransaction) {
        throw new AppError('Transaction not found.', 404);
    }

    if (value !== undefined && (typeof value !== 'number' || isNaN(value))) {
        throw new AppError('Value must be a valid number.', 400);
    }

    if (type !== undefined && !['income', 'expense'].includes(type)) {
        throw new AppError('Type must be either "income" or "expense".', 400);
    }

    if (date !== undefined && isNaN(new Date(date).getTime())) {
        throw new AppError('Invalid date format.', 400);
    }

    const updates = {};
    if (value !== undefined) updates.Value = value;
    if (type !== undefined) updates.Type = type;
    if (categoryId !== undefined) updates.CategoryID = categoryId;
    if (date !== undefined) updates.Date = new Date(date);
    if (description !== undefined) updates.Description = description;

    try {
        const updatedTransaction = await updateTransactionRepo(transactionId, userId, updates);
        if (!updatedTransaction) {
            throw new AppError('Transaction not found.', 404);
        }
        return updatedTransaction;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error updating transaction.', 500);
    }
};

export const deleteTransaction = async (transactionId, userId) => {
    const transaction = await getTransactionById(transactionId, userId);
    if (!transaction) {
        throw new AppError('Transaction not found.', 404);
    }

    try {
        const result = await deleteTransactionRepo(transactionId, userId);
        if (!result) {
            throw new AppError('Transaction not found.', 404);
        }
        return { message: 'Transaction deleted successfully.' };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error deleting transaction.', 500);
    }
};

export const getTransactionsByPeriod = async (userId, startDate, endDate) => {
    if (!startDate || !endDate) {
        throw new AppError('Start date and end date are required.', 400);
    }

    try {
        return await getTransactionsByDateRange(userId, new Date(startDate), new Date(endDate));
    } catch (error) {
        throw new AppError('Error fetching transactions.', 500);
    }
}; 