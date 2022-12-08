import { Router } from 'express';

export const categories = Router();
categories.get('/categories');
categories.post('/categories');