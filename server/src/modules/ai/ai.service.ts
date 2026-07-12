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
import {
    AIRecommendationType,
    BuildPlanInput,
    BuildReviewInput,
    NextUpgradeInput,
    CostAnalysisInput,
    RecommendCarInput,
} from './ai.types';
import {createAIRecommendation} from './ai.repository';
import {AI_MODELS} from './ai.constants';

const getCarWithModifications = async (carId: string, userId: string) => {
    const car = await findOwnedCarOrFail(carId, userId);
    const modifications = await Modification.find({car: carId});
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

export const getRecommendationsService = async (userId: string) => {
    return AIRecommendation.find({user: userId}).sort({createdAt: -1});
};

export const getRecommendationsByCarService = async (
    carId: string,
    userId: string,
) => {
    await findOwnedCarOrFail(carId, userId);

    return AIRecommendation.find({user: userId, car: carId}).sort({
        createdAt: -1,
    });
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

    const prompt = buildNextUpgradePrompt(car, modifications, data);

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
