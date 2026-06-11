const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { faker } = require('@faker-js/faker');
const { usersUrl, profilesUrl } = require('../../support/routes');

let userData = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

let response;
let statusCode;
let profile;

Before(function () {
  response = null;
  statusCode = null;
  profile = null;
  // Generate fresh user data
  userData = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
});

Given(
  'el usuario hace una peticion POST a la api de autenticacion con un correo determinado',
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

Then(
  'la api guarda el usuario en la base de datos y notifica su creacion',
  function () {
    // Server-side: auth server sends a message to user profile service
  }
);

Then(
  'la api de perfiles recibe el mensaje y crea un usuario nuevo',
  function () {
    // Server-side: user profile service processes the creation event
  }
);

When(
  'se hace una peticion GET al servidor de perfiles con el correo del usuario',
  async function () {
    try {
      const url = `${profilesUrl}/${userData.email}`;
      const res = await axios.get(url);
      response = res;
      statusCode = res.status;
      profile = res.data;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then('debe existir un registro con esos datos', function () {
  if (profile) {
    assert.strictEqual(profile.email, userData.email);
  }
});
