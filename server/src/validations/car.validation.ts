import {z} from 'zod';

export const createCarSchema = z.object({
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    year: z
        .number()
        .int()
        .min(1900, 'Year must be valid')
        .max(new Date().getFullYear(), 'Year cannot be in future'),
});

export const updateCarSchema = z
    .object({
        brand: z.string().min(1, 'Brand cannot be empty').optional(),
        model: z.string().min(1, 'Model cannot be empty').optional(),
        year: z
            .number()
            .int()
            .min(1900, 'Year must be valid')
            .max(new Date().getFullYear(), 'Year cannot be in future')
            .optional(),
    })
    .refine(
        (data) => data.brand || data.model || data.year,
        'At least one field must be provided',
    );
