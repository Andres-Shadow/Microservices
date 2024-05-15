const mainHandler = require("../handlers/mainHandler");
const logsHandler = require("../handlers/logsHandler");
const healthHandler = require("../handlers/healthMonitorHandler");

const API_PREFIX = "/api/v1";

async function routes(fastify, options) {
  //register and login routes
  fastify.post(API_PREFIX + "/user/login", mainHandler.userLogin);
  fastify.post(API_PREFIX + "/user/register", mainHandler.userRegister);

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
  fastify.get(API_PREFIX + "/health", healthHandler.getMonitoredAps);
  fastify.post(API_PREFIX + "/health", healthHandler.createMonitoredAp);
  fastify.delete(API_PREFIX + "/health", healthHandler.deleteMonitoredAp);
  fastify.put(API_PREFIX + "/health", healthHandler.updateMonitoredAp);
}

module.exports = routes;
