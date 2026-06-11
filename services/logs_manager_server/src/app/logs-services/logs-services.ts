import { DataLog } from '../database/database';

class logsServices {
    /**
     * Maps incoming NATS JSON payload to a DataLog record and persists it.
     */
    static async mapJSONToDataLogs(jsonData: any): Promise<string> {
        try {
            const newDataLog = await DataLog.create({
                Name:        jsonData.name,
                Summary:     jsonData.summary,
                Description: jsonData.description,
                Log_date:    jsonData.log_date,
                Log_type:    jsonData.log_type,
                Module:      jsonData.module,
            });
            return 'Log created successfully: ' + JSON.stringify(newDataLog.toJSON());
        } catch (error: any) {
            throw new Error('Error mapping JSON to DataLog: ' + error.message);
        }
    }

    static async createInDatabase(data: any): Promise<void> {
        await DataLog.create(data);
    }

    static async getLogs(pageNumber: number, size: number, filter: any) {
        const offset = (pageNumber - 1) * size;

        const options: any = {
            limit:  size,
            offset,
        };

        if (filter && Object.keys(filter).length > 0) {
            options.where = filter;
        }

        return DataLog.findAndCountAll(options);
    }

    static async deleteLog(id: number): Promise<void> {
        await DataLog.destroy({ where: { id } });
    }

    static async getLog(id: string) {
        return DataLog.findByPk(id) ?? null;
    }

    static async getLogsByName(name: string) {
        return DataLog.findAll({
            where: {
                Name:     name,
                Log_type: 'CREATION',
            },
        });
    }

    static async updateLog(id: string, data: any): Promise<void> {
        await DataLog.update(data, { where: { id } });
    }

    static async getLogsByApplication(application: string, pageNumber: number, size: number) {
        const offset = (pageNumber - 1) * size;
        return DataLog.findAndCountAll({
            where:  { Module: application },
            limit:  size,
            offset,
        });
    }
}

export default logsServices;
