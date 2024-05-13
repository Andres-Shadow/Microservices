const fastify = require("fastify")();

// Importar rutas
const exampleRoutes = require("./appRoutes");

// Registrar rutas
fastify.register(exampleRoutes);

module.exports = fastify;
