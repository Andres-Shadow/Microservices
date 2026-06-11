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

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_set_JWT_SECRET_env_var';

class MainHandler {

  static verifyJwt(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }

  static async getUsers(request, reply) {
    const authHeader = request.headers.authorization;
    if (!MainHandler.verifyJwt(authHeader)) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    try {
      const response = await axios.get(userurl, { headers: { Authorization: authHeader } });
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('getUsers error:', error.message);
      reply.code(500).send({ error: 'Internal server error' });
    }
  }

  static async userLogin(request, reply) {
    const body = request.body;
    try {
      const response = await axios.post(loginUrl, body);
      nats.sendLogToNats(body.username, 'Login successful', `User ${body.username} logged in via gateway`, 'INFO');
      reply.code(200).send(response.data);
    } catch (error) {
      nats.sendLogToNats(body.username || 'unknown', 'Login failed', 'Login attempt failed via gateway', 'ERROR');
      console.error('userLogin error:', error.message);
      reply.code(error.response?.status || 400).send(error.response?.data || { error: 'Bad request' });
    }
  }

  static async userRegister(request, reply) {
    const body = request.body;
    try {
      const response = await axios.post(userurl, body);
      nats.sendLogToNats(body.username, 'User registered', `User ${body.username} registered via gateway`, 'CREATION');
      reply.code(201).send(response.data);
    } catch (error) {
      nats.sendLogToNats(body.username || 'unknown', 'Registration failed', 'Registration attempt failed via gateway', 'ERROR');
      console.error('userRegister error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async deleteUser(request, reply) {
    const authHeader = request.headers.authorization;
    if (!MainHandler.verifyJwt(authHeader)) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    const email = request.params.email;
    try {
      const response = await axios.delete(`${userurl}${email}`, {
        headers: { Authorization: authHeader },
      });
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('deleteUser error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async getUserInfo(request, reply) {
    const authHeader = request.headers.authorization;
    if (!MainHandler.verifyJwt(authHeader)) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    const email = request.params.email;
    try {
      const [authRes, profileRes] = await Promise.all([
        axios.get(`${userurl}${email}`, { headers: { Authorization: authHeader } }),
        axios.get(`${userProfile}/${email}`),
      ]);
      const fullResponse = { ...authRes.data, ...profileRes.data };
      reply.code(200).send(fullResponse);
    } catch (error) {
      console.error('getUserInfo error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async updateUserInformation(request, reply) {
    const authHeader = request.headers.authorization;
    if (!MainHandler.verifyJwt(authHeader)) {
      return reply.code(401).send({ error: 'Unauthorized' });
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
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async updateUserPassword(request, reply) {
    const authHeader = request.headers.authorization;
    if (!MainHandler.verifyJwt(authHeader)) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    try {
      const response = await axios.patch(passwordRoute, request.body, {
        headers: { Authorization: authHeader },
      });
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('updateUserPassword error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }

  static async recoverPassword(request, reply) {
    const email = request.query.email;
    try {
      const response = await axios.get(`${passwordUpdateRoute}?email=${email}`);
      reply.code(200).send(response.data);
    } catch (error) {
      console.error('recoverPassword error:', error.message);
      reply.code(error.response?.status || 500).send(error.response?.data || { error: 'Internal server error' });
    }
  }
}

module.exports = MainHandler;
