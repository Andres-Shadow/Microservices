const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const faker = require("@faker-js/faker");
const { getLastLogId } = require("../../logic/database");

let baseUrl = require("../../configuration/routes").logsManager;

let response;
let statusCode;
let log_id;
Before(function () {});

Given("el id existe en la base de datos", async function () {
  try {
    const count = await new Promise((resolve, reject) => {
      getLastLogId((error, count) => {
        if (error) {
          console.error("Error:", error);
          reject(error);
        } else {
          // console.log("count", count);
          resolve(count);
        }
      });
    });

    // Ahora puedes acceder a log_id fuera de la función de devolución de llamada
    log_id = count;
    // console.log("log_id", log_id);
  } catch (error) {
    console.error("Error:", error);
  }
});

Given(
  "el usuario hace una peticion delete a \\/api\\/v1\\/logs\\/?id",
  async function () {
    try {
      url = baseUrl + "?id=" + log_id;
      respuesta = await axios.delete(url);
      response = respuesta.data;
      statusCode = respuesta.status;
      // console.log("url", url);
      // console.log("response", response);
    } catch (error) {
      response = error.response.data;
      statusCode = error.response.status;
    }
  }
);

When("el usuario envia la peticion", function () {
  // Write code here that turns the phrase above into concrete actions
  //nothing to do here
});

When("el servidor valida que se encuentre el log", function () {
  // Write code here that turns the phrase above into concrete actions
  //nothing to do here
});

Then("el servidor de logs responde con estado {int}", function (int) {
  // Then('el servidor de logs responde con estado {float}', function (float) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, int);
});

Then("el servidor de logs responde con el log eliminado", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

// scenario 2

When(
  "el usuario hace una peticion delete a \\/api\\/v1\\/logs\\/",
  async function () {
    try {
      respuesta = await axios.delete(baseUrl);
      response = respuesta.data;
      statusCode = respuesta.status;
    } catch (error) {
      response = error.response.data;
      statusCode = error.response.status;
    }
  }
);

Given("el usuario no proporciona un id", function () {
  // Write code here that turns the phrase above into concrete actions
  log_id = 0;
});

Then("el servidor de logs envia un mensaje", function () {
  // Write code here that turns the phrase above into concrete actions
  assert.ok(response);
});

Then("el servidor responde con estado {int}", function (int) {
  // Then('el servidor responde con estado {float}', function (float) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(statusCode, int);
});

// scenario 3

Given("el id no existe en la base de datos", function () {
  // Write code here that turns the phrase above into concrete actions
  log_id = 10000000000000;
});

// scenario 4

Given("el usuario no proporciona un id valido de logs", function () {
  // Write code here that turns the phrase above into concrete actions
  log_id = "hola";
});
