import { connection } from '../database/database.js';

export async function insertCategory(req, res) {
  const { name } = res.locals.category;

  try {
    await connection.query(`
      INSERT INTO categories 
      (name)
      VALUES ($1)`,
      [name]
    );
    res.sendStatus(201);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }

  return;
}

export async function listCategories(req, res) {
  try {
    const categories = (await connection.query(`
      SELECT * 
      FROM categories`,
    )).rows;
    res.status(200).send(categories);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }

  return;
}