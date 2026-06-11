import { Response, Request } from "express";
import { verifyLiveDependencies, verifyReadyDependencies } from "../logs-services/health-handler-service";

const verifyLive = async (req: Request, res: Response) => {

    let live = await verifyLiveDependencies();

    res.status(200);
    res.json(live);

}

const verifyReady = async (req: Request, res: Response) => {

    let live = await verifyReadyDependencies();
    res.status(200);
    res.json(live);
}

const verifyHealth = async (req: Request, res: Response) => {
    let live = await verifyLiveDependencies();
    let ready = await verifyReadyDependencies();

    res.status(200);
    res.json({ live, ready });
}



export { verifyLive, verifyReady, verifyHealth }