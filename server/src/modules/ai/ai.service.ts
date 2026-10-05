import {findOwnedCarOrFail} from '../car/car.service';
import {Modification} from '../modification/modification.model';
import {AIRecommendation} from './ai.model';
import {
    buildBuildPlanPrompt,
    buildBuildReviewPrompt,
    buildCarRecommendationPrompt,
    buildNextUpgradePrompt,
    buildUpgradeRecommendationPrompt,
    buildCostAnalysisPrompt,
} from './ai.prompts';
import {AIRecommendationType} from './ai.types';
import {
    createAIRecommendation,
    findRecentRecommendationsByCar,
} from './ai.repository';
import {AI_MODELS} from './ai.constants';
import {
    BuildPlanInput,
    BuildReviewInput,
    CostAnalysisInput,
    NextUpgradeInput,
    RecommendCarInput,
    RecommendationsByCarQuery,
    RecommendationsQuery,
} from './ai.validation';

const getCarWithModifications = async (carId: string, userId: string) => {
    const car = await findOwnedCarOrFail(carId, userId);
    const modifications = await Modification.find({car: carId}).lean();
    return {car, modifications};
};

export const generateCarRecommendationService = async (
    userId: string,
    data: RecommendCarInput,
) => {
    const prompt = buildCarRecommendationPrompt(data);

    return createAIRecommendation({
        userId,
        type: AIRecommendationType.CAR_RECOMMENDATION,
        prompt,
        model: AI_MODELS.RECOMMENDATION,
        input: data,
    });
};

export const recommendUpgradeService = async (
    carId: string,
    userId: string,
) => {
    const {car, modifications} = await getCarWithModifications(carId, userId);
    const prompt = buildUpgradeRecommendationPrompt(car, modifications);

    return createAIRecommendation({
        userId,
        carId,
        type: AIRecommendationType.NEXT_UPGRADE,
        prompt,
        model: AI_MODELS.FAST,
        input: {carId},
    });
};

export const getRecommendationsService = async (
    userId: string,
    {type, page, limit}: RecommendationsQuery,
) => {
    const filter: Record<string, unknown> = {
        user: userId,
    };

    if (type) {
        filter.type = type;
    }

    const skip = (page - 1) * limit;

    const [recommendations, total] = await Promise.all([
        AIRecommendation.find(filter)
            .select('car type input content createdAt updatedAt')
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .lean(),
        AIRecommendation.countDocuments(filter),
    ]);

    return {
        recommendations,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getRecommendationsByCarService = async (
    carId: string,
    userId: string,
    {page, limit}: RecommendationsByCarQuery,
) => {
    await findOwnedCarOrFail(carId, userId);

    const filter = {
        user: userId,
        car: carId,
    };

    const skip = (page - 1) * limit;

    const [recommendations, total] = await Promise.all([
        AIRecommendation.find(filter)
            .select('car type input content createdAt updatedAt')
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .lean(),
        AIRecommendation.countDocuments(filter),
    ]);

    return {
        recommendations,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const buildPlanService = async (
    carId: string,
    userId: string,
    data: BuildPlanInput,
) => {
    const {car, modifications} = await getCarWithModifications(carId, userId);
    const prompt = buildBuildPlanPrompt(car, modifications, data);

    return createAIRecommendation({
        userId,
        carId,
        type: AIRecommendationType.BUILD_PLAN,
        prompt,
        model: AI_MODELS.RECOMMENDATION,
        input: data,
    });
};

export const nextUpgradeService = async (
    carId: string,
    userId: string,
    data: NextUpgradeInput,
) => {
    const {car, modifications} = await getCarWithModifications(carId, userId);

    const previousRecommendations = await findRecentRecommendationsByCar(carId);

    const prompt = buildNextUpgradePrompt(
        car,
        modifications,
        previousRecommendations,
        data,
    );

    return createAIRecommendation({
        userId,
        carId,
        type: AIRecommendationType.NEXT_UPGRADE_ADVISOR,
        prompt,
        model: AI_MODELS.RECOMMENDATION,
        input: data,
    });
};

export const buildReviewService = async (
    carId: string,
    userId: string,
    data: BuildReviewInput,
) => {
    const {car, modifications} = await getCarWithModifications(carId, userId);

    const prompt = buildBuildReviewPrompt(car, modifications, data);

    return createAIRecommendation({
        userId,
        carId,
        type: AIRecommendationType.BUILD_REVIEW,
        prompt,
        model: AI_MODELS.RECOMMENDATION,
        input: data,
    });
};

export const costAnalysisService = async (
    carId: string,
    userId: string,
    data: CostAnalysisInput,
) => {
    const {car, modifications} = await getCarWithModifications(carId, userId);

    const prompt = buildCostAnalysisPrompt(car, modifications, data);

    return createAIRecommendation({
        userId,
        carId,
        type: AIRecommendationType.COST_ANALYSIS,
        prompt,
        model: AI_MODELS.RECOMMENDATION,
        input: data,
    });
};
