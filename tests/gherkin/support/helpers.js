/**
 * Shared test helpers for Gherkin E2E tests.
 */
const axios = require('axios');
const { loginUrl } = require('./routes');

/**
 * Authenticate a user and return the JWT token.
 * @param {object} credentials - { email, password }
 * @returns {Promise<string>} JWT token
 */
async function authenticate(credentials) {
  const response = await axios.post(loginUrl, credentials);
  return response.data;
}

/**
 * Build an Authorization header object with a Bearer token.
 * @param {string} token - JWT token
 * @returns {object} headers config for axios
 */
function authHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}

/**
 * Safely execute an axios request, returning { response, status }.
 * Catches HTTP errors and normalizes the result.
 * @param {Function} requestFn - async function that performs the axios call
 * @returns {Promise<{response: object, status: number}>}
 */
async function safeRequest(requestFn) {
  try {
    const res = await requestFn();
    return { response: res, status: res.status };
  } catch (error) {
    if (error.response) {
      return { response: error.response, status: error.response.status };
    }
    throw error;
  }
}

module.exports = { authenticate, authHeaders, safeRequest };
