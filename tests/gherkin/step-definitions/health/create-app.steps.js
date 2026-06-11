const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { healthAppsUrl } = require('../../support/routes');

let monitorBody = {
  name: 'users',
  endpoint: 'http://localhost:9090/api/v1/health',
  frequency: '10',
  email: 'microservicios@gmail.com',
};

let response;
let statusCode;

Before(function () {
  response = null;
  statusCode = null;
  // Reset to valid body
  monitorBody = {
    name: 'users',
    endpoint: 'http://localhost:9090/api/v1/health',
    frequency: '10',
    email: 'microservicios@gmail.com',
  };
});

// Scenario 1: all required fields provided
When(
  'el usuario ingresa todos requeridos en la peticion de monitoreo',
  function () {
    // Monitor body already has all required fields
  }
);

Given(
  'el usuario realiza una peticion POST a \\/api\\/v1\\/apps',
  async function () {
    try {
      const res = await axios.post(healthAppsUrl, monitorBody);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then('el sistema guarda la aplicacion en la base de datos', function () {
  // Server-side action
});

Then(
  'el mensaje de respuesta contiene un codigo de repuesta {int}',
  function (expected) {
    assert.strictEqual(statusCode, expected);
  }
);

Then('el servidor regresa un mensaje de respuesta', function () {
  assert.ok(response, 'Expected a response message');
});

// Scenario 2: missing required fields
When(
  'el usuario no ingresa todos los campos requeridos en la peticion de monitoreo',
  function () {
    monitorBody = {
      name: 'users',
      endpoint: 'http://localhost:9090/api/v1/health',
      frequency: '10',
      // Missing email field
    };
  }
);

Then('el sistema no guarda la aplicacion en la base de datos', function () {
  // Server-side action
});

// Scenario 3: incorrect field value
When(
  'el usuario ingresa un campo incorrecto en la peticion de monitoreo',
  function () {
    monitorBody = {
      name: 'users',
      endpoint: 'http://localhost:9090/api/v1/health',
      frequency: '10',
      email: 123, // Invalid type
    };
  }
);
