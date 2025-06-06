import {
    createAccount,
    getAccountById,
    updateAccount,
    deleteAccount,
    getAllAccounts,
    getAccountBalance
} from '../services/account.service.js';
import AppError from '../utils/appError.js';

export const getAllAccountsHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID;
        const accounts = await getAllAccounts(userId);
        res.status(200).json({
            status: 'sucesso',
            data: accounts
        });
    } catch (error) {
        next(error);
    }
};

export const createAccountHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID; 
        const account = await createAccount(userId, req.body);
        res.status(201).json({
            status: 'sucesso',
            data: account
        });
    } catch (error) {
        next(error);
    }
};

export const getAccountHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID; 
        const accountId = parseInt(req.params.id);
        
        if (isNaN(accountId)) {
            throw new AppError('ID da conta inválido.', 400);
        }

        const account = await getAccountById(accountId, userId);
        
        if (!account) {
            throw new AppError('Conta não encontrada.', 404);
        }

        res.status(200).json({
            status: 'sucesso',
            data: account
        });
    } catch (error) {
        next(error);
    }
};

export const updateAccountHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID;
        const accountId = parseInt(req.params.id);
        
        if (isNaN(accountId)) {
            throw new AppError('ID da conta inválido.', 400);
        }

        const account = await updateAccount(accountId, userId, req.body);
        res.status(200).json({
            status: 'sucesso',
            data: account
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAccountHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID; 
        const accountId = parseInt(req.params.id);
        
        if (isNaN(accountId)) {
            throw new AppError('ID da conta inválido.', 400);
        }

        await deleteAccount(accountId, userId);
        res.status(204).json({
            status: 'sucesso',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

export const getAccountBalanceHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID;
        const accountId = parseInt(req.params.id);
        
        if (isNaN(accountId)) {
            throw new AppError('ID da conta inválido.', 400);
        }

        const balance = await getAccountBalance(accountId, userId);
        res.status(200).json({
            status: 'sucesso',
            data: balance
        });
    } catch (error) {
        next(error);
    }
}; 