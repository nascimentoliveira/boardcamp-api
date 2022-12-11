import { connection } from '../../database/database.js';

export async function rentalCustomerValidation(req, res, next) {

  const { customerId } = res.locals.rental;

  try {
    const customer = (await connection.query(`
      SELECT id
      FROM   customers 
      WHERE  id=$1;`,
      [customerId]
    )).rows[0];

    if (!customer) {
      res.status(400).send({ message: 'Cliente não cadastrado(a)!' });
      return;
    }

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
    return;
  }

  next();
}