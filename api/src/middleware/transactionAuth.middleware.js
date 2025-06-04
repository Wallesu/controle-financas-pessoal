import { getAccountById } from '../repositories/account.repository.js';
import { getTransactionById } from '../repositories/transaction.repository.js';
import AppError from '../utils/appError.js';

export const verifyTransactionAccess = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.ID;
        let accountId;
        let transactionId;

        if (req.params.accountId) {
            accountId = parseInt(req.params.accountId);
        }
        else if (req.method === 'POST' && req.body.accountId) {
            accountId = parseInt(req.body.accountId);
        }
        else if (req.params.id) {
            transactionId = parseInt(req.params.id);
            const transaction = await getTransactionById(transactionId, loggedInUserId);
            if (!transaction) {
                throw new AppError('Transaction not found or unauthorized.', 404);
            }
            accountId = transaction.AccountID;
        }

        if (!accountId) {
            throw new AppError('Account ID not provided or transaction not found.', 400);
        }

        const account = await getAccountById(accountId, loggedInUserId);
        if (!account) {
            throw new AppError('Account not found or unauthorized.', 404);
        }

        req.account = account;
        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError('Error verifying transaction access.', 500));
        }
    }
}; 