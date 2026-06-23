import {z} from 'zod';

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
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z
        .string()
        .min(6, 'New password must be at least 6 characters'),
});
