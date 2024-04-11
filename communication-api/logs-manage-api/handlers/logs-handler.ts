import { Response, Request } from "express";
import { DataLog } from '../database/database';

const getLog = (req: Request, res: Response) => {

    res.send('getLog');
}

const createLog = (req: Request, res: Response) => {
    const { body } = req;
    DataLog.create(body);
    res.send('createLog');
}

export { getLog, createLog };