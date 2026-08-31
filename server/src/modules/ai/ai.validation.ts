import {z} from 'zod';
import {objectIdSchema} from '../../validations/common.validation';
import {AIRecommendationType} from './ai.types';

const requiredString = (message: string, maxLength = 500) =>
    z.string({error: message}).trim().min(1, message).max(maxLength);

export const recommendCarSchema = z.object({
    budget: requiredString('Budget is required'),
    fuel: requiredString('Fuel type is required'),
    use: requiredString('Use case is required'),
});

export const aiCarParamsSchema = z.object({
    carId: objectIdSchema,
});

export const buildPlanSchema = z.object({
    budget: requiredString('Budget is required'),
    goal: requiredString('Goal is required'),
});

export const nextUpgradeSchema = z.object({
    budget: requiredString('Budget is required'),
    goal: requiredString('Goal is required'),
});

export const buildReviewSchema = z.object({
    goal: requiredString('Goal is required'),
});

export const costAnalysisSchema = z.object({
    budget: requiredString('Budget is required'),
    goal: requiredString('Goal is required'),
});

export const recommendationsQuerySchema = z.object({
    type: z.nativeEnum(AIRecommendationType).optional(),
});

export type RecommendCarInput = z.infer<typeof recommendCarSchema>;
export type BuildPlanInput = z.infer<typeof buildPlanSchema>;
export type NextUpgradeInput = z.infer<typeof nextUpgradeSchema>;
export type BuildReviewInput = z.infer<typeof buildReviewSchema>;
export type CostAnalysisInput = z.infer<typeof costAnalysisSchema>;

export type RecommendationsQuery = z.infer<typeof recommendationsQuerySchema>;
