function getExampleHandler(request, reply) {
  reply.send({ message: "Ejemplo de respuesta de API" });
}

module.exports = {
  getExampleHandler,
};
