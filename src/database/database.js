import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

console.log('Trying to connect to the data server...');

export const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (connection) {
  console.log('Connection to data server established!');
} else {
  console.log('Failed to connect to database');
}