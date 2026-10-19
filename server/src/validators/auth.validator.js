import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
    email: z.string().email('Format email invalide'),
    password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
    role: z.enum(['donor', 'beneficiary', 'admin']).default('beneficiary'),
    phone: z.string().optional(),
    organizationName: z.string().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        formattedAddress: z.string().optional(),
      })
      .optional(),
    location: z
      .object({
        type: z.literal('Point').default('Point'),
        // [longitude, latitude]
        coordinates: z
          .array(z.number())
          .length(2, 'Les coordonnées doivent contenir [longitude, latitude]'),
      })
      .optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Format email invalide'),
    password: z.string().min(1, 'Le mot de passe est obligatoire'),
  }),
});
