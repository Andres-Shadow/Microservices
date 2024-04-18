import { Router } from "express";
import { getLog, createLog, deleteLog, udpateLog, getLogsByApplication, getLogsByEmailAndCreation } from "../handlers/logs-handler";

const router = Router();
const apiUrl = '/api/v1/logs/';

router.get(apiUrl, getLog)
router.post(apiUrl, createLog)
router.delete(apiUrl, deleteLog)
router.put(apiUrl, udpateLog)
router.get(apiUrl+':email', getLogsByEmailAndCreation)
router.get(apiUrl + ':application', getLogsByApplication)

export default router;