const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const messageSchema = require("../../schemas/message-schema");
const Ajv = require("ajv");
const ajv = new Ajv();

// let baseUrl = "http://localhost:9090/api/v1/users/password/";
let baseUrl = require("../../configuration/routes").passwordUpdateRoute;

let response;

let statusCode;

let token;

let userData = {
  username: "pepe",
  email: "d@gmail.com",
  password: "12345",
};

Given("un usario llamado pepe que ya se ha registrado", function () {
  //Nothing to do here
});

Given("pepe por correo electronico a@gmail.com", function () {
  userData.email = "a@gmail.com";
});

//Scenario 1

When(
  "pepe hace una solicitud a la ruta GET \\/api\\/v1\\/users\\/password\\/?email={string}",
  async function (string) {
    try {
      ruta = baseUrl + "?email=" + string;
      respuesta = await axios.get(ruta);
      response = respuesta;
      token = response.data;
      statusCode = response.status;
    } catch (error) {
      response = error.response;
      statusCode = response.status;
    }
  }
);

Then("si existe un registro con ese correo", function () {
  if (statusCode != 200) {
    return;
  }
});

Then(
  "la aplicación responde con un token jwt valido por {int} minutos",
  function (int) {
    if (!response.data) {
      return;
    } else {
      valid = ajv.validate(messageSchema, response);
      assert.ok(valid);
    }
  }
);

Then("la respuesta tendrá un código {int}", function (int) {
  assert.equal(statusCode, 200);
});

//Scenario 2

When("si no existe un registro con esos datos", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, 404);
});

Then("la aplicación responde con un mensaje de error", function () {
  // Write code here that turns the phrase above into concrete actions
  if (!response.data) {
    return;
  }
});

Then("la respuesta envida tendrá un código {int}", function (int) {
  // Then('la respuesta envida tendrá un código {float}', function (float) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, int);
});

// Scenario 3

When(
  "pepe hace una solicitud a la ruta GET \\/api\\/v1\\/users\\/password\\/",
  async function () {
    try {
      respuesta = await axios.get(baseUrl);
      response = respuesta;
      token = response.data;
      statusCode = response.status;
      //console.log("token generado");
    } catch (error) {
      response = error.response;
      //console.log(error);
    }
  }
);

When("se envía un correo electrónico no valido", function () {
  // Write code here that turns the phrase above into concrete actions
  userData.email = "correo no valido y falso ekis de";
});
