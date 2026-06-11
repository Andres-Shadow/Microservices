const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { logsUrl } = require('../../support/routes');

let logBody = {
  id: '1',
  Name: 'Test from JS',
  Summary: 'Test made with CucumberJS',
  Description: 'Just a test made with cucumberJS',
  Log_date: '2024-04-09',
  Log_type: 'INFO',
  Module: 'CUCUMBER',
};

let response;
let statusCode;

Before(async function () {
  response = null;
  statusCode = null;

  // Create a log and retrieve its actual ID for the update test
  const createBody = {
    Name: 'Test from JS',
    Summary: 'Test made with CucumberJS',
    Description: 'Just a test made with cucumberJS',
    Log_date: '2024-04-09 00:00:00',
    Log_type: 'INFO',
    Module: 'CUCUMBER',
  };
  try {
    await axios.post(logsUrl, createBody);
  } catch (error) {
    // ignore
  }
  // Fetch list to get a valid ID
  try {
    const listRes = await axios.get(logsUrl);
    if (listRes.data && listRes.data.rows && listRes.data.rows.length > 0) {
      logBody.id = String(listRes.data.rows[listRes.data.rows.length - 1].id);
    } else if (listRes.data && Array.isArray(listRes.data) && listRes.data.length > 0) {
      logBody.id = String(listRes.data[listRes.data.length - 1].id);
    }
  } catch (error) {
    // keep default id
  }

  // Reset to valid log body (keeping the fetched id)
  const validId = logBody.id;
  logBody = {
    id: validId,
    Name: 'Test from JS',
    Summary: 'Test made with CucumberJS',
    Description: 'Just a test made with cucumberJS',
    Log_date: '2024-04-09',
    Log_type: 'INFO',
    Module: 'CUCUMBER',
  };
});

// Scenario 1: valid update
Given(
  'el usuario diligencia de forma correcta en el cuerpo de la peticion la informacion a actualizar',
  function () {
    // Log body is already valid
  }
);

When(
  'el usuario envia la peticion PUT a \\/api\\/v1\\/logs',
  async function () {
    try {
      const res = await axios.put(logsUrl, logBody);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response;
      statusCode = error.response.status;
    }
  }
);

Then(
  'el servidor responde con un codigo de respuesta igual a {int}',
  function (expected) {
    assert.strictEqual(statusCode, expected);
  }
);

Then('el servidor envia un mensaje de respuesta con informacion', function () {
  assert.ok(response, 'Expected a response with information');
});

// Scenario 2: incorrect data
Given(
  'el usuario diligencia de forma incorrecta en el cuerpo de la peticion la informacion a actualizar',
  function () {
    logBody = {
      id: '1',
      Name: 123,
      Summary: 123,
      Description: 123,
      Log_date: 123,
      Log_type: 123,
      Module: 123,
    };
  }
);

// Scenario 3: missing data
Given(
  'el usuario no diligencia la informacion a actualizar en la base de datos de logs',
  function () {
    logBody = {};
  }
);
