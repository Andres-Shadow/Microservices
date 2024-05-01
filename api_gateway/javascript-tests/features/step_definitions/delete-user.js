const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");
const messageSchema = require("../../schemas/message-schema");
const Ajv = require("ajv");
const ajv = new Ajv();

// let baseUrl = "http://localhost:9090/api/v1/users/?email=";
// let loginUrl = "http://localhost:9090/api/v1/login";
// let registerUrl = "http://localhost:9090/api/v1/users/";

let baseUrl = require("../../configuration/routes").userurl;
let loginUrl = require("../../configuration/routes").loginUrl;
let registerUrl = require("../../configuration/routes").userurl;

let response;

let statusCode;

let config = {};

let token;

let userData = {
  username: faker.fakerAR.internet.userName(),
  password: faker.fakerAR.internet.password(),
};

Before(async function () {});

Given(
  "un usario llamado pepe que ya ha pasado por el proceso de registrarse",
  async function () {
    //const timestamp = new Date().getTime();
    //userData.email = userData.username + timestamp + "@gmail.com";
    userData.email = faker.fakerAR.internet.email();
    try {
      respuesta = await axios.post(registerUrl, userData);
      response = respuesta;
    } catch (error) {
      response = error.response;
      return;
    }
  }
);

Given("pepe ya se ha autenticado", async function () {
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
    //console.log(config);
    statusCode = respuesta.status;
  } catch (error) {
    response = error.response;
    statusCode = error.response.status;
  }
});
// scenario 1

Given(
  "pepe proporsiona su correo electrónico en el cuerpo de la petición de eliminado",
  function () {}
);

When("pepe hace una petición DELETE a \\/api\\/v1\\/users", async function () {
  try {
    baseUrl = baseUrl + "?email=" + userData.email;
    respuesta = await axios.delete(baseUrl, config);
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

When("la aplicación encuentra su registro", function () {
  if (response.data) {
    valid = ajv.validate(messageSchema, response);
    assert.ok(valid);
  }
});

Then("la aplicación elimina el registro de la base de datos", function () {
  if (!response.data) {
  }
});

Then(
  "el mensaje de respuesta del servidor contiene un estado {int}",
  function (int) {
    assert.equal(statusCode, int);
  }
);

// scenario 2

Given(
  "pepe no proporsiona un correo electrónico valido en el cuerpo de la peticion",
  function () {
    userData.email = 123456779;
  }
);

// scenario 3

Given(
  "pepe no proporsiona un correo electrónico en el cuerpo de la petición",
  function () {
    userData.email = "";
  }
);

// scenario 4

Given("pepe ingresa un correo electrónico diferente al suyo", function () {
  // Write code here that turns the phrase above into concrete actions
  userData.email = "correosuperdiferenteekisde";
});

When("la aplicación no encuentra un registro con ese correo", function () {
  // Write code here that turns the phrase above into concrete actions
  if (response.data) {
    valid = ajv.validate(messageSchema, response);
    assert.ok(valid);
  }
});

// scenario 5

Given("pepe no proporsiona un token jwt de autenticación", function () {
  // Write code here that turns the phrase above into concrete actions
  config = {};
});
