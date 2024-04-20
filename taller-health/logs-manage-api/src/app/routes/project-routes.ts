import { Router } from "express";
import { getLog, createLog, deleteLog, udpateLog, getLogsByApplication, getLogsByEmailAndCreation } from "../handlers/logs-handler";
import { verifyLive, verifyReady, verifyHealth } from "../handlers/health-handler";


const router = Router();
const apiUrl = '/api/v1/logs/';
const healthUrl = "/api/v1/health";

//logs routes
router.get(apiUrl, getLog)
router.post(apiUrl, createLog)
router.delete(apiUrl, deleteLog)
router.put(apiUrl, udpateLog)
router.get(apiUrl + ':email', getLogsByEmailAndCreation)
router.get(apiUrl + ':application', getLogsByApplication)

//health routes

router.get(healthUrl + "/live", verifyLive)
router.get(healthUrl + "/ready", verifyReady)
router.get(healthUrl, verifyHealth)


export default router;