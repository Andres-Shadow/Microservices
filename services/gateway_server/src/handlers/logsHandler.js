const axios = require('axios');

const logsUrl = require('../configuracion/routesConfiguration').logsManager;

class LogsHandler {
  static async getLogs(request, reply) {
    try {
      const { page, pageSize, startDate, logType } = request.query;
      const params = {};
      if (page) params.page = page;
      if (pageSize) params.pageSize = pageSize;
      if (startDate) params.startDate = startDate;
      if (logType) params.logType = logType;

      const response = await axios.get(logsUrl, { params });
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('getLogs error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async createLog(request, reply) {
    try {
      const response = await axios.post(logsUrl, request.body);
      reply.code(201).send(response.data);
    } catch (error) {
      console.error('createLog error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async deleteLog(request, reply) {
    const id = request.params.id;
    try {
      const response = await axios.delete(`${logsUrl}/${id}`);
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('deleteLog error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async updateLog(request, reply) {
    try {
      const response = await axios.put(logsUrl, request.body);
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('updateLog error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }
}

module.exports = LogsHandler;
