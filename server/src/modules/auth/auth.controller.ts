import {Request, Response} from 'express';
import {
    getCurrentUserService,
    loginService,
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

    const {user, token} = await loginService(email, password);

    res.status(OK).json({
        message: 'Login successful',
        token,
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
