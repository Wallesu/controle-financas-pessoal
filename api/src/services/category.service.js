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
        throw new AppError('Nome da categoria é obrigatório.', 400);
    }

    try {
        return await createCategoryRepo(userId, name);
    } catch (error) {
        if (error.message.includes('already exists')) {
            throw new AppError('Já existe uma categoria com este nome.', 409);
        }
        throw new AppError('Erro ao criar categoria.', 500);
    }
};

export const getAllCategories = async (userId) => {
    try {
        return await getCategoriesByUserId(userId);
    } catch (error) {
        throw new AppError('Erro ao buscar categorias.', 500);
    }
};

export const getCategoryById = async (categoryId, userId) => {
    try {
        const category = await getCategoryByIdRepo(categoryId, userId);
        if (!category) {
            throw new AppError('Categoria não encontrada.', 404);
        }
        return category;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Erro ao buscar categoria.', 500);
    }
};

export const updateCategory = async (categoryId, userId, updateData) => {
    const { name } = updateData;

    if (!name) {
        throw new AppError('Nome da categoria é obrigatório.', 400);
    }

    try {
        const updatedCategory = await updateCategoryRepo(categoryId, userId, name);
        if (!updatedCategory) {
            throw new AppError('Categoria não encontrada.', 404);
        }
        return updatedCategory;
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.message.includes('already exists')) {
            throw new AppError('Já existe uma categoria com este nome.', 409);
        }
        throw new AppError('Erro ao atualizar categoria.', 500);
    }
};

export const deleteCategory = async (categoryId, userId) => {
    try {
        const result = await deleteCategoryRepo(categoryId, userId);
        if (!result) {
            throw new AppError('Categoria não encontrada.', 404);
        }
        return { message: 'Categoria excluída com sucesso.' };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Erro ao excluir categoria.', 500);
    }
}; 