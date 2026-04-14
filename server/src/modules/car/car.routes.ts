import {Router} from 'express';
import {
    createCar,
    deleteCar,
    getCarById,
    getMyCars,
    updateCar,
} from './car.controller';
import {protect} from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createCar);
router.get('/', protect, getMyCars);
router.get('/:id', protect, getCarById);
router.patch('/:id', protect, updateCar);
router.delete('/:id', protect, deleteCar);

export default router;
