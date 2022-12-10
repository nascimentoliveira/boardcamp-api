import { customerSchema } from '../models/customer.model.js';

export function customerSchemaValidation(req, res, next) {
  const customer = req.body;

  const { error } = customerSchema.validate(customer, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    res.status(400).send({ message: 'Formato inesperado! ', errors: errors });
    return;
  }

  res.locals.customer = customer;

  next();

  return;
}