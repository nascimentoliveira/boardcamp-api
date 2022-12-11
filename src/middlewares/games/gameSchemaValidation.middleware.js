import { gameSchema } from '../../models/game.model.js';

export function gameSchemaValidation(req, res, next) {
  const game = req.body;

  const { error } = gameSchema.validate(game, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    res.status(400).send({ message: 'Formato inesperado! ', errors: errors });
    return;
  }

  res.locals.game = game;

  next();

  return;
}