import {z} from 'zod';
import {objectIdSchema} from '../../validations/common.validation';

const modificationCategorySchema = z.enum([
    'performance',
    'suspension',
    'brakes',
    'wheels',
    'exterior',
    'interior',
    'maintenance',
    'other',
]);

const modificationStatusSchema = z.enum([
    'planned',
    'ordered',
    'installed',
    'removed',
]);

export const createModificationSchema = z.object({
    title: z.string().min(1, 'Title is required').max(120),
    description: z.string().max(1000).optional(),
    category: modificationCategorySchema,
    status: modificationStatusSchema.optional(),
    cost: z.number().min(0, 'Cost must be positive').optional(),
    installedAt: z.coerce.date().optional(),
    brand: z.string().max(80).optional(),
    partNumber: z.string().max(80).optional(),
    mileage: z.number().min(0).optional(),
    notes: z.string().max(1000).optional(),
});

export const updateModificationSchema = createModificationSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided',
    });

export const modificationIdParamsSchema = z.object({
    id: objectIdSchema,
});

export const carIdParamsSchema = z.object({
    carId: objectIdSchema,
});
