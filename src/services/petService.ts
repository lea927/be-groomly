import { ConflictError, NotFoundError } from '@/errors';
import { prisma } from '../libs/prisma';
import { CreatePetData, PetResponse } from '../types/pet';

export async function createPet(petData: CreatePetData): Promise<PetResponse> {
  const owner = await prisma.user.findUnique({
    where: { clerkId: petData.ownerId },
  });

  if (!owner) {
    throw new NotFoundError('User not found');
  }

  if (!owner.isActive) {
    throw new ConflictError('User is not active');
  }

  const age = computePetAge(petData.dateOfBirth || new Date());
  if (age > 30) {
    throw new ConflictError('Pet age cannot be more than 30 years');
  }

  if (petData.dateOfBirth && petData.dateOfBirth > new Date()) {
    throw new ConflictError('Date of birth cannot be in the future');
  }

  const existingPet = await prisma.pet.findFirst({
    where: {
      name: { equals: petData.name, mode: 'insensitive' },
      ownerId: owner.id,
    },
  });

  if (existingPet) {
    throw new ConflictError('Pet with this name already exists for this owner');
  }

  if (petData.weight && (petData.weight < 0.1 || petData.weight > 200)) {
    throw new ConflictError('Weight must be between 0.1 and 200 kg');
  }

  validateWeightBySpeciesAndSize(petData.species, petData.size, petData.weight);

  const newPet = await prisma.pet.create({
    data: {
      breed: petData.breed ?? null,
      color: petData.color ?? null,
      dateOfBirth: petData.dateOfBirth ?? null,
      gender: petData.gender,
      name: petData.name,
      ownerId: owner.id,
      PetGroomingPreference: petData.groomingPreference
        ? {
            create: {
              coatType: petData.groomingPreference.coatType,
              notes: petData.groomingPreference.notes,
              specialInstructions:
                petData.groomingPreference.specialInstructions,
              temperament: petData.groomingPreference.temperament,
            },
          }
        : undefined,
      size: petData.size,
      species: petData.species,
      weight: petData.weight ?? null,
    },
    include: {
      PetGroomingPreference: true,
    },
  });

  return newPet;
}

function computePetAge(dateOfBirth: Date): number {
  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    return age - 1;
  }
  return age;
}

function validateWeightBySpeciesAndSize(
  species: string,
  size: string,
  weight?: number | null
): void {
  if (weight === null || weight === undefined) return;

  // Example ranges in kg (customize as needed)
  const ranges: Record<string, Record<string, [number, number]>> = {
    CAT: {
      EXTRA_LARGE: [10, 20],
      LARGE: [6, 10],
      MEDIUM: [4, 6],
      SMALL: [1, 4],
    },
    DOG: {
      EXTRA_LARGE: [41, 100],
      LARGE: [28, 40],
      MEDIUM: [12, 27],
      SMALL: [1, 11],
    },
  };

  const speciesRanges = ranges[species as keyof typeof ranges];
  if (!speciesRanges) return;

  const sizeRange = speciesRanges[size as keyof typeof speciesRanges];
  if (!sizeRange) return;

  if (weight < sizeRange[0] || weight > sizeRange[1]) {
    throw new ConflictError(
      `Weight ${weight}kg is not realistic for a ${size.toLowerCase()} ${species.toLowerCase()}. Expected range: ${sizeRange[0]}-${sizeRange[1]}kg.`
    );
  }
}
