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
app.set("trust proxy", 1);


if (process.env.NODE_ENV === 'development') {
    app.use(cors({ 
        origin: 'http://localhost:3001', 
        credentials: true
    }));
} else {
    app.use(cors({
        origin: 'https://myclinic-s2i.vercel.app', 
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Assicurati di includere i metodi utilizzati dal tuo frontend
        allowedHeaders: ['Content-Type', 'Authorization'], // Aggiungi gli header necessari
        exposedHeaders: ['Content-Type', 'Authorization'], // Esponi gli header necessari
    }));
}

app.use(cookieParser({
    sameSite: 'None', // Assicurati che SameSite sia impostato su None
    secure: true // Assicurati che Secure sia impostato su true per inviare cookie solo su connessioni sicure (HTTPS)
}));

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));

app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/doctor', doctorRoutes);
app.use('/visit', visitRoutes);

export default app