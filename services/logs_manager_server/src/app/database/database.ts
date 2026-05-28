import { DataTypes } from 'sequelize';
import sequelize from './connection';

// Modelo para la tabla 'logs' dentro del schema configurado
export const DataLog = sequelize.define('log', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name',
    },
    Summary: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'summary',
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'description',
    },
    Log_date: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'log_date',
    },
    Log_type: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'log_type',
    },
    Module: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'module',
    },
}, {
    tableName: 'logs',
    createdAt: false,
    updatedAt: false,
});

export default DataLog;
