import { getCategoryById } from '../repositories/category.repository.js';
import AppError from '../utils/appError.js';

export const verifyCategoryOwnership = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.ID;
        let categoryId;

        if (req.params.id) {
            categoryId = parseInt(req.params.id);
            
            if (req.method === 'POST') {
                return next();
            }

            const category = await getCategoryById(categoryId, loggedInUserId);
            if (!category) {
                throw new AppError('Category not found or unauthorized.', 404);
            }

            req.category = category;
        }

        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError('Error verifying category ownership.', 500));
        }
    }
}; 