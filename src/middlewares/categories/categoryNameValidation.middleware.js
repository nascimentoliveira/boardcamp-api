import { connection } from '../../database/database.js';

export async function categoryNameValidation(req, res, next) {

  const { name } = res.locals.category;

  try {
    const category = (await connection.query(`
      SELECT name
      FROM   categories 
      WHERE  name=$1;`,
      [name]
    )).rows[0];

    if (category) {
      res.status(409).send({ message: 'Categoria já cadastrada!' });
      return;
    }

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
    return;
  }

  next();
}