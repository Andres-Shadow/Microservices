// Conexión a la base de datos compartida PostgreSQL
// Schema: user_profile (user_profile_server)
const { Client } = require('pg');

const host     = process.env.USER_DATABASE        ?? 'localhost';
const password = process.env.PROFILE_DB_PASSWORD  ?? 'profilepassword';
const user     = process.env.PROFILE_DB_USER      ?? 'profileuser';

async function getUserByEmail(email) {
  const client = new Client({
    host,
    port: 5432,
    user,
    password,
    database: 'appdb',
    options: '-c search_path=user_profile',
  });

  await client.connect();
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows;
  } finally {
    await client.end();
  }
}

module.exports = { getUserByEmail };
