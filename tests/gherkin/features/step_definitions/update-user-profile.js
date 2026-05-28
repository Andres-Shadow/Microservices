const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");

let baseUrl = require("../../configuration/routes").userProfile;
let userProfileBody = {
  name: faker.fakerAR.internet.userName(),
  nickname: "cucumber test",
  public_info: "0",
  messaging: "No message addres registered",
  biography: "No biography added",
  organization: "No organization added",
  country: "No country added",
  social_media: "No social media added",
  email: "cucumbertest@gmail.com",
};
let response;
let statusCode;
Before(async function () {
  try {
    let respuesta = await axios.post(baseUrl, userProfileBody);
  } catch (error) {}
});

// scenario 1

Given(
  "el usuario diligencia el cuerpo de la peticion a actualizar con su nombre de usuario",
  function () {
    // Write code here that turns the phrase above into concrete actions
    // nothing to do here
  }
);

When(
  "el usuario envía una solicitud put a \\/api\\/v1\\/users",
  async function () {
    let respuesta;
    // Write code here that turns the phrase above into concrete actions
    try {
      respuesta = await axios.put(baseUrl, userProfileBody);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (error) {
      response = error.response.data;
      statusCode = error.response.status;
    }
  }
);

Then("el sistema actualiza la información", function () {
  // Write code here that turns the phrase above into concrete actions
  // nothing to do here
});

Then(
  "el mensaje de respuesta del servidor de perfiles tiene un codigo {int}",
  function (int) {
    // Then('el mensaje de respuesta del servidor de perfiles tiene un codigo {float}', function (float) {
    // Write code here that turns the phrase above into concrete actions
    assert.equal(statusCode, int);
  }
);

// scenario 2

Given(
  "el usuario diligencia el cuerpo de la peticion intentando actualizar su correo electronico",
  function () {
    // Write code here that turns the phrase above into concrete actions
    userProfileBody.email = "cualquiercosa@gmail.com";
  }
);

Then("el servidor de perfiles responde con un mensaje de error", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

// scenario 3

Given(
  "el usuario diligencia el cuerpo de la peticion con un nombre de usuario no registrado en la base de datos",
  function () {
    // Write code here that turns the phrase above into concrete actions
    userProfileBody.nickname = faker.fakerAR.internet.userName();
  }
);
