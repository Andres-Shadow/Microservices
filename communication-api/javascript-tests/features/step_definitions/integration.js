const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");
const userSchema = require("../../schemas/user-schema");
const messageSchema = require("../../schemas/message-schema");
const Ajv = require("ajv");
const ajv = new Ajv();

//let baseURL = "http://localhost:9090/api/v1/users/";
let baseURL = require("../../configuration/routes").userurl;
let logsUrl = require("../../configuration/routes").logsManager;

let userData = {
  username: faker.fakerAR.internet.userName(),
  email: faker.fakerAR.internet.email(),
  password: faker.fakerAR.internet.password(),
};

let response;

let statusCode;

let responseLogs;
let statusLogs;

Before(function () {});

Given("El usuario se registra en la aplicación de usuarios", async function () {
  // Write code here that turns the phrase above into concrete actions
  let respuesta;
  // const timestamp = new Date().getTime();
  // userData.email = userData.username + timestamp + "@gmail.com";
  //console.log(userData.email);
  try {
    respuesta = await axios.post(baseURL, userData);
    response = respuesta;
    statusCode = response.status;

    //console.log(valid)
  } catch (error) {
    response = error.response;
    statusCode = error.response.status;
  }
});

Given("Si el registro es exitoso", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, 200);
});

Then(
  "el servidor de usuario genera un log con su correo electronico y asociado al evento de creacion",
  function () {
    // Write code here that turns the phrase above into concrete actions
    //Nothing to do here
  }
);

Then(
  "el usuario realiza una peticion get con ese correo al servidor de logs",
  async function () {
    let respuesta;
    try {
      url = logsUrl + userData.email;
      respuesta = await axios.get(url);
      responseLogs = respuesta;
      statusLogs = respuesta.status;

      //console.log(valid)
    } catch (error) {
      responseLogs = error.response;
      statusLogs = error.response.status;
    }
  }
);

Then("si existe un log asociado a este correo", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, 200);
});

Then("el servidor de logs responde con el log asociado", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response.data);
});

Then("el mensaje de respuesta tiene un {int}", function (int) {
  // Then('el mensaje de respuesta tiene un {float}', function (float) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, 200);
});
