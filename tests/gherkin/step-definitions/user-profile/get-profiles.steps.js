const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { profilesUrl } = require('../../support/routes');

let response;
let statusCode;

Before(function () {
  response = null;
  statusCode = null;
});

// Scenario 1: list profiles with pagination
Given(
  'el usuario hace una peticion get a la url \\/api\\/v1\\/users?page={int}&limit={int} \\(perfiles\\)',
  async function (page, limit) {
    try {
      const url = `${profilesUrl}?page=${page}&limit=${limit}`;
      const res = await axios.get(url);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response ? error.response.data : null;
      statusCode = error.response ? error.response.status : 500;
    }
  }
);

When('el servidor de perfiles recibe la peticion', function () {
  // Server-side action
});

Then('el servidor responde con los registros', function () {
  assert.ok(response, 'Expected profile records in the response');
});

// Scenario 2: list profiles without pagination
Given(
  'el usuario hace una peticion get a la url \\/api\\/v1\\/users \\(perfiles\\)',
  async function () {
    try {
      const res = await axios.get(profilesUrl);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response ? error.response.data : null;
      statusCode = error.response ? error.response.status : 500;
    }
  }
);
