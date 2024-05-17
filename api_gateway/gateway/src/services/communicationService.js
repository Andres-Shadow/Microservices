const { connect, StringCodec } = require("nats");
//importar la clase logs
const LogResponse = require("../models/logModel");
// Crear una variable global para la conexión de NATS
let nc = null;
const sc = StringCodec();
const subject = "MicroservicesLogs";

// Función para conectar a NATS si no está ya conectado
async function connectToNats() {
  if (!nc) {
    try {
      nc = await connect({ servers: "nats://localhost:4222" });
      console.log("Conectado a NATS");
    } catch (err) {
      console.error(`Error conectando a NATS: ${err.message}`);
    }
  }
}

// Función para enviar el log a NATS
async function sendLogToNats(name, summary, description, logType) {
  try {
    // Asegúrate de que estamos conectados a NATS
    await connectToNats();

    // Crear una instancia de LogResponse
    const notification = new LogResponse(name, summary, description, logType);

    // Convierte el objeto a JSON
    const mensaje = JSON.stringify(notification);
    console.log(mensaje);

    // Publica el mensaje en el tema especificado
    nc.publish(subject, sc.encode(mensaje));

    console.log(`Mensaje enviado: ${mensaje} en el tema: ${subject}`);
  } catch (err) {
    console.error(`Error enviando el log a NATS: ${err.message}`);
  }
}

//exportar el modulo
module.exports = { sendLogToNats };
