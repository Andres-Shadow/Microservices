const fastify = require("fastify")({ logger: true });

// Importar rutas
const exampleRoutes = require("./appRoutes");

// Registrar rutas
fastify.register(exampleRoutes);

module.exports = fastify;
