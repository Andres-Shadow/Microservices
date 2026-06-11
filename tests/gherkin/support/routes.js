const host             = process.env.USER_SERVER_HOST  || 'localhost';
const logsHost         = process.env.LOGS_HOST         || 'localhost';
const healthHost       = process.env.HEALTH_HOST       || 'localhost';
const userProfileHost  = process.env.USER_PROFILE_HOST || 'localhost';
const notificationHost = process.env.NOTIFICATION_HOST || 'localhost';

const authPort    = process.env.AUTH_PORT    || '9090';
const logsPort    = process.env.LOGS_PORT    || '9091';
const healthPort  = process.env.HEALTH_PORT  || '9092';
const profilePort = process.env.PROFILE_PORT || '9094';
const notifPort   = process.env.NOTIF_PORT   || '9096';

module.exports = {
  authBaseUrl:    `http://${host}:${authPort}/api/v1`,
  loginUrl:       `http://${host}:${authPort}/api/v1/login`,
  usersUrl:       `http://${host}:${authPort}/api/v1/users`,
  logsUrl:        `http://${logsHost}:${logsPort}/api/v1/logs`,
  healthAppsUrl:  `http://${healthHost}:${healthPort}/api/v1/apps`,
  profilesUrl:    `http://${userProfileHost}:${profilePort}/api/v1/users`,
  notificationsUrl: `http://${notificationHost}:${notifPort}/api/v1/notifications`,
};
