const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { faker } = require('@faker-js/faker');
const { loginUrl, usersUrl } = require('../../support/routes');

// Pre-loaded user in the database
let userData = {
  username: 'pepe',
  email: 'a@gmail.com',
  password: '12345',
};

let config;
let response;
let statusCode;
let token;

Before(async function () {
  response = null;
  statusCode = null;
  // Authenticate to get a valid JWT
  try {
    const res = await axios.post(loginUrl, userData);
    token = res.data;
  } catch (error) {
    token = null;
  }
});

Given(
  'un usario llamado pepe registrado en la base de datos que ya se ha autenticado',
  function () {
    // Token is already generated in Before hook
  }
);

Then(
  'pepe proporsiona el token jwt en las cabeceras de las peticiones',
  function () {
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }
);

// Scenario 1: successful update
When(
  'el cuerpo de la petición corresponde a los datos almacenados en la base dedatos',
  function () {
    userData.email = 'a@gmail.com';
  }
);

When('pepe realiza una petición PUT a \\/api\\/v1\\/users', async function () {
  try {
    const res = await axios.put(usersUrl, userData, config);
    response = res;
    statusCode = res.status;
  } catch (error) {
    response = error.response;
    statusCode = error.response ? error.response.status : 500;
  }
});

Then('el servidor actualiza los datos del usuario', function () {
  assert.strictEqual(response.status, 200);
});

Then('el servidor responde con un mensaje de éxito', function () {
  assert.ok(response.data, 'Expected a success message in the response');
});

// Scenario 2: user does not exist
Given(
  'el cuerpo de la petición corresponde a los datos de un usuario que no existe',
  function () {
    userData.email = faker.internet.email();
  }
);

Then('el servidor responde con un json con un mensaje de error', function () {
  assert.ok(response.data, 'Expected an error message in the response');
});

Then('el servidor responde con un código de estado {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});

// Scenario 3: expired token
When('el token jwt ingresado se encuentra vencido', function () {
  token = 'expired-fake-token';
  config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
});
