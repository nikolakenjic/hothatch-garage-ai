import {Router} from 'express';
import {
    getRecommendations,
    getRecommendationsByCar,
    recommendCar,
    recommendUpgrade,
} from './ai.controller';
import {protect} from '../../middlewares/auth.middleware';
import {validate} from '../../middlewares/validate';
import {recommendCarSchema} from '../../validations/ai.validation';
import {carIdParamsSchema} from '../../validations/car.validation';

const router = Router();

router.post('/recommend', protect, validate(recommendCarSchema), recommendCar);
router.post(
    '/upgrade/:carId',
    protect,
    validate(carIdParamsSchema, 'params'),
    recommendUpgrade,
);
router.get('/recommendations', protect, getRecommendations);
router.get(
    '/recommendations/car/:carId',
    protect,
    validate(carIdParamsSchema, 'params'),
    getRecommendationsByCar,
);

export default router;
