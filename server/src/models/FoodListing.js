import mongoose from 'mongoose';

const foodListingSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Le donneur (donorId) est obligatoire'],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Le titre de l'offre est obligatoire"],
      trim: true,
      maxlength: [120, 'Le titre ne peut pas dépasser 120 caractères'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      enum: {
        values: [
          'bakery',      // Boulangerie / Pâtisserie
          'meals',       // Plats cuisinés / Traiteur
          'produce',     // Fruits & Légumes
          'dairy',       // Produits laitiers
          'groceries',   // Épicerie sèche
          'beverages',   // Boissons
          'other',       // Divers
        ],
        message: '{VALUE} n’est pas une catégorie valide',
      },
      index: true,
    },
    quantity: {
      type: String,
      required: [true, 'La quantité est obligatoire (ex: 3 paniers, 5 portions, 2kg)'],
      trim: true,
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    discountedPrice: {
      type: Number,
      default: 0,
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    pickupStart: {
      type: Date,
      required: [true, "L'heure de début de collecte est obligatoire"],
    },
    pickupEnd: {
      type: Date,
      required: [true, "L'heure de fin de collecte est obligatoire"],
      index: true,
    },
    // 🌍 Coordonnées GeoJSON pour le requêtage $near / $geoWithin
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      // IMPORTANT GeoJSON : [Longitude, Latitude]
      coordinates: {
        type: [Number],
        required: [true, 'Les coordonnées géographiques [lng, lat] sont obligatoires'],
      },
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      formattedAddress: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'completed', 'expired'],
      default: 'available',
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    dietaryTags: {
      type: [String], // 'vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free'
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🌍 Index géospatial 2dsphere OBLIGATOIRE pour les requêtes $near, $geoWithin et $nearSphere
foodListingSchema.index({ location: '2dsphere' });

// Index composé pour optimiser les requêtes sur les annonces actives et valides
foodListingSchema.index({ status: 1, pickupEnd: 1 });

// Virtual pour vérifier si l'annonce a expiré
foodListingSchema.virtual('isExpired').get(function () {
  return new Date() > this.pickupEnd;
});

// Middleware pre-save pour synchroniser isFree avec le prix
foodListingSchema.pre('save', function (next) {
  if (this.discountedPrice === 0) {
    this.isFree = true;
  }
  if (this.isExpired && this.status === 'available') {
    this.status = 'expired';
  }
  next();
});

export const FoodListing = mongoose.model('FoodListing', foodListingSchema);
