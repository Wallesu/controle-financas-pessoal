// src/server.js
import http from 'http';
import app from './app.js';
import config from './config/index.js';
import pool from './database/db.js';

const server = http.createServer(app);
const PORT = config.port;

const startServer = async () => {
    try {


        server.listen(PORT, () => {
            console.log(`Server running in ${config.env} mode on port ${PORT}`);
            console.log(`Access API at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server or connect to database:', error);
        process.exit(1);
    }
};

const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        console.log('HTTP server closed.');
        try {
            await pool.end();
            console.log('Database pool closed.');
        } catch (err) {
            console.error('Error closing database pool:', err);
        }
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down.');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();