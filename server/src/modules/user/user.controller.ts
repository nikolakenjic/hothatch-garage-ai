import {Request, Response} from 'express';
import {OK} from '../../constants/http';
import {catchAsync} from '../../utils/catchAsync';
import {
    changePasswordService,
    deleteAccountService,
    getPublicProfileService,
    getUserStatsService,
    updateProfileService,
    updateSettingsService,
} from './user.service';
import {getUserId} from '../../utils/getUser';
import {toUserResponse} from './user.mapper';
import type {
    ChangePasswordInput,
    UpdateProfileInput,
    UpdateSettingsInput,
} from './user.validation';
import {authCookieClearOptions} from '../auth/auth.cookies';

export const updateProfile = catchAsync(
    async (req: Request<{}, {}, UpdateProfileInput>, res: Response) => {
        const userId = getUserId(req);

        const user = await updateProfileService(userId, req.body);

        res.status(OK).json({
            message: 'Profile updated successfully',
            user: toUserResponse(user),
        });
    },
);

export const changePassword = catchAsync(
    async (req: Request<{}, {}, ChangePasswordInput>, res: Response) => {
        const userId = getUserId(req);

        await changePasswordService(userId, req.body);

        res.status(OK).json({
            status: 'success',
            message: 'Password changed successfully',
        });
    },
);

export const deleteAccount = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    await deleteAccountService(userId);

    res.clearCookie('accessToken', authCookieClearOptions);
    res.clearCookie('refreshToken', authCookieClearOptions);

    res.status(OK).json({
        status: 'success',
        message: 'Account deleted successfully',
    });
});

export const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const stats = await getUserStatsService(userId);

    res.status(OK).json({
        status: 'success',
        data: stats,
    });
});

export const getPublicProfile = catchAsync(
    async (req: Request, res: Response) => {
        const username = req.params.username as string;

        const result = await getPublicProfileService(username);

        res.status(OK).json({
            message: 'Public profile fetched successfully',
            profile: result.profile,
            stats: result.stats,
            cars: result.cars,
        });
    },
);

export const updateSettings = catchAsync(
    async (req: Request<{}, {}, UpdateSettingsInput>, res: Response) => {
        const userId = getUserId(req);

        const user = await updateSettingsService(userId, req.body);

        res.status(OK).json({
            message: 'Settings updated successfully',
            user: toUserResponse(user),
        });
    },
);
