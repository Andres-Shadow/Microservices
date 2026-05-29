const mainHandler        = require('../handlers/mainHandler');
const logsHandler        = require('../handlers/logsHandler');
const healthMonitorHandler = require('../handlers/healthMonitorHandler');
const healthHandler      = require('../handlers/healthHandler');
const notiHandler        = require('../handlers/notificationHandler');

const API = '/api/v1';

async function routes(fastify, options) {
  // Auth
  fastify.post(`${API}/user/login`,    mainHandler.userLogin);
  fastify.post(`${API}/user/register`, mainHandler.userRegister);

  // Users
  fastify.get(`${API}/user`,           mainHandler.getUsers);
  fastify.delete(`${API}/user`,        mainHandler.deleteUser);
  fastify.get(`${API}/user/:email`,    mainHandler.getUserInfo);
  fastify.put(`${API}/user/:email`,    mainHandler.updateUserInformation);

  // Password
  fastify.get(`${API}/password`,       mainHandler.recoverPassword);
  fastify.patch(`${API}/password`,     mainHandler.updateUserPassword);

  // Logs
  fastify.get(`${API}/logs`,           logsHandler.getLogs);
  fastify.post(`${API}/logs`,          logsHandler.createLog);
  fastify.delete(`${API}/logs`,        logsHandler.deleteLog);
  fastify.put(`${API}/logs`,           logsHandler.upateLog);

  // Health monitor (apps)
  fastify.get(`${API}/apps`,           healthMonitorHandler.getMonitoredAps);
  fastify.post(`${API}/apps`,          healthMonitorHandler.createMonitoredAp);
  fastify.delete(`${API}/apps`,        healthMonitorHandler.deleteMonitoredAp);
  fastify.put(`${API}/apps`,           healthMonitorHandler.updateMonitoredAp);
  fastify.get(`${API}/apps/:name`,     healthMonitorHandler.getAppByName);

  // Gateway health
  fastify.get(`${API}/health/ready`,   healthHandler.readyVerification);
  fastify.get(`${API}/health/live`,    healthHandler.liveVerification);
  fastify.get(`${API}/health`,         healthHandler.verifyHealth);

  // Notifications
  fastify.post(`${API}/notification`,          notiHandler.sendNotification);
  fastify.get(`${API}/notification`,           notiHandler.getNotifications);
  fastify.get(`${API}/notification/:email`,    notiHandler.getNotificationsByEMail);
}

module.exports = routes;
