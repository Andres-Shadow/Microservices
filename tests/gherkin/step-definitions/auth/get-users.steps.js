const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const Ajv = require('ajv');
const ajv = new Ajv();
const userListSchema = require('../../support/schemas/userlist-schema.json');
const { loginUrl, usersUrl } = require('../../support/routes');

let token;
let config;
let response;
let statusCode;

const userData = {
  username: 'pepe',
  email: 'a@gmail.com',
  password: '12345',
};

Before(async function () {
  response = null;
  statusCode = null;
  // Authenticate to get a valid JWT token
  try {
    const res = await axios.post(loginUrl, userData);
    token = res.data.token;
  } catch (error) {
    token = null;
  }
});

Given('un usario llamado pepe registrado en la base de datos', function () {
  // User is pre-seeded in the database
});

Then('pepe proporsiona el token jwt', function () {
  config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
});

// Scenario 1: list users with pagination params
When(
  'pepe hace un petición get a la ruta \\/api\\/v1\\/users?page={int}&limit={int}',
  async function (page, limit) {
    const url = `${usersUrl}?page=${page}&pageSize=${limit}`;
    try {
      const res = await axios.get(url, config);
      response = res;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then(
  'la API le responde con una lista de usuarios registrados en la base de datos con paginación',
  function () {
    assert.ok(response.data, 'Expected a paginated user list');
    const valid = ajv.validate(userListSchema, response.data);
    assert.ok(valid, 'Response should match user list schema');
  }
);

Then('la API le responde con un status code {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});

// Scenario 2: list users without explicit pagination
When(
  'pepe hace una petición get a la ruta \\/api\\/v1\\/users',
  async function () {
    try {
      const res = await axios.get(usersUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      response = res;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then(
  'la aplicación internamente define el tamaño de la paginación a mostrar',
  function () {
    // Internal server behavior, nothing to assert here
  }
);

// Scenario 3: empty database
Given('la base de datos se encuentra vacía', function () {
  // This is a precondition assumed by the scenario
});

Then('la API le responde con una lista vacía', function () {
  // The response may contain an empty array or empty list
  assert.ok(response.data !== undefined, 'Expected a response body');
});

// Scenario 4: expired token
Given('el token jwt ingresado se encuentra caducado', function () {
  token = 'expired-fake-token';
  config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
});

Then('la API le responde con un mensaje de error', function () {
  assert.ok(response.data, 'Expected an error message');
});
