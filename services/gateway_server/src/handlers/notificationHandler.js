const axios = require('axios');

const notificationUrl = require('../configuracion/routesConfiguration').notification;

class NotificationHandler {
  static async sendNotification(request, reply) {
    try {
      const response = await axios.post(notificationUrl, request.body);
      reply.code(201).send(response.data);
    } catch (error) {
      console.error('sendNotification error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async getNotifications(request, reply) {
    try {
      const { page, page_size } = request.query;
      const params = {};
      if (page) params.page = page;
      if (page_size) params.page_size = page_size;

      const response = await axios.get(notificationUrl, { params });
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('getNotifications error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async getNotificationsByEmail(request, reply) {
    const email = request.params.email;
    try {
      const response = await axios.get(`${notificationUrl}/${email}`);
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('getNotificationsByEmail error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }
}

module.exports = NotificationHandler;
