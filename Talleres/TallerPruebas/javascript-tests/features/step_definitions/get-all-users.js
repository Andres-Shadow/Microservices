const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const messageSchema = require("../../schemas/message-schema");
const userListSchema = require("../../schemas/userlist-schema");
const Ajv = require("ajv");
const ajv = new Ajv();

// let loginUrl = "http://localhost:9090/api/v1/login";
// let baseUrl = "http://localhost:9090/api/v1/users/";

let loginUrl = require("../../configuration/routes").loginUrl;
let baseUrl = require("../../configuration/routes").userurl;

let config2;

let response2;

let statusCode2;

let token2;

let userData = {
  username: "pepe",
  email: "a@gmail.com",
  password: "12345",
};

Before(async function () {
  try {
    respuesta = await axios.post(loginUrl, userData);
    response2 = respuesta;
    token2 = response2.data;
  } catch (error) {
    response2 = error.response;
  }
});

Then("pepe proporsiona el token jwt", function () {
  config2 = {
    headers: {
      Authorization: "Bearer " + token2,
      "Content-Type": "application/json",
    },
  };
});

Given("un usario llamado pepe registrado en la base de datos", function () {
  // Write code here that turns the phrase above into concrete actions
  return;
});

// scenario 1

When(
  "pepe hace un petición get a la ruta \\/api\\/v1\\/users?page={int}&limit={int}",
  async function (int, int2) {
    // Construir la URL con los parámetros de la página y el límite
    const url = baseUrl + `?page=${int}&pageSize=${int2}`;

    try {
      // Realizar la solicitud GET con Axios, incluyendo las cabeceras con el token JWT
      response2 = await axios.get(url, config2);
      statusCode2 = response2.status;
      //console.log(response2.data); // Imprimir la respuesta en la consola
    } catch (error) {
      // Capturar cualquier error en la solicitud y manejarlo
      response2 = error.response;
      statusCode2 = error.response.status;
    }
  }
);

Then(
  "la API le responde con una lista de usuarios registrados en la base de datos con paginación",
  function () {
    // Write code here that turns the phrase above into concrete actions
    if (response2.data) {
      valid = ajv.validate(userListSchema, response2.data);
      assert.ok(valid);
    }
  }
);
Then("la API le responde con un status code {int}", function (int) {
  assert.equal(statusCode2, int);
});

// scenario 2

When(
  "pepe hace una petición get a la ruta \\/api\\/v1\\/users",
  async function () {
    try {
      // Realizar la solicitud GET con Axios, incluyendo las cabeceras con el token JWT
      response2 = await axios.get(baseUrl, {
        headers: {
          Authorization: "Bearer " + token2,
          "Content-Type": "application/json",
        },
      });
      statusCode2 = response2.status;
      //console.log(response2.data); // Imprimir la respuesta en la consola
    } catch (error) {
      // Capturar cualquier error en la solicitud y manejarlo
      response2 = error.response;
      statusCode2 = error.response.status;
    }
  }
);

Then(
  "la aplicación internamente define el tamaño de la paginación a mostrar",
  function () {
    // Nothing to do here, internally in the api server
  }
);

// scenario 3

Given("el token jwt ingresado se encuentra caducado", function () {
  // Write code here that turns the phrase above into concrete actions
  token2 = "token falso caducado";
});
Given("la base de datos se encuentra vacía", function () {
  // Nothing to do here, internally in the api server
});

Then("la API le responde con una lista vacía", function () {
  if (!response2.data) {
    return;
  }
});

// scenario 4

Then("la API le responde con un mensaje de error", function () {
  if (response2.data) {
    valid = ajv.validate(messageSchema, response2);
    assert.ok(valid);
  }
});
