const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { usersUrl, loginUrl } = require('../../support/routes');

const passwordRecoverUrl = `${usersUrl}/password`;

let response;
let statusCode;
let token;
let config = {};

let userData = {
  username: 'pepe',
  email: 'a@gmail.com',
  password: '12345',
};

Before(async function () {
  response = null;
  statusCode = null;
  // Authenticate to get a valid JWT (the /password endpoint is behind auth-protected route)
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

Given('un usario llamado pepe que ya se ha registrado', function () {
  // User is pre-seeded in the database
});

Given('pepe por correo electronico a@gmail.com', function () {
  userData.email = 'a@gmail.com';
});

// Scenario 1: valid email recovery
When(
  'pepe hace una solicitud a la ruta GET \\/api\\/v1\\/users\\/password\\/?email={string}',
  async function (email) {
    try {
      const cleanEmail = email.replace(/"/g, '');
      const url = `${passwordRecoverUrl}?email=${cleanEmail}`;
      const res = await axios.get(url);
      response = res;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then('si existe un registro con ese correo', function () {
  if (statusCode !== 200) {
    return; // Not found, will be asserted later
  }
});

Then(
  'la aplicación responde con un token jwt valido por {int} minutos',
  function (minutes) {
    assert.ok(response.data.token, 'Expected a JWT token in the response');
  }
);

Then('la respuesta tendrá un código {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});

// Scenario 2: email not found
When('si no existe un registro con esos datos', function () {
  // Status will be asserted in the Then step
});

Then('la aplicación responde con un mensaje de error', function () {
  assert.ok(response, 'Expected an error response');
});

Then('la respuesta envida tendrá un código {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});

// Scenario 3: no email provided
When(
  'pepe hace una solicitud a la ruta GET \\/api\\/v1\\/users\\/password\\/',
  async function () {
    try {
      const res = await axios.get(passwordRecoverUrl);
      response = res;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

When('se envía un correo electrónico no valido', function () {
  // The request was already sent without a valid email
});
