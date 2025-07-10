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
router.put('/:id', petController.updatePet);
router.get('/:id', petController.getPet);
router.get('/', petController.getPets);
router.delete('/:id', petController.deletePet);

export default router;
