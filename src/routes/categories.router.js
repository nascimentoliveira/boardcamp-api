import { Router } from 'express';

import { categorySchemaValidation } from '../middlewares/categories/categorySchemaValidation.middleware.js';
import { categoryNameValidation } from '../middlewares/categories/categoryNameValidation.middleware.js';
import { listCategories, insertCategory } from '../controllers/categories.controller.js';

export const categories = Router();
categories.get('/categories', listCategories);
categories.post('/categories', categorySchemaValidation, categoryNameValidation, insertCategory);