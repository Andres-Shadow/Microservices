const { getExampleHandler } = require("../handlers/mainHandler");

async function routes(fastify, options) {
  fastify.get("/example", getExampleHandler);
}

module.exports = routes;
