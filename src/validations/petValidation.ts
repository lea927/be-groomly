import { z } from 'zod';
import {
  PetGender,
  PetSize,
  PetSpecies,
  PetCoatType,
  PetTemperament,
} from '../../generated/prisma';

const groomingPreferenceSchema = z
  .object({
    coatType: z.nativeEnum(PetCoatType).optional(),
    notes: z.string().trim().max(255).optional(),
    specialInstructions: z.string().trim().max(255).optional(),
    temperament: z.nativeEnum(PetTemperament).optional(),
  })
  .optional();

const createPetSchema = z.object({
  breed: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? capitalizeName(val) : val)),

  color: z.string().trim().toLowerCase().optional(),

  dateOfBirth: z.coerce.date().optional(),

  gender: z.nativeEnum(PetGender),

  groomingPreference: groomingPreferenceSchema,

  name: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .transform((val) => capitalizeName(val)),

  size: z.nativeEnum(PetSize),

  species: z.nativeEnum(PetSpecies),

  weight: z
    .number()
    .positive()
    .max(200)
    .transform((val) => Math.round(val * 100) / 100),
});

function capitalizeName(val: string): string {
  return val
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export { createPetSchema };
