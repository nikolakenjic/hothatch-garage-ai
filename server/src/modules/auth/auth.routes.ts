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
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resendVerificationSchema,
    resetPasswordSchema,
    verifyEmailSchema,
} from './auth.validation';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many requests, try again later',
});

const router = Router();
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);

router.get('/me', protect, getMe);
router.post('/refresh', refresh);

router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post(
    '/resend-verification',
    validate(resendVerificationSchema),
    resendVerification,
);

router.post(
    '/forgot-password',
    authLimiter,
    validate(forgotPasswordSchema),
    forgotPassword,
);

router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
