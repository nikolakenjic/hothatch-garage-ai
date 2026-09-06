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
import {
    CONFIRM_PASSWORD_RESET_RATE_LIMIT,
    LOGIN_RATE_LIMIT,
    REFRESH_RATE_LIMIT,
    REGISTER_RATE_LIMIT,
    REQUEST_PASSWORD_RESET_RATE_LIMIT,
    RESEND_VERIFICATION_RATE_LIMIT,
    VERIFY_EMAIL_RATE_LIMIT,
} from '../../constants/auth.constants';

const registerLimiter = rateLimit(REGISTER_RATE_LIMIT);
const loginLimiter = rateLimit(LOGIN_RATE_LIMIT);
const resendVerificationLimiter = rateLimit(RESEND_VERIFICATION_RATE_LIMIT);
const requestPasswordResetLimiter = rateLimit(
    REQUEST_PASSWORD_RESET_RATE_LIMIT,
);
const confirmPasswordResetLimiter = rateLimit(
    CONFIRM_PASSWORD_RESET_RATE_LIMIT,
);
const refreshLimiter = rateLimit(REFRESH_RATE_LIMIT);
const verifyEmailLimiter = rateLimit(VERIFY_EMAIL_RATE_LIMIT);

const router = Router();

router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);

router.get('/me', protect, getMe);
router.post('/refresh', refreshLimiter, refresh);

router.post(
    '/verify-email',
    verifyEmailLimiter,
    validate(verifyEmailSchema),
    verifyEmail,
);

router.post(
    '/resend-verification',
    resendVerificationLimiter,
    validate(resendVerificationSchema),
    resendVerification,
);

router.post(
    '/forgot-password',
    requestPasswordResetLimiter,
    validate(forgotPasswordSchema),
    forgotPassword,
);

router.post(
    '/reset-password',
    confirmPasswordResetLimiter,
    validate(resetPasswordSchema),
    resetPassword,
);

export default router;
