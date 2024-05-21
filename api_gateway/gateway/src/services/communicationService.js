const { connect, StringCodec } = require("nats");
//importar la clase logs
const LogResponse = require("../models/logModel");
// Crear una variable global para la conexión de NATS
let nc = null;
const sc = StringCodec();
const host = process.env.NATS_SERVER || "localhost";
const subject = "MicroservicesLogs";

// Función para conectar a NATS si no está ya conectado
async function connectToNats() {
  if (!nc) {
    try {
      url = `nats://${host}:4222`;
      nc = await connect({ servers: url });
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

//funcioon para probar la conexion a nats
async function testConnection() {
  try {
    await connectToNats();
    console.log("Conexión exitosa");
    return true;
  } catch (err) {
    console.error(`Error en la conexión: ${err.message}`);
    return false;
  }
}

async function sendSampleMessage() {
  try {
    await connectToNats();
    nc.publish("sample", sc.encode("Mensaje de prueba"));
    console.log(`Mensaje de prueba enviado en el tema: ${subject}`);
    return true;
  } catch (err) {
    console.error(`Error enviando el mensaje de prueba a NATS: ${err.message}`);
    return false;
  }
}

//exportar el modulo
module.exports = { sendLogToNats, testConnection, sendSampleMessage };
