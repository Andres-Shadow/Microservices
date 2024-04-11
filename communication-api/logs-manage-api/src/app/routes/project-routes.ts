import { Router } from "express";
import { getLog, createLog } from "../handlers/logs-handler";

const router = Router();


router.get('/api/v1/logs/', getLog)
router.post('/api/v1/logs/', createLog)

export default router;