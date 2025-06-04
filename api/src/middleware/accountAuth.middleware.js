import { getAccountById } from '../repositories/account.repository.js';
import AppError from '../utils/appError.js';

export const verifyAccountOwnership = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.ID; 
        let accountId;

        if (req.params.id) {
            accountId = parseInt(req.params.id);
        }
        else if (req.body.accountId) {
            accountId = parseInt(req.body.accountId);
        }
        else if (req.method === 'POST' && req.path.endsWith('/accounts')) {
            return next();
        }
        else {
            throw new AppError('Account ID not provided.', 400);
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
            next(new AppError('Error verifying account ownership.', 500));
        }
    }
}; 