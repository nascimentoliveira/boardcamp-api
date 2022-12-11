import { connection } from '../../database/database.js';

export async function rentalIdValidation(req, res, next) {

  const rentalId = req.params.id;

  try {
    const rental = (await connection.query(`
      SELECT id, "rentDate", "returnDate", "daysRented", "originalPrice"
      FROM   rentals 
      WHERE  id=$1;`,
      [rentalId]
    )).rows[0];

    if (!rental) {
      res.status(404).send({ message: 'Aluguel não cadastrado!' });
      return;
    }

    res.locals.rental = rental;

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
    return;
  }

  next();
}