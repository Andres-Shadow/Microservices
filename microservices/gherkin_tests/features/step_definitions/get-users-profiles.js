const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");

let baseUrl = require("../../configuration/routes").userProfile;

let response;
let statusCode;
Before(function () {});

// scenario 1

Given(
  "el usuario hace una peticion get a la url \\/api\\/v1\\/users?page={int}&limit={int}",
  async function (int, int2) {
    // Write code here that turns the phrase above into concrete actions
    let respuesta;
    try {
      respuesta = await axios.get(baseUrl + `?page=${int}&limit=${int2}`);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (error) {
      response = error.response.data;
      statusCode = error.response.status;
    }
  }
);

When("el servidor de perfiles recibe la peticion", function () {
  // Write code here that turns the phrase above into concrete actions
  //nothing to do here
});

Then("el servidor responde con los registros", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

// scenario 2

Given(
  "el usuario hace una peticion get a la url \\/api\\/v1\\/users",
  async function () {
    // Write code here that turns the phrase above into concrete actions
    let respuesta;
    try {
      respuesta = await axios.get(baseUrl);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (error) {
      response = error.response.data;
      statusCode = error.response.status;
    }
  }
);
