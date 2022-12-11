import { connection } from '../database/database.js';

export async function listCategories(req, res) {

  const queryParams = Object.fromEntries([
    [`OFFSET $x`, req.query.offset],
    [`LIMIT $x`, req.query.limit]
  ]
  .filter(param => param[1] !== undefined)
  .map((param, index) => [param[0].replace('$x', '$' + (index+1)), param[1]]));

  try {
    const categories = (await connection.query(`
      SELECT * 
      FROM   categories
      ${Object.keys(queryParams).join(' ')};`,
      Object.values(queryParams)
    )).rows;

    res.status(200).send(categories);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }
}

export async function insertCategory(req, res) {

  const { name } = res.locals.category;

  try {
    await connection.query(`
      INSERT INTO categories 
      ("name")
      VALUES ($1);`,
      [name]
    );

    res.sendStatus(201);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }
}