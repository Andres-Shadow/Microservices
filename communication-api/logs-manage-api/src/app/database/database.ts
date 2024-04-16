import { DataTypes } from 'sequelize';
import sequelize from './connection';

// Define el modelo para la tabla 'logs'
export const DataLog = sequelize.define('log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id' // Nombre del campo en la base de datos
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'name' // Nombre del campo en la base de datos
  },
  Summary: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'summary' // Nombre del campo en la base de datos
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'description' // Nombre del campo en la base de datos
  },
  Log_date: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'log_date' // Nombre del campo en la base de datos
  },
  Log_type: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'log_type' // Nombre del campo en la base de datos
  },
  Module: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'module' // Nombre del campo en la base de datos
  }
}, {
  // Configuración adicional
  tableName: 'logs', // Nombre de la tabla en la base de datos
  createdAt: false,
  updatedAt: false
});

DataLog.sync({ alter: true })
  .then(() => console.log('Tabla logs creada o actualizada'))
  .catch(err => console.error('Error al sincronizar la tabla logs:', err));

export default DataLog;