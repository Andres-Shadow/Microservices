const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { notificationsUrl } = require('../../support/routes');

let response;
let statusCode;

Before(function () {
  response = null;
  statusCode = null;
});

Given(
  'el usuario hace una peticion get a la ruta \\/api\\/v1\\/notifications',
  async function () {
    try {
      const res = await axios.get(notificationsUrl);
      response = res;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then(
  'el servidor responde con un listado de notificaciones registradas',
  function () {
    assert.ok(response, 'Expected a list of notifications');
  }
);

Then('el codigo de respuesta es {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});
