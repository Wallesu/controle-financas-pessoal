import {
    createCategory as createCategoryRepo,
    getCategoriesByUserId,
    getCategoryById as getCategoryByIdRepo,
    updateCategory as updateCategoryRepo,
    deleteCategory as deleteCategoryRepo
} from '../repositories/category.repository.js';
import AppError from '../utils/appError.js';

export const createCategory = async (userId, categoryData) => {
    const { name } = categoryData;

    if (!name) {
        throw new AppError('Category name is required.', 400);
    }

    try {
        return await createCategoryRepo(userId, name);
    } catch (error) {
        if (error.message.includes('already exists')) {
            throw new AppError(error.message, 409);
        }
        throw new AppError('Error creating category.', 500);
    }
};

export const getAllCategories = async (userId) => {
    try {
        return await getCategoriesByUserId(userId);
    } catch (error) {
        throw new AppError('Error fetching categories.', 500);
    }
};

export const getCategoryById = async (categoryId, userId) => {
    try {
        const category = await getCategoryByIdRepo(categoryId, userId);
        if (!category) {
            throw new AppError('Category not found.', 404);
        }
        return category;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error fetching category.', 500);
    }
};

export const updateCategory = async (categoryId, userId, updateData) => {
    const { name } = updateData;

    if (!name) {
        throw new AppError('Category name is required for update.', 400);
    }

    try {
        const updatedCategory = await updateCategoryRepo(categoryId, userId, name);
        if (!updatedCategory) {
            throw new AppError('Category not found.', 404);
        }
        return updatedCategory;
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.message.includes('already exists')) {
            throw new AppError(error.message, 409);
        }
        throw new AppError('Error updating category.', 500);
    }
};

export const deleteCategory = async (categoryId, userId) => {
    try {
        const result = await deleteCategoryRepo(categoryId, userId);
        if (!result) {
            throw new AppError('Category not found.', 404);
        }
        return { message: 'Category deleted successfully.' };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error deleting category.', 500);
    }
}; 