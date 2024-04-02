// Class that contains all the routes for accesiing the API

//Definig the host

host = "localhost";
//host = "server"

//user route
const userurl = "http://" + host + ":9090/api/v1/users/";
//login route
const loginUrl = "http://" + host + ":9090/api/v1/login";
//change password rouete
const passwordRoute = "http://" + host + ":9090/api/v1/users/password";
//update password route
const passwordUpdateRoute = "http://" + host + ":9090/api/v1/users/password/";

module.exports = {
  userurl,
  loginUrl,
  passwordRoute,
  passwordUpdateRoute,
};
