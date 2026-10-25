import {Router} from 'express';
import rateLimit from 'express-rate-limit';
import {
    buildPlan,
    buildReview,
    costAnalysis,
    getRecommendations,
    getRecommendationsByCar,
    nextUpgrade,
    recommendCar,
} from './ai.controller';
import {protect} from '../../middlewares/auth.middleware';
import {validate} from '../../middlewares/validate';
import {
    aiCarParamsSchema,
    buildPlanSchema,
    buildReviewSchema,
    costAnalysisSchema,
    nextUpgradeSchema,
    recommendationsByCarQuerySchema,
    recommendationsQuerySchema,
    recommendCarSchema,
} from './ai.validation';
import {AI_GENERATION_RATE_LIMIT} from './ai.constants';
import {getUserId} from '../../utils/getUser';

const aiGenerationLimiter = rateLimit({
    ...AI_GENERATION_RATE_LIMIT,
    keyGenerator: (req) => getUserId(req),
});

const router = Router();

router.post(
    '/recommend',
    protect,
    aiGenerationLimiter,
    validate(recommendCarSchema),
    recommendCar,
);

router.get(
    '/recommendations',
    protect,
    validate(recommendationsQuerySchema, 'query'),
    getRecommendations,
);

router.get(
    '/recommendations/car/:carId',
    protect,
    validate(aiCarParamsSchema, 'params'),
    validate(recommendationsByCarQuerySchema, 'query'),
    getRecommendationsByCar,
);

router.post(
    '/build-plan/:carId',
    protect,
    aiGenerationLimiter,
    validate(aiCarParamsSchema, 'params'),
    validate(buildPlanSchema),
    buildPlan,
);

router.post(
    '/next-upgrade/:carId',
    protect,
    aiGenerationLimiter,
    validate(aiCarParamsSchema, 'params'),
    validate(nextUpgradeSchema),
    nextUpgrade,
);

router.post(
    '/build-review/:carId',
    protect,
    aiGenerationLimiter,
    validate(aiCarParamsSchema, 'params'),
    validate(buildReviewSchema),
    buildReview,
);

router.post(
    '/cost-analysis/:carId',
    protect,
    aiGenerationLimiter,
    validate(aiCarParamsSchema, 'params'),
    validate(costAnalysisSchema),
    costAnalysis,
);

export default router;
