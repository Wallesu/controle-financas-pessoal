import express from 'express';
import {
    createAccountHandler,
    getAccountHandler,
    updateAccountHandler,
    deleteAccountHandler,
    getAllAccountsHandler,
    getAccountBalanceHandler
} from '../controllers/account.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { verifyAccountOwnership } from '../middleware/accountAuth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createAccountHandler)
    .get(getAllAccountsHandler);

router.route('/:id')
    .get(verifyAccountOwnership, getAccountHandler)
    .patch(verifyAccountOwnership, updateAccountHandler)
    .delete(verifyAccountOwnership, deleteAccountHandler);

router.route('/:id/balance')
    .get(verifyAccountOwnership, getAccountBalanceHandler);

export default router; 