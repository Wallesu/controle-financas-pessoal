import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import mainRouter from './routes/index.js';
import AppError from './utils/appError.js';



const app = express();

const corsOptions = {
    origin: config.env === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' })); 

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to Financial Management API. Please use /api/v1/ for API endpoints.'
    });
});

app.use('/api/v1', mainRouter);

app.get('/v1', (req, res) => {
    res.redirect('/api/v1');
});


app.use((req, res, next) => {
    next(new AppError(`Route Not Found - ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (config.env === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.isOperational ? err.message : 'Something went wrong!'
        });
    }
});

export default app;