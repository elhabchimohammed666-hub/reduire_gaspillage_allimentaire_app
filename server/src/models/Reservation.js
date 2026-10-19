import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
      required: [true, 'Le listing associé est obligatoire'],
      index: true,
    },
    beneficiaryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Le bénéficiaire est obligatoire'],
      index: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Le donateur est obligatoire'],
      index: true,
    },
    pickupCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'claimed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Les remarques ne peuvent pas dépasser 300 caractères'],
    },
  },
  {
    timestamps: true,
  }
);

// Empêcher les doublons de réservation pending pour la même annonce
reservationSchema.index({ listingId: 1, beneficiaryId: 1, status: 1 });

export const Reservation = mongoose.model('Reservation', reservationSchema);
