import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// 🛡️ Sécurité & Utilitaires
app.use(helmet());
app.use(morgan('dev'));

// 🌐 Configuration CORS (avec support des cookies HttpOnly)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permettre les requêtes sans origine (comme Postman ou curl) ou sur la liste
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origine CORS non autorisée : ${origin}`));
      }
    },
    credentials: true,
  })
);

// 📦 Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 🚀 Point d'entrée de l'API v1
app.use('/api/v1', routes);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.originalUrl}`,
  });
});

// ⚠️ Gestionnaire d'erreurs global centralisé
app.use(errorHandler);

export default app;
