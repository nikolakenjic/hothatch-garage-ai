import {Router} from 'express';
import {createCar, getCarById, getMyCars} from './car.controller';
import {protect} from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createCar);
router.get('/', protect, getMyCars);
router.get('/:id', protect, getCarById);

export default router;
