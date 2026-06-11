const { connect, StringCodec } = require('nats');
const LogResponse = require('../models/logModel');

let nc = null;
const sc = StringCodec();
const host = process.env.NATS_SERVER || 'localhost';
const subject = 'MicroservicesLogs';

async function connectToNats() {
  if (!nc) {
    try {
      const url = `nats://${host}:4222`;
      nc = await connect({ servers: url });
      console.log('Connected to NATS');
    } catch (err) {
      console.error(`Failed to connect to NATS: ${err.message}`);
    }
  }
}

async function sendLogToNats(name, summary, description, logType) {
  try {
    await connectToNats();
    const notification = new LogResponse(name, summary, description, logType);
    const message = JSON.stringify(notification);
    nc.publish(subject, sc.encode(message));
  } catch (err) {
    console.error(`Error publishing log to NATS: ${err.message}`);
  }
}

async function testConnection() {
  try {
    await connectToNats();
    return true;
  } catch (err) {
    console.error(`NATS connection test failed: ${err.message}`);
    return false;
  }
}

async function sendSampleMessage() {
  try {
    await connectToNats();
    nc.publish('sample', sc.encode('Sample message'));
    return true;
  } catch (err) {
    console.error(`Failed to send NATS sample message: ${err.message}`);
    return false;
  }
}

module.exports = { sendLogToNats, testConnection, sendSampleMessage };
