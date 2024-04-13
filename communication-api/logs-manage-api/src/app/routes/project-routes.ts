import { Router } from "express";
import { getLog, createLog, deleteLog, udpateLog } from "../handlers/logs-handler";

const router = Router();
const apiUrl = '/api/v1/logs';

router.get(apiUrl, getLog)
router.post(apiUrl, createLog)
router.delete(apiUrl, deleteLog)
router.put(apiUrl, udpateLog)

export default router;