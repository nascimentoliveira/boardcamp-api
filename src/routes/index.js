import { Router } from 'express';

import { rentals } from './rentals.router.js';
import { customers } from './customers.router.js';
import { games } from './games.router.js';
import { categories } from './categories.router.js';

export const router = Router();
router.use(rentals);
router.use(customers);
router.use(games);
router.use(categories);