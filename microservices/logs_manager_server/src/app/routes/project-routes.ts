import { Router } from 'express';
import {
    getLog,
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
router.get(apiUrl,                        getLog);
router.post(apiUrl,                       createLog);
router.delete(apiUrl,                     deleteLog);
router.put(apiUrl,                        updateLog);

// Rutas con parámetro — separadas por prefijo para evitar conflicto
router.get(`${apiUrl}/by-email/:email`,   getLogsByEmail);
router.get(`${apiUrl}/by-app/:module`,    getLogsByApplication);

// Health routes
router.get(`${healthUrl}/live`,  verifyLive);
router.get(`${healthUrl}/ready`, verifyReady);
router.get(healthUrl,            verifyHealth);

export default router;
