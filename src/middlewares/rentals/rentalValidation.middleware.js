import { connection } from '../../database/database.js';

export async function rentalIdValidation(req, res, next) {

  const rentalId = req.params.id;

  try {
    const rental = (await connection.query(`
        SELECT "id", "rentDate", "returnDate", "daysRented", "originalPrice"
        FROM    rentals 
        WHERE  "id" = $1;`,
      [rentalId]
    )).rows[0]

    if (!rental) {
      res.status(404).send({ message: 'Aluguel não encontrado!' });
      return;
    }
    
    res.locals.rental = rental;

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
    return;
  }

  next();

  return;
}

export async function rentalUnfinalizedValidation(req, res, next) {

  const { returnDate } = res.locals.rental;

  if (returnDate) {
    res.status(400).send({ message: 'Este aluguel já está finalizado!' });
    return;
  }

  next();

  return;
}

export async function rentalFinalizedValidation(req, res, next) {

  const { returnDate } = res.locals.rental;

  if (!returnDate) {
    res.status(400).send({ message: 'Este aluguel não foi finalizado!' });
    return;
  }

  next();

  return;
}