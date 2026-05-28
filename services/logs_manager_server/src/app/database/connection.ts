import { Sequelize } from 'sequelize';

const host     = process.env.DATABASE      ?? 'localhost';
const port     = parseInt(process.env.DATABASE_PORT ?? '5432', 10);
const user     = process.env.DATABASE_USER ?? 'logsuser';
const password = process.env.DATABASE_PASSWORD ?? 'logspassword';
const dbname   = process.env.DATABASE_NAME ?? 'appdb';
const schema   = process.env.DATABASE_SCHEMA ?? 'logs';

const sequelize = new Sequelize(dbname, user, password, {
    host,
    port,
    dialect: 'postgres',
    schema,
    define: {
        // Todas las tablas se crean dentro del schema configurado
        schema,
    },
    logging: false,
});

export default sequelize;
