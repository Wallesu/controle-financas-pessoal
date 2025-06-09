import pool from '../database/db.js';

export const createCategory = async (userId, name) => {
    const checkSql = 'SELECT ID FROM Categories WHERE (UserId = ? OR UserId IS NULL) AND Name = ?';
    try {
        const [existing] = await pool.query(checkSql, [userId, name]);
        if (existing.length > 0) {
            throw new Error('Category name already exists for this user or globally.');
        }

        const insertSql = 'INSERT INTO Categories (UserId, Name) VALUES (?, ?)';
        const [result] = await pool.query(insertSql, [userId, name]);
        return { id: result.insertId, userId, name };
    } catch (error) {
        console.error('Error creating category:', error.message);
        if (error.message.includes('already exists')) {
            throw error; 
        }
        throw new Error('Database error while creating category.');
    }
};

export const getCategoriesByUserId = async (userId) => {
    const sql = 'SELECT * FROM Categories WHERE UserId = ? OR UserId IS NULL ORDER BY UserId, Name';
    try {
        const [rows] = await pool.query(sql, [userId]);
        return rows;
    } catch (error) {
        console.error('Error getting categories:', error.message);
        throw new Error('Database error while fetching categories.');
    }
};

export const getCategoryById = async (categoryId, userId) => {
    const sql = 'SELECT * FROM Categories WHERE ID = ? AND (UserId = ? OR UserId IS NULL)';
    try {
        const [rows] = await pool.query(sql, [categoryId, userId]);
        return rows[0];
    } catch (error) {
        console.error('Error getting category:', error.message);
        throw new Error('Database error while fetching category.');
    }
};

export const updateCategory = async (categoryId, userId, name) => {
    const checkSql = 'SELECT ID FROM Categories WHERE (UserId = ? OR UserId IS NULL) AND Name = ? AND ID != ?';
    try {
        const [existing] = await pool.query(checkSql, [userId, name, categoryId]);
        if (existing.length > 0) {
            throw new Error('Category name already exists for this user or globally.');
        }

        const updateSql = 'UPDATE Categories SET Name = ? WHERE ID = ? AND (UserId = ? OR UserId IS NULL)';
        const [result] = await pool.query(updateSql, [name, categoryId, userId]);
        if (result.affectedRows === 0) {
            throw new Error('Category not found or unauthorized.');
        }
        return { id: categoryId, userId, name };
    } catch (error) {
        console.error('Error updating category:', error.message);
        if (error.message.includes('already exists')) {
            throw error; 
        }
        throw new Error('Database error while updating category.');
    }
};

export const deleteCategory = async (categoryId, userId) => {
    const sql = 'DELETE FROM Categories WHERE ID = ? AND (UserId = ? OR UserId IS NULL)';
    try {
        const [result] = await pool.query(sql, [categoryId, userId]);
        if (result.affectedRows === 0) {
            throw new Error('Category not found or unauthorized.');
        }
        return true;
    } catch (error) {
        console.error('Error deleting category:', error.message);
        throw new Error('Database error while deleting category.');
    }
}; 