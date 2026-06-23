import {Router} from 'express';
import {protect} from '../../middlewares/auth.middleware';
import {changePassword, updateProfile} from './user.controller';
import {changePasswordSchema, updateProfileSchema} from './user.validation';
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

export default router;
