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
            return next(new AppError('You are not logged in. Please log in to get access.', 401));
        }

        const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

        const user = await findUserById(decoded.ID);
        if (!user) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError('Invalid token. Please log in again.', 401));
        }
        if (error instanceof jwt.TokenExpiredError) {
            return next(new AppError('Your token has expired. Please log in again.', 401));
        }
        next(error);
    }
}; 