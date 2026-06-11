const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { logsUrl } = require('../../support/routes');

let logBody = {
  Name: 'Test from JS',
  Summary: 'Test made with CucumberJS',
  Description: 'Just a test made with cucumberJS',
  Log_date: '2024-04-09 00:00:00',
  Log_type: 'INFO',
  Module: 'CUCUMBER',
};

let response;
let statusCode;

Before(function () {
  response = null;
  statusCode = null;
  // Reset log body to valid state
  logBody = {
    Name: 'Test from JS',
    Summary: 'Test made with CucumberJS',
    Description: 'Just a test made with cucumberJS',
    Log_date: '2024-04-09 00:00:00',
    Log_type: 'INFO',
    Module: 'CUCUMBER',
  };
});

// Scenario 1: valid log creation
Given(
  'el usuario diligencia en el cuerpo de la petición de forma correcta los campos',
  function () {
    // Log body is already set with valid data
  }
);

When('se hace una petición post a \\/api\\/v1\\/logs', async function () {
  try {
    const res = await axios.post(logsUrl, logBody);
    response = res.data;
    statusCode = res.status;
  } catch (error) {
    response = error.response;
    statusCode = error.response.status;
  }
});

Then('se debe retornar un status code {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});

Then('el servidor envia un mensaje de respuesta', function () {
  assert.ok(response, 'Expected a response message from the server');
});

// Scenario 2: missing fields
Given(
  'el usuario no diligencia en el cuerpo de la petición de forma correcta los campos',
  function () {
    logBody = {};
  }
);

// Scenario 3: invalid data types
Given(
  'el usuario diligencia en el cuerpo con un tipo de dato diferente a los permitidos',
  function () {
    logBody = {
      Name: 123,
      Summary: 123,
      Description: 123,
      Log_date: 123,
      Log_type: 123,
      Module: 123,
    };
  }
);
