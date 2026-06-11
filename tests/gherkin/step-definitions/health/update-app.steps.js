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

// Scenario 1: valid update
Given(
  'El usuario ingresa correctamente el cuerpo de la aplicacion a actualizar',
  function () {
    // Body is already valid
  }
);

When(
  'El usuario hace una peticion PUT a \\/api\\/v1\\/apps',
  async function () {
    try {
      const res = await axios.put(healthAppsUrl, monitorBody);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then('el servidor encuentra la aplicacion y actualiza sus datos', function () {
  // Server-side action
});

Then('el servidor responde con un mensaje', function () {
  assert.ok(response, 'Expected a response message');
});

Then('el mensaje del servidor monitor tiene un codigo {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});

// Scenario 2: incorrect body
Given(
  'El usuario no ingresa correctamente el cuerpo de la aplicacion a actualizar',
  function () {
    monitorBody.email = 1234456; // Invalid type
  }
);

Then(
  'el servidor no encuentra la aplicacion y no actualiza sus datos',
  function () {
    // Server-side action
  }
);

// Scenario 3: empty body
Given(
  'El usuario no ingresa el cuerpo de la aplicacion a actualizar',
  function () {
    monitorBody = {};
  }
);
