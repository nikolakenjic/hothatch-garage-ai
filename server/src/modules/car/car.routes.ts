import {Router} from 'express';
import {createCar, getMyCars} from './car.controller';
import {protect} from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createCar);
router.get('/', protect, getMyCars);

export default router;
