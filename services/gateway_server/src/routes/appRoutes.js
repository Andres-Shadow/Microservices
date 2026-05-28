const mainHandler = require("../handlers/mainHandler");
const logsHandler = require("../handlers/logsHandler");
const healthHandler = require("../handlers/healthMonitorHandler");
const healthHandler2 = require("../handlers/healthHandler");
const notiHandler = require("../handlers/notificationHandler");

const API_PREFIX = "/api/v1";

async function routes(fastify, options) {
  //register and login routes
  fastify.post(API_PREFIX + "/user/login", mainHandler.userLogin);
  fastify.post(API_PREFIX + "/user/register", mainHandler.userRegister);

  //user info route
  fastify.get(API_PREFIX + "/user/:email", mainHandler.getUserInfo);
  fastify.put(API_PREFIX + "/user/:email", mainHandler.updateUserInformation);

  //user routes
  fastify.get(API_PREFIX + "/user", mainHandler.getUsers);
  fastify.post(API_PREFIX + "/user", mainHandler.userRegister);
  fastify.delete(API_PREFIX + "/user", mainHandler.deleteUser);
  fastify.get(API_PREFIX + "/password", mainHandler.recoverPassword);
  fastify.patch(API_PREFIX + "/password", mainHandler.updateUserPassword);

  //logs routes
  fastify.get(API_PREFIX + "/logs", logsHandler.getLogs);
  fastify.delete(API_PREFIX + "/logs", logsHandler.deleteLog);
  fastify.post(API_PREFIX + "/logs", logsHandler.createLog);
  fastify.put(API_PREFIX + "/logs", logsHandler.upateLog);

  //health monitoring route
  fastify.get(API_PREFIX + "/apps", healthHandler.getMonitoredAps);
  fastify.post(API_PREFIX + "/apps", healthHandler.createMonitoredAp);
  fastify.delete(API_PREFIX + "/apps", healthHandler.deleteMonitoredAp);
  fastify.put(API_PREFIX + "/apps", healthHandler.updateMonitoredAp);
  fastify.get(API_PREFIX + "/apps/:name", healthHandler.getAppByName);

  //health verification route
  fastify.get(API_PREFIX + "/health/ready", healthHandler2.readyVerification);
  fastify.get(API_PREFIX + "/health/live", healthHandler2.liveVerification);
  fastify.get(API_PREFIX + "/health", healthHandler2.verifyHealth);

  //notification routes
  fastify.post(API_PREFIX + "/notification", notiHandler.sendNotification);
  fastify.get(API_PREFIX + "/notification", notiHandler.getNotifications);
  fastify.get(API_PREFIX + "/notification/:email", notiHandler.getNotificationsByEMail);
}

module.exports = routes;
