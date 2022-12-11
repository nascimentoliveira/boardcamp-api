import { Router } from 'express';

import { rentalSchemaValidation } from '../middlewares/rentals/rentalSchemaValidation.middleware.js';
import { rentalInsertValidation } from '../middlewares/rentals/rentalInsertValidation.middleware.js';
import { rentalAvailableValidation } from '../middlewares/rentals/rentalAvailableValidation.middleware.js';

import {
  rentalIdValidation,
  rentalUnfinalizedValidation,
  rentalFinalizedValidation
} from '../middlewares/rentals/rentalValidation.middleware.js';

import {
  listRentals,
  insertRental,
  finalizeRental,
  deleteRental
} from '../controllers/rentals.controller.js';


export const rentals = Router();
rentals.get('/rentals', listRentals);
rentals.post('/rentals', rentalSchemaValidation, rentalInsertValidation, rentalAvailableValidation, insertRental);
rentals.post('/rentals/:id/return', rentalIdValidation, rentalUnfinalizedValidation, finalizeRental);
rentals.delete('/rentals/:id', rentalIdValidation, rentalFinalizedValidation, deleteRental);