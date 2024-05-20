const mainHandler = require("../handlers/mainHandler");
const logsHandler = require("../handlers/logsHandler");
const healthHandler = require("../handlers/healthMonitorHandler");
const healthVerification = require("../handlers/healthHandler");

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
  //upate route logic pending

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

  //health verification route
  fastify.get(API_PREFIX + "/health/ready",healthVerification.readyVerification);
  fastify.get(API_PREFIX + "/health/live",healthVerification.liveVerification);
  fastify.get(API_PREFIX + "/health",healthVerification.verifyHealth);
}

module.exports = routes;
