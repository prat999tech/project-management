import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

const app = express();

// --- Standard Middleware ---
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

app.use(express.json({ limit: '16kb' })); // Set a reasonable payload limit
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());


// --- Security Middleware: API Rate Limiter ---
// This middleware will apply to all requests that come after this point.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window (here, per 15 minutes)
    standardHeaders: 'draft-7', // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: "Too many requests from this IP, please try again after 15 minutes" }
});

// Apply the rate limiting middleware to all requests
app.use(limiter);


// --- Routes Import ---
import userRouter from './routes/user.routes.js';


// --- Routes Declaration ---
app.use('/api/v1/users', userRouter);


export { app };
