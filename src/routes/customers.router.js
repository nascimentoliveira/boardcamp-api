import { Router } from 'express';

import { customerSchemaValidation } from '../middlewares/customers/customerSchemaValidation.middleware.js';
import { customerIdValidation } from '../middlewares/customers/customerIdValidation.middleware.js';
import { customerCPFValidation } from '../middlewares/customers/customerCPFValidation.middleware.js';

import {
  listCustomers,
  getCustomerById,
  insertCustomer,
  updateCustomer
} from '../controllers/customers.controller.js';

export const customers = Router();

customers.get(
  '/customers', 
  listCustomers
);

customers.get(
  '/customers/:id', 
  customerIdValidation, 
  getCustomerById
);

customers.post(
  '/customers', 
  customerSchemaValidation, 
  customerIdValidation, 
  customerCPFValidation, 
  insertCustomer
);

customers.put(
  '/customers/:id', 
  customerSchemaValidation, 
  customerIdValidation, 
  updateCustomer
);