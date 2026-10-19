import express from 'express';
import authRoutes from './auth.routes.js';
import listingRoutes from './listing.routes.js';
import reservationRoutes from './reservation.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/reservations', reservationRoutes);

// Route de santé API (Healthcheck)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Food Surplus API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

export default router;
