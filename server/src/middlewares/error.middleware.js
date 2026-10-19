import { ApiError } from '../utils/apiError.js';
import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Si c'est une erreur de validation Zod
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Données de formulaire invalides',
      errors: formattedErrors,
    });
  }

  // Si ce n'est pas une instance d'ApiError standard
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Une erreur serveur est survenue';
    error = new ApiError(statusCode, message, error?.errors || []);
  }

  // Erreur Mongoose Duplicate Key (ex: email déjà pris)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `La valeur pour le champ '${field}' existe déjà.`,
    });
  }

  // Erreur Mongoose CastError (ex: ObjectId invalide)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Identifiant invalide : ${err.value}`,
    });
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  return res.status(error.statusCode || 500).json(response);
};
