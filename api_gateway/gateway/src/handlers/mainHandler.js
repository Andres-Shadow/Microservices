//importar axios
const axios = require("axios");
//importar las rutas
const login = require("../configuracion/routesConfiguration").loginUrl;
const auth_server_url = require("../configuracion/routesConfiguration").userurl;
const user_profile_service =
  require("../configuracion/routesConfiguration").userProfile;

class MainHandler {
  static async getUsers(request, reply) {
    //obtener el header authorization
    const authHeader = request.headers.authorization;

    const decodedToken = MainHandler.verifyJwt(authHeader);

    if (!decodedToken) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }

    try {
      // Realizar la petición GET con node-fetch y pasar el token en el encabezado de autorización
      const response = await axios.get(auth_server_url, {
        headers: {
          Authorization: authHeader,
        },
      });
      // Si la petición se realiza con éxito, devolver la respuesta
      reply.code(200).send(response.data);
    } catch (error) {
      // Si ocurre algún error durante la petición, devolver un error
      console.error("Error al realizar la petición GET:", error.message);
      reply.code(500).send({ message: "Internal Server Error" });
    }
  }

  //redirige la peticion de login
  //localhost:9095/api/v1/user/login -> localhost:9090/api/v1/login
  static async userLogin(request, reply) {
    //obtener el body de la peticion
    const usuario = request.body;
    let respuesta;
    try {
      respuesta = await axios.post(login, usuario);
    } catch (error) {
      console.error("Error al verificar el token JWT:", error);
      return null;
    }
    reply.code(200).send({ message: respuesta.data });
  }

  static async userRegister(request, reply) {
    //obtener el body de la peticion
    const usuario = request.body;
    let respuesta;
    try {
      respuesta = await axios.post(auth_server_url, usuario);
    } catch (error) {
      console.error("Error al verificar el token JWT:", error);
      reply.code(500).send({ message: "Internal Server Error" });
      return null;
    }
    reply.code(200).send({ message: respuesta.data });
  }

  static async deleteUser(request, reply) {
    //obtener el header authorization
    const authHeader = request.headers.authorization;
    const email = request.body.email;

    const decodedToken = MainHandler.verifyJwt(authHeader);

    if (!decodedToken) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }

    try {
      // Realizar la petición DELETE con node-fetch y pasar el token en el encabezado de autorización
      const response = await axios.delete(auth_server_url + "?email=" + email, {
        headers: {
          Authorization: authHeader,
        },
      });
      // Si la petición se realiza con éxito, devolver la respuesta
      reply.code(200).send(response.data);
    } catch (error) {
      // Si ocurre algún error durante la petición, devolver un error
      console.error("Error al realizar la petición DELETE:", error.message);
      reply.code(500).send({ message: "Internal Server Error" });
    }
  }

  static async getUserInfo(request, reply) {
    //obtener el header authorization

    const email = request.query.email;

    const authHeader = request.headers.authorization;

    const decodedToken = MainHandler.verifyJwt(authHeader);

    if (!decodedToken) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }

    try {
      // Realizar la petición GET con node-fetch y pasar el token en el encabezado de autorización
      const response = await axios.get(auth_server_url + "/info/" + email, {
        headers: {
          Authorization: authHeader,
        },
      });

      const response2 = await axios.get(user_profile_service + "/" + email);

      //concatenate both responses
      let fullResponse = { ...response.data, ...response2.data };

      // Si la petición se realiza con éxito, devolver la respuesta
      reply.code(200).send(fullResponse);
    } catch (error) {
      // Si ocurre algún error durante la petición, devolver un error
      console.error("Error al realizar la petición GET:", error.message);
      reply.code(500).send({ message: "Internal Server Error" });
    }
    // Si la petición se realiza con éxito, devolver la respuesta
    reply.code(200).send(fullResponse);
  }
  catch(error) {
    // Si ocurre algún error durante la petición, devolver un error
    console.error("Error al realizar la petición GET:", error.message);
    reply.code(500).send({ message: "Internal Server Error" });
  }

  static verifyJwt(token) {
    let decodedToken;

    try {
      decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken;
    } catch (error) {
      return null;
    }
  }
}

module.exports = MainHandler;
