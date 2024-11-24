const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const messageSchema = require("../../schemas/message-schema");
const Ajv = require("ajv");
const ajv = new Ajv();
//let loginUrl = "http://localhost:9090/api/v1/login";
let loginUrl = require("../../configuration/routes").loginUrl;

//usuario precargado en la base de datos
let userData = {
  username: "pepe",
  email: "a@gmail.com",
  password: "12345",
};


let response;

let statusCode;

Before(async function () {
});

Given(
  ": un usuario ya registrado de forma exitosa en la base de datos de la aplicación",
  function () {
    // Nothing to do here
  }
);

Given("este usuario tiene por nombre pepe", function () {
  userData.username = "pepe";
});

When(
  "invoca el método de autenticación en \\/api\\/v1\\/login",
  async function () {
    try {
      respuesta = await axios.post(loginUrl, userData);
      response = respuesta;
      statusCode = response.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then("se obtiene el mensaje de respuesta {int}", function (int) {
  assert.equal(statusCode, int);
});

Then("se obtiene el token jwt de autenticación", function () {
  if (!response.data) {
    assert.fail("No se obtuvo el token de autenticación");
  }else{
    valid = ajv.validate(messageSchema, response);
    assert.ok(valid)
  }
});

Given("los datos diligenciados no existen en la base de datos", function () {
  // Write code here that turns the phrase above into concrete actions
  userData.username = "pepe-fake-ekis-de";
});
Then("se obtiene el mensaje de error {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  if (!response.data) {
    assert.fail("No se obtuvo el mensaje de error");
  }
});

Given(
  "la contraseña ingresada no coincide con los registrados en la base de datos",
  function () {
    // Write code here that turns the phrase above into concrete actions
    userData.password = "1234-fake-ekis-de";
  }
);
Given(
  "los datos diligenciados no cumplen con el formato esperado",
  function () {
    // Write code here that turns the phrase above into concrete actions
    userData.username = 23464;
  }
);
