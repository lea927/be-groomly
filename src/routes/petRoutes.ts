import { Router } from 'express';
import petController from '../controllers/petController';
import { validate } from '../middleware/validate';
import * as petValidation from '../validations/petValidation';

const router = Router();

router.post(
  '/',
  validate(petValidation.createPetSchema),
  petController.createPet
);

export default router;
