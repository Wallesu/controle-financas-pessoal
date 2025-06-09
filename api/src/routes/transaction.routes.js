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

router.route('/')
    .get(verifyTransactionAccess, getAccountTransactionsHandler)
    .post(verifyTransactionAccess, createTransactionHandler);

router.route('/:id')
    .get(verifyTransactionAccess, getTransactionByIdHandler)
    .patch(verifyTransactionAccess, updateTransactionHandler)
    .delete(verifyTransactionAccess, deleteTransactionHandler);

router.route('/period')
    .get(verifyTransactionAccess, getTransactionsByPeriodHandler);

export default router; 