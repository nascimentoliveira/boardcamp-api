import { connection } from '../database/database.js';

export async function listGames(req, res) {

  try {
    const games = (await connection.query(`
      SELECT games.*, categories.name as "categoryName"
      FROM   games 
      JOIN   categories ON games."categoryId"=categories.id
      ${req.query.name ? `WHERE games."name" ILIKE $1||'%'`: ``};`,
      req.query.name ? [req.query.name] : null
    )).rows;
    res.status(200).send(games);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }

  return;
}

export async function insertGame(req, res) {

  const {
    name,
    image,
    stockTotal,
    categoryId,
    pricePerDay
  } = res.locals.game;

  try {
    await connection.query(`
      INSERT INTO games 
      ("name", "image", "stockTotal", "categoryId", "pricePerDay")
      VALUES ($1, $2, $3, $4, $5);`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(201);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }

  return;
}