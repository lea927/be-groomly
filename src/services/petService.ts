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
