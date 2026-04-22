import {Router} from 'express';
import {recommendCar, recommendUpgrade} from './ai.controller';
import {protect} from '../../middlewares/auth.middleware';

const router = Router();

router.post('/recommend', protect, recommendCar);
router.post('/upgrade/:carId', protect, recommendUpgrade);

export default router;
