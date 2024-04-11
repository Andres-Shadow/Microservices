import { Sequelize } from 'sequelize';

let database = process.env.DATABASE;
let root_password = process.env.ROOT_PASSWORD;
let port = process.env.DATABASE_PORT;

if (!database || !root_password || !port) {
    database = 'localhost';
    root_password = 'andres_1';
    port = '3306';
}

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(`mysql://root:${root_password}@${database}:${port}/logs`);

export default sequelize;
