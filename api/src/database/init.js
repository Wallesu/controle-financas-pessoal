// src/database/init.js
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeDatabase = async () => {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: config.db.host,
            user: config.db.user,
            password: config.db.password
        });

        console.log('Connected to MySQL server...');

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.db.name}`);
        console.log(`Database ${config.db.name} ensured...`);

        await connection.query(`USE ${config.db.name}`);

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');

        const statements = schema
            .split(';')
            .filter(statement => statement.trim())
            .map(statement => statement.trim() + ';');

        for (const statement of statements) {
            await connection.query(statement);
        }

        console.log('Database schema initialized successfully!');

        const defaultCategories = [
            'Groceries',
            'Transportation',
            'Entertainment',
            'Bills',
            'Healthcare',
            'Shopping',
            'Restaurants',
            'Salary',
            'Investment',
            'Other'
        ];

        const [rows] = await connection.query('SELECT COUNT(*) as count FROM Categories');
        if (rows[0].count === 0) {
            await connection.query(`
                INSERT IGNORE INTO Users (Email, Password, Name)
                VALUES ('test@example.com', 'testpassword', 'Test User')
            `);

            const [userResult] = await connection.query('SELECT ID FROM Users WHERE Email = ?', ['test@example.com']);
            const userId = userResult[0].ID;

            for (const category of defaultCategories) {
                await connection.query(
                    'INSERT IGNORE INTO Categories (UserId, Name) VALUES (?, ?)',
                    [userId, category]
                );
            }

            console.log('Default categories added successfully!');
        }

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    initializeDatabase().catch(console.error);
}

export default initializeDatabase; 