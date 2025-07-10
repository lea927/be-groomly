import { PetGender, PetSize, PetSpecies } from '../../generated/prisma';

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
  ownerId: string;
}

// export interface UpdatePetData extends Partial<Omit<CreatePetData, 'ownerId'>> {}

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
}
