import healthServices from './health-services';
import { Check, LiveStatus, CheckData } from '../models/health-response';

function buildCheck(name: string, isUp: boolean): Check {
    const checkData: CheckData = {
        from:   new Date().toISOString(),
        status: isUp ? 'READY' : 'DOWN',
    };
    return {
        name,
        status: isUp ? 'UP' : 'DOWN',
        data:   checkData,
    };
}

function buildStatus(checks: Check[]): LiveStatus {
    const allUp = checks.every(c => c.status === 'UP');
    return {
        status:  allUp ? 'UP' : 'DOWN',
        checks,
        version: '1.0.0',
        uptime:  healthServices.getUptime(),
    };
}

export async function verifyLiveDependencies(): Promise<LiveStatus> {
    const [dbOk, natsOk] = await Promise.all([
        healthServices.verifyDatabaseConnection(),
        healthServices.verifyNatsConnection(),
    ]);

    return buildStatus([
        buildCheck('Logs Service Database alive connection check', dbOk),
        buildCheck('Logs Service NATS alive connection check', natsOk),
    ]);
}

export async function verifyReadyDependencies(): Promise<LiveStatus> {
    const [dbOk, natsOk] = await Promise.all([
        healthServices.verifyDatabaseReady(),
        healthServices.verifyNatsReady(),
    ]);

    return buildStatus([
        buildCheck('Logs Service Database ready check', dbOk),
        buildCheck('Logs Service NATS ready check', natsOk),
    ]);
}
