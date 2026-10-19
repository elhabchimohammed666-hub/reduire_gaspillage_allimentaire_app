import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Vérification dans les Cookies HttpOnly
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Vérification dans l'en-tête Authorization Bearer
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Accès non autorisé : Token manquant');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret_fallback_key'
    );

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new ApiError(401, 'Utilisateur introuvable ou compte désactivé');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Session expirée ou jeton invalide. Veuillez vous reconnecter.'));
    }
    next(error);
  }
};
