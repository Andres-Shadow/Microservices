const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { logsUrl } = require('../../support/routes');

let response;
let statusCode;

Before(function () {
  response = null;
  statusCode = null;
});

// Scenario 1: list all logs
Given(
  'El usuario realiza una petición GET a la URL \\/api\\/v1\\/logs',
  async function () {
    try {
      const res = await axios.get(logsUrl);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

When('El usuario envía la petición', function () {
  // Request was already sent in the Given step
});

Then('El sistema responde con un código de estado {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});

Then('El sistema responde con una lista de logs', function () {
  assert.ok(response, 'Expected a list of logs in the response');
});

// Scenario 2: list logs with pagination
Given(
  'El usuario realiza una petición GET a la URL \\/api\\/v1\\/logs?page={int}&pageSize={int}',
  async function (page, pageSize) {
    try {
      const url = `${logsUrl}?page=${page}&pageSize=${pageSize}`;
      const res = await axios.get(url);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);
