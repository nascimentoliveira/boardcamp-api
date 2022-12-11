import { Router } from 'express';

import { rentalSchemaValidation } from '../middlewares/rentals/rentalSchemaValidation.middleware.js';
import { rentalGameValidation } from '../middlewares/rentals/rentalGameValidation.middleware.js';
import { rentalCustomerValidation } from '../middlewares/rentals/rentalCustomerValidation.middleware.js';
import { rentalAvailableValidation } from '../middlewares/rentals/rentalAvailableValidation.middleware.js';
import { rentalIdValidation } from '../middlewares/rentals/rentalIdValidation.middleware.js';
import { rentalUnfinalizedValidation } from '../middlewares/rentals/rentalUnfinalizedValidation.middleware.js';
import { rentalFinalizedValidation } from '../middlewares/rentals/rentalFinalizedValidation.middleware.js';

import {
  listRentals,
  insertRental,
  finalizeRental,
  deleteRental
} from '../controllers/rentals.controller.js';

export const rentals = Router();

rentals.get(
  '/rentals', 
  listRentals
);

rentals.post(
  '/rentals', 
  rentalSchemaValidation, 
  rentalGameValidation, 
  rentalCustomerValidation, 
  rentalAvailableValidation, 
  insertRental
);

rentals.post(
  '/rentals/:id/return',
  rentalIdValidation, 
  rentalUnfinalizedValidation, 
  finalizeRental
);

rentals.delete(
  '/rentals/:id', 
  rentalIdValidation, 
  rentalFinalizedValidation, 
  deleteRental
);