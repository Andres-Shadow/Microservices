import { Sequelize, DataTypes } from 'sequelize';

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize('mysql://root:andres_1@localhost:3306/logs');

// Define el modelo para la tabla 'logs'
export const DataLog = sequelize.define('log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Summary: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Log_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Log_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Module: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sincroniza el modelo con la base de datos
sequelize.sync()
  .then(() => console.log('Tabla logs creada'))
  .catch(err => console.error('Error al sincronizar la tabla logs:', err));
