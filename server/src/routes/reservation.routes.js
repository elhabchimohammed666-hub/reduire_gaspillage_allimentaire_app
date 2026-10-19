import express from 'express';
import {
  createReservation,
  getMyReservations,
  getDonorReservations,
  claimReservation,
  cancelReservation,
} from '../controllers/reservation.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

// Toutes les routes de réservation nécessitent une authentification
router.use(authenticate);

// Bénéficiaires
router.post('/', authorizeRoles('beneficiary', 'admin'), createReservation);
router.get('/my', authorizeRoles('beneficiary', 'admin'), getMyReservations);

// Donateurs
router.get('/donor', authorizeRoles('donor', 'admin'), getDonorReservations);
router.post('/claim', authorizeRoles('donor', 'admin'), claimReservation);

// Annulation (Bénéficiaire, Donateur, Admin)
router.patch('/:id/cancel', cancelReservation);

export default router;
