import { connection } from '../../database/database.js';

export async function rentalAvailableValidation(req, res, next) {

  const { gameId, stockTotal } = res.locals.rental;

  try {
    const rentals = (await connection.query(`
      SELECT "returnDate"
      FROM    rentals 
      WHERE  "gameId" = $1;`,
      [gameId]
    )).rows;

    if (rentals.filter(rent => rent.returnDate === null).length >= stockTotal) {
      res.status(400).send({ message: 'Todas as unidades deste jogo estão alugadas!' });
      return;
    }

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
    return;
  }

  next();

  return;
}