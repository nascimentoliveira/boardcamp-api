import joi from 'joi';

export const gameSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().uri().trim().required(),
  stockTotal: joi.number().integer().greater(0).required(),
  categoryId: joi.number().integer().min(1).required(),
  pricePerDay: joi.number().greater(0).required()
});