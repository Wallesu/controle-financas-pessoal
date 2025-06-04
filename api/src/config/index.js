import {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_WAIT_FOR_CONNECTIONS,
    DB_CONNECTION_LIMIT,
    DB_QUEUE_LIMIT,
} from './environment.js';

const config = {
    port: PORT,
    env: NODE_ENV,
    db: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        name: DB_NAME,
        waitForConnections: DB_WAIT_FOR_CONNECTIONS,
        connectionLimit: DB_CONNECTION_LIMIT,
        queueLimit: DB_QUEUE_LIMIT,
    },
};

export default config;