import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {
    generateCarRecommendationService,
    getRecommendationsByCarService,
    getRecommendationsService,
    recommendUpgradeService,
} from './ai.service';

export const recommendCar = catchAsync(async (req: Request, res: Response) => {
    const recommendation = await generateCarRecommendationService(req.body);

    res.status(200).json({
        message: 'Recommendation generated',
        recommendation,
    });
});

export const recommendUpgrade = catchAsync(
    async (req: Request, res: Response) => {
        const carId = req.params.carId as string;
        const userId = (req.user as any).userId;

        const recommendation = await recommendUpgradeService(carId, userId);

        res.status(200).json({
            message: 'Upgrade recommendation generated',
            recommendation,
        });
    },
);

export const getRecommendations = catchAsync(
    async (req: Request, res: Response) => {
        const userId = (req.user as any).userId;

        const recommendations = await getRecommendationsService(userId);

        res.status(200).json({
            message: 'Recommendations fetched successfully',
            count: recommendations.length,
            recommendations,
        });
    },
);

export const getRecommendationsByCar = catchAsync(
    async (req: Request, res: Response) => {
        const carId = req.params.carId as string;
        const userId = (req.user as any).userId;

        const recommendations = await getRecommendationsByCarService(
            carId,
            userId,
        );

        res.status(200).json({
            message: 'Car recommendations fetched successfully',
            count: recommendations.length,
            recommendations,
        });
    },
);
