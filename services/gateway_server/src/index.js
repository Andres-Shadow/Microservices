const fastify = require('./routes/routes');

const PORT = parseInt(process.env.PORT || '9095', 10);

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Gateway listening on port ${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
