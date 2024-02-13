import express from "express";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import doctorRoutes from './routes/doctorRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import visitRoutes from './routes/visitRoutes.js';

dotenv.config();

const app = express()

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(cors({ 
        origin: 'http://localhost:3001', 
        credentials: true
    }));
} else {
    app.use(cors({
        origin: 'https://myclinic-backend.onrender.com', 
        credentials: true
    }));
}

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));

app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/doctor', doctorRoutes);
app.use('/visit', visitRoutes);

export default app