import {Router} from 'express';
import {
    forgotPassword,
    getMe,
    login,
    logout,
    refresh,
    register,
    resendVerification,
    resetPassword,
    verifyEmail,
} from './auth.controller';
import {protect} from '../../middlewares/auth.middleware';
import {validate} from '../../middlewares/validate';
import {loginSchema, registerSchema} from './auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

router.get('/me', protect, getMe);
router.post('/refresh', refresh);

router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
