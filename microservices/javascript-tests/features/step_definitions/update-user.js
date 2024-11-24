const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");
const messageSchema = require("../../schemas/message-schema");
const Ajv = require("ajv");
const ajv = new Ajv();

// let loginUrl = "http://localhost:9090/api/v1/login";
// let baseUrl = "http://localhost:9090/api/v1/users/";

let loginUrl = require("../../configuration/routes").loginUrl;
let baseUrl = require("../../configuration/routes").userurl;

//usuario precargado en la base de datos
let userData = {
  username: "pepe",
  email: "a@gmail.com",
  password: "12345",
};

let config;

let response;

let statusCode;

let token;

Before(async function () {
  try {
    respuesta = await axios.post(loginUrl, userData);
    response = respuesta;
    token = response.data;
    //console.log("token generado");
  } catch (error) {
    response = error.response;
    //console.log(error);
  }
});

Given(
  "un usario llamado pepe registrado en la base de datos que ya se ha autenticado",
  function () {
    // nothing to do here, token is already generated int token world variable
    return;
  }
);

Then(
  "pepe proporsiona el token jwt en las cabeceras de las peticiones",
  function () {
    config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token JWT en el encabezado Authorization
        "Content-Type": "application/json", // Especificar el tipo de contenido como JSON (opcional)
      },
    };
  }
);

When("pepe realiza una petición PUT a \\/api\\/v1\\/users", async function () {
  // Write code here that turns the phrase above into concrete actions

  try {
    respuesta = await axios.put(baseUrl, userData, config);
    response = respuesta;
    statusCode = response.status;
  } catch (error) {
    response = error.response;
    //statusCode = error.response.status;
  }
});

When(
  "el cuerpo de la petición corresponde a los datos almacenados en la base dedatos",
  function () {
    userData.email = "a@gmail.com";
  }
);

Then("el servidor actualiza los datos del usuario", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(response.status, 200);
});

Then("el servidor responde con un mensaje de éxito", function () {
  // Write code here that turns the phrase above into concrete actions
  if (!response.data) {
    console.log("entro aqui");
    return;
  }
});

//scenario 2

Given(
  "el cuerpo de la petición corresponde a los datos de un usuario que no existe",
  function () {
    // const timestamp = new Date().getTime();
    // userData.email = userData.username + timestamp + "@gmail.com";
    userData.email = faker.fakerAR.internet.email();
  }
);

Then("el servidor responde con un json con un mensaje de error", function () {
  // Write code here that turns the phrase above into concrete actions
  if (response.data) {
    valid = ajv.validate(messageSchema, response);
    assert.ok(valid);
  }
});

//scenario 3

When("el token jwt ingresado se encuentra vencido", function () {
  // Write code here that turns the phrase above into concrete actions
  token = "token falso vencido";
});

Then("el servidor responde con un código de estado {int}", function (int) {
  // Then('el servidor responde con un código de estado {float}', function (float) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(response.status, 404);
});
