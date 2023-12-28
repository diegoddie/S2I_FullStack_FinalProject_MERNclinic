import express from "express";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

// Import routes
import doctorRoutes from './routes/doctorRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import visitRoutes from './routes/visitRoutes.js';

dotenv.config();

const app = express()

// Middleware for parsing cookies
app.use(cookieParser());

// Enable Cross-Origin Resource Sharing (CORS)
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ 
        origin: 'http://localhost:3001', // Sostituisci con l'URL del tuo frontend
        credentials: true, // Consenti l'invio di cookie durante le richieste cross-origin
    }));
} else {
    // Configurazione CORS per l'ambiente di produzione
    app.use(cors());
}

// Parse JSON requests
app.use(express.json())


// Define routes
app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/doctor', doctorRoutes);
app.use('/visit', visitRoutes);

export default app