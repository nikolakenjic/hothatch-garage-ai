import {z} from 'zod';
import {passwordPolicySchema} from '../../validations/common.validation';

export const updateProfileSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(
            /^[a-zA-Z0-9_]+$/,
            'Username can only contain letters, numbers and underscores',
        )
        .optional(),

    displayName: z
        .string()
        .min(2, 'Display name must be at least 2 characters')
        .max(50, 'Display name must be at most 50 characters')
        .optional(),

    bio: z.string().max(300, 'Bio must be at most 300 characters').optional(),

    avatarUrl: z.string().url('Avatar must be a valid URL').optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z
        .string({error: 'Current password is required'})
        .min(1, 'Current password is required'),
    newPassword: passwordPolicySchema,
});

export const publicProfileSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters'),
});

export const updateSettingsSchema = z
    .object({
        preferences: z
            .object({
                theme: z.enum(['light', 'dark', 'system']).optional(),
                emailNotifications: z.boolean().optional(),
            })
            .optional(),

        privacy: z
            .object({
                publicProfile: z.boolean().optional(),
                publicGarage: z.boolean().optional(),
            })
            .optional(),
    })
    .refine(
        (data) => data.preferences !== undefined || data.privacy !== undefined,
        {
            message: 'At least one settings field is required',
        },
    );

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
