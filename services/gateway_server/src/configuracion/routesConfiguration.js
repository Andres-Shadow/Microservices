// Hosts de los microservicios — configurables via variables de entorno
const host             = process.env.USER_SERVER_HOST  || 'localhost';
const logsHost         = process.env.LOGS_HOST         || 'localhost';
const healthHost       = process.env.HEALTH_HOST       || 'localhost';
const userProfileHost  = process.env.USER_PROFILE_HOST || 'localhost';
const notificationHost = process.env.NOTIFICATION_HOST || 'localhost';

// Puertos — configurables via variables de entorno con defaults
const authPort         = process.env.AUTH_PORT         || '9090';
const logsPort         = process.env.LOGS_PORT         || '9091';
const healthPort       = process.env.HEALTH_PORT       || '9092';
const profilePort      = process.env.PROFILE_PORT      || '9094';
const notifPort        = process.env.NOTIF_PORT        || '9096';

const userurl           = `http://${host}:${authPort}/api/v1/users/`;
const loginUrl          = `http://${host}:${authPort}/api/v1/login`;
const passwordRoute     = `http://${host}:${authPort}/api/v1/users/password`;
const passwordUpdateRoute = `http://${host}:${authPort}/api/v1/users/password/`;
const logsManager       = `http://${logsHost}:${logsPort}/api/v1/logs`;
const healthServer      = `http://${healthHost}:${healthPort}/api/v1/apps`;
const userProfile       = `http://${userProfileHost}:${profilePort}/api/v1/users`;
const notification      = `http://${notificationHost}:${notifPort}/api/v1/notification`;

module.exports = {
  userurl,
  loginUrl,
  passwordRoute,
  passwordUpdateRoute,
  logsManager,
  healthServer,
  userProfile,
  notification,
};
