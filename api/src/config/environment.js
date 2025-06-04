// src/config/environment.js
import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;

// Database credentials from environment variables
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;

export const DB_WAIT_FOR_CONNECTIONS = process.env.DB_WAIT_FOR_CONNECTIONS === 'true';
export const DB_CONNECTION_LIMIT = parseInt(process.env.DB_CONNECTION_LIMIT, 10);
export const DB_QUEUE_LIMIT = parseInt(process.env.DB_QUEUE_LIMIT, 10);

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
