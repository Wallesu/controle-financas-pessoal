import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.error('Error hashing password:', error.message);
        throw new Error('Error hashing password');
    }
};

export const comparePassword = async (candidatePassword, hashedPassword) => {
    try {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (error) {
        console.error('Error comparing passwords:', error.message);
        throw new Error('Error comparing passwords');
    }
}; 