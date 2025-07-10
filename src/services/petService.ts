import { ConflictError, NotFoundError } from '@/errors';
import { prisma } from '../libs/prisma';
import { CreatePetData, PetResponse } from '../types/pet';

export async function createPet(petData: CreatePetData): Promise<PetResponse> {
  if (!petData.clerkId) {
    throw new ConflictError('ClerkId is required');
  }

  const owner = await validateOwner(petData.clerkId);
  await validateUniquePetNameForOwner(owner.id, petData.name);
  validatePetAge(petData.dateOfBirth);
  validatePetWeight(petData.weight);
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

export async function updatePet(
  petId: string,
  petData: CreatePetData
): Promise<PetResponse> {
  const pet = await prisma.pet.findUnique({
    include: { PetGroomingPreference: true },
    where: { id: petId },
  });

  if (!pet) throw new NotFoundError('Pet not found');

  if (!petData.clerkId) {
    throw new ConflictError('ClerkId is required');
  }

  const owner = await validateOwner(petData.clerkId);
  if (owner.id !== pet.ownerId)
    throw new ConflictError(`Pet doesn't belong to this user`);
  await validateUniquePetNameForOwner(owner.id, petData.name);
  validatePetAge(petData.dateOfBirth);
  validatePetWeight(petData.weight);
  validateWeightBySpeciesAndSize(petData.species, petData.size, petData.weight);

  const updatedPet = await prisma.pet.update({
    data: {
      breed: petData.breed ?? pet.breed,
      color: petData.color ?? pet.color,
      dateOfBirth: petData.dateOfBirth ?? pet.dateOfBirth,
      gender: petData.gender ?? pet.gender,
      name: petData.name ?? pet.name,
      ownerId: owner.id,
      PetGroomingPreference: petData.groomingPreference
        ? {
            upsert: {
              create: {
                coatType: petData.groomingPreference.coatType,
                notes: petData.groomingPreference.notes,
                specialInstructions:
                  petData.groomingPreference.specialInstructions,
                temperament: petData.groomingPreference.temperament,
              },
              update: {
                coatType: petData.groomingPreference.coatType,
                notes: petData.groomingPreference.notes,
                specialInstructions:
                  petData.groomingPreference.specialInstructions,
                temperament: petData.groomingPreference.temperament,
              },
            },
          }
        : undefined,
      size: petData.size ?? pet.size,
      species: petData.species ?? pet.species,
      weight: petData.weight ?? pet.weight,
    },
    include: { PetGroomingPreference: true },
    where: { id: petId },
  });

  return updatedPet;
}

export async function findPetById({
  clerkId,
  petId,
}: {
  clerkId: string;
  petId: string;
}): Promise<PetResponse | null> {
  const pet = await prisma.pet.findUnique({
    include: { PetGroomingPreference: true },
    where: { id: petId },
  });

  if (!pet) {
    throw new NotFoundError('Pet not found');
  }

  const owner = await validateOwner(clerkId);
  if (owner.id !== pet.ownerId)
    throw new ConflictError(`Pet doesn't belong to this user`);

  return pet;
}

export async function findPetsByOwnerId({
  clerkId,
}: {
  clerkId: string;
}): Promise<PetResponse[]> {
  const owner = await validateOwner(clerkId);

  const pets = await prisma.pet.findMany({
    include: { PetGroomingPreference: true },
    where: {
      ownerId: owner.id,
    },
  });

  if (!pets || pets.length === 0) {
    return [];
  }

  return pets;
}

/**
 * Helpers
 */
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

function validatePetAge(dateOfBirth?: Date): void {
  if (!dateOfBirth) return;
  const age = computePetAge(dateOfBirth);
  if (age > 30) {
    throw new ConflictError('Pet age cannot be more than 30 years');
  }
  if (dateOfBirth > new Date()) {
    throw new ConflictError('Date of birth cannot be in the future');
  }
}

function validatePetWeight(weight?: number): void {
  if (weight && (weight < 0.1 || weight > 200)) {
    throw new ConflictError('Weight must be between 0.1 and 200 kg');
  }
}

async function validateOwner(
  clerkId: string
): Promise<{ id: string; isActive: boolean }> {
  const owner = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!owner) {
    throw new NotFoundError('User not found');
  }

  if (!owner.isActive) {
    throw new ConflictError('User is not active');
  }

  return owner;
}

async function validateUniquePetNameForOwner(
  ownerId: string,
  petName: string,
  excludePetId?: string
): Promise<void> {
  const existingPet = await prisma.pet.findFirst({
    where: {
      id: excludePetId ? { not: excludePetId } : undefined,
      name: { equals: petName, mode: 'insensitive' },
      ownerId,
    },
  });

  if (existingPet) {
    throw new ConflictError('Pet with this name already exists for this owner');
  }
}
