const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { faker } = require('@faker-js/faker');
const { profilesUrl } = require('../../support/routes');

let userProfileBody = {
  name: faker.internet.userName(),
  nickname: 'cucumber-test',
  public_info: '0',
  messaging: 'No message address registered',
  biography: 'No biography added',
  organization: 'No organization added',
  country: 'No country added',
  social_media: 'No social media added',
  email: 'cucumbertest@gmail.com',
};

let response;
let statusCode;

Before(async function () {
  response = null;
  statusCode = null;
  // Create a profile so we have something to update
  try {
    await axios.post(profilesUrl, userProfileBody);
  } catch (error) {
    // Profile may already exist
  }
});

// Scenario 1: valid update
Given(
  'el usuario diligencia el cuerpo de la peticion a actualizar con su nombre de usuario',
  function () {
    // Profile body is ready
  }
);

When(
  'el usuario envía una solicitud put a \\/api\\/v1\\/users \\(perfiles\\)',
  async function () {
    try {
      const res = await axios.put(profilesUrl, userProfileBody);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response ? error.response.data : null;
      statusCode = error.response ? error.response.status : 500;
    }
  }
);

Then('el sistema actualiza la información', function () {
  // Server-side action
});

Then(
  'el mensaje de respuesta del servidor de perfiles tiene un codigo {int}',
  function (expected) {
    assert.strictEqual(statusCode, expected);
  }
);

// Scenario 2: attempt to update email
Given(
  'el usuario diligencia el cuerpo de la peticion intentando actualizar su correo electronico',
  function () {
    userProfileBody.email = 'changed-email@gmail.com';
  }
);

Then('el servidor de perfiles responde con un mensaje de error', function () {
  assert.ok(response, 'Expected an error message');
});

// Scenario 3: unregistered username
Given(
  'el usuario diligencia el cuerpo de la peticion con un nombre de usuario no registrado en la base de datos',
  function () {
    userProfileBody.nickname = faker.internet.userName();
  }
);
