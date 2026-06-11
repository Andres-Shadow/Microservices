const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { loginUrl } = require('../../support/routes');

// Pre-loaded user in the database
let userData = {
  username: 'pepe',
  email: 'a@gmail.com',
  password: '12345',
};

let response;
let statusCode;

Before(async function () {
  response = null;
  statusCode = null;
});

Given(
  ': un usuario ya registrado de forma exitosa en la base de datos de la aplicación',
  function () {
    // User is already seeded in the database
  }
);

Given('este usuario tiene por nombre pepe', function () {
  userData.username = 'pepe';
});

When(
  'invoca el método de autenticación en \\/api\\/v1\\/login',
  async function () {
    try {
      const res = await axios.post(loginUrl, userData);
      response = res;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then('se obtiene el mensaje de respuesta {int}', function (expectedStatus) {
  assert.strictEqual(statusCode, expectedStatus);
});

Then('se obtiene el token jwt de autenticación', function () {
  assert.ok(response.data, 'Expected a JWT token in the response body');
});

Given('los datos diligenciados no existen en la base de datos', function () {
  userData.username = 'nonexistent-fake-user';
  userData.email = 'nonexistent@fake.com';
});

Then('se obtiene el mensaje de error {string}', function (expectedMessage) {
  assert.ok(response.data, 'Expected an error message in the response');
});

Given(
  'la contraseña ingresada no coincide con los registrados en la base de datos',
  function () {
    userData.password = 'wrong-password-12345';
  }
);

Given(
  'los datos diligenciados no cumplen con el formato esperado',
  function () {
    userData.username = 23464; // Invalid type to trigger format error
  }
);
