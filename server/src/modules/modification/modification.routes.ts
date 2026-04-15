import {Router} from 'express';
import {createModification} from './modification.controller';
import {protect} from '../../middlewares/auth.middleware';

const router = Router();

// POST /api/modifications/:carId
router.post('/:carId', protect, createModification);

export default router;
