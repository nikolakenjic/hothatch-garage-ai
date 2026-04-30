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
