import { connection } from '../database/database.js';

export async function listRentals(req, res) {

  try {
    const rentals = (await connection.query(`
      SELECT rentals.*, 
      
      json_build_object(
        'id', customers."id", 
        'name', customers."name"
      ) AS customer,
      
      json_build_object(
        'id', games."id", 
        'name', games."name", 
        'categoryId', games."categoryId", 
        'categoryName', categories."name"
      ) AS game
      
      FROM     rentals
      JOIN     customers ON customers."id" = rentals."customerId"
      JOIN     games ON games."id" = rentals."gameId"
      JOIN     categories ON categories."id" = games."categoryId"

      ${req.query.customerId ? `WHERE rentals."customerId" = $1` : ``}
      ${req.query.gameId ? req.query.customerId ? `AND rentals."gameId" = $2` : `WHERE rentals."gameId" = $1` : ``}
      
      GROUP BY rentals."id", customers."id", games."id", categories."id";`,

      [req.query.customerId, req.query.gameId].filter(elem => elem !== undefined)
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

  return;
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
      [customerId, gameId, new Date().toJSON().slice(0, 10), daysRented, null, pricePerDay * daysRented, null]
    );

    res.sendStatus(201);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }

  return;
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
      WHERE  rentals."id"=$3;`,
      [new Date().toJSON().slice(0, 10), delayFee, id.toString()]
    );

    res.sendStatus(200);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }

  return;
}

export async function deleteRental(req, res) {

  const { id } = res.locals.rental;

  try {
    await connection.query(`
      DELETE 
      FROM   rentals 
      WHERE  "id"=$1`,
      [id]
    );

    res.sendStatus(200);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }

  return;
}