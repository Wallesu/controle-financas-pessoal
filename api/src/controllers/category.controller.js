import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../services/category.service.js';
import AppError from '../utils/appError.js';

export const createCategoryHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID; 
        
        
        if (!req.body || !req.body.name) {
            throw new AppError('Category name is required.', 400);
        }

        const category = await createCategory(userId, req.body);
        res.status(201).json({
            status: 'success',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCategoriesHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID;
        const categories = await getAllCategories(userId);
        res.status(200).json({
            status: 'success',
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

export const getCategoryByIdHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID; 
        const categoryId = parseInt(req.params.id);
        
        if (isNaN(categoryId)) {
            throw new AppError('Invalid category ID.', 400);
        }

        const category = await getCategoryById(categoryId, userId);
        if (!category) {
            throw new AppError('Category not found.', 404);
        }

        res.status(200).json({
            status: 'success',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

export const updateCategoryHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID; 
        const categoryId = parseInt(req.params.id);
        
        if (isNaN(categoryId)) {
            throw new AppError('Invalid category ID.', 400);
        }

        if (!req.body || !req.body.name) {
            throw new AppError('Category name is required for update.', 400);
        }

        const category = await updateCategory(categoryId, userId, req.body);
        if (!category) {
            throw new AppError('Category not found.', 404);
        }

        res.status(200).json({
            status: 'success',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCategoryHandler = async (req, res, next) => {
    try {
        const userId = req.user.ID; 
        const categoryId = parseInt(req.params.id);
        
        if (isNaN(categoryId)) {
            throw new AppError('Invalid category ID.', 400);
        }

        const result = await deleteCategory(categoryId, userId);
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
}; 