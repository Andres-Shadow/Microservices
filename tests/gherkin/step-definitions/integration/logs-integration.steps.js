const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { faker } = require('@faker-js/faker');
const { usersUrl, logsUrl } = require('../../support/routes');

let userData = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

let response;
let statusCode;
let logsResponse;
let logsStatusCode;

Before(function () {
  response = null;
  statusCode = null;
  logsResponse = null;
  logsStatusCode = null;
  // Generate fresh user data
  userData = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
});

Given(
  'El usuario se registra en la aplicación de usuarios',
  async function () {
    try {
      const res = await axios.post(usersUrl, userData);
      response = res;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Given('Si el registro es exitoso', function () {
  assert.strictEqual(statusCode, 201);
});

Then(
  'el servidor de usuario genera un log con su correo electronico y asociado al evento de creacion',
  function () {
    // Server-side action: auth server should emit a log event
  }
);

Then(
  'el usuario realiza una peticion get con ese correo al servidor de logs',
  async function () {
    try {
      const url = `${logsUrl}/by-email/${userData.email}`;
      const res = await axios.get(url);
      logsResponse = res;
      logsStatusCode = res.status;
    } catch (error) {
      logsResponse = error.response;
      logsStatusCode = error.response.status;
    }
  }
);

Then('si existe un log asociado a este correo', function () {
  assert.strictEqual(logsStatusCode, 200);
});

Then('el servidor de logs responde con el log asociado', function () {
  assert.ok(logsResponse.data, 'Expected the associated log in the response');
});

Then('el mensaje de respuesta tiene un {int}', function (expected) {
  assert.strictEqual(logsStatusCode, expected);
});
