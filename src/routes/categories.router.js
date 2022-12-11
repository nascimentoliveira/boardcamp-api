import { Router } from 'express';

import { categorySchemaValidation } from '../middlewares/categories/categorySchemaValidation.middleware.js';
import { categoryValidation } from '../middlewares/categories/categoryValidation.middleware.js';
import { listCategories, insertCategory } from '../controllers/categories.controller.js';

export const categories = Router();
categories.get('/categories', listCategories);
categories.post('/categories', categorySchemaValidation, categoryValidation, insertCategory);