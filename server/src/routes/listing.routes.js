import express from 'express';
import {
  getNearbyListings,
  createListing,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
} from '../controllers/listing.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createListingSchema, nearbyQuerySchema } from '../validators/listing.validator.js';

const router = express.Router();

// 🌍 Route géospatiale publique principale
router.get('/nearby', validate(nearbyQuerySchema), getNearbyListings);

// 📦 Gestion des offres du commerçant connecté
router.get('/my-listings', authenticate, authorizeRoles('donor', 'admin'), getMyListings);

// 🔍 Détail d'une offre
router.get('/:id', getListingById);

// ➕ Création d'une offre (Donneurs & Admins)
router.post(
  '/',
  authenticate,
  authorizeRoles('donor', 'admin'),
  validate(createListingSchema),
  createListing
);

// ✏️ Modification et suppression
router.put('/:id', authenticate, authorizeRoles('donor', 'admin'), updateListing);
router.delete('/:id', authenticate, authorizeRoles('donor', 'admin'), deleteListing);

export default router;
