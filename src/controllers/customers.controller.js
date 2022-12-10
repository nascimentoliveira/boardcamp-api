import { connection } from '../database/database.js';

export async function listCustomers(req, res) {

  try {
    const customers = (await connection.query(`
      SELECT *
      FROM customers 
      ${req.query.cpf ? `WHERE cpf LIKE $1||'%';` : `;`}`,
      req.query.cpf ? [req.query?.cpf] : null
    )).rows;
    
    res.status(200).send(customers.map(customer => {
      return { ...customer, birthday: customer.birthday.toISOString().slice(0, 10) }
    }));

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }

  return;
}

export async function listCustomerById(req, res) {

  const customerId = res.locals.customerId;

  try {
    const customer = (await connection.query(`
      SELECT *
      FROM customers 
      WHERE id = $1;`,
      [customerId]
    )).rows;

    res.status(200).send({ ...customer, birthday: customer.birthday.toISOString().slice(0, 10) });
    
  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }

  return;
}

export async function insertCustomer(req, res) {

  const {
    name,
    phone,
    cpf,
    birthday
  } = res.locals.customer;

  try {
    await connection.query(`
      INSERT INTO customers 
      ("name", "phone", "cpf", "birthday")
      VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }

  return;
}

export async function updateCustomer(req, res) {

  const {
    name,
    phone,
    cpf,
    birthday
  } = res.locals.customer;

  const customerId = res.locals.customerId;

  try {
    await connection.query(`
      UPDATE customers 
      SET "name"=$1, phone=$2, cpf=$3, birthday=$4 
      WHERE id = $5;`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(200);

  } catch (err) {
    console.error('An error has occurred: ', err);
    res.status(500).send({ message: 'Ocorreu um erro interno ao servidor!' });
  }

  return;
}