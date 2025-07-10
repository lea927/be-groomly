import {
  PetGender,
  PetSize,
  PetSpecies,
  PetCoatType,
  PetTemperament,
} from '../../generated/prisma';

export interface CreatePetData {
  name: string;
  species: PetSpecies;
  breed?: string;
  dateOfBirth?: Date;
  weight?: number;
  gender: PetGender;
  size: PetSize;
  color?: string;
  // this comes from Clerk not client
  clerkId?: string;
  ownerId: string;
  groomingPreference?: {
    coatType?: PetCoatType;
    temperament?: PetTemperament;
    specialInstructions?: string;
    notes?: string;
  };
}

export interface PetGroomingPreferenceResponse {
  id: string;
  petId: string;
  coatType?: PetCoatType | null;
  temperament?: PetTemperament | null;
  specialInstructions?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PetResponse {
  id: string;
  name: string;
  breed: string | null; // Changed from string | undefined
  color: string | null; // Changed from string | undefined
  weight: number | null; // Changed from number | undefined
  species: PetSpecies;
  dateOfBirth: Date | null; // Changed from Date | undefined
  gender: PetGender;
  size: PetSize;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  PetGroomingPreference?: PetGroomingPreferenceResponse | null;
}
