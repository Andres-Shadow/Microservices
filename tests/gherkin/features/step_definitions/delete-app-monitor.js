const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");

let baseUrl = require("../../configuration/routes").healthServer;
let monitorBody = {
  name: "deleteion",
  endpoint: "http://localhost:9090/api/v1/health",
  frequency: "10",
  email: "miccroservicios@gmail.com",
};
let response;
let statusCode;
Before(async function () {
  try {
    respuesta = await axios.post(baseUrl, monitorBody);
  } catch (e) {}
});

// scenario 1

When("el usuario configura el nombre de la aplicacion en la url", function () {
  // Write code here that turns the phrase above into concrete actions
  //Nothing to do here
});

Given(
  "el usuario hace una peticion delte a \\/api\\/v1\\/health?name",
  async function () {
    // Write code here that turns the phrase above into concrete actions
    try {
      url = baseUrl + "?name=" + monitorBody.name;
      respuesta = await axios.delete(url, monitorBody);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (e) {
      response = e.response;
      statusCode = e.response.status;
    }
  }
);

Then("el servidor procesa la eliminacion", function () {
  // Write code here that turns the phrase above into concrete actions
  //nothing to do here
});

Then("el servidor responde con un mensaje de exitosa", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

// scenario 2

When(
  "el usuario no configura el nombre de la aplicacion en la url",
  function () {
    // Write code here that turns the phrase above into concrete actions
    monitorBody.name = "";
  }
);

Then("el servidor responde con un mensaje de error", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

// scenario 3

Given(
  "el usuario hace una peticion delte a \\/api\\/v1\\/health",
  async function () {
    // Write code here that turns the phrase above into concrete actions
    try {
      respuesta = await axios.post(baseUrl);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (e) {
      response = e.response;
      statusCode = e.response.status;
    }
  }
);

Then("el mensaje tiene un codigo de error {int}", function (int) {
  // Then('el mensaje tiene un codigo de error {float}', function (float) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, int);
});
