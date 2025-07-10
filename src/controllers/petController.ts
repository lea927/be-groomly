import { Request, Response, NextFunction } from 'express';
import * as petService from '../services/petService';
import * as petValidation from '../validations/petValidation';
import { CreatePetData, PetResponse } from '../types/pet';
import { getAuth } from '@clerk/express';

async function createPet(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = petValidation.createPetSchema.parse(
      req.body
    ) as CreatePetData;

    // Use Clerk's Express SDK to get the user's User object
    //  and set the ownerId to the user's ID
    const { userId } = getAuth(req);
    const updatedValidatedData = {
      ...validatedData,
      // requireAuth() handles authentication and ensures userId is set
      ownerId: userId ?? '',
    };

    petService
      .createPet(updatedValidatedData)
      .then((pet: PetResponse) => {
        res.status(201).json({
          data: pet,
          message: 'Pet created successfully',
          success: true,
        });
      })
      .catch(next);
  } catch (error) {
    next(error);
  }
}

export default { createPet };
