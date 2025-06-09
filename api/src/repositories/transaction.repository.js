import pool from '../database/db.js';

export const createTransaction = async (transaction) => {
    const {
        accountId,
        categoryId,
        value,
        type,
        date,
        description
    } = transaction;

    const sql = `
        INSERT INTO Transactions 
        (AccountID, CategoryID, Value, Type, Date, Description)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await pool.query(sql, [
            accountId,
            categoryId,
            value,
            type,
            date,
            description
        ]);

        return {
            id: result.insertId,
            ...transaction
        };
    } catch (error) {
        console.error('Error creating transaction:', error.message);
        throw new Error('Database error while creating transaction.');
    }
};

export const getTransactionsByAccountId = async (accountId, userId) => {
    const sql = `
        SELECT t.* 
        FROM Transactions t
        JOIN Accounts a ON t.AccountID = a.ID
        WHERE t.AccountID = ? AND a.UserId = ?
        ORDER BY t.Date DESC, t.ID DESC
    `;

    try {
        const [rows] = await pool.query(sql, [accountId, userId]);
        return rows;
    } catch (error) {
        console.error('Error getting transactions:', error.message);
        throw new Error('Database error while fetching transactions.');
    }
};

export const getTransactionById = async (transactionId, userId) => {
    const sql = `
        SELECT t.* 
        FROM Transactions t
        JOIN Accounts a ON t.AccountID = a.ID
        WHERE t.ID = ? AND a.UserId = ?
    `;

    try {
        const [rows] = await pool.query(sql, [transactionId, userId]);
        return rows[0];
    } catch (error) {
        console.error('Error getting transaction:', error.message);
        throw new Error('Database error while fetching transaction.');
    }
};

export const updateTransaction = async (transactionId, userId, updates) => {
    const allowedUpdates = ['categoryId', 'value', 'type', 'date', 'description'];
    const updateFields = Object.keys(updates)
        .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined)
        .map(key => `${key} = ?`);

    if (updateFields.length === 0) return null;

    const sql = `
        UPDATE Transactions t
        JOIN Accounts a ON t.AccountID = a.ID
        SET ${updateFields.join(', ')}
        WHERE t.ID = ? AND a.UserId = ?
    `;

    const values = [
        ...Object.values(updates).filter((_, index) => 
            allowedUpdates.includes(Object.keys(updates)[index])
        ),
        transactionId,
        userId
    ];

    try {
        const [result] = await pool.query(sql, values);
        if (result.affectedRows === 0) {
            throw new Error('Transaction not found or unauthorized.');
        }
        return await getTransactionById(transactionId, userId);
    } catch (error) {
        console.error('Error updating transaction:', error.message);
        throw error;
    }
};

export const deleteTransaction = async (transactionId, userId) => {
    const sql = `
        DELETE t FROM Transactions t
        JOIN Accounts a ON t.AccountID = a.ID
        WHERE t.ID = ? AND a.UserId = ?
    `;

    try {
        const [result] = await pool.query(sql, [transactionId, userId]);
        if (result.affectedRows === 0) {
            throw new Error('Transaction not found or unauthorized.');
        }
        return true;
    } catch (error) {
        console.error('Error deleting transaction:', error.message);
        throw new Error('Database error while deleting transaction.');
    }
};

export const getTransactionsByDateRange = async (userId, startDate, endDate) => {
    const sql = `
        SELECT t.* 
        FROM Transactions t
        JOIN Accounts a ON t.AccountID = a.ID
        WHERE a.UserId = ? 
        AND t.Date BETWEEN ? AND ?
        ORDER BY t.Date DESC, t.ID DESC
    `;

    try {
        const [rows] = await pool.query(sql, [userId, startDate, endDate]);
        return rows;
    } catch (error) {
        console.error('Error getting transactions by date range:', error.message);
        throw new Error('Database error while fetching transactions.');
    }
}; 