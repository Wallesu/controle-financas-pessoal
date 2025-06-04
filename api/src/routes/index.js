import express from 'express';
import categoryRoutes from './category.routes.js';
import accountRoutes from './account.routes.js';
import transactionRoutes from './transaction.routes.js';
import authRoutes from './auth.routes.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is healthy'
    });
});

router.use('/auth', authRoutes);

router.use('/categories', protect, categoryRoutes);
router.use('/accounts', protect, accountRoutes);
router.use('/transactions', protect, transactionRoutes);

export default router; 