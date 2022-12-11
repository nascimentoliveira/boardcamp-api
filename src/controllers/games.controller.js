import { connection } from '../database/database.js';

export async function listGames(req, res) {

  let count = 0;

  const queryParams = Object.fromEntries([
    [`WHERE games.name ILIKE $x||'%'`, req.query.name],
    [`OFFSET $x`, req.query.offset],
    [`LIMIT $x`, req.query.limit]
  ]
  .filter(param => param[1] !== undefined)
  .map((param, index) => [param[0].replace('$x', '$' + (index+1)), param[1]]));

  try {
    const games = (await connection.query(`
      SELECT games.*, categories.name as "categoryName"
      FROM   games 
      JOIN   categories ON games."categoryId"=categories.id
      ${Object.keys(queryParams)
        .filter(query => query.includes('WHERE'))
        .join(' ')
        .replaceAll('WHERE', v => count++ > 0 ? 'AND' : v)
      }

      ${req.query.order ? `ORDER BY ${req.query.order} ${req.query.desc ? 'DESC' : 'ASC' }` : ``}
      
      ${Object.keys(queryParams)
        .filter(query => !query.includes('WHERE'))
        .join(' ')
      };`,
      Object.values(queryParams)
    )).rows;

    res.status(200).send(games);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }
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
}