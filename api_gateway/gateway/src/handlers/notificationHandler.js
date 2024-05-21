const axios = require("axios");
const notificationUrl =
  require("../configuracion/routesConfiguration").notification;

class NotificationHandler {
  static async sendNotification(request, reply) {
    const notification = request.body;
    let respuesta;
    try {
      respuesta = await axios.post(notificationUrl, notification);
    } catch (error) {
      console.error("Error al verificar el token JWT:", error);
      reply.code(500).send({ message: "Internal Server Error" });
      return null;
    }
    reply.code(200).send({ message: respuesta.data });
  }

  static async getNotifications(request, reply) {
    try {
      const response = await axios.get(notificationUrl);
      reply.code(200).send(response.data);
    } catch (error) {
      console.error("Error al realizar la petición GET:", error.message);
      reply.code(500).send({ message: "Internal Server Error" });
    }
  }
}

module.exports = NotificationHandler;
