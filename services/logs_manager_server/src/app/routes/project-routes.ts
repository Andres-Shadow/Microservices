import { Router } from 'express';
import {
    getLogs,
    createLog,
    deleteLog,
    updateLog,
    getLogsByApplication,
    getLogsByEmail,
} from '../handlers/logs-handler';
import { verifyLive, verifyReady, verifyHealth } from '../handlers/health-handler';

const router = Router();
const apiUrl    = '/api/v1/logs';
const healthUrl = '/api/v1/health';

// Logs routes
router.get(apiUrl,                        getLogs);
router.post(apiUrl,                       createLog);
router.put(apiUrl,                        updateLog);
router.delete(`${apiUrl}/:id`,            deleteLog);

// Filtered routes
router.get(`${apiUrl}/by-email/:email`,   getLogsByEmail);
router.get(`${apiUrl}/by-app/:module`,    getLogsByApplication);

// Health routes
router.get(`${healthUrl}/live`,  verifyLive);
router.get(`${healthUrl}/ready`, verifyReady);
router.get(healthUrl,            verifyHealth);

export default router;
