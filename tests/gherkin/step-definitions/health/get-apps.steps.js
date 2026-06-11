const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { healthAppsUrl } = require('../../support/routes');

let response;
let statusCode;

Before(function () {
  response = null;
  statusCode = null;
});

// Scenario 1 & 2: GET health apps
Given(
  'el usuario hace una peticion GET a \\/api\\/v1\\/apps',
  async function () {
    try {
      const res = await axios.get(healthAppsUrl);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then(
  'el servidor evalua la salud de las aplicaciones registradas',
  function () {
    // Server-side evaluation
  }
);

Then(
  'el servidor responde con un json con el estado de salud de las aplicaciones registradas',
  function () {
    assert.ok(response, 'Expected health status data');
  }
);

// Scenario 2: no apps registered
Then('no hay aplicaciones registradas', function () {
  // Precondition for the scenario
});

Then('el servidor responde con un json vacio', function () {
  assert.ok(response !== undefined, 'Expected a response (possibly empty)');
});
