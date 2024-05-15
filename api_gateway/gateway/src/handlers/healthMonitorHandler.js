const axios = require("axios");

const healthUrl = require("../configuracion/routesConfiguration").healthServer;

class HealthMonitorHandler {
  static async getMonitoredAps(request, reply) {
    try {
      // Realizar la petición GET con node-fetch y pasar el token en el encabezado de autorización
      const response = await axios.get(healthUrl);
      // Si la petición se realiza con éxito, devolver la respuesta
      reply.code(200).send(response.data);
    } catch (error) {
      // Si ocurre algún error durante la petición, devolver un error
      console.error("Error al realizar la petición GET:", error.message);
      reply.code(500).send({ message: "Internal Server Error" });
    }
  }

  static async createMonitoredAp(request, reply) {
    //obtener el body de la peticion
    const monitoredAp = request.body;
    let respuesta;
    try {
      respuesta = await axios.post(healthUrl, monitoredAp);
    } catch (error) {
      console.error("Error al verificar el token JWT:", error);
      reply.code(500).send({ message: "Internal Server Error" });
      return null;
    }
    reply.code(200).send({ message: respuesta.data });
  }

  static async deleteMonitoredAp(request, reply) {
    const appName = request.params.name;
    let respuesta;
    try {
      respuesta = await axios.delete(healthUrl + "?name=" + appName);
    } catch (error) {
      console.error("Error al verificar el token JWT:", error);
      reply.code(500).send({ message: "Internal Server Error" });
      return null;
    }
  }

  static async updateMonitoredAp(request, reply) {
    const monitoredAp = request.body;
    let respuesta;
    try {
      respuesta = await axios.put(healthUrl, monitoredAp);
    } catch (error) {
      console.error("Error al verificar el token JWT:", error);
      reply.code(500).send({ message: "Internal Server Error" });
      return null;
    }
  }
}

module.exports = HealthMonitorHandler;
