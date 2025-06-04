import { createUserInDB, findUserByEmail, findUserById as findUserByIdRepo } from '../repositories/user.repository.js';
import { hashPassword } from '../utils/password.util.js';
import AppError from '../utils/appError.js';

export const registerUser = async (userData) => {
    const { email, password, name } = userData;

    if (!email || !password) {
        throw new AppError('Email and password are required.', 400);
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new AppError('Email is already registered.', 409);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await createUserInDB({
        email,
        password: hashedPassword,
        name,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

export const getUserById = async (id) => {
    const user = await findUserByIdRepo(id);
    if (!user) {
        throw new AppError('User not found.', 404);
    }
    return user;
};

export const getAllUsers = async () => {
    return await getAllUsersRepo();
};

export const updateUser = async (id, updates) => {
    return await updateUserRepo(id, updates);
};

export const deleteUser = async (id) => {
    return await deleteUserRepo(id);
};
