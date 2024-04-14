const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");

let baseUrl = require("../../configuration/routes").logsManager;

let response;
let statusCode;
Before(function () {});

// scenario 1
Given(
  "El usuario realiza una petición GET a la URL \\/api\\/v1\\/logs\\/",
  async function () {
    try {
      respuesta = await axios.get(baseUrl);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

When("El usuario envía la petición", function () {
  // Write code here that turns the phrase above into concrete actions
});

Then("El sistema responde con un código de estado {int}", function (int) {
  // Then('El sistema responde con un código de estado {float}', function (float) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, int);
});

Then("El sistema responde con una lista de logs", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

// scenario 2

Given(
  "El usuario realiza una petición GET a la URL \\/api\\/v1\\/logs\\/?page={int}&pageSize={int}",
  async function (int, int) {
    try {
      url = baseUrl + `?page=${int}&pageSize=${int}`;
      respuesta = await axios.get(url);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);
