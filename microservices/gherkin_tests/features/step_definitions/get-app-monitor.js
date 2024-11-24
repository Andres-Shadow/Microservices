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
Given(
  "el usuario hace una peticio get a \\/api\\/v1\\/health",
  async function () {
    // Write code here that turns the phrase above into concrete actions
    try {
      respuesta = await axios.get(baseUrl);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (e) {
      console.log("Error:", e);
      response = e.response;
      statusCode = e.response.status;
    }
  }
);

Then(
  "el servidor evalua la salud de las aplicaciones registradas",
  function () {
    // Write code here that turns the phrase above into concrete actions
    // nothing to do here
  }
);

Then(
  "el servidor responde con un json con el estado de salud de las aplicaciones registradas",
  function () {
    // Write code here that turns the phrase above into concrete actions
    assert.ok(response);
  }
);

// scenario 2

Then("no hay aplicaciones registradas", function () {
  // Write code here that turns the phrase above into concrete actions
  //nothing to do here
});

Then("el servidor responde con un json vacio", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});
