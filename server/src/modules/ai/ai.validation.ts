import {z} from 'zod';
import {objectIdSchema} from '../../validations/common.validation';

export const recommendCarSchema = z.object({
    budget: z
        .string({error: 'Budget is required'})
        .min(1, 'Budget is required'),
    fuel: z
        .string({error: 'Fuel type is required'})
        .min(1, 'Fuel type is required'),

    use: z
        .string({error: 'Use case is required'})
        .min(1, 'Use case is required'),
});

export const aiCarParamsSchema = z.object({
    carId: objectIdSchema,
});

export const buildPlanSchema = z.object({
    budget: z
        .string({error: 'Budget is required'})
        .min(1, 'Budget is required'),
    goal: z.string({error: 'Goal is required'}).min(1, 'Goal is required'),
});
