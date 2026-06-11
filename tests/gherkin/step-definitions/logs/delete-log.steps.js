const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const { logsUrl } = require('../../support/routes');

let response;
let statusCode;
let logId;

Before(function () {
  response = null;
  statusCode = null;
  logId = null;
});

// Scenario 1: delete existing log
Given('el id existe en la base de datos', async function () {
  // Create a log first so we have a valid ID to delete
  const logBody = {
    Name: 'Temp log for deletion',
    Summary: 'Will be deleted',
    Description: 'Temporary log for delete test',
    Log_date: '2024-04-09 00:00:00',
    Log_type: 'INFO',
    Module: 'CUCUMBER',
  };
  try {
    await axios.post(logsUrl, logBody);
  } catch (error) {
    // ignore creation errors
  }
  // Fetch the list to get a valid ID
  try {
    const listRes = await axios.get(logsUrl);
    if (listRes.data && listRes.data.rows && listRes.data.rows.length > 0) {
      logId = listRes.data.rows[listRes.data.rows.length - 1].id;
    } else if (listRes.data && Array.isArray(listRes.data) && listRes.data.length > 0) {
      logId = listRes.data[listRes.data.length - 1].id;
    } else {
      logId = 1;
    }
  } catch (error) {
    logId = 1;
  }
});

When(
  'el usuario hace una peticion DELETE a \\/api\\/v1\\/logs\\/:id',
  async function () {
    try {
      const url = `${logsUrl}/${logId}`;
      const res = await axios.delete(url);
      response = res.data;
      statusCode = res.status;
    } catch (error) {
      response = error.response ? error.response.data : null;
      statusCode = error.response ? error.response.status : 500;
    }
  }
);

When('el servidor valida que se encuentre el log', function () {
  // Server-side validation
});

Then('el servidor de logs responde con estado {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});

Then('el servidor de logs responde con el log eliminado', function () {
  assert.ok(response, 'Expected the deleted log data in the response');
});

// Scenario 2: no ID provided
Given('el usuario no proporciona un id', function () {
  logId = '';
});

Then('el servidor de logs envia un mensaje', function () {
  assert.ok(response, 'Expected a message from the server');
});

Then('el servidor responde con estado {int}', function (expected) {
  assert.strictEqual(statusCode, expected);
});

// Scenario 3: non-existent ID
Given('el id no existe en la base de datos', function () {
  logId = 99999999;
});

// Scenario 4: invalid ID format
Given('el usuario no proporciona un id valido de logs', function () {
  logId = 'invalid-id';
});
