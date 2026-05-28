const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");

let baseUrl = require("../../configuration/routes").notification;

let response;
let statusCode;
Before(function () {});

Given(
  "el usuario hace una peticion get a la ruta \\/api\\/v1\\/notification",
  async function () {
    // Write code here that turns the phrase above into concrete actions
    try {
      response = await axios.get(baseUrl);
      statusCode = response.status;
    } catch (e) {
      response = e.response;
      statusCode = e.response.status;
    }
  }
);

Then(
  "el servidor responde con un listado de notificaciones registradas",
  function () {
    // Write code here that turns the phrase above into concrete actions
    assert.ok(response);
  }
);

Then("el codigo de respuesta es {int}", function (int) {
  // Then('el codigo de respuesta es {float}', function (float) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, int);
});
