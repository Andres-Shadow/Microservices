//importar las verificiaciones
const nats = require("../services/communicationService");
const { Check, CheckData, LiveStatus } = require("../models/healthCheckModel");

class HealthHandler {
  static async verifyReady() {
    let status = await nats.testConnection();
    let label_status = status ? "UP" : "DOWN";
    let data_status = status ? "READY" : "DOWN";
    let name = "Nats server ready verification";
    let from = new Date().toISOString();
    let checkData = new CheckData(from, data_status);
    let check = new Check(checkData, name, label_status);
    let live = new LiveStatus(label_status, [check], "1.0.0");
    return live;
  }

  static async readyVerification(request, reply) {
    let report = await HealthHandler.verifyReady();
    reply.code(200).send(report);
  }

  static async verifyLive() {
    let status = await nats.sendSampleMessage();
    let label_status = status ? "UP" : "DOWN";
    let data_status = status ? "LIVE" : "DOWN";
    let name = "Nats server live verification";
    let from = new Date().toISOString();
    let checkData = new CheckData(from, data_status);
    let check = new Check(checkData, name, label_status);
    let live = new LiveStatus(label_status, [check], "1.0.0");
    return live;
  }

  static async liveVerification(request, reply) {
    let report = await HealthHandler.verifyLive();
    reply.code(200).send(report);
  }

  static async verifyHealth(request, reply) {
    let report = await HealthHandler.verifyReady();
    let report2 = await HealthHandler.verifyLive();
    let reports = [report, report2];
    reply.code(200).send(reports);
  }
}
module.exports = HealthHandler;
