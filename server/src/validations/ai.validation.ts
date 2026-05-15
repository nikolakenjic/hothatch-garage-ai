import {z} from 'zod';
import {objectIdSchema} from './common.validation';

export const recommendCarSchema = z.object({
    budget: z
        .string({error: 'Budget is required'})
        .min(1, 'Budget is required')
        .refine((val) => typeof val === 'string', {
            message: 'Budget must be a string',
        }),

    fuel: z
        .string({error: 'Fuel type is required'})
        .min(1, 'Fuel type is required'),

    use: z
        .string({error: 'Use case is required'})
        .min(1, 'Use case is required'),
});

export const carIdParamsSchema = z.object({
    carId: objectIdSchema,
});

export const buildPlanSchema = z.object({
    budget: z
        .string({error: 'Budget is required'})
        .min(1, 'Budget is required'),
    goal: z.string({error: 'Goal is required'}).min(1, 'Goal is required'),
});
