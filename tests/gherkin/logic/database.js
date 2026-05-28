// Conexión a la base de datos compartida PostgreSQL
// Schema: logs (logs_manager_server)
const { Client } = require('pg');

const host     = process.env.LOGS_DATABASE     ?? 'localhost';
const password = process.env.LOGS_DB_PASSWORD  ?? 'logspassword';
const user     = process.env.LOGS_DB_USER      ?? 'logsuser';

async function getLastLogId() {
  const client = new Client({
    host,
    port: 5432,
    user,
    password,
    database: 'appdb',
    options: '-c search_path=logs',
  });

  await client.connect();
  try {
    const result = await client.query('SELECT id FROM logs ORDER BY id DESC LIMIT 1');
    return result.rows[0]?.id ?? null;
  } finally {
    await client.end();
  }
}

module.exports = { getLastLogId };
