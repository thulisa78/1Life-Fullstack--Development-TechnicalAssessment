// A robot did this: this module centralises all PostgreSQL access behind a
// small pool so the rest of the app never has to think about connections.
const { Pool } = require('pg');
require('dotenv').config();

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
