import { Router } from 'express';
import { designRoundHandler } from '../controllers/roundController';

const router = Router();
router.post('/design', designRoundHandler);

export default router;
