import { connection } from '../../database/database.js';

export async function rentalGameValidation(req, res, next) {

  const { gameId } = res.locals.rental;

  try {
    const game = (await connection.query(`
      SELECT id, "pricePerDay", "stockTotal"
      FROM   games 
      WHERE  id=$1;`,
      [gameId]
    )).rows[0];

    if (!game) {
      res.status(400).send({ message: 'Jogo não cadastrado!' });
      return;
    }

    res.locals.rental = { ...res.locals.rental, pricePerDay: game.pricePerDay, stockTotal: game.stockTotal };

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
    return;
  }

  next();
}