import { Response, Request } from "express";
import healthServices from "../logs-services/health-services";
import { Check, LiveStatus, CheckData } from "../models/health-response";

const verifyLive = async (req: Request, res: Response) => {

    let estado = await healthServices.verifyDatabaseConnection()
    let dbCheck = estado ? 'UP' : 'DOWN';
    let dbStatus = estado ? 'READY' : 'DOWN';

    const CheckData: CheckData = {
        from: new Date().toISOString(),
        status: dbStatus,
    }

    const Check: Check = {
        name: 'Database alive connection test',
        status: dbCheck,
        data: CheckData,
    }



    const natsConnection = await healthServices.verifyNatsConnection();
    let natsCheck = natsConnection ? 'UP' : 'DOWN';
    let natsStatus = natsConnection ? 'READY' : 'DOWN';

    const CheckDataNats: CheckData = {
        from: new Date().toISOString(),
        status: natsStatus,
    }

    const CheckNats: Check = {
        name: 'NATS alive connection test',
        status: natsCheck,
        data: CheckDataNats,
    }

    // Envía el objeto como respuesta JSON


    const checks: Check[] = [Check, CheckNats];

    let uptime = healthServices.getUptime();
    // // Crea el objeto principal con el estado y la lista de 'checks'
    const liveStatus: LiveStatus = {
        status: 'UP',
        checks,
        version: '1.0',
        uptime: uptime,
    };

    res.status(200);
    res.json(liveStatus);

}

const verifyReady = async (req: Request, res: Response) => {
    let estado = await healthServices.verifyDatabaseReady()
    let dbCheck = estado ? 'UP' : 'DOWN';
    let dbStatus = estado ? 'READY' : 'DOWN';

    const CheckData: CheckData = {
        from: new Date().toISOString(),
        status: dbStatus,
    }

    const Check: Check = {
        name: 'Database ready connection test',
        status: dbCheck,
        data: CheckData,
    }


    // Verificar conexión a NATS

    const natsConnection = await healthServices.verifyNatsReady();
    let natsCheck = natsConnection ? 'UP' : 'DOWN';
    let natsStatus = natsConnection ? 'READY' : 'DOWN';

    const CheckDataNats: CheckData = {
        from: new Date().toISOString(),
        status: natsStatus,
    }

    const CheckNats: Check = {
        name: 'NATS ready connection test',
        status: natsCheck,
        data: CheckDataNats,
    }

    // Envía el objeto como respuesta JSON


    const checks: Check[] = [Check, CheckNats];

    let uptime = healthServices.getUptime();
    // // Crea el objeto principal con el estado y la lista de 'checks'
    const liveStatus: LiveStatus = {
        status: 'UP',
        checks,
        version: '1.0',
        uptime: uptime,
    };

    res.json(liveStatus);
}

export { verifyLive, verifyReady }