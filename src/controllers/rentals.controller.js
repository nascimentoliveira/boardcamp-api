import { connection } from '../database/database.js';

export async function listRentals(req, res) {

  let count = 0;

  const queryParams = Object.fromEntries([
    [`WHERE rentals."customerId"=$x`, req.query.customerId],
    [`WHERE rentals."gameId"=$x`, req.query.gameId],
    [`OFFSET $x`, req.query.offset],
    [`LIMIT $x`, req.query.limit]
  ]
  .filter(param => param[1] !== undefined)
  .map((param, index) => [param[0].replace('$x', '$' + (index+1)), param[1]]));

  try {
    const rentals = (await connection.query(`
      SELECT rentals.*, 
      
      json_build_object(
        'id', customers.id, 
        'name', customers.name
      ) AS customer,
      
      json_build_object(
        'id', games.id, 
        'name', games.name, 
        'categoryId', games."categoryId", 
        'categoryName', categories.name
      ) AS game
      
      FROM  rentals
      JOIN  customers ON customers.id=rentals."customerId"
      JOIN  games ON games.id=rentals."gameId"
      JOIN  categories ON categories.id=games."categoryId"

      ${Object.keys(queryParams)
        .filter(query => query.includes('WHERE'))
        .join(' ')
        .replaceAll('WHERE', v => count++ > 0 ? 'AND' : v)
      }
      
      GROUP BY rentals.id, customers.id, games.id, categories.id

      ${req.query.order ? `ORDER BY ${req.query.order} ${req.query.desc ? 'DESC' : 'ASC' }` : ``}

      ${Object.keys(queryParams)
        .filter(query => !query.includes('WHERE'))
        .join(' ')
      };`,
      Object.values(queryParams)
    )).rows;

    rentals.forEach(rental => {
      rental.rentDate = rental.rentDate.toISOString().slice(0, 10);
      if (rental.returnDate) {
        rental.returnDate = rental.returnDate.toISOString().slice(0, 10);
      }
    });

    res.status(200).send(rentals);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }
}

export async function insertRental(req, res) {

  const {
    customerId,
    gameId,
    daysRented,
    pricePerDay
  } = res.locals.rental;

  try {
    await connection.query(`
      INSERT INTO rentals 
      ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES ($1, $2, $3, $4, $5, $6, $7);`,

      [
        customerId,
        gameId,
        new Date().toJSON().slice(0, 10),
        daysRented,
        null,
        pricePerDay * daysRented,
        null
      ]
    );

    res.sendStatus(201);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }
}

export async function finalizeRental(req, res) {

  const { id, rentDate, daysRented, originalPrice } = res.locals.rental;

  try {
    const rentDays = Math.max(
      Math.round(
        (rentDate.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
      ), 1);

    const delayFee = (Math.max(0, rentDays - daysRented) * (originalPrice / daysRented));

    await connection.query(`
      UPDATE rentals 
      SET    "returnDate"=$1, "delayFee"=$2
      WHERE  rentals.id=$3;`,
      [new Date().toJSON().slice(0, 10), delayFee, id.toString()]
    );

    res.sendStatus(200);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }
}

export async function deleteRental(req, res) {

  const { id } = res.locals.rental;

  try {
    await connection.query(`
      DELETE 
      FROM   rentals 
      WHERE  id=$1`,
      [id]
    );

    res.sendStatus(200);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }
}