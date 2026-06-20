import {Request, Response} from 'express';
import {
    getCurrentUserService,
    loginService,
    refreshAccessTokenService,
    registerService,
} from './auth.service';
import {CREATED, OK} from '../../constants/http';
import {catchAsync} from '../../utils/catchAsync';
import {getUserId} from '../../utils/getUser';

export const register = catchAsync(async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const user = await registerService(email, password);

    res.status(CREATED).json({
        message: 'User created',
        user: {
            id: user._id,
            email: user.email,
        },
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
        user: {
            _id: user._id,
            email: user.email,
        },
    });
});

export const logout = catchAsync(async (req, res) => {
    res.clearCookie('token');

    res.status(OK).json({
        status: 'success',
        message: 'Logged out successfully',
    });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const user = await getCurrentUserService(userId);

    res.status(OK).json({
        message: 'Success',
        user,
    });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
    const {refreshToken} = req.body;
    const accessToken = await refreshAccessTokenService(refreshToken);

    res.status(OK).json({
        message: 'Access token refreshed',
        accessToken,
    });
});
