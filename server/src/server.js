import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connexion MongoDB
    await connectDB();

    // 2. Démarrage de l'écoute HTTP
    app.listen(PORT, () => {
      console.log(`🌿 Food Surplus Server running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('Erreur fatale au démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();
