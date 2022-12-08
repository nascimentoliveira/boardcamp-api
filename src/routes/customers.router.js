import { Router } from 'express';

export const customers = Router();
customers.get('/customers');
customers.get('/customers/:id');
customers.post('/customers');
customers.put('/customers/:id');