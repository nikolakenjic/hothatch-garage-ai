import {Router} from 'express';
import {
    getRecommendations,
    recommendCar,
    recommendUpgrade,
} from './ai.controller';
import {protect} from '../../middlewares/auth.middleware';

const router = Router();

router.post('/recommend', protect, recommendCar);
router.post('/upgrade/:carId', protect, recommendUpgrade);
router.get('/recommendations', protect, getRecommendations);

export default router;
