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
        throw new AppError('ID da conta é obrigatório.', 400);
    }

    if (!value || typeof value !== 'number') {
        throw new AppError('Valor deve ser um número válido.', 400);
    }

    if (!type || !['income', 'expense'].includes(type)) {
        throw new AppError('Tipo deve ser "income" (receita) ou "expense" (despesa).', 400);
    }

    await getAccountById(accountId, userId);

    try {
        const transaction = await createTransactionRepo({
            accountId,
            categoryId,
            value,
            type,
            date: typeof date === 'string' ? date.split('T')[0] : new Date(date),
            description
        });

        return transaction;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Erro ao criar transação.', 500);
    }
};

export const getAccountTransactions = async (accountId, userId) => {
    await getAccountById(accountId, userId);

    try {
        return await getTransactionsByAccountId(accountId, userId);
    } catch (error) {
        throw new AppError('Erro ao buscar transações.', 500);
    }
};

export const getTransactionById = async (transactionId, userId) => {
    try {
        const transaction = await getTransactionByIdRepo(transactionId, userId);
        if (!transaction) {
            throw new AppError('Transação não encontrada.', 404);
        }
        return transaction;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Erro ao buscar transação.', 500);
    }
};

export const updateTransaction = async (transactionId, userId, updateData) => {
    const { value, type, date, description, categoryId } = updateData;

    if (value !== undefined && typeof value !== 'number') {
        throw new AppError('Valor deve ser um número válido.', 400);
    }

    if (type && !['income', 'expense'].includes(type)) {
        throw new AppError('Tipo deve ser "income" (receita) ou "expense" (despesa).', 400);
    }

    if(updateData.date) updateData.date = typeof updateData.date === 'string' ? date.split('T')[0] : new Date(updateData.date)

    try {
        const updatedTransaction = await updateTransactionRepo(transactionId, userId, updateData);
        if (!updatedTransaction) {
            throw new AppError('Transação não encontrada.', 404);
        }
        return updatedTransaction;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Erro ao atualizar transação.', 500);
    }
};

export const deleteTransaction = async (transactionId, userId) => {
    try {
        const result = await deleteTransactionRepo(transactionId, userId);
        if (!result) {
            throw new AppError('Transação não encontrada.', 404);
        }
        return { message: 'Transação excluída com sucesso.' };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Erro ao excluir transação.', 500);
    }
};

export const getTransactionsByPeriod = async (accountId, userId, startDate, endDate) => {
    await getAccountById(accountId, userId);

    if (!startDate || !endDate) {
        throw new AppError('Data inicial e data final são obrigatórias.', 400);
    }

    try {
        return await getTransactionsByDateRange(accountId, userId, startDate, endDate);
    } catch (error) {
        throw new AppError('Erro ao buscar transações do período.', 500);
    }
}; 