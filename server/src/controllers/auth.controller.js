import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Configuration du cookie HttpOnly sécurisé
const sendTokenResponse = (user, statusCode, res, message = 'Authentification réussie') => {
  const token = user.generateAuthToken();

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
  };

  const userObj = user.toObject();
  delete userObj.password;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json(
      new ApiResponse(
        statusCode,
        {
          token,
          user: userObj,
        },
        message
      )
    );
};

// @desc    Inscription d'un utilisateur (Donor, Beneficiary)
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, organizationName, address, location } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'Cet email est déjà associé à un compte.');
    }

    const userData = {
      name,
      email,
      password,
      role: role || 'beneficiary',
      phone,
      organizationName,
      address,
    };

    if (location && location.coordinates) {
      userData.location = {
        type: 'Point',
        coordinates: location.coordinates, // [lng, lat]
      };
    }

    const user = await User.create(userData);
    sendTokenResponse(user, 201, res, 'Compte créé avec succès !');
  } catch (error) {
    next(error);
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Identifiants invalides (email ou mot de passe incorrect)');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Identifiants invalides (email ou mot de passe incorrect)');
    }

    sendTokenResponse(user, 200, res, 'Connexion réussie !');
  } catch (error) {
    next(error);
  }
};

// @desc    Déconnexion
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });

    res.status(200).json(new ApiResponse(200, null, 'Déconnexion effectuée avec succès'));
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les informations de l'utilisateur connecté
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(new ApiResponse(200, user, 'Profil utilisateur récupéré'));
  } catch (error) {
    next(error);
  }
};
