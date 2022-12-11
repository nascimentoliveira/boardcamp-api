import { rentalSchema } from '../../models/rental.model.js';

export function rentalSchemaValidation(req, res, next) {
  
  const rental = req.body;

  const { error } = rentalSchema.validate(rental, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    res.status(400).send({ message: 'Formato inesperado! ', errors: errors });
    return;
  }

  res.locals.rental = rental;

  next();
}