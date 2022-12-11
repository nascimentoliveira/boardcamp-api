import { connection } from '../../database/database.js';

export async function customerCPFValidation(req, res, next) {

  const { cpf } = res.locals.customer;

  try {
    const customer = (await connection.query(`
      SELECT cpf
      FROM   customers 
      WHERE  cpf=$1;`,
      [cpf]
    )).rows[0];

    if (customer) {
      res.status(409).send({ message: 'Cliente já cadastrado(a)!' });
      return;
    }

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
    return;
  }

  next();
}