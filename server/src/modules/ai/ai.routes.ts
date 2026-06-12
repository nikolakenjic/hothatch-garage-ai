import {Router} from 'express';
import {
    buildPlan,
    getRecommendations,
    getRecommendationsByCar,
    recommendCar,
    recommendUpgrade,
} from './ai.controller';
import {protect} from '../../middlewares/auth.middleware';
import {validate} from '../../middlewares/validate';
import {
    aiCarParamsSchema,
    buildPlanSchema,
    recommendCarSchema,
} from './ai.validation';

const router = Router();

router.post('/recommend', protect, validate(recommendCarSchema), recommendCar);
router.post(
    '/upgrade/:carId',
    protect,
    validate(aiCarParamsSchema, 'params'),
    recommendUpgrade,
);
router.get('/recommendations', protect, getRecommendations);
router.get(
    '/recommendations/car/:carId',
    protect,
    validate(aiCarParamsSchema, 'params'),
    getRecommendationsByCar,
);
router.post(
    '/build-plan/:carId',
    protect,
    validate(aiCarParamsSchema, 'params'),
    validate(buildPlanSchema),
    buildPlan,
);

export default router;
