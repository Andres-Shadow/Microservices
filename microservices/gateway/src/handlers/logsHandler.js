const axios = require("axios");

const logsUrl = require("../configuracion/routesConfiguration").logsManager;

class LogsHandler {
  static async getLogs(request, reply) {
    try {
      // Realizar la petición GET con node-fetch y pasar el token en el encabezado de autorización
      const response = await axios.get(logsUrl);
      // Si la petición se realiza con éxito, devolver la respuesta
      reply.code(200).send(response.data);
    } catch (error) {
      // Si ocurre algún error durante la petición, devolver un error
      console.error("Error al realizar la petición GET:", error.message);
      reply.code(500).send({ message: "Internal Server Error" });
    }
  }

  static async createLog(request, reply) {
    //obtener el body de la peticion
    const log = request.body;
    let respuesta;
    try {
      respuesta = await axios.post(logsUrl, log);
    } catch (error) {
      console.error("Error al verificar el token JWT:", error);
      reply.code(500).send({ message: "Internal Server Error" });
      return null;
    }
    reply.code(200).send({ message: respuesta.data });
  }

  static async deleteLog(request, reply) {
    //obtener el body de la peticion
    const logId = request.params.id;
    let respuesta;
    try {
      respuesta = await axios.delete(logsUrl + "?id=" + logId);
    } catch (error) {
      console.error("Error al verificar el token JWT:", error);
      reply.code(500).send({ message: "Internal Server Error" });
      return null;
    }
    reply.code(200).send({ message: respuesta.data });
  }

  static async upateLog(request, reply) {
    //obtener el body de la peticion
    const log = request.body;
    let respuesta;
    try {
      respuesta = await axios.put(logsUrl, log);
    } catch (error) {
      console.error("Error al verificar el token JWT:", error);
      reply.code(500).send({ message: "Internal Server Error" });
      return null;
    }
    reply.code(200).send({ message: respuesta.data });
  }
}

module.exports = LogsHandler;
