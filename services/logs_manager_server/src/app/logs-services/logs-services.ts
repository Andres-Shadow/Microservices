import { DataLog } from '../database/database';

class logsServices {
    // Method for casting logs that came from nats server communication to JSON 
    // so, it can be stored in the database
    static async mapJSONToDataLogs(jsonData: any): Promise<String> {
        try {
            // Crea una nueva instancia de DataLogs con los datos del JSON
            const newDataLogs = await DataLog.create({
                Name: jsonData.name,
                Summary: jsonData.summary,
                Description: jsonData.description,
                Log_date: jsonData.log_date,
                Log_type: jsonData.log_type,
                Module: jsonData.module,
            });
            return "Log created successfully!" + newDataLogs.toJSON();
        } catch (error: any) {
            throw new Error('Error while mapping JSON atributes: ' + error.message);
        }
    }

    static async createInDatabase(data: any) {
        await DataLog.create(data);
    }

    static async getLogs(pageNumber: number, size: number, filter: any) {
        const offset = (pageNumber - 1) * size;

        // Crea un objeto de opciones para la consulta
        const options: any = {
            limit: size,
            offset: offset
        };

        // Si se proporciona un filtro, agrégalo a las opciones de consulta
        if (filter) {
            options.where = filter;
        }

        // Consulta los logs utilizando las opciones de consulta
        const logs_stored = await DataLog.findAndCountAll(options);

        return logs_stored;
    }

    static async deleteLog(id: number) {
        await DataLog.destroy({
            where: {
                id: id
            }
        });
    }

    static async getLog(id: string) {
        const log = await DataLog.findByPk(id);
        if (!log) {
            return null;
        } else {
            return log;
        }
    }

    static async getLogsByName(name: string) {
        const logs = await DataLog.findAll({
            where: {
                Name: name,
                Log_type: 'CREATION'
            }
        });

        return logs;
    }

    static async updateLog(id: string, data: any) {
        await DataLog.update(data, {
            where: {
                id: id
            }
        });
    }

    static async getLogsByApplication(application: string, pageNumber: number, size: number) {
        const offset = (pageNumber - 1) * size;

        // Consulta los comentarios utilizando la paginación
        const logs_stored = await DataLog.findAndCountAll({
            where: {
                Module: application
            },
            limit: size,
            offset: offset
        });

        return logs_stored;
    }
}


export default logsServices;
