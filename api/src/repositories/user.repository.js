import pool from '../database/db.js';

export const findUserByEmail = async (email) => {
    const sql = 'SELECT * FROM Users WHERE Email = ?';
    try {
        const [rows] = await pool.query(sql, [email]);
        return rows[0];
    } catch (error) {
        console.error('Error finding user by email:', error.message);
        throw new Error('Database error while finding user by email.');
    }
};

export const findUserById = async (id) => {
    const sql = 'SELECT ID, Email, Name, CreatedAt, UpdatedAt FROM Users WHERE ID = ?';
    try {
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error finding user by ID:', error.message);
        throw new Error('Database error while finding user by ID.');
    }
};

export const createUserInDB = async (userData) => {
    const { email, password, name } = userData;
    const sql = 'INSERT INTO Users (Email, Password, Name) VALUES (?, ?, ?)';
    try {
        const [result] = await pool.query(sql, [email, password, name]);
        return { id: result.insertId, email, name }; 
    } catch (error) {
        console.error('Error creating user:', error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Email already exists.');
        }
        throw new Error('Database error while creating user.');
    }
};

export const updateUserInDB = async (id, updates) => {
    const allowedUpdates = ['Name', 'Password'];
    const updateFields = Object.keys(updates)
        .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined)
        .map(key => `${key} = ?`);

    if (updateFields.length === 0) return null;

    const sql = `UPDATE Users SET ${updateFields.join(', ')} WHERE ID = ?`;
    const values = [...Object.values(updates).filter((_, index) => 
        allowedUpdates.includes(Object.keys(updates)[index])), id];

    try {
        const [result] = await pool.query(sql, values);
        if (result.affectedRows === 0) {
            throw new Error('User not found.');
        }
        return await findUserById(id);
    } catch (error) {
        console.error('Error updating user:', error.message);
        throw error;
    }
};

export const deleteUserFromDB = async (id) => {
    const sql = 'DELETE FROM Users WHERE ID = ?';
    try {
        const [result] = await pool.query(sql, [id]);
        if (result.affectedRows === 0) {
            throw new Error('User not found.');
        }
        return true;
    } catch (error) {
        console.error('Error deleting user:', error.message);
        throw new Error('Database error while deleting user.');
    }
}; 