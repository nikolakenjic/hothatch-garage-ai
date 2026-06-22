import {Router} from 'express';
import {protect} from '../../middlewares/auth.middleware';
import {updateProfile} from './user.controller';
import {updateProfileSchema} from './user.validation';
import {validate} from '../../middlewares/validate';

const router = Router();

router.patch(
    '/me/profile',
    protect,
    validate(updateProfileSchema),
    updateProfile,
);

export default router;
