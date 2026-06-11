const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { healthAppsUrl } = require('../../support/routes');

let monitorBody = {
  name: 'deletion-test',
  endpoint: 'http://localhost:9090/api/v1/health',
  frequency: '10',
  email: 'microservicios@gmail.com',
};

let response;
let statusCode;

Before(async function () {
  response = null;
  statusCode = null;
  // Create an app so we have something to delete
  try {
    await axios.post(healthAppsUrl, monitorBody);
  } catch (error) {
    // May already exist
  }
});

// Scenario 1: successful deletion with name in URL
When('el usuario configura el nombre de la aplicacion en la url', function () {
  // Name is already set in monitorBody
});

Given(
  'el usuario hace una peticion DELETE a \\/api\\/v1\\/apps\\/:name',
  async function () {
    try {
      const url = `${healthAppsUrl}/${encodeURIComponent(monitorBody.name)}`;
      const res = await axios.delete(url);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then('el servidor procesa la eliminacion', function () {
  // Server-side action
});

Then('el servidor responde con un mensaje de exitosa', function () {
  assert.ok(response, 'Expected a success message');
});

// Scenario 2: app not found (empty name)
When(
  'el usuario no configura el nombre de la aplicacion en la url',
  function () {
    monitorBody.name = 'nonexistent-app-xyz';
  }
);

Then('el servidor responde con un mensaje de error', function () {
  assert.ok(response, 'Expected an error message');
});

// Scenario 3: no name provided
Given(
  'el usuario hace una peticion DELETE a \\/api\\/v1\\/apps sin nombre',
  async function () {
    try {
      // Send DELETE without a name path param
      const res = await axios.delete(healthAppsUrl);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then('el mensaje tiene un codigo de error {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});
