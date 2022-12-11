import { connection } from '../../database/database.js';

export async function gameNameValidation(req, res, next) {

  const { name } = res.locals.game;

  try {
    const game = (await connection.query(`
      SELECT name
      FROM   games 
      WHERE  name=$1;`,
      [name]
    )).rows[0];

    if (game) {
      res.status(409).send({ message: 'Jogo já cadastrado!' });
      return;
    }

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
    return;
  }

  next();
}