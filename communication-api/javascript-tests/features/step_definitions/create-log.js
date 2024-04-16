const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");

let baseUrl = require("../../configuration/routes").logsManager;
let logBody = {
  Name: "Test from JS",
  Summary: "Test made with CucumberJS",
  Description: "Just a test made with cucumberJS",
  Log_date: "2024-04-09 00:00:00",
  Log_type: "INFO",
  Module: "CUCUMBER",
};
let response;
let statusCode;
Before(function () {});

Given(
  "el usuario diligencia en el cuerpo de la petición de forma correcta los campos",
  function () {
    // nothing to do here
  }
);

When("se hace una petición post a \\/api\\/v1\\/logs\\/", async function () {
  try {
    respuesta = await axios.post(baseUrl, logBody);
    response = respuesta.data;
    statusCode = respuesta.status;
  } catch (error) {
    response = error.response;
    statusCode = error.response.status;
  }
});

Then("se debe retornar un status code {int}", function (int) {
  // Then('se debe retornar un status code {float}', function (float) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, int);
});

Then("el servidor envia un mensaje de respuesta", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

// scenario 2
Given(
  "el usuario no diligencia en el cuerpo de la petición de forma correcta los campos",
  function () {
    // Write code here that turns the phrase above into concrete actions
    logBody = {};
  }
);

// scenario 3
Given(
  "el usuario diligencia en el cuerpo con un tipo de dato diferente a los permitidos",
  function () {
    logBody = {
      Name: 123,
      Summary: 123,
      Description: 123,
      Log_date: 123,
      Log_type: 123,
      Module: 123,
    };
  }
);
