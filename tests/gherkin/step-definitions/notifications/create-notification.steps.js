const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { notificationsUrl } = require('../../support/routes');

let notification = {
  target: 'microservicios@gmail.com',
  subject: 'test from postman',
  message: 'test message',
};

let response;
let statusCode;

Before(function () {
  response = null;
  statusCode = null;
  // Reset notification to valid state
  notification = {
    target: 'microservicios@gmail.com',
    subject: 'test from postman',
    message: 'test message',
  };
});

// Scenario 1: valid notification
Given('el usuario define correctamente los campos de la peticion', function () {
  // Notification body is already valid
});

When(
  'el usuario envia una peticion post a \\/api\\/v1\\/notifications',
  async function () {
    try {
      const res = await axios.post(notificationsUrl, notification);
      response = res;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then('el sistema envia la notificacion', function () {
  // Server-side action
});

Then('responde con un codigo de estado {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});

// Scenario 2: invalid notification fields
Given(
  'el usuario define incorrectamente los campos de la peticion',
  function () {
    notification = {
      target: 12345678, // Invalid type
    };
  }
);

Then('el sistema no envia la notificacion', function () {
  // Server-side action
});
