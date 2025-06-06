import { loginUser } from '../services/auth.service.js';
import { registerUser } from '../services/user.service.js';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);

        res.status(200).json({
            status: 'sucesso',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const newUser = await registerUser({ email, password, name });

        res.status(201).json({
            status: 'sucesso',
            data: {
                user: newUser
            }
        });
    } catch (error) {
        next(error);
    }
}; 