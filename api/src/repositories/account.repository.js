import pool from '../database/db.js';

export const createAccount = async (userId, accountName, initialAmount = 0) => {
    const sql = 'INSERT INTO Accounts (UserId, Account_Name, Initial_Amount) VALUES (?, ?, ?)';
    try {
        const [result] = await pool.query(sql, [userId, accountName, initialAmount]);
        return {
            id: result.insertId,
            userId,
            accountName,
            initialAmount
        };
    } catch (error) {
        console.error('Error creating account:', error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Account name already exists for this user.');
        }
        throw new Error('Database error while creating account.');
    }
};

export const getAccountsByUserId = async (userId) => {
    const sql = 'SELECT * FROM Accounts WHERE UserId = ?';
    try {
        const [rows] = await pool.query(sql, [userId]);
        return rows;
    } catch (error) {
        console.error('Error getting accounts:', error.message);
        throw new Error('Database error while fetching accounts.');
    }
};

export const getAccountById = async (accountId, userId) => {
    const sql = 'SELECT * FROM Accounts WHERE ID = ? AND UserId = ?';
    try {
        const [rows] = await pool.query(sql, [accountId, userId]);
        return rows[0];
    } catch (error) {
        console.error('Error getting account:', error.message);
        throw new Error('Database error while fetching account.');
    }
};

export const updateAccount = async (accountId, userId, updates) => {
    const allowedUpdates = ['Account_Name', 'Initial_Amount'];
    const updateFields = Object.keys(updates)
        .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined)
        .map(key => `${key} = ?`);

    if (updateFields.length === 0) return null;

    const sql = `UPDATE Accounts SET ${updateFields.join(', ')} WHERE ID = ? AND UserId = ?`;
    const values = [...Object.values(updates).filter((_, index) => allowedUpdates.includes(Object.keys(updates)[index])), accountId, userId];

    try {
        const [result] = await pool.query(sql, values);
        if (result.affectedRows === 0) {
            throw new Error('Account not found or unauthorized.');
        }
        return await getAccountById(accountId, userId);
    } catch (error) {
        console.error('Error updating account:', error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Account name already exists for this user.');
        }
        throw error;
    }
};

export const deleteAccount = async (accountId, userId) => {
    const sql = 'DELETE FROM Accounts WHERE ID = ? AND UserId = ?';
    try {
        const [result] = await pool.query(sql, [accountId, userId]);
        if (result.affectedRows === 0) {
            throw new Error('Account not found or unauthorized.');
        }
        return true;
    } catch (error) {
        console.error('Error deleting account:', error.message);
        throw new Error('Database error while deleting account.');
    }
};

export const updateAccountBalance = async (accountId, userId, amount) => {
    const sql = 'UPDATE Accounts SET Initial_Amount = Initial_Amount + ? WHERE ID = ? AND UserId = ?';
    try {
        const [result] = await pool.query(sql, [amount, accountId, userId]);
        if (result.affectedRows === 0) {
            throw new Error('Account not found or unauthorized.');
        }
        return await getAccountById(accountId, userId);
    } catch (error) {
        console.error('Error updating account balance:', error.message);
        throw new Error('Database error while updating account balance.');
    }
};

export const getAccountBalance = async (accountId, userId) => {
    const sql = `
        SELECT 
            a.Initial_Amount,
            COALESCE(
                SUM(CASE 
                    WHEN t.Type = 'income' THEN t.Value
                    WHEN t.Type = 'expense' THEN -t.Value
                    ELSE 0
                END),
                0
            ) as TransactionsSum,
            a.Initial_Amount + COALESCE(
                SUM(CASE 
                    WHEN t.Type = 'income' THEN t.Value
                    WHEN t.Type = 'expense' THEN -t.Value
                    ELSE 0
                END),
                0
            ) as CurrentBalance
        FROM Accounts a
        LEFT JOIN Transactions t ON a.ID = t.AccountID
        WHERE a.ID = ? AND a.UserId = ?
        GROUP BY a.ID, a.Initial_Amount
    `;

    try {
        const [rows] = await pool.query(sql, [accountId, userId]);
        if (rows.length === 0) {
            return null;
        }
        return {
            initialAmount: rows[0].Initial_Amount,
            transactionsSum: rows[0].TransactionsSum,
            currentBalance: rows[0].CurrentBalance
        };
    } catch (error) {
        console.error('Error getting account balance:', error.message);
        throw new Error('Database error while fetching account balance.');
    }
}; 