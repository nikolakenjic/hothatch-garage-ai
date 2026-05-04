import {z} from 'zod';
import {objectIdSchema} from './common.validation';

export const createModificationSchema = z.object({
    car: objectIdSchema,
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    price: z.number().min(0, 'Price must be positive').optional(),
});

export const updateModificationSchema = z
    .object({
        name: z.string().min(1).optional(),
        category: z.string().min(1).optional(),
        price: z.number().min(0).optional(),
    })
    .refine(
        (data) => data.name || data.category || data.price !== undefined,
        'At least one field must be provided',
    );

export const modificationIdParamsSchema = z.object({
    id: objectIdSchema,
});
