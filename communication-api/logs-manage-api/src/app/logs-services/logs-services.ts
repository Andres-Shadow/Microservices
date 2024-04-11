import { DataLog } from '../database/database';

async function mapJSONToDataLogs(jsonData: any): Promise<String> {
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
        return "Log created successfully!";
    } catch (error: any) {
        throw new Error('Error while mapping JSON atributes: ' + error.message);
    }
}

export { mapJSONToDataLogs };
