import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import cookieParser from 'cookie-parser';
import protectedRoutes from './routes/protectedRoutes.js';
import authRoute from './routes/authroutes.js';
import authMiddleware from './middleware/auth.js';
import paymentRoute from './routes/paymentRoute.js';
import csurf from 'csurf';


dotenv.config();
const app = express();

connectDB();

// CORS configuration
const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
});

app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.get('/', authMiddleware, (req, res) => {
    res.send('Welcome to the server!');
});

app.use('/api/payment', paymentRoute);
app.use('/api/auth', authRoute);
app.use('/api/protected', protectedRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
