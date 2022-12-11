import { connection } from '../../database/database.js';

export async function gameValidation(req, res, next) {
  const { name, categoryId } = res.locals.game;

  try {
    const category = (await connection.query(`
      SELECT "id"
      FROM    categories 
      WHERE  "id" = $1;`,
      [categoryId]
    )).rows[0];

    if (!category) {
      res.status(400).send({ message: 'Categoria não registrada!' });
      return;
    }

    const game = (await connection.query(`
      SELECT "name"
      FROM    games 
      WHERE  "name" = $1;`,
      [name]
    )).rows[0];

    if (game) {
      res.status(409).send({ message: 'Jogo já registrado!' });
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