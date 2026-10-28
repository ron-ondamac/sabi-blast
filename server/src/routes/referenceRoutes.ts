import { Router } from 'express';
import { listExplosiveTypes, listRockTypes } from '../controllers/referenceController';

const router = Router();
router.get('/rock-types', listRockTypes);
router.get('/explosive-types', listExplosiveTypes);

export default router;
