const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");

let baseUrl = require("../../configuration/routes").userProfile;
let userProfileBody = {
  name: faker.fakerAR.internet.userName(),
  nickname: faker.fakerAR.internet.userName(),
  public_info: "0",
  messaging: "No message addres registered",
  biography: "No biography added",
  organization: "No organization added",
  country: "No country added",
  social_media: "No social media added",
  email: faker.fakerAR.internet.email(),
};
let response;
let statusCode;
Before(function () {});

// scenario 1

Given(
  "el usuario proporsiona de forma completa su informacion el cuerpo de la peticion",
  function () {
    // Write code here that turns the phrase above into concrete actions
    // nothing to do here
  }
);

When(
  "el usuario hace una peticion POST a \\/api\\/v1\\/users",
  async function () {
    let respuesta;
    // Write code here that turns the phrase above into concrete actions
    try {
      respuesta = await axios.post(baseUrl, userProfileBody);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (error) {
      response = error.response.data;
      statusCode = error.response.status;
    }
  }
);

Then(
  "el sistema de usuarios responde con el cuerpo del usuario creado",
  function () {
    // Write code here that turns the phrase above into concrete actions
    assert.ok(response);
  }
);

Then(
  "el sistema de usuarios responde con el codigo de estado {int}",
  function (int) {
    // Then('el sistema de usuarios responde con el codigo de estado {float}', function (float) {
    // Write code here that turns the phrase above into concrete actions
    assert.equal(statusCode, int);
  }
);

// sceneario 2

Given(
  "el usuario no proporsiona de forma completa su informacion el cuerpo de la peticion",
  function () {
    // Write code here that turns the phrase above into concrete actions
    userProfileBody = {
      name: faker.fakerAR.internet.userName(),
      nickname: faker.fakerAR.internet.userName(),
      public_info: "0",
      messaging: "No message addres registered",
      biography: "No biography added",
      organization: "No organization added",
      country: "No country added",
      social_media: "No social media added",
    };
  }
);

Then("el sistema de usuarios responde con el mensaje de error", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

// scenario 3

Given("el correo ya esta registrado", function () {
  // Write code here that turns the phrase above into concrete actions
  userProfileBody.email = "microservice2@gmail.com";
});

// scenario 4
Given(
  "el usuario proporsiona de forma erronea su informacion el cuerpo de la peticion",
  function () {
    // Write code here that turns the phrase above into concrete actions
    userProfileBody.email = 12345;
  }
);

// scenario 5

Given(
  "el usuario no proporsiona su informacion el cuerpo de la peticion",
  function () {
    // Write code here that turns the phrase above into concrete actions
    userProfileBody = {};
  }
);
