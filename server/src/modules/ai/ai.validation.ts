import {z} from 'zod';
import {objectIdSchema} from '../../validations/common.validation';

const requiredString = (message: string) =>
    z.string({error: message}).min(1, message);

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
