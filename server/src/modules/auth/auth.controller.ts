import {Request, Response} from 'express';
import {
    forgotPasswordService,
    getCurrentUserService,
    loginService,
    logoutService,
    refreshAccessTokenService,
    registerService,
    resendVerificationService,
    resetPasswordService,
    verifyEmailService,
} from './auth.service';
import {CREATED, OK} from '../../constants/http';
import {catchAsync} from '../../utils/catchAsync';
import {getUserId} from '../../utils/getUser';
import {toUserResponse} from '../user/user.mapper';
import {RegisterInput} from './auth.validation';
import {
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
} from './auth.cookies';

export const register = catchAsync(
    async (req: Request<{}, {}, RegisterInput>, res: Response) => {
        const {email, password} = req.body;

        const {user, verificationEmailSent} = await registerService({
            email,
            password,
        });

        res.status(CREATED).json({
            message: verificationEmailSent
                ? 'Registration successful. Please verify your email.'
                : 'Registration successful, but the verification email could not be sent. Please request a new verification email.',
            verificationEmailSent,
            user: toUserResponse(user),
        });
    },
);

export const login = catchAsync(async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const {user, accessToken, refreshToken} = await loginService(
        email,
        password,
    );

    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.status(OK).json({
        message: 'Login successful',
        user: toUserResponse(user),
    });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    await logoutService(refreshToken);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(OK).json({
        message: 'Logged out successfully',
    });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const user = await getCurrentUserService(userId);

    res.status(OK).json({
        message: 'Current user fetched successfully',
        user: toUserResponse(user),
    });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        res.status(401).json({
            message: 'No refresh token',
        });
        return;
    }

    const accessToken = await refreshAccessTokenService(refreshToken);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
    });

    res.status(OK).json({
        message: 'Access token refreshed',
    });
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const {token} = req.body;

    const user = await verifyEmailService(token);

    res.status(OK).json({
        message: 'Email verified successfully',
        user: toUserResponse(user),
    });
});

export const resendVerification = catchAsync(
    async (req: Request, res: Response) => {
        const {email} = req.body;

        await resendVerificationService(email);

        res.status(OK).json({
            message:
                'If that email exists and is unverified, a verification link has been sent.',
        });
    },
);

export const forgotPassword = catchAsync(
    async (req: Request, res: Response) => {
        const {email} = req.body;

        await forgotPasswordService(email);

        res.status(OK).json({
            message:
                'If that email exists, a password reset link has been sent.',
        });
    },
);

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const {token, newPassword} = req.body;

    await resetPasswordService(token, newPassword);

    res.status(OK).json({
        message: 'Password reset successfully',
    });
});
