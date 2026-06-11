const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { faker } = require('@faker-js/faker');
const Ajv = require('ajv');
const ajv = new Ajv();
const userSchema = require('../../support/schemas/user-schema.json');
const messageSchema = require('../../support/schemas/message-schema.json');
const { usersUrl } = require('../../support/routes');

let userData = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

let response;
let statusCode;

Before(function () {
  response = null;
  statusCode = null;
  // Generate fresh random user data for each scenario
  userData = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
});

// Background
Given(
  'un usario llamado pepe totalmente nuevo que no se ha registrado en la base de datos de la aplicación',
  function () {
    // Nothing to do - user data is fresh from Before hook
  }
);

Given('pepe ingresa los siguientes datos:', function (dataTable) {
  const rows = dataTable.raw();
  // Row 0 is headers, row 1 is data
  // We keep the faker-generated data to avoid collisions
});

// Scenario 1: successful registration
When(
  'el cliente envia una solicitud POST a \\/api\\/v1\\/users',
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

Then('el codigo de respuesta debe ser {int}', function (expectedStatus) {
  assert.strictEqual(statusCode, expectedStatus);
});

Then(
  'el cuerpo de la respuesta debe contener los detalles del usuario registrado',
  function () {
    assert.ok(response.data, 'Response body should contain user details');
    const valid = ajv.validate(userSchema, response.data);
    assert.strictEqual(valid, true, 'Response should match user schema');
  }
);

// Scenario 2: missing required fields
Given(
  'el cuerpo de la solicitud de creación no contiene los datos requeridos',
  function () {
    userData = {};
  }
);

Then(
  'el cuerpo de la respuesta debe contener un mensaje de error',
  function () {
    assert.ok(response.data, 'Response should contain an error message');
  }
);

// Scenario 3: duplicate email
Given(
  'en el cuerpo de la solicitud se ingresa un email ya registrado',
  function () {
    userData.email = 'a@gmail.com'; // Already registered in DB
  }
);

// Scenario 4: invalid data types
Given(
  'se crea un cuerpo de solicitud con datos que no coindicen con el esquema de la base de datos',
  function () {
    userData.username = 123; // Invalid type
  }
);
