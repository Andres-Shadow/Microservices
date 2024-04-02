const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");
const messageSchema = require("../../schemas/message-schema");
const Ajv = require("ajv");
const ajv = new Ajv();

//  let baseUrl = "http://localhost:9090/api/v1/users/password";
// let loginUrl = "http://localhost:9090/api/v1/login";
// let registerUrl = "http://localhost:9090/api/v1/users/";

let baseUrl = require("../../configuration/routes").passwordRoute;
let loginUrl = require("../../configuration/routes").loginUrl;
let registerUrl = require("../../configuration/routes").userurl;

let response;

let statusCode;

let config = {};

let token;

let userData = {
  username: faker.fakerAR.internet.userName(),
  email: faker.fakerAR.internet.email(),
  password: faker.fakerAR.internet.password(),
};

Before(async function () {
  //primero lo creamos
  // const timestamp = new Date().getTime();
  // userData.email = userData.username + timestamp + "@gmail.com";
  userData.email = faker.fakerAR.internet.email();

  try {
    respuesta = await axios.post(registerUrl, userData);
    response = respuesta;
  } catch (error) {
    response = error.response;
    return;
  }

  try {
    respuesta = await axios.post(loginUrl, userData);
    response = respuesta;
    token = response.data;
    config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token JWT en el encabezado Authorization
        "Content-Type": "application/json", // Especificar el tipo de contenido como JSON (opcional)
      },
    };
    statusCode = respuesta.status;
  } catch (error) {
    response = error.response;
    statusCode = error.response.status;
  }
});

Given("un usario llamado pepe que ya ha realizado el registro", function () {
  // Write code here that turns the phrase above into concrete actions
  //Nothing to do here
});

Given("pepe quiere actualizar su contraseña a {int}", function (int) {
  // Given('pepe quiere actualizar su contraseña a {float}', function (float) {
  userData.password = int;
});

//scenario 1

Given("pepe diligencia su correo en el cuerpo de la petición", function () {
  // Write code here that turns the phrase above into concrete actions
  // Nothing to do here
});

When(
  "pepe hace una solicitud a la ruta PATCH \\/api\\/v1\\/users\\/password",
  async function () {
    try {
      respuesta = await axios.patch(baseUrl, userData, config);
      response = respuesta;
      statusCode = respuesta.status;
      // assert.equal(mensajeRespuesta.username, userData.username);
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then("la aplicación lo busca en la base de datos", function () {
  // Write code here that turns the phrase above into concrete actions
  //Nothing to do here
});

Then(
  "si existe un registro con esos dados actauliza la contraseña",
  function () {
    // Write code here that turns the phrase above into concrete actions
    //Nothing to do here
  }
);

Then("el servidor retorna un codigo de estado {int}", function (int) {
  valid = ajv.validate(messageSchema, response);
  assert.strictEqual(valid, true);
  // if (int == 200) {
  //   console.log(response);
  // }
  assert.equal(statusCode, int);
});

// scenario 2

Given(
  "pepe diligencia un correo que no está registrado en la base de datos",
  function () {
    userData.email = faker.fakerAR.internet.email();
  }
);

Then("la aplicación busca su registro en la base de datos", function () {});

Then("si no existe un registro con esos dados", function () {});

// scenario 3

When("pepe no proporsiona el token de verificación jwt", function () {
  config = {};
});
