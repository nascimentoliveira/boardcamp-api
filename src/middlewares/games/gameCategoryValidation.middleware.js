import { connection } from '../../database/database.js';

export async function gameCategoryValidation(req, res, next) {

  const { categoryId } = res.locals.game;

  try {
    const category = (await connection.query(`
      SELECT id
      FROM   categories 
      WHERE  id=$1;`,
      [categoryId]
    )).rows[0];

    if (!category) {
      res.status(400).send({ message: 'Categoria não cadastrada!' });
      return;
    }

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
    return;
  }

  next();
}