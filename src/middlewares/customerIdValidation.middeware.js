import { connection } from '../database/database.js';

export async function customerIdValidation(req, res, next) {

  const customerId = req.params.id;

  try {
    const customer = (await connection.query(`
        SELECT (id)
        FROM customers 
        WHERE id = $1;`,
      [customerId]
    )).rows[0]

    if (!customer) {
      res.status(404).send({ message: 'Registro não encontrado!' });
      return;
    }

    res.locals.customerId = customerId;

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
    return;
  }

  next();

  return;
}