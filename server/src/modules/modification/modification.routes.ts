import {Router} from 'express';
import {
    createModification,
    deleteModification,
    getModificationsByCar,
    updateModification,
} from './modification.controller';
import {protect} from '../../middlewares/auth.middleware';

const router = Router();

router.post('/:carId', protect, createModification);
router.get('/:carId', protect, getModificationsByCar);
router.patch('/:id', protect, updateModification);
router.delete('/:id', protect, deleteModification);

export default router;
