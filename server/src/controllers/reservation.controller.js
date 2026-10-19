import { Reservation } from '../models/Reservation.js';
import { FoodListing } from '../models/FoodListing.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import crypto from 'crypto';

// Générateur de code alphanumérique unique pour le retrait (ex: FS-7A3B9)
const generatePickupCode = () => {
  return 'FS-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

// @desc    Réserver une offre alimentaire (Bénéficiaire ou Particulier)
// @route   POST /api/v1/reservations
// @access  Private (Beneficiary, Admin)
export const createReservation = async (req, res, next) => {
  try {
    const { listingId, notes } = req.body;

    const listing = await FoodListing.findById(listingId);
    if (!listing) {
      throw new ApiError(404, 'Offre introuvable');
    }

    if (listing.status !== 'available') {
      throw new ApiError(400, "Cette offre n'est plus disponible (déjà réservée ou expirée).");
    }

    if (new Date() > listing.pickupEnd) {
      listing.status = 'expired';
      await listing.save();
      throw new ApiError(400, "L'horaire de retrait pour cette offre est malheureusement dépassé.");
    }

    // Empêcher un donateur de réserver sa propre annonce
    if (listing.donorId.toString() === req.user._id.toString()) {
      throw new ApiError(400, 'Vous ne pouvez pas réserver votre propre offre.');
    }

    const pickupCode = generatePickupCode();

    const reservation = await Reservation.create({
      listingId: listing._id,
      beneficiaryId: req.user._id,
      donorId: listing.donorId,
      pickupCode,
      notes,
      status: 'pending',
    });

    // Mettre à jour le statut du listing
    listing.status = 'reserved';
    await listing.save();

    await reservation.populate([
      { path: 'listingId' },
      { path: 'donorId', select: 'name organizationName phone email address' },
    ]);

    res.status(201).json(
      new ApiResponse(201, reservation, 'Réservation confirmée avec succès !')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les réservations du bénéficiaire connecté
// @route   GET /api/v1/reservations/my
// @access  Private (Beneficiary)
export const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ beneficiaryId: req.user._id })
      .populate('listingId')
      .populate('donorId', 'name organizationName phone email address location')
      .sort({ createdAt: -1 });

    res.status(200).json(
      new ApiResponse(200, reservations, 'Vos réservations ont été récupérées')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les réservations reçues par le donateur connecté
// @route   GET /api/v1/reservations/donor
// @access  Private (Donor)
export const getDonorReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ donorId: req.user._id })
      .populate('listingId')
      .populate('beneficiaryId', 'name phone email role')
      .sort({ createdAt: -1 });

    res.status(200).json(
      new ApiResponse(200, reservations, 'Réservations reçues récupérées')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Valider le retrait via le code unique (Effectué par le commerçant)
// @route   POST /api/v1/reservations/claim
// @access  Private (Donor, Admin)
export const claimReservation = async (req, res, next) => {
  try {
    const { pickupCode } = req.body;

    if (!pickupCode) {
      throw new ApiError(400, 'Le code de retrait est obligatoire');
    }

    const reservation = await Reservation.findOne({
      pickupCode: pickupCode.trim().toUpperCase(),
    });

    if (!reservation) {
      throw new ApiError(404, 'Code de retrait introuvable ou invalide');
    }

    if (reservation.donorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new ApiError(403, 'Vous n’êtes pas le donateur associé à ce code de retrait');
    }

    if (reservation.status === 'claimed') {
      throw new ApiError(400, 'Cette réservation a déjà été retirée.');
    }

    if (reservation.status === 'cancelled') {
      throw new ApiError(400, 'Cette réservation a été annulée.');
    }

    reservation.status = 'claimed';
    reservation.claimedAt = new Date();
    await reservation.save();

    // Mettre à jour l'offre alimentaire en 'completed'
    await FoodListing.findByIdAndUpdate(reservation.listingId, { status: 'completed' });

    res.status(200).json(
      new ApiResponse(200, reservation, 'Retrait validé avec succès ! Merci pour votre geste anti-gaspillage.')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Annuler une réservation
// @route   PATCH /api/v1/reservations/:id/cancel
// @access  Private (Beneficiary, Donor, Admin)
export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      throw new ApiError(404, 'Réservation non trouvée');
    }

    const isBeneficiary = reservation.beneficiaryId.toString() === req.user._id.toString();
    const isDonor = reservation.donorId.toString() === req.user._id.toString();

    if (!isBeneficiary && !isDonor && req.user.role !== 'admin') {
      throw new ApiError(403, 'Non autorisé à annuler cette réservation');
    }

    if (reservation.status !== 'pending') {
      throw new ApiError(400, 'Seule une réservation en attente peut être annulée');
    }

    reservation.status = 'cancelled';
    await reservation.save();

    // Remettre l'offre à disposition
    await FoodListing.findByIdAndUpdate(reservation.listingId, { status: 'available' });

    res.status(200).json(
      new ApiResponse(200, reservation, 'Réservation annulée. L’offre est de nouveau disponible.')
    );
  } catch (error) {
    next(error);
  }
};
