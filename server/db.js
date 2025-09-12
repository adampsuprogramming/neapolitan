const pg = require('pg');
const Pool = pg.Pool;
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PW,
    port: process.env.DB_PORT,
});

pool.connect()
  .then(client=> {
    console.log('connected to PostgreSQL');
    client.release();
  })
  .catch(err => console.error('Error', err.stack));

  module.exports = pool;