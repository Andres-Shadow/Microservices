const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");

let baseUrl = require("../../configuration/routes").healthServer;
let monitorBody = {
  name: "users",
  endpoint: "http://localhost:9090/api/v1/health",
  frequency: "10",
  email: "miccroservicios@gmail.com",
};
let response;
let statusCode;
Before(function () {});

// scneario 1

Given(
  "El usuario ingresa correctamente el cuerpo de la aplicacion a actualizar",
  function () {
    // Write code here that turns the phrase above into concrete actions
    //nothing to do here
  }
);

When(
  "El usuario hace una peticion PUT a \\/api\\/v1\\/health",
  async function () {
    // Write code here that turns the phrase above into concrete actions
    try {
      respuesta = await axios.post(baseUrl, monitorBody);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (e) {
      response = e.response;
      statusCode = e.response.status;
    }
  }
);

Then("el servidor encuentra la aplicacion y actualiza sus datos", function () {
  // Write code here that turns the phrase above into concrete actions
});

Then("el servidor responde con un mensaje", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

Then("el mensaje del servidor monitor tiene un codigo {int}", function (int) {
  // Then('el mensaje del servidor monitor tiene un codigo {float}', function (float) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, int);
});

// scenario 2

Given(
  "El usuario no ingresa correctamente el cuerpo de la aplicacion a actualizar",
  function () {
    // Write code here that turns the phrase above into concrete actions
    monitorBody.email = 1234456;
  }
);

Then(
  "el servidor no encuentra la aplicacion y no actualiza sus datos",
  function () {
    // Write code here that turns the phrase above into concrete actions
    //nothing to do here
  }
);

// scenario 3

Given(
  "El usuario no ingresa el cuerpo de la aplicacion a actualizar",
  function () {
    // Write code here that turns the phrase above into concrete actions
    monitorBody = {};
  }
);
