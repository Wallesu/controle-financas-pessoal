// src/repositories/user.repository.js
import pool from '../database/db.js'; // Your database connection pool

export const createUserInDB = async (userData) => {
    const { email, password, name } = userData;
    const sql = 'INSERT INTO Users (Email, Password, Name) VALUES (?, ?, ?)';
    try {
        const [result] = await pool.query(sql, [email, password, name]);
        // result.insertId will give you the ID of the newly created user
        return { id: result.insertId, email, name }; // Return relevant user info (excluding password)
    } catch (error) {
        // Log the error for debugging
        console.error('Error creating user in DB:', error.message);
        // Check for specific MySQL errors, e.g., duplicate entry for UNIQUE email
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Email already exists.'); // More specific error
        }
        throw new Error('Database error while creating user.');
    }
};

export const findUserByEmail = async (email) => {
    const sql = 'SELECT ID, Email, Password, Name, CreatedAt, UpdatedAt FROM Users WHERE Email = ?';
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
