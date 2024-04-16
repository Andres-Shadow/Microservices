// Importa el módulo mysql
const mysql = require("mysql2");

host = process.env.LOGS_DATABASE;

if (!host) {
  host = "localhost";
}

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: host,
  port: 3306,
  user: "root",
  password: "andres_1",
  database: "logs",
});

function getLastLogId(callback) {
  // Conecta a la base de datos
  connection.connect();

  // Realiza la consulta para obtener el último ID
  connection.query(
    "SELECT id FROM logs ORDER BY id DESC LIMIT 1",
    (error, results, fields) => {
      if (error) {
        connection.end(); // Cierra la conexión si hay un error
        return callback(error, null);
      }
      const lastLogId = results[0].id;
      connection.end(); // Cierra la conexión
      callback(null, lastLogId);
    }
  );
}

module.exports = { getLastLogId };
