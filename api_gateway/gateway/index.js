const fastify = require("./routes/routes");

const PORT = 9095;

const start = async () => {
  try {
    await fastify.listen({port: PORT});
    console.log(`Servidor Fastify corriendo en puerto ${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
