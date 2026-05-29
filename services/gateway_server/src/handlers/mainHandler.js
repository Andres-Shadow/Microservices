const axios = require('axios');
const jwt   = require('jsonwebtoken');

const {
  loginUrl,
  userurl,
  userProfile,
  passwordRoute,
  passwordUpdateRoute,
} = require('../configuracion/routesConfiguration');
const nats = require('../services/communicationService');

// JWT_SECRET debe coincidir con el del auth_server
const JWT_SECRET = process.env.JWT_SECRET || 'changeme_set_JWT_SECRET_env_var';

class MainHandler {

  // ── helpers ────────────────────────────────────────────────────────────────

  static verifyJwt(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }

  // ── handlers ───────────────────────────────────────────────────────────────

  static async getUsers(request, reply) {
    const authHeader = request.headers.authorization;
    if (!MainHandler.verifyJwt(authHeader)) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    try {
      const response = await axios.get(userurl, { headers: { Authorization: authHeader } });
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('getUsers error:', error.message);
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  static async userLogin(request, reply) {
    const usuario = request.body;
    try {
      const respuesta = await axios.post(loginUrl, usuario);
      nats.sendLogToNats(usuario.username, 'User logged in', `User ${usuario.username} logged in`, 'INFO');
      reply.code(200).send({ message: respuesta.data });
    } catch (error) {
      nats.sendLogToNats(usuario.username || 'unknown', 'Login failed', `Login attempt failed`, 'ERROR');
      console.error('userLogin error:', error.message);
      reply.code(400).send({ message: error.response?.data || 'Bad Request' });
    }
  }

  static async userRegister(request, reply) {
    const usuario = request.body;
    try {
      const respuesta = await axios.post(userurl, usuario);
      nats.sendLogToNats(usuario.username, 'User registered', `User ${usuario.username} registered`, 'CREATION');
      reply.code(201).send({ message: respuesta.data });
    } catch (error) {
      nats.sendLogToNats(usuario.username || 'unknown', 'Register failed', `Registration attempt failed`, 'ERROR');
      console.error('userRegister error:', error.message);
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  static async deleteUser(request, reply) {
    const authHeader = request.headers.authorization;
    if (!MainHandler.verifyJwt(authHeader)) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const email = request.body?.email;
    try {
      const response = await axios.delete(`${userurl}?email=${email}`, {
        headers: { Authorization: authHeader },
      });
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('deleteUser error:', error.message);
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  static async getUserInfo(request, reply) {
    const authHeader = request.headers.authorization;
    if (!MainHandler.verifyJwt(authHeader)) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const email = request.params.email;
    try {
      const [authRes, profileRes] = await Promise.all([
        axios.get(`${userurl}${email}`, { headers: { Authorization: authHeader } }),
        axios.get(`${userProfile}/${email}`),
      ]);
      // fullResponse declarado dentro del try — bug original corregido
      const fullResponse = { ...authRes.data, ...profileRes.data };
      reply.code(200).send(fullResponse);
    } catch (error) {
      console.error('getUserInfo error:', error.message);
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  static async updateUserInformation(request, reply) {
    const authHeader = request.headers.authorization;
    if (!MainHandler.verifyJwt(authHeader)) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const newData = request.body;
    const email   = request.params.email;

    try {
      if (newData.password) {
        await axios.put(`${userurl}?oldEmail=${email}`, newData, {
          headers: { Authorization: authHeader },
        });
      } else {
        await axios.put(userProfile, newData);
      }
      reply.code(200).send({ message: 'User updated successfully' });
    } catch (error) {
      console.error('updateUserInformation error:', error.message);
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  static async updateUserPassword(request, reply) {
    const authHeader = request.headers.authorization;
    if (!MainHandler.verifyJwt(authHeader)) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const body = request.body;
    try {
      const respuesta = await axios.patch(passwordRoute, body, {
        headers: { Authorization: authHeader },
      });
      reply.code(200).send({ message: respuesta.data });
    } catch (error) {
      console.error('updateUserPassword error:', error.message);
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }

  static async recoverPassword(request, reply) {
    const email = request.query.email;
    try {
      const respuesta = await axios.get(`${passwordUpdateRoute}?email=${email}`);
      reply.code(200).send({ message: respuesta.data });
    } catch (error) {
      console.error('recoverPassword error:', error.message);
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }
}

module.exports = MainHandler;
