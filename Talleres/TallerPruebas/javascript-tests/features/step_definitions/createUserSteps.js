const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");

let baseURL = "http://localhost:9090/api/v1";

let userData = {
  name: "pepe",
  email: "a@gmail.com",
  password: "1234",
};

let responseBody;

Before(function () {
  // Reset responseBody before each scenario
  responseBody = null;
});

Given(
  "un usuario llamado pepe totalmente nuevo que no se ha registrado en la base de datos de la aplicación",
  async function () {
    // Nothing to do here, as we'll use a clean state for each scenario
  }
);

When(
  "el cliente envia una solicitud POST a {string}",
  async function (endpoint) {
    try {
      const response = await axios.post(baseURL + endpoint, userData);
      responseBody = response.data;
      this.response = response;
    } catch (error) {
      this.response = error.response;
    }
  }
);

Then("el codigo de respuesta debe ser {int}", function (expectedStatusCode) {
  assert.strictEqual(this.response.status, expectedStatusCode);
});

Then(
  "el cuerpo de la respuesta debe contener los detalles del usuario registrado",
  function () {
    assert.deepStrictEqual(this.response.data, userData);
  }
);

Then(
  "el cuerpo de la respuesta debe contener un mensaje de error",
  function () {
    assert.ok(this.response.data.error);
  }
);

When(
  "el cuerpo de la solicitud de creación no contiene los datos requeridos",
  async function () {
    // Modify userData to remove required fields
    delete userData.name;
    delete userData.email;
    delete userData.password;
  }
);

When("el email ya se encuentra registrado", async function () {
  // You can implement this step based on your API's behavior
  // For testing purposes, you can simulate email already exists error
  userData.email = "existing@gmail.com";
});

When(
  "el tipado de los datos ingresados no coincide con el esquema de bases de datos",
  async function () {
    // Modify userData to have incorrect data types
    userData.name = 123; // Should be a string
  }
);
