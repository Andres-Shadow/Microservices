// Importa el módulo mysql
const mysql = require("mysql2");

host = process.env.USER_DATABASE;

if (!host) {
  host = "localhost";
}

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: host,
  port: 3306,
  user: "root",
  password: "andres_1",
  database: "users",
});
async function getUserByEmail(email, callback) {
  console.log("Conectando a la base de datos...");
  connection.connect();

  console.log("Email:", email);
  const query = "SELECT * FROM users WHERE email = ?";

  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
    } else {
      console.log("Resultados de la consulta:", results);
      callback(null, results);
    }

    // Cerrar la conexión
    connection.end();
  });
  // console.log("Email:", email);

  // connection.query(
  //   "SELECT * FROM `users` WHERE `email` = ?",
  //   [email],
  //   (error, results, fields) => {
  //     if (error) {
  //       console.error("Error en la consulta:", error);
  //       connection.end();
  //       return callback(error, null);
  //     }

  //     console.log("Resultados:", results);

  //     if (results.length === 0) {
  //       console.warn("No se encontró un usuario con el correo proporcionado.");
  //       const userCount = results[0].userCount;
  //       console.log(
  //         "Query ejecutada:",
  //         "SELECT * FROM `users` WHERE `email` = ?",
  //         [email]
  //       );
  //       connection.end();
  //       return callback(new Error("No user found with given email"), null);
  //     }

  //     connection.end();
  //     callback(null, userCount);
  //   }
  // );
}

module.exports = { getUserByEmail };
