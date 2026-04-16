import {Router} from 'express';
import {
    createModification,
    getModificationsByCar,
} from './modification.controller';
import {protect} from '../../middlewares/auth.middleware';

const router = Router();

router.post('/:carId', protect, createModification);
router.get('/:carId', protect, getModificationsByCar);

export default router;
