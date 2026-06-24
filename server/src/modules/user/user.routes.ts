import {Router} from 'express';
import {protect} from '../../middlewares/auth.middleware';
import {
    changePassword,
    deleteAccount,
    getPublicProfile,
    getUserStats,
    updateProfile,
} from './user.controller';
import {
    changePasswordSchema,
    publicProfileSchema,
    updateProfileSchema,
} from './user.validation';
import {validate} from '../../middlewares/validate';

const router = Router();

router.patch(
    '/me/profile',
    protect,
    validate(updateProfileSchema),
    updateProfile,
);

router.patch(
    '/me/password',
    protect,
    validate(changePasswordSchema),
    changePassword,
);

router.delete('/me', protect, deleteAccount);

router.get('/me/stats', protect, getUserStats);

router.get('/:username', validate(publicProfileSchema), getPublicProfile);

export default router;
