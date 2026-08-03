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

export const register = catchAsync(async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const {user, verificationToken} = await registerService(email, password);

    res.status(CREATED).json({
        message: 'User created',
        verificationToken,
        user: toUserResponse(user),
    });
});

export const login = catchAsync(async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const {user, accessToken, refreshToken} = await loginService(
        email,
        password,
    );

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
    });

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
        // user: {
        //     id: user._id.toString(),
        //     email: user.email,
        //     isEmailVerified: user.isEmailVerified,
        // },
    });
});

export const resendVerification = catchAsync(
    async (req: Request, res: Response) => {
        const {email} = req.body;

        const verificationToken = await resendVerificationService(email);

        res.status(OK).json({
            message: 'Verification token resent',
            verificationToken,
        });
    },
);

export const forgotPassword = catchAsync(
    async (req: Request, res: Response) => {
        const {email} = req.body;

        const resetToken = await forgotPasswordService(email);

        res.status(OK).json({
            message: 'Password reset token generated',
            resetToken,
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
