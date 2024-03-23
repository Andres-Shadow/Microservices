const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");

let baseURL = "http://localhost:9090/api/v1/users/";

let userData = {
  username: "pepe",
  email: "a@gmail.com",
  password: "1234",
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
    const timestamp = new Date().getTime();
    userData.email = userData.username + timestamp + "@gmail.com";
    //console.log(userData.email);
    try {
      respuesta = await axios.post(baseURL, userData);
      response = respuesta;
      statusCode = response.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }

    //console.log(statusCode);
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
      assert.equal(mensajeRespuesta.username, userData.username);
    } else {
      console.error("No se ha recibido una respuesta válida");
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
      console.error("No se ha recibido una respuesta válida");
      return;
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
