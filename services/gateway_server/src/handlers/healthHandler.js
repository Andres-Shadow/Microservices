const nats = require('../services/communicationService');
const { Check, CheckData, LiveStatus } = require('../models/healthCheckModel');

class HealthHandler {
  static async verifyReady() {
    const status = await nats.testConnection();
    const checkData = new CheckData(new Date().toISOString(), status ? 'READY' : 'DOWN');
    const check = new Check(checkData, 'Gateway — NATS readiness check', status ? 'UP' : 'DOWN');
    return new LiveStatus(status ? 'UP' : 'DOWN', [check], '1.0.0');
  }

  static async readyVerification(request, reply) {
    const report = await HealthHandler.verifyReady();
    reply.code(200).send(report);
  }

  static async verifyLive() {
    const status = await nats.sendSampleMessage();
    const checkData = new CheckData(new Date().toISOString(), status ? 'LIVE' : 'DOWN');
    const check = new Check(checkData, 'Gateway — NATS liveness check', status ? 'UP' : 'DOWN');
    return new LiveStatus(status ? 'UP' : 'DOWN', [check], '1.0.0');
  }

  static async liveVerification(request, reply) {
    const report = await HealthHandler.verifyLive();
    reply.code(200).send(report);
  }

  static async verifyHealth(request, reply) {
    const [ready, live] = await Promise.all([
      HealthHandler.verifyReady(),
      HealthHandler.verifyLive(),
    ]);
    reply.code(200).send({ live, ready });
  }
}

module.exports = HealthHandler;
