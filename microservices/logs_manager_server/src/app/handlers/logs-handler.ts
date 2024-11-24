import { Response, Request } from "express";
import logsServices from "../logs-services/logs-services"
import { Op } from 'sequelize';


const getLog = async (req: Request, res: Response) => {
    let page = req.query.page as string;
    let pageSize = req.query.pageSize as string;
    let startDate = req.query.startDate as string;
    let logType = req.query.logType as string;
    let pageNumber, size = 0;

    // Verifica y asigna los valores de paginación predeterminados si los parámetros no están definidos
    if (!page || !pageSize) {
        pageNumber = 1;
        size = 10;
    } else {
        pageNumber = parseInt(page, 10);
        size = parseInt(pageSize, 10);
    }

    // Crea un objeto de filtro para la consulta
    const filter: any = {};

    // Agrega filtros para el rango de fechas y el tipo de log si están presentes en los parámetros de consulta
    if (startDate) {
        filter.log_date = {
            [Op.eq]: [startDate]
        };
    }

    if (logType) {
        filter.logType = logType;
    }

    try {
        // Realiza la consulta de logs utilizando la paginación y los filtros
        const logs = await logsServices.getLogs(pageNumber, size, filter);
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error al obtener los logs:', error);
        res.status(500).json({ error: 'Error interno al obtener los logs.' });
    }
}

const createLog = (req: Request, res: Response) => {

    const { body } = req;

    // Verificar si el cuerpo de la petición está vacío
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'El cuerpo de la petición está vacío.' });
    }

    // Verificar si la cantidad de elementos en el JSON es diferente a la cantidad de campos necesarios
    const requiredFields = ['Name', 'Summary', 'Description', 'Log_date', 'Log_type', 'Module']; // Reemplazar con los nombres de los campos necesarios
    // if (Object.keys(body).length !== requiredFields.length) {
    //     return res.status(400).json({ error: 'La cantidad de elementos en el JSON es incorrecta.' });
    // }

    // Verificar si existen tipos de datos diferentes
    for (const field of requiredFields) {
        if (!(field in body) || typeof body[field] !== 'string') {
            return res.status(400).json({ error: 'Los tipos de datos son incorrectos.' });
        }
    }

    // Llamada al método de creación de la base de datos
    try {
        logsServices.createInDatabase(body);
        res.status(200).json({ data: 'Log was created successfully!' });
    } catch (error) {
        console.error('Error al crear el log en la base de datos:', error);
        res.status(500).json({ error: 'Error interno al crear el log en la base de datos.' });
    }
}
const deleteLog = async (req: Request, res: Response) => {
    const idParam = req.query.id;

    // Verificar si el parámetro id existe y no está vacío
    if (!idParam || typeof idParam !== 'string') {
        return res.status(400).json({ error: 'El ID del log es requerido.' });
    }

    // Convertir el id a un número entero
    const id = parseInt(idParam, 10);

    // Verificar si el id es un número válido
    if (isNaN(id) || id < 0) {
        return res.status(400).json({ error: 'El ID del log no es válido.' });
    }

    try {
        // Obtener el log de la base de datos
        const log = await logsServices.getLog("" + id);

        // Verificar si se encontró el log
        if (!log) {
            return res.status(404).json({ error: 'Log not found' });
        }

        // Llamada al método de eliminación de la base de datos
        await logsServices.deleteLog(id);
        res.status(200).json({ data: 'Log was deleted successfully!' });
    } catch (error) {
        console.error('Error al eliminar o recuperar el log en la base de datos:', error);
        res.status(500).json({ error: 'Error interno al eliminar o recuperar el log en la base de datos.' });
    }
}

const udpateLog = async (req: Request, res: Response) => {
    const { body } = req;


    console.log('Body:', body);
    // Verificar si el cuerpo de la petición está vacío
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'El cuerpo de la petición está vacío.' });
    }

    // Verificar si la cantidad de elementos en el JSON es diferente a la cantidad de campos necesarios
    const requiredFields = ['id', 'Name', 'Summary', 'Description', 'Log_date', 'Log_type', 'Module']; // Reemplazar con los nombres de los campos necesarios
    if (Object.keys(body).length !== requiredFields.length) {
        return res.status(400).json({ error: 'La cantidad de elementos en el JSON es incorrecta.' });
    }

    // Verificar si existen tipos de datos diferentes
    for (const field of requiredFields) {
        if (!(field in body) || typeof body[field] !== 'string') {
            return res.status(400).json({ error: 'Los tipos de datos son incorrectos.' });
        }
    }

    let storedLog = await logsServices.getLog(body.id);

    if (!storedLog) {
        return res.status(404).json({ error: 'Log not found' });
    }
    // Llamada al método de actualización de la base de datos
    try {
        logsServices.updateLog(body.id, body);
        res.status(200).json({ data: 'Log was updated successfully!' });
    } catch (error) {
        console.error('Error al actualizar el log en la base de datos:', error);
        res.status(500).json({ error: 'Error interno al actualizar el log en la base de datos.' });
    }

}

const getLogsByApplication = (req: Request, res: Response) => {
    let application = req.params.application as string;
    let page = req.query.page as string;
    let pageSize = req.query.pageSize as string;
    let pageNumber, size = 0;

    if (!page || !pageSize) {
        // Si page o pageSize son undefined, asigna los valores predeterminados
        pageNumber = 1;
        size = 10;
    } else {
        // Convierte los parámetros de consulta a números enteros y verifica si son válidos
        pageNumber = parseInt(page, 10);
        size = parseInt(pageSize, 10);
    }

    let logs = logsServices.getLogsByApplication(application, pageNumber, size);

    logs.then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        console.error('Error al obtener los logs:', error);
        res.status(500).json({ error: 'Error interno al obtener los logs.' });
    });

}

const getLogsByEmailAndCreation = (req: Request, res: Response) => {
    let email = req.params.email as string;

    let logs = logsServices.getLogsByName(email);

    logs.then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        console.error('Error al obtener los logs:', error);
        res.status(500).json({ error: 'Error interno al obtener los logs.' });
    });
}


export { getLog, createLog, deleteLog, udpateLog, getLogsByApplication, getLogsByEmailAndCreation };