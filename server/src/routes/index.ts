import { Router } from 'express';
import authRoutes from './authRoutes';
import { requireAuth } from '../middleware/requireAuth';
import referenceRoutes from './referenceRoutes';
import roundRoutes from './roundRoutes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/reference', requireAuth, referenceRoutes);
router.use('/rounds', requireAuth, roundRoutes);

export default router;
