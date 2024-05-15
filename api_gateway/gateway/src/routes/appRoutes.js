const mainHandler = require("../handlers/mainHandler");

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


}

module.exports = routes;
