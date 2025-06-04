import express from 'express';
import {
    createTransactionHandler,
    getAccountTransactionsHandler,
    getTransactionByIdHandler,
    updateTransactionHandler,
    deleteTransactionHandler,
    getTransactionsByPeriodHandler
} from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { verifyTransactionAccess } from '../middleware/transactionAuth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(verifyTransactionAccess, createTransactionHandler);

router.route('/period')
    .get(getTransactionsByPeriodHandler);

router.route('/account/:accountId')
    .get(verifyTransactionAccess, getAccountTransactionsHandler);

router.route('/:id')
    .get(verifyTransactionAccess, getTransactionByIdHandler)
    .patch(verifyTransactionAccess, updateTransactionHandler)
    .delete(verifyTransactionAccess, deleteTransactionHandler);

export default router; 