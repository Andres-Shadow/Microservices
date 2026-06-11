const fastify = require('fastify')({ logger: true });
const appRoutes = require('./appRoutes');

fastify.register(appRoutes);

module.exports = fastify;
