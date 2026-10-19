import { z } from 'zod';

export const createListingSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Le titre doit comporter au moins 3 caractères').max(120),
    description: z.string().max(1000).optional(),
    category: z.enum([
      'bakery',
      'meals',
      'produce',
      'dairy',
      'groceries',
      'beverages',
      'other',
    ]),
    quantity: z.string().min(1, 'La quantité est obligatoire'),
    originalPrice: z.number().min(0).default(0),
    discountedPrice: z.number().min(0).default(0),
    isFree: z.boolean().default(false),
    pickupStart: z.string().or(z.date()),
    pickupEnd: z.string().or(z.date()),
    location: z.object({
      type: z.literal('Point').default('Point'),
      coordinates: z
        .array(z.number())
        .length(2, 'Les coordonnées GeoJSON doivent être [longitude, latitude]'),
    }),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        formattedAddress: z.string().optional(),
      })
      .optional(),
    images: z.array(z.string()).optional(),
    dietaryTags: z.array(z.string()).optional(),
  }),
});

export const nearbyQuerySchema = z.object({
  query: z.object({
    lat: z.string().transform(Number),
    lng: z.string().transform(Number),
    radius: z.string().optional().transform((val) => (val ? Number(val) : 10)), // km
    category: z.string().optional(),
    isFree: z
      .string()
      .optional()
      .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
    search: z.string().optional(),
  }),
});
