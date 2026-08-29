import {z} from 'zod';
import {objectIdSchema} from '../../validations/common.validation';

const currentYear = new Date().getFullYear();

export const carIdParamsSchema = z.object({
    id: objectIdSchema,
});

const carBaseSchema = {
    brand: z.string().trim().min(1, 'Brand is required').max(50),
    model: z.string().trim().min(1, 'Model is required').max(50),
    year: z
        .number()
        .int()
        .min(1900, 'Year must be valid')
        .max(currentYear + 1, 'Year cannot be too far in the future'),

    nickname: z.string().trim().max(50).optional(),
    fuelType: z.enum(['petrol', 'diesel', 'hybrid', 'electric']).optional(),
    horsepower: z.number().int().min(1).max(2000).optional(),
    torque: z.number().int().min(1).max(3000).optional(),
    transmission: z.enum(['manual', 'automatic', 'dsg']).optional(),
    drivetrain: z.enum(['fwd', 'rwd', 'awd']).optional(),
};

export const createCarSchema = z.object(carBaseSchema);

export const updateCarSchema = z
    .object({
        brand: carBaseSchema.brand.optional(),
        model: carBaseSchema.model.optional(),
        year: carBaseSchema.year.optional(),
        nickname: carBaseSchema.nickname,
        fuelType: carBaseSchema.fuelType,
        horsepower: carBaseSchema.horsepower,
        torque: carBaseSchema.torque,
        transmission: carBaseSchema.transmission,
        drivetrain: carBaseSchema.drivetrain,
    })
    .refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        'At least one field must be provided',
    );
