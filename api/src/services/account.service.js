import {
    createAccount as createAccountRepo,
    getAccountsByUserId,
    getAccountById as getAccountByIdRepo,
    updateAccount as updateAccountRepo,
    deleteAccount as deleteAccountRepo,
    updateAccountBalance,
    getAccountBalance as getAccountBalanceRepo
} from '../repositories/account.repository.js';
import AppError from '../utils/appError.js';

export const createAccount = async (userId, accountData) => {
    const { accountName, initialAmount = 0 } = accountData;

    if (!accountName) {
        throw new AppError('Account name is required.', 400);
    }

    if (typeof initialAmount !== 'number') {
        throw new AppError('Initial amount must be a number.', 400);
    }

    try {
        return await createAccountRepo(userId, accountName, initialAmount);
    } catch (error) {
        if (error.message.includes('already exists')) {
            throw new AppError(error.message, 409);
        }
        throw new AppError('Error creating account.', 500);
    }
};

export const getAllAccounts = async (userId) => {
    try {
        return await getAccountsByUserId(userId);
    } catch (error) {
        throw new AppError('Error fetching accounts.', 500);
    }
};

export const getAccountById = async (accountId, userId) => {
    try {
        const account = await getAccountByIdRepo(accountId, userId);
        if (!account) {
            throw new AppError('Account not found.', 404);
        }
        return account;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error fetching account.', 500);
    }
};

export const updateAccount = async (accountId, userId, updateData) => {
    const { accountName, initialAmount } = updateData;

    if (!accountName && initialAmount === undefined) {
        throw new AppError('At least one field (accountName or initialAmount) is required for update.', 400);
    }

    if (initialAmount !== undefined && typeof initialAmount !== 'number') {
        throw new AppError('Initial amount must be a number.', 400);
    }

    const updates = {};
    if (accountName) updates.Account_Name = accountName;
    if (initialAmount !== undefined) updates.Initial_Amount = initialAmount;

    try {
        const updatedAccount = await updateAccountRepo(accountId, userId, updates);
        if (!updatedAccount) {
            throw new AppError('Account not found.', 404);
        }
        return updatedAccount;
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.message.includes('already exists')) {
            throw new AppError(error.message, 409);
        }
        throw new AppError('Error updating account.', 500);
    }
};

export const deleteAccount = async (accountId, userId) => {
    try {
        const result = await deleteAccountRepo(accountId, userId);
        if (!result) {
            throw new AppError('Account not found.', 404);
        }
        return { message: 'Account deleted successfully.' };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error deleting account.', 500);
    }
};

export const adjustAccountBalance = async (accountId, userId, amount) => {
    if (typeof amount !== 'number') {
        throw new AppError('Amount must be a number.', 400);
    }

    try {
        const updatedAccount = await updateAccountBalance(accountId, userId, amount);
        if (!updatedAccount) {
            throw new AppError('Account not found.', 404);
        }
        return updatedAccount;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error adjusting account balance.', 500);
    }
};

export const getAccountBalance = async (accountId, userId) => {
    try {
        const account = await getAccountByIdRepo(accountId, userId);
        if (!account) {
            throw new AppError('Account not found.', 404);
        }

        const balance = await getAccountBalanceRepo(accountId, userId);
        if (!balance) {
            throw new AppError('Error calculating account balance.', 500);
        }

        return balance;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error fetching account balance.', 500);
    }
}; 