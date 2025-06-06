import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AppError from '../utils/appError.js';
import { findUserById } from '../repositories/user.repository.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/environment.js';

export const signToken = (id) => {
    return jwt.sign({ ID: id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Você não está logado. Por favor, faça login para ter acesso.', 401));
        }

        const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

        const user = await findUserById(decoded.ID);
        if (!user) {
            return next(new AppError('O usuário associado a este token não existe mais.', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError('Token inválido. Por favor, faça login novamente.', 401));
        }
        if (error instanceof jwt.TokenExpiredError) {
            return next(new AppError('Seu token expirou. Por favor, faça login novamente.', 401));
        }
        next(error);
    }
}; 