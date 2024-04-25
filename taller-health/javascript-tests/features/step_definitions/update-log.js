const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");

let baseUrl = require("../../configuration/routes").logsManager;
let logBody = {
  id: "1",
  Name: "Test from JS",
  Summary: "Test made with CucumberJS",
  Description: "Just a test made with cucumberJS",
  Log_date: "2024-04-09",
  Log_type: "INFO",
  Module: "CUCUMBER",
};
let response;
let statusCode;
Before(function () {});

// scenario 1

Given(
  "el usuario diligencia de forma correcta en el cuerpo de la peticion la informacion a actualizar",
  function () {
    //nothing to do here
  }
);

When(
  "el usuario envia la peticion PUT a \\/api\\/v1\\/logs\\/",
  async function () {
    try {
      respuesta = await axios.put(baseUrl, logBody);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then(
  "el servidor responde con un codigo de respuesta igual a {int}",
  function (int) {
    // Write code here that turns the phrase above into concrete actions
    assert.equal(statusCode, int);
  }
);

Then("el servidor envia un mensaje de respuesta con informacion", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

// scenario 2

Given(
  "el usuario diligencia de forma incorrecta en el cuerpo de la peticion la informacion a actualizar",
  function () {
    // Write code here that turns the phrase above into concrete actions
    logBody = {
      Id: "1",
      Name: 123,
      Summary: 123,
      Description: 123,
      Log_date: 123,
      Log_type: 123,
      Module: 123,
    };
  }
);

// scenario 3

Given(
  "el usuario no diligencia la informacion a actualizar en la base de datos de logs",
  function () {
    // Write code here that turns the phrase above into concrete actions
    logBody = {};
  }
);
