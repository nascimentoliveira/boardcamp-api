import { Router } from 'express';

import { customerSchemaValidation } from '../middlewares/customers/customerSchemaValidation.middleware.js';
import { customerValidation } from '../middlewares/customers/customerValidation.middleware.js';
import { customerIdValidation } from '../middlewares/customers/customerIdValidation.middeware.js';
import {
  listCustomers,
  listCustomerById,
  insertCustomer,
  updateCustomer
} from '../controllers/customers.controller.js';

export const customers = Router();
customers.get('/customers', listCustomers);
customers.get('/customers/:id', customerIdValidation, listCustomerById);
customers.post('/customers', customerSchemaValidation, customerValidation, insertCustomer);
customers.put('/customers/:id', customerSchemaValidation, customerIdValidation, updateCustomer);