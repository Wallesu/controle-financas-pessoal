import { findUserByEmail } from '../repositories/user.repository.js';
import { comparePassword } from '../utils/password.util.js';
import { signToken } from '../middleware/auth.middleware.js';
import AppError from '../utils/appError.js';

export const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new AppError('Por favor, forneça email e senha.', 400);
    }

    const user = await findUserByEmail(email);
    if (!user || !(await comparePassword(password, user.Password))) {
        throw new AppError('Email ou senha incorretos.', 401);
    }

    const token = signToken(user.ID);

    const { Password, ...userWithoutPassword } = user;

    return {
        token,
        user: userWithoutPassword
    };
}; 