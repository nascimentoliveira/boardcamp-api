import { Router } from 'express';

export const rentals = Router();
rentals.get('/rentals');
rentals.post('/rentals');
rentals.post('/rentals/:id/return');
rentals.delete('/rentals/:id');