const axios = require('axios');

const healthUrl = require('../configuracion/routesConfiguration').healthServer;

class HealthMonitorHandler {
  static async getMonitoredApps(request, reply) {
    try {
      const response = await axios.get(healthUrl);
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('getMonitoredApps error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async createMonitoredApp(request, reply) {
    try {
      const response = await axios.post(healthUrl, request.body);
      reply.code(201).send(response.data);
    } catch (error) {
      console.error('createMonitoredApp error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async deleteMonitoredApp(request, reply) {
    const name = request.params.name;
    try {
      const response = await axios.delete(`${healthUrl}/${name}`);
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('deleteMonitoredApp error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async updateMonitoredApp(request, reply) {
    try {
      const response = await axios.put(healthUrl, request.body);
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('updateMonitoredApp error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async getAppByName(request, reply) {
    const name = request.params.name;
    try {
      const response = await axios.get(`${healthUrl}/${name}`);
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('getAppByName error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }
}

module.exports = HealthMonitorHandler;
