// Class that contains all the routes for accesiing the API

//Definig the host

host = process.env.USER_SERVER_HOST;
logsHost = process.env.LOGS_HOST;
healtHost = process.env.HEALTH_HOST;
userProfileHost = process.env.USER_PROFILE_HOST;

if (!host) {
  host = "localhost";
}

if (!logsHost) {
  logsHost = "localhost";
}

if (!healtHost) {
  healtHost = "localhost";
}

if (!userProfileHost) {
  userProfileHost = "localhost";
}

//user route
const userurl = "http://" + host + ":9090/api/v1/users/";
//login route
const loginUrl = "http://" + host + ":9090/api/v1/login";
//change password rouete
const passwordRoute = "http://" + host + ":9090/api/v1/users/password";
//update password route
const passwordUpdateRoute = "http://" + host + ":9090/api/v1/users/password/";

// logs manager API

const logsManager = "http://" + logsHost + ":9091/api/v1/logs/";

// health server API

const healthServer = "http://" + healtHost + ":9092/api/v1/health";

// user profile API

const userProfile = "http://" + userProfileHost + ":9094/api/v1/users";

module.exports = {
  userurl,
  loginUrl,
  passwordRoute,
  passwordUpdateRoute,
  logsManager,
  healthServer,
  userProfile,
};
