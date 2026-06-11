const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { faker } = require('@faker-js/faker');
const { usersUrl, loginUrl } = require('../../support/routes');

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
  config = {};
});

// Background: register and authenticate a user
Given(
  'un usario llamado pepe que ya ha pasado por el proceso de registrarse',
  async function () {
    userData.email = faker.internet.email();
    try {
      await axios.post(usersUrl, userData);
    } catch (error) {
      // User may already exist, continue
    }
  }
);

Given('pepe ya se ha autenticado', async function () {
  try {
    const res = await axios.post(loginUrl, userData);
    token = res.data;
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    statusCode = res.status;
  } catch (error) {
    response = error.response;
    statusCode = error.response.status;
  }
});

// Scenario 1: successful deletion
Given(
  'pepe proporsiona su correo electrónico en el parámetro de la URL',
  function () {
    // Email is already set in userData
  }
);

When(
  'pepe hace una petición DELETE a \\/api\\/v1\\/users\\/:email',
  async function () {
    try {
      const url = `${usersUrl}/${encodeURIComponent(userData.email)}`;
      const res = await axios.delete(url, config);
      response = res;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

When('la aplicación encuentra su registro', function () {
  // Server-side action, nothing to do client-side
});

Then('la aplicación elimina el registro de la base de datos', function () {
  // Confirmed by status code assertion
});

Then(
  'el mensaje de respuesta del servidor contiene un estado {int}',
  function (expected) {
    assert.strictEqual(statusCode, expected);
  }
);

// Scenario 2: invalid email in path param
Given(
  'pepe no proporsiona un correo electrónico valido en el parámetro de la URL',
  function () {
    userData.email = 'invalid-not-an-email';
  }
);

// Scenario 3: empty email
Given(
  'pepe no proporsiona un correo electrónico en el parámetro de la URL',
  function () {
    userData.email = '';
  }
);

// Scenario 4: different email
Given('pepe ingresa un correo electrónico diferente al suyo', function () {
  userData.email = 'nonexistent-user@fake.com';
});

When('la aplicación no encuentra un registro con ese correo', function () {
  // Server-side logic, nothing to assert here
});

// Scenario 5: no JWT token
Given('pepe no proporsiona un token jwt de autenticación', function () {
  config = {};
});
