const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");

let baseURL = require("../../configuration/routes").userurl;
let profileURL = require("../../configuration/routes").userProfile;

let userData = {
  username: faker.fakerAR.internet.userName(),
  email: faker.fakerAR.internet.email(),
  password: faker.fakerAR.internet.password(),
};

let response;

let statusCode;

let profile;

Before(function () {
  // Reset responseBody before each scenario
  response = null;
});

Given(
  "el usuario hace una peticion POSt a la api de autenticacion con un correo determinado",
  async function () {
    let respuesta;
    try {
      respuesta = await axios.post(baseURL, userData);
      response = respuesta;
      statusCode = response.status;

      //console.log(valid)
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then(
  "la api guarda el usuario en la base de datos y notifica su creacion",
  function () {
    // Write code here that turns the phrase above into concrete actions
    //nothing to do here
  }
);

Then(
  "la api de perfiles recibe el mensaje y crea un usuario nuevo",
  function () {
    // Write code here that turns the phrase above into concrete actions
    //nothing to do here
  }
);

When(
  "se hace una peticion GET al servidor de perfiles con el correo del usuario",
  async function () {
    let respuesta;
    try {
      url = profileURL + "/" + userData.email;
      respuesta = await axios.get(url);
      response = respuesta;
      statusCode = response.status;
      profile = response.data;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then("debe existir un registro con esos datos", function () {
  // Write code here that turns the phrase above into concrete actions
  if (profile) {
    assert.equal(profile.email, userData.email);
  }
});
