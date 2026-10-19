import { FoodListing } from '../models/FoodListing.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// @desc    Rechercher les offres à proximité via géolocalisation ($geoNear / 2dsphere)
// @route   GET /api/v1/listings/nearby?lat=...&lng=...&radius=...&category=...&isFree=...&search=...
// @access  Public
export const getNearbyListings = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10, category, isFree, search } = req.query;

    if (!lat || !lng) {
      throw new ApiError(400, 'Les paramètres de géolocalisation [lat] et [lng] sont requis.');
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = parseFloat(radius);
    const maxDistanceInMeters = radiusInKm * 1000;

    // Filtres de recherche
    const matchQuery = {
      status: 'available',
      pickupEnd: { $gt: new Date() }, // Offres non expirées uniquement
    };

    if (category && category !== 'all') {
      matchQuery.category = category;
    }

    if (isFree !== undefined && isFree !== '') {
      matchQuery.isFree = isFree === 'true' || isFree === true;
    }

    if (search && search.trim() !== '') {
      matchQuery.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // 🚀 Pipeline d'agrégation géospatiale MongoDB 2dsphere
    const listings = await FoodListing.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            // IMPORTANT : format GeoJSON [longitude, latitude]
            coordinates: [longitude, latitude],
          },
          distanceField: 'distanceInMeters',
          maxDistance: maxDistanceInMeters,
          spherical: true,
          query: matchQuery,
        },
      },
      {
        $addFields: {
          distanceInKm: {
            $round: [{ $divide: ['$distanceInMeters', 1000] }, 1],
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'donorId',
          foreignField: '_id',
          as: 'donor',
        },
      },
      {
        $unwind: '$donor',
      },
      {
        $project: {
          'donor.password': 0,
          'donor.__v': 0,
        },
      },
      {
        $sort: { distanceInMeters: 1 },
      },
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          count: listings.length,
          center: { lat: latitude, lng: longitude },
          radiusKm: radiusInKm,
          listings,
        },
        'Annonces à proximité récupérées avec succès'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Créer une nouvelle offre alimentaire (Donneur uniquement)
// @route   POST /api/v1/listings
// @access  Private (Donor, Admin)
export const createListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      quantity,
      originalPrice,
      discountedPrice,
      isFree,
      pickupStart,
      pickupEnd,
      location,
      address,
      images,
      dietaryTags,
    } = req.body;

    // Vérifier que la date de fin est ultérieure à la date de début
    if (new Date(pickupEnd) <= new Date(pickupStart)) {
      throw new ApiError(400, "L'heure de fin de retrait doit être postérieure à l'heure de début.");
    }

    const listing = await FoodListing.create({
      donorId: req.user._id,
      title,
      description,
      category,
      quantity,
      originalPrice: originalPrice || 0,
      discountedPrice: discountedPrice || 0,
      isFree: isFree || discountedPrice === 0,
      pickupStart,
      pickupEnd,
      location: {
        type: 'Point',
        // [longitude, latitude]
        coordinates: location.coordinates,
      },
      address,
      images: images || [],
      dietaryTags: dietaryTags || [],
      status: 'available',
    });

    res.status(201).json(new ApiResponse(201, listing, 'Offre créée avec succès !'));
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir toutes les offres créées par le Donneur connecté
// @route   GET /api/v1/listings/my-listings
// @access  Private (Donor, Admin)
export const getMyListings = async (req, res, next) => {
  try {
    const listings = await FoodListing.find({ donorId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json(
      new ApiResponse(200, listings, 'Historique de vos offres récupéré')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Détails d'une offre spécifique
// @route   GET /api/v1/listings/:id
// @access  Public
export const getListingById = async (req, res, next) => {
  try {
    const listing = await FoodListing.findById(req.params.id).populate(
      'donorId',
      'name organizationName phone email address location avatar'
    );

    if (!listing) {
      throw new ApiError(404, 'Offre non trouvée');
    }

    res.status(200).json(new ApiResponse(200, listing, 'Détails de l’offre récupérés'));
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour une offre (Donneur propriétaire)
// @route   PUT /api/v1/listings/:id
// @access  Private (Donor, Admin)
export const updateListing = async (req, res, next) => {
  try {
    let listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      throw new ApiError(404, 'Offre introuvable');
    }

    // Vérifier les permissions
    if (listing.donorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new ApiError(403, 'Non autorisé à modifier cette offre');
    }

    listing = await FoodListing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(new ApiResponse(200, listing, 'Offre mise à jour'));
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer / Annuler une offre
// @route   DELETE /api/v1/listings/:id
// @access  Private (Donor, Admin)
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      throw new ApiError(404, 'Offre introuvable');
    }

    if (listing.donorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new ApiError(403, 'Non autorisé à supprimer cette offre');
    }

    await listing.deleteOne();

    res.status(200).json(new ApiResponse(200, null, 'Offre supprimée avec succès'));
  } catch (error) {
    next(error);
  }
};
