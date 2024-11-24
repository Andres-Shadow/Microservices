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

// scenario 1

When(
  "el usuario ingresa todos requeridos en la peticion de monitoreo",
  function () {
    // Write code here that turns the phrase above into concrete actions
    //Nothing to do here
  }
);

Given(
  "el usuario realiza una peticion POST a \\/api\\/v1\\/health",
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

Then("el sistema guarda la aplicacion en la base de datos", function () {
  // Write code here that turns the phrase above into concrete actions
  // nothing to do here
});

Then(
  "el mensaje de respuesta contiene un codigo de repuesta {int}",
  function (int) {
    // Then('el mensaje de respuesta contiene un codigo de repuesta {float}', function (float) {
    // Write code here that turns the phrase above into concrete actions
    assert.equal(statusCode, int);
  }
);

Then("el servidor regresa un mensaje de respuesta", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

// scenario 2
When(
  "el usuario no ingresa todos los campos requeridos en la peticion de monitoreo",
  function () {
    // Write code here that turns the phrase above into concrete actions
    monitorBody = {
      name: "users",
      endpoint: "http://localhost:9090/api/v1/health",
      frequency: "10",
    };
  }
);

Then("el sistema no guarda la aplicacion en la base de datos", function () {
  // Write code here that turns the phrase above into concrete actions
  // nothing to do here
});

// scenario 3
When(
  "el usuario ingresa un campo incorrecto en la peticion de monitoreo",
  function () {
    // Write code here that turns the phrase above into concrete actions
    monitorBody = {
      name: "users",
      endpoint: "http://localhost:9090/api/v1/health",
      frequency: "10",
      email: 123,
    };
  }
);
