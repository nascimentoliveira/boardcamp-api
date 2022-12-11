import { categorySchema } from '../../models/category.model.js';

export function categorySchemaValidation(req, res, next) {
  const category = req.body;

  const { error } = categorySchema.validate(category, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    res.status(400).send({ message: 'Formato inesperado! ', errors: errors });
    return;
  }

  res.locals.category = category;

  next();

  return;
}