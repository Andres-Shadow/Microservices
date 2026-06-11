const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { faker } = require('@faker-js/faker');
const { profilesUrl } = require('../../support/routes');

let userProfileBody = {
  name: faker.internet.userName(),
  nickname: faker.internet.userName(),
  public_info: '0',
  messaging: 'No message address registered',
  biography: 'No biography added',
  organization: 'No organization added',
  country: 'No country added',
  social_media: 'No social media added',
  email: faker.internet.email(),
};

let response;
let statusCode;

Before(function () {
  response = null;
  statusCode = null;
  // Generate fresh profile data
  userProfileBody = {
    name: faker.internet.userName(),
    nickname: faker.internet.userName(),
    public_info: '0',
    messaging: 'No message address registered',
    biography: 'No biography added',
    organization: 'No organization added',
    country: 'No country added',
    social_media: 'No social media added',
    email: faker.internet.email(),
  };
});

// Scenario 1: complete information provided
Given(
  'el usuario proporsiona de forma completa su informacion el cuerpo de la peticion',
  function () {
    // Profile body is already complete
  }
);

When(
  'el usuario hace una peticion POST a \\/api\\/v1\\/users \\(perfiles\\)',
  async function () {
    try {
      const res = await axios.post(profilesUrl, userProfileBody);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response ? error.response.data : null;
      statusCode = error.response ? error.response.status : 500;
    }
  }
);

Then(
  'el sistema de usuarios responde con el cuerpo del usuario creado',
  function () {
    assert.ok(response, 'Expected the created user profile in the response');
  }
);

Then(
  'el sistema de usuarios responde con el codigo de estado {int}',
  function (expected) {
    assert.strictEqual(statusCode, expected);
  }
);

// Scenario 2: incomplete information
Given(
  'el usuario no proporsiona de forma completa su informacion el cuerpo de la peticion',
  function () {
    userProfileBody = {
      name: faker.internet.userName(),
      nickname: faker.internet.userName(),
      public_info: '0',
      messaging: 'No message address registered',
      biography: 'No biography added',
      organization: 'No organization added',
      country: 'No country added',
      social_media: 'No social media added',
      // Missing email
    };
  }
);

Then('el sistema de usuarios responde con el mensaje de error', function () {
  assert.ok(response, 'Expected an error message');
});

// Scenario 3: email already registered
Given('el correo ya esta registrado', function () {
  userProfileBody.email = 'microservice2@gmail.com';
});

// Scenario 4: erroneous data
Given(
  'el usuario proporsiona de forma erronea su informacion el cuerpo de la peticion',
  function () {
    userProfileBody.email = 12345; // Invalid type
  }
);

// Scenario 5: empty body
Given(
  'el usuario no proporsiona su informacion el cuerpo de la peticion',
  function () {
    userProfileBody = {};
  }
);
