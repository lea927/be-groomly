import { z } from 'zod';
import { PetGender, PetSize, PetSpecies } from '../../generated/prisma';

const createPetSchema = z.object({
  breed: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? capitalizeName(val) : val)),

  color: z.string().trim().toLowerCase().optional(),

  dateOfBirth: z.coerce.date().optional(),

  gender: z.nativeEnum(PetGender),

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
