const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");

let baseUrl = require("../../configuration/routes").notification;

let notification = {
  target: "miccroservicios@gmail.com",
  subject: "test desde postman",
  message: "mensaje de test",
};
let response;
let statusCode;
Before(function () {});

//scenario 1

Given("el usuario define correctamente los campos de la peticion", function () {
  // Write code here that turns the phrase above into concrete actions
  //nothing to do here
});

When(
  "el usuario envia una peticion post a \\/api\\/v1\\/notification",
  async function () {
    // Write code here that turns the phrase above into concrete actions
    try {
      response = await axios.post(baseUrl, notification);
      statusCode = response.status;
    } catch (e) {
      response = e.response;
      statusCode = e.response.status;
    }
  }
);

Then("el sistema envia la notificacion", function () {
  // Write code here that turns the phrase above into concrete actions
  //nothing to do here
});

Then("responde con un codigo de estado {int}", function (int) {
  // Then('responde con un codigo de estado {float}', function (float) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, int);
});

//scenario 2

Given(
  "el usuario define incorrectamente los campos de la peticion",
  function () {
    // Write code here that turns the phrase above into concrete actions
    notification = {
      target: 12345678,
    };
  }
);

Then("el sistema no envia la notificacion", function () {
  // Write code here that turns the phrase above into concrete actions
  //nothing to do here
});
