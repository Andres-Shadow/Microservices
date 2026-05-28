import { Response, Request } from 'express';
import { z } from 'zod';
import { Op } from 'sequelize';
import logsServices from '../logs-services/logs-services';

// ─── Schemas de validación ────────────────────────────────────────────────────

const LogSchema = z.object({
    Name:        z.string().min(1),
    Summary:     z.string().min(1),
    Description: z.string().min(1),
    Log_date:    z.string().min(1),
    Log_type:    z.string().min(1),
    Module:      z.string().min(1),
});

const LogUpdateSchema = LogSchema.extend({
    id: z.string().min(1),
});

// ─── Helpers de paginación ────────────────────────────────────────────────────

function parsePagination(page?: string, pageSize?: string): { pageNumber: number; size: number } {
    const pageNumber = page ? Math.max(1, parseInt(page, 10)) : 1;
    const size       = pageSize ? Math.max(1, parseInt(pageSize, 10)) : 10;
    return { pageNumber, size };
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

export const getLog = async (req: Request, res: Response): Promise<void> => {
    const { pageNumber, size } = parsePagination(
        req.query.page as string,
        req.query.pageSize as string,
    );

    const filter: Record<string, unknown> = {};

    const startDate = req.query.startDate as string | undefined;
    const logType   = req.query.logType   as string | undefined;

    if (startDate) {
        filter['log_date'] = { [Op.eq]: startDate };
    }
    if (logType) {
        filter['log_type'] = logType;
    }

    try {
        const logs = await logsServices.getLogs(pageNumber, size, filter);
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error al obtener los logs:', error);
        res.status(500).json({ error: 'Error interno al obtener los logs.' });
    }
};

export const createLog = async (req: Request, res: Response): Promise<void> => {
    const result = LogSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: 'Datos inválidos.', details: result.error.flatten() });
        return;
    }

    try {
        await logsServices.createInDatabase(result.data);
        res.status(201).json({ data: 'Log created successfully.' });
    } catch (error) {
        console.error('Error al crear el log:', error);
        res.status(500).json({ error: 'Error interno al crear el log.' });
    }
};

export const deleteLog = async (req: Request, res: Response): Promise<void> => {
    const idParam = req.query.id as string | undefined;

    if (!idParam) {
        res.status(400).json({ error: 'El parámetro id es requerido.' });
        return;
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id) || id < 0) {
        res.status(400).json({ error: 'El id no es válido.' });
        return;
    }

    try {
        const log = await logsServices.getLog(String(id));
        if (!log) {
            res.status(404).json({ error: 'Log not found.' });
            return;
        }
        await logsServices.deleteLog(id);
        res.status(200).json({ data: 'Log deleted successfully.' });
    } catch (error) {
        console.error('Error al eliminar el log:', error);
        res.status(500).json({ error: 'Error interno al eliminar el log.' });
    }
};

export const updateLog = async (req: Request, res: Response): Promise<void> => {
    const result = LogUpdateSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: 'Datos inválidos.', details: result.error.flatten() });
        return;
    }

    const { id, ...data } = result.data;

    try {
        const storedLog = await logsServices.getLog(id);
        if (!storedLog) {
            res.status(404).json({ error: 'Log not found.' });
            return;
        }
        await logsServices.updateLog(id, data);
        res.status(200).json({ data: 'Log updated successfully.' });
    } catch (error) {
        console.error('Error al actualizar el log:', error);
        res.status(500).json({ error: 'Error interno al actualizar el log.' });
    }
};

export const getLogsByApplication = async (req: Request, res: Response): Promise<void> => {
    const module = req.params.module;
    const { pageNumber, size } = parsePagination(
        req.query.page as string,
        req.query.pageSize as string,
    );

    try {
        const result = await logsServices.getLogsByApplication(module, pageNumber, size);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener logs por aplicación:', error);
        res.status(500).json({ error: 'Error interno al obtener los logs.' });
    }
};

export const getLogsByEmail = async (req: Request, res: Response): Promise<void> => {
    const email = req.params.email;

    try {
        const result = await logsServices.getLogsByName(email);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener logs por email:', error);
        res.status(500).json({ error: 'Error interno al obtener los logs.' });
    }
};
