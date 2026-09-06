import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {
    buildPlanService,
    buildReviewService,
    costAnalysisService,
    generateCarRecommendationService,
    getRecommendationsByCarService,
    getRecommendationsService,
    nextUpgradeService,
    recommendUpgradeService,
} from './ai.service';
import {OK} from '../../constants/http';
import {getUserId} from '../../utils/getUser';
import type {RecommendationsQuery} from './ai.validation';

export const recommendCar = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const recommendation = await generateCarRecommendationService(
        userId,
        req.body,
    );

    res.status(OK).json({
        message: 'Recommendation generated',
        recommendation,
    });
});

export const recommendUpgrade = catchAsync(
    async (req: Request, res: Response) => {
        const carId = req.params.carId as string;
        const userId = getUserId(req);

        const recommendation = await recommendUpgradeService(carId, userId);

        res.status(OK).json({
            message: 'Upgrade recommendation generated',
            recommendation,
        });
    },
);

export const getRecommendations = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getUserId(req);
        const query = req.query as unknown as RecommendationsQuery;

        const recommendations = await getRecommendationsService(
            userId,
            query.type,
        );

        res.status(OK).json({
            message: 'Recommendations fetched successfully',
            count: recommendations.length,
            recommendations,
        });
    },
);

export const getRecommendationsByCar = catchAsync(
    async (req: Request, res: Response) => {
        const carId = req.params.carId as string;
        const userId = getUserId(req);

        const recommendations = await getRecommendationsByCarService(
            carId,
            userId,
        );

        res.status(OK).json({
            message: 'Car recommendations fetched successfully',
            count: recommendations.length,
            recommendations,
        });
    },
);

export const buildPlan = catchAsync(async (req: Request, res: Response) => {
    const carId = req.params.carId as string;
    const userId = getUserId(req);

    const recommendation = await buildPlanService(carId, userId, req.body);

    res.status(OK).json({
        message: 'Build plan generated successfully',
        recommendation,
    });
});

export const nextUpgrade = catchAsync(async (req: Request, res: Response) => {
    const carId = req.params.carId as string;
    const userId = getUserId(req);

    const recommendation = await nextUpgradeService(carId, userId, req.body);

    res.status(OK).json({
        message: 'Next upgrade recommendation generated',
        recommendation,
    });
});

export const buildReview = catchAsync(async (req: Request, res: Response) => {
    const carId = req.params.carId as string;
    const userId = getUserId(req);

    const recommendation = await buildReviewService(carId, userId, req.body);

    res.status(OK).json({
        message: 'Build review generated successfully',
        recommendation,
    });
});

export const costAnalysis = catchAsync(async (req: Request, res: Response) => {
    const carId = req.params.carId as string;
    const userId = getUserId(req);

    const recommendation = await costAnalysisService(carId, userId, req.body);

    res.status(OK).json({
        message: 'Cost analysis generated successfully',
        recommendation,
    });
});
