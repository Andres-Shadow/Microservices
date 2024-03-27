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

let userData = {
  username: faker.fakerAR.internet.userName(),
  email: faker.fakerAR.internet.email(),
  password: faker.fakerAR.internet.password(),
};

let response;

let statusCode;

Before(function () {
  // Reset responseBody before each scenario
  response = null;
});

//background 1

Given(
  "un usario llamado pepe totalmente nuevo que no se ha registrado en la base de datos de la aplicación",
  function () {}
  //nothing to do here
);

Given("pepe ingresa los siguientes datos:", function (dataTable) {
  // Obtener los datos de la tabla
  const data = dataTable.raw();

  // Acceder a los valores de la tabla
  const name = data[1][0]; // El nombre estará en la primera columna de la segunda fila
  const email = data[1][1]; // El correo electrónico estará en la segunda columna de la segunda fila
  const password = data[1][2]; // La contraseña estará en la tercera columna de la segunda fila

  // Puedes retornar algo si es necesario, de lo contrario, puedes omitir el retorno o retornar una promesa
  return Promise.resolve(); // Resolución de una promesa vacía para indicar que la ejecución del paso ha finalizado
});

//scenario 1

When(
  "el cliente envia una solicitud POST a \\/api\\/v1\\/users",
  async function () {
    let respuesta;
    // const timestamp = new Date().getTime();
    // userData.email = userData.username + timestamp + "@gmail.com";
    userData.email = faker.fakerAR.internet.email();
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

    //console.log(statusCode);

    // Validar el objeto de datos contra el esquema

    // Verificar si la validación fue exitosa
    // if (!valid) {
    //   console.log("Errores de validación:", ajv.errors);
    //   throw new Error("El objeto de datos no coincide con el esquema.");
    // }
  }
);

Then("el codigo de respuesta debe ser {int}", function (estadoEsperado) {
  assert.strictEqual(statusCode, estadoEsperado);
});

//scenario 2

Then(
  "el cuerpo de la respuesta debe contener los detalles del usuario registrado",
  function () {
    // Verificar si la respuesta ha sido almacenada correctamente
    if (response && response.data) {
      // Acceder al cuerpo de la respuesta utilizando la propiedad data
      const mensajeRespuesta = response.data;
      // assert.equal(mensajeRespuesta.username, userData.username);
      valid = ajv.validate(userSchema, mensajeRespuesta);
      assert.strictEqual(valid, true);
    }
  }
);

Given(
  "el cuerpo de la solicitud de creación no contiene los datos requeridos",
  function () {
    userData = {};
  }
);

Then(
  "el cuerpo de la respuesta debe contener un mensaje de error",
  function () {
    if (!response && !response.data) {
      // console.error("No se ha recibido una respuesta válida");
      // return;
      const mensajeRespuesta = response.data;
      // assert.equal(mensajeRespuesta.username, userData.username);
      valid = ajv.validate(messageSchema, mensajeRespuesta);
      assert.strictEqual(valid, true);
    }
  }
);

Given(
  "en el cuerpo de la solicitud se ingresa un email ya registrado",
  function () {
    userData.email = "b@gmail.com";
  }
);

Given(
  "se crea un cuerpo de solicitud con datos que no coindicen con el esquema de la base de datos",
  function () {
    userData.username = 123;
  }
);
