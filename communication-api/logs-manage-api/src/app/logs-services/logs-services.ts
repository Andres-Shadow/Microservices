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
                Log_date: new Date(jsonData.log_date),
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

    static async getLogs(pageNumber: number, size: number) {
        const offset = (pageNumber - 1) * size;

        // Consulta los comentarios utilizando la paginación
        const logs_stored = await DataLog.findAndCountAll({
            limit: size,
            offset: offset
        });

        return logs_stored;
    }

    static async deleteLog(id: string) {
        await DataLog.destroy({
            where: {
                id: id
            }
        });
    }

    static async getLog(id: string) {
        const log = await DataLog.findByPk(id);
        return log;
    }

    static async updateLog(id: string, data: any) {
        await DataLog.update(data, {
            where: {
                id: id
            }
        });
    }
}


export default logsServices;
