const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { faker } = require('@faker-js/faker');
const { usersUrl, loginUrl } = require('../../support/routes');

const passwordUrl = `${usersUrl}/password`;

let response;
let statusCode;
let config = {};
let token;

let userData = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

Before(async function () {
  response = null;
  statusCode = null;

  // Register and authenticate the user
  userData.email = faker.internet.email();
  try {
    await axios.post(usersUrl, userData);
  } catch (error) {
    // User may already exist
  }

  try {
    const res = await axios.post(loginUrl, userData);
    token = res.data.token;
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    token = null;
    config = {};
  }
});

Given('un usario llamado pepe que ya ha realizado el registro', function () {
  // User is registered in the Before hook
});

Given('pepe quiere actualizar su contraseña a {int}', function (newPassword) {
  userData.password = String(newPassword);
});

// Scenario 1: successful password change
Given('pepe diligencia su correo en el cuerpo de la petición', function () {
  // Email is already in userData
});

When(
  'pepe hace una solicitud a la ruta PATCH \\/api\\/v1\\/users\\/password',
  async function () {
    try {
      const res = await axios.patch(passwordUrl, userData, config);
      response = res;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then('la aplicación lo busca en la base de datos', function () {
  // Server-side action
});

Then('si existe un registro con esos dados actauliza la contraseña', function () {
  // Server-side action
});

Then('el servidor retorna un codigo de estado {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});

// Scenario 2: email not registered
Given(
  'pepe diligencia un correo que no está registrado en la base de datos',
  function () {
    userData.email = faker.internet.email();
  }
);

Then('la aplicación busca su registro en la base de datos', function () {
  // Server-side action
});

Then('si no existe un registro con esos dados', function () {
  // Confirmed by status code
});

// Scenario 3: no JWT token
When('pepe no proporsiona el token de verificación jwt', function () {
  config = {};
});
