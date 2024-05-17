//importar axios
const axios = require("axios");
//importar las rutas
const login = require("../configuracion/routesConfiguration").loginUrl;
const auth_server_url = require("../configuracion/routesConfiguration").userurl;
const user_profile_service =
  require("../configuracion/routesConfiguration").userProfile;
//importar la funcion sendlosToNats
const nats = require("../services/communicationService");

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
    console.log("entro aqui");
    try {
      respuesta = await axios.post(login, usuario);
      let name = usuario.username;
      let description =
        "User " + usuario.name + " logged in with email " + usuario.email;
      let summary = "User logged in";
      nats.sendLogToNats(name, summary, description, "INFO");
      reply.code(200).send({ message: respuesta.data });
    } catch (error) {
      let name = usuario.name;
      let description = "User " + usuario.name + " tryed to log in";
      let summary = "User tryed to log in";
      nats.sendLogToNats(name, summary, description, "ERROR");
      console.error("Error al verificar el token JWT:", error);
      reply.code(400).send({ message: error.response.data });
    }
  }

  static async userRegister(request, reply) {
    //obtener el body de la peticion
    const usuario = request.body;
    let respuesta;
    try {
      respuesta = await axios.post(auth_server_url, usuario);
      let name = usuario.username;
      let description =
        "User " + usuario.name + " logged in with email " + usuario.email;
      let summary = "User logged in";
      nats.sendLogToNats(name, summary, description, "CREATION");
    } catch (error) {
      let name = usuario.name;
      let description = "User " + usuario.name + " tryed to log in";
      let summary = "User tryed to log in";
      nats.sendLogToNats(name, summary, description, "ERROR");
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

  //metoodo objetivo
  static async getUserInfo(request, reply) {
    //obtener el header authorization

    const email = request.params.email;

    const authHeader = request.headers.authorization;

    const decodedToken = MainHandler.verifyJwt(authHeader);

    if (!decodedToken) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }

    try {
      // Realizar la petición GET con node-fetch y pasar el token en el encabezado de autorización
      const response = await axios.get(auth_server_url + "/" + email, {
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

  static async updateUserInformation(request, reply) {
    const newData = request.body;
    const authHeader = request.headers.authorization;
    let backupAuthUser;
    let email = request.params.email;

    //almacenar en cache el usuario antes de actulizarlo en caso de que falle la actualizacion
    try {
      const response = await axios.get(auth_server_url + "/" + email, {
        headers: {
          Authorization: authHeader,
        },
      });

      backupAuthUser = response.data;
    } catch (error) {
      reply.code(500).send({ message: "Internal Server Error" });
    }

    try {
      if (newData.password) {
        await axios.put(auth_server_url, newData, {
          headers: {
            Authorization: authHeader,
          },
        });
      } else {
        await axios.put(user_profile_service, newData);
      }
    } catch (error) {
      // Si ocurre algún error durante la petición, devolver un error
      console.error("Error al realizar la petición PUT:", error.message);
      reply.code(500).send({ message: "Internal Server Error" });
    }

    // verificar para rollbackk
    try {
      const verificarion = axios.get(user_profile_service + "/" + email);
      const user = verificarion.data;
      if (user.email != newData.email) {
        //rollback
        try {
          // Realizar la petición PUT con node-fetch y pasar el token en el encabezado de autorización
          await axios.put(auth_server_url, backupAuthUser, {
            headers: {
              Authorization: authHeader,
            },
          });
        } catch (error) {
          // Si ocurre algún error durante la petición, devolver un error
          console.error(
            "Error al realizar la petición de rollback:",
            error.message
          );
          reply.code(500).send({ message: "Internal Server Error" });
        }
      } else {
        reply.code(200).send({ message: "User updated successfully" });
      }
    } catch (error) {
      await axios.put(auth_server_url, backupAuthUser, {
        headers: {
          Authorization: authHeader,
        },
      });
      reply.code(500).send({ message: "Internal Server Error" });
    }
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
