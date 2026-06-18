import {Router} from 'express';
import {getMe, login, logout, refresh, register} from './auth.controller';
import {protect} from '../../middlewares/auth.middleware';
import {validate} from '../../middlewares/validate';
import {loginSchema, registerSchema} from './auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

router.get('/me', protect, getMe);
router.post('/refresh', refresh);

export default router;
