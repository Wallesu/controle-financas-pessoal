import express from 'express';
import {
    createCategoryHandler,
    getAllCategoriesHandler,
    getCategoryByIdHandler,
    updateCategoryHandler,
    deleteCategoryHandler
} from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { verifyCategoryOwnership } from '../middleware/categoryAuth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createCategoryHandler)
    .get(getAllCategoriesHandler);  

router.route('/:id')
    .get(verifyCategoryOwnership, getCategoryByIdHandler)
    .patch(verifyCategoryOwnership, updateCategoryHandler)
    .delete(verifyCategoryOwnership, deleteCategoryHandler);

export default router; 