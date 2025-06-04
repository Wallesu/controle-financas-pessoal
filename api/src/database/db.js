// src/database/db.js
import mysql from 'mysql2/promise'; 
import config from '../config/index.js';

const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    waitForConnections: config.db.waitForConnections,
    connectionLimit: config.db.connectionLimit,
    queueLimit: config.db.queueLimit,
});

pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to the database via connection pool.');
        connection.release(); 
    })
    .catch(err => {
        console.error('ERROR: Could not connect to the database pool.');
        console.error(err.message);
    });

export default pool; 