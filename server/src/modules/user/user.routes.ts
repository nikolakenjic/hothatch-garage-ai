import {Router} from 'express';
import {protect} from '../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';
import {CHANGE_PASSWORD_RATE_LIMIT} from './user.constants';
import {getUserId} from '../../utils/getUser';
import {
    changePassword,
    deleteAccount,
    getPublicProfile,
    getUserStats,
    updateProfile,
    updateSettings,
} from './user.controller';
import {
    changePasswordSchema,
    publicProfileSchema,
    updateProfileSchema,
    updateSettingsSchema,
} from './user.validation';
import {validate} from '../../middlewares/validate';

const router = Router();

const changePasswordLimiter = rateLimit({
    ...CHANGE_PASSWORD_RATE_LIMIT,
    keyGenerator: (req) => getUserId(req),
});

router.patch(
    '/me/profile',
    protect,
    validate(updateProfileSchema),
    updateProfile,
);

router.patch(
    '/me/password',
    protect,
    changePasswordLimiter,
    validate(changePasswordSchema),
    changePassword,
);

router.patch(
    '/me/settings',
    protect,
    validate(updateSettingsSchema),
    updateSettings,
);

router.delete('/me', protect, deleteAccount);

router.get('/me/stats', protect, getUserStats);

router.get(
    '/:username',
    validate(publicProfileSchema, 'params'),
    getPublicProfile,
);

export default router;
