const mainHandler          = require('../handlers/mainHandler');
const logsHandler          = require('../handlers/logsHandler');
const healthMonitorHandler = require('../handlers/healthMonitorHandler');
const healthHandler        = require('../handlers/healthHandler');
const notificationHandler  = require('../handlers/notificationHandler');

const API = '/api/v1';

async function routes(fastify) {
  // Auth
  fastify.post(`${API}/auth/login`,       mainHandler.userLogin);
  fastify.post(`${API}/auth/register`,    mainHandler.userRegister);

  // Users
  fastify.get(`${API}/users`,             mainHandler.getUsers);
  fastify.get(`${API}/users/:email`,      mainHandler.getUserInfo);
  fastify.put(`${API}/users/:email`,      mainHandler.updateUserInformation);
  fastify.delete(`${API}/users/:email`,   mainHandler.deleteUser);

  // Password
  fastify.get(`${API}/users/password`,    mainHandler.recoverPassword);
  fastify.patch(`${API}/users/password`,  mainHandler.updateUserPassword);

  // Logs
  fastify.get(`${API}/logs`,              logsHandler.getLogs);
  fastify.post(`${API}/logs`,             logsHandler.createLog);
  fastify.put(`${API}/logs`,              logsHandler.updateLog);
  fastify.delete(`${API}/logs/:id`,       logsHandler.deleteLog);

  // Health monitor (apps)
  fastify.get(`${API}/apps`,              healthMonitorHandler.getMonitoredApps);
  fastify.post(`${API}/apps`,             healthMonitorHandler.createMonitoredApp);
  fastify.put(`${API}/apps`,              healthMonitorHandler.updateMonitoredApp);
  fastify.get(`${API}/apps/:name`,        healthMonitorHandler.getAppByName);
  fastify.delete(`${API}/apps/:name`,     healthMonitorHandler.deleteMonitoredApp);

  // Gateway health
  fastify.get(`${API}/health`,            healthHandler.verifyHealth);
  fastify.get(`${API}/health/ready`,      healthHandler.readyVerification);
  fastify.get(`${API}/health/live`,       healthHandler.liveVerification);

  // Notifications
  fastify.get(`${API}/notifications`,           notificationHandler.getNotifications);
  fastify.post(`${API}/notifications`,          notificationHandler.sendNotification);
  fastify.get(`${API}/notifications/:email`,    notificationHandler.getNotificationsByEmail);
}

module.exports = routes;
